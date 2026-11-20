// ============================================================
// ID cross-check: compares what the guest typed with the text
// Google reads off their ID photo, and writes a short verdict
// for the hosts ("Matches the ID", or what to look at).
//
// Everything in this file is plain logic with no Google calls,
// so it can be tested on a computer too (see test-checks.mjs).
// Code.gs does the reading (OCR) and calls checkIdText() /
// checkPassportText() below.
//
// It is a helper, not a judge: OCR misreads blurry or angled
// photos, so a warning means "have a look", not "fake ID".
// ============================================================

// ---- Text clean-up ----

/** Upper-case, accents removed, anything that isn't a letter or digit becomes a space. */
function normaliseText(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
}

/** Letters and digits only, no spaces: "DL-14 2011" -> "DL142011". */
function compact(text) {
  return normaliseText(text).replace(/ /g, '');
}

// ---- Names ----

/**
 * How many words of the typed name appear on the ID.
 * Returns { found, total, missing[] }. Single letters (initials) are skipped.
 */
function checkName(typedName, ocrText) {
  const words = normaliseText(ocrText).split(' ');
  const wordSet = {};
  words.forEach(function (w) {
    wordSet[w] = true;
  });
  const parts = normaliseText(typedName)
    .split(' ')
    .filter(function (p) {
      return p.length > 1;
    });
  const missing = parts.filter(function (p) {
    return !wordSet[p];
  });
  return { found: parts.length - missing.length, total: parts.length, missing: missing };
}

// ---- Dates of birth ----

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Looks for a date ("1995-03-07") on the ID in the ways Indian IDs and
 * passports print it: 07/03/1995, 07-03-1995, 07.03.1995, 07 MAR 1995,
 * 1995-03-07. Returns 'full', 'year' (only the year was found, which is
 * normal for older Aadhaar cards that print "Year of Birth") or 'none'.
 */
function checkDate(isoDate, ocrText) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '');
  if (!m) return 'none';
  const y = m[1];
  const mo = m[2];
  const d = m[3];
  const mon = MONTHS[Number(mo) - 1];
  // Digits run together once separators are dropped: 07/03/1995 -> 07031995.
  const digits = String(ocrText || '')
    .replace(/[^0-9A-Za-z]+/g, '')
    .toUpperCase();
  const candidates = [d + mo + y, y + mo + d, d + mon + y, Number(d) + mon + y];
  for (let i = 0; i < candidates.length; i++) {
    if (digits.indexOf(candidates[i]) !== -1) return 'full';
  }
  if (new RegExp('(^|[^0-9])' + y + '([^0-9]|$)').test(String(ocrText || ''))) return 'year';
  return 'none';
}

// ---- ID numbers ----

/**
 * Aadhaar: the guest only types the last 4 digits (we never keep the
 * full number), so look for a 4-digit group ending a 12-digit number.
 * Other IDs: the typed number, spaces and dashes ignored.
 */
function checkIdNumber(idType, typedNumber, ocrText) {
  const typed = compact(typedNumber);
  if (!typed) return 'none';
  if (idType === 'aadhaar') {
    const groups = String(ocrText || '').match(/\d{4}\s?\d{4}\s?\d{4}/g) || [];
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].replace(/\s/g, '').slice(-4) === typed) return 'full';
    }
    // Masked Aadhaar prints "XXXX XXXX 1234".
    if (new RegExp('X{4}\\s?X{4}\\s?' + typed).test(String(ocrText || '').toUpperCase())) {
      return 'full';
    }
    return 'none';
  }
  return compact(ocrText).indexOf(typed) !== -1 ? 'full' : 'none';
}

// ---- Passports: the machine-readable lines (MRZ) ----
// The two lines of <<<< at the bottom of every passport photo page
// carry the name, passport number, nationality, date of birth and
// expiry, each with a check digit. When OCR reads them cleanly this
// is a much stronger check than looking for words.

/** ICAO 9303 check digit: weights 7,3,1; < counts as 0, A=10 ... Z=35. */
function mrzCheckDigit(field) {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < field.length; i++) {
    const c = field.charAt(i);
    let v;
    if (c >= '0' && c <= '9') v = Number(c);
    else if (c >= 'A' && c <= 'Z') v = c.charCodeAt(0) - 55;
    else v = 0;
    sum += v * weights[i % 3];
  }
  return String(sum % 10);
}

/** "950307" -> "1995-03-07". Birth dates in the future roll back a century. */
function mrzDate(yymmdd, isBirthDate) {
  if (!/^\d{6}$/.test(yymmdd)) return '';
  const yy = Number(yymmdd.slice(0, 2));
  const thisYear = new Date().getFullYear() % 100;
  let century = 2000;
  if (isBirthDate ? yy > thisYear : yy > thisYear + 30) century = 1900;
  return century + yy + '-' + yymmdd.slice(2, 4) + '-' + yymmdd.slice(4, 6);
}

/**
 * Finds and reads a passport MRZ (two lines of 44 characters) in OCR
 * text. Returns null if none is found, otherwise the fields plus which
 * check digits passed.
 */
function parseMrz(ocrText) {
  const lines = String(ocrText || '')
    .toUpperCase()
    .split(/\r?\n/)
    .map(function (l) {
      // OCR often reads < as « or K-ish noise, and adds spaces.
      return l.replace(/[«‹]/g, '<').replace(/\s+/g, '');
    })
    .filter(function (l) {
      return /^[A-Z0-9<]{30,}$/.test(l);
    });
  for (let i = 0; i < lines.length - 1; i++) {
    const l1 = lines[i];
    const l2 = (lines[i + 1] + '<'.repeat(44)).slice(0, 44);
    if (l1.charAt(0) !== 'P') continue;
    const passportNo = l2.slice(0, 9).replace(/<+$/, '');
    const nameField = (l1 + '<'.repeat(44)).slice(5, 44);
    const nameParts = nameField.split('<<');
    const surname = nameParts[0].replace(/</g, ' ').trim();
    const given = (nameParts.slice(1).join(' ') || '')
      .replace(/</g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      surname: surname,
      givenNames: given,
      passportNo: passportNo,
      passportNoValid: mrzCheckDigit(l2.slice(0, 9)) === l2.charAt(9),
      nationality: l2.slice(10, 13).replace(/</g, ''),
      dateOfBirth: mrzDate(l2.slice(13, 19), true),
      dateOfBirthValid: mrzCheckDigit(l2.slice(13, 19)) === l2.charAt(19),
      sex: l2.charAt(20),
      expiry: mrzDate(l2.slice(21, 27), false),
      expiryValid: mrzCheckDigit(l2.slice(21, 27)) === l2.charAt(27),
    };
  }
  return null;
}

// ---- Verdicts ----
// Each returns { status: 'ok' | 'warn' | 'unreadable', message }.
// The message is what the hosts see in the sheet.

function verdict(problems, notes) {
  if (problems.length === 0) {
    return {
      status: 'ok',
      message: '✅ Matches the ID' + (notes.length ? ' (' + notes.join('; ') + ')' : ''),
    };
  }
  return { status: 'warn', message: '⚠️ Check: ' + problems.concat(notes).join('; ') };
}

/**
 * Indian IDs. `typed` = { fullName, dateOfBirth (YYYY-MM-DD), idType, idNumber }.
 * `ocrText` = all text read from the front and back photos together.
 */
function checkIdText(typed, ocrText) {
  if (normaliseText(ocrText).length < 15) {
    return {
      status: 'unreadable',
      message: '❓ Couldn’t read the ID photo. Have a look yourself.',
    };
  }
  const problems = [];
  const notes = [];

  const name = checkName(typed.fullName, ocrText);
  if (name.total > 0 && name.found < name.total) {
    problems.push('name on ID doesn’t show "' + name.missing.join(' ').toLowerCase() + '"');
  }

  const dob = checkDate(typed.dateOfBirth, ocrText);
  if (dob === 'year') notes.push('ID shows birth year only');
  else if (dob === 'none') problems.push('date of birth not found on ID');

  const idNo = checkIdNumber(typed.idType, typed.idNumber, ocrText);
  if (idNo === 'none') {
    problems.push(
      typed.idType === 'aadhaar' ? 'last 4 Aadhaar digits not found' : 'ID number not found on ID',
    );
  }
  return verdict(problems, notes);
}

/**
 * Passports. `typed` = { surname, givenNames, dateOfBirth, passportNo,
 * passportExpiry, nationality }. Uses the MRZ when it can be read,
 * otherwise falls back to looking for the words.
 */
function checkPassportText(typed, ocrText) {
  if (normaliseText(ocrText).length < 15) {
    return {
      status: 'unreadable',
      message: '❓ Couldn’t read the passport photo. Have a look yourself.',
    };
  }
  const problems = [];
  const notes = [];
  const mrz = parseMrz(ocrText);

  if (mrz && mrz.passportNoValid && mrz.dateOfBirthValid) {
    if (compact(mrz.passportNo) !== compact(typed.passportNo)) {
      problems.push('passport says no. ' + mrz.passportNo);
    }
    if (mrz.dateOfBirth !== typed.dateOfBirth) {
      problems.push('passport says born ' + mrz.dateOfBirth);
    }
    if (mrz.expiryValid && typed.passportExpiry && mrz.expiry !== typed.passportExpiry) {
      problems.push('passport says expires ' + mrz.expiry);
    }
    const name = checkName(
      typed.surname + ' ' + typed.givenNames,
      mrz.surname + ' ' + mrz.givenNames,
    );
    if (name.total > 0 && name.found < name.total) {
      problems.push('passport name is ' + mrz.givenNames + ' ' + mrz.surname);
    }
    notes.push('nationality code ' + mrz.nationality);
    return verdict(problems, notes);
  }

  // No clean MRZ: look for the typed values in the page text instead.
  notes.push('bottom lines of the passport not readable');
  const name = checkName(typed.surname + ' ' + typed.givenNames, ocrText);
  if (name.total > 0 && name.found < name.total) {
    problems.push('passport doesn’t show "' + name.missing.join(' ').toLowerCase() + '"');
  }
  if (checkDate(typed.dateOfBirth, ocrText) !== 'full') problems.push('date of birth not found');
  if (compact(ocrText).indexOf(compact(typed.passportNo)) === -1) {
    problems.push('passport number not found');
  }
  return verdict(problems, notes);
}
