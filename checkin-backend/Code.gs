// ============================================================
// Aangan guest check-in: the private back office.
//
// This is a Google Apps Script project that lives in the hosts'
// own Google account (see README.md in this folder for setup).
// The check-in page on the website (checkin.html) sends each
// guest's details and ID photos here. This script:
//
//   1. checks the desk code, so only people at the hostel (who
//      scanned the QR card) can send a check-in,
//   2. saves the ID photos into a PRIVATE Google Drive folder,
//      named like "Priya-Sharma_2026-11-20_aadhaar-front.jpg",
//   3. adds one row per guest to a private Google Sheet: an
//      "Indian guests" tab and a "Foreign guests (C-Form)" tab
//      with everything needed to file Form C on the FRRO site,
//   4. every few minutes, reads the text on new ID photos (Google
//      Drive's built-in OCR) and writes a match / check verdict
//      next to the guest (logic in Checks.gs).
//
// Nothing is ever sent back to the website except "saved" or an
// error, so the web address of this script can't be used to read
// any guest data.
// ============================================================

// ---- Settings ----
const SETTINGS = {
  folderName: 'Aangan guest check-ins',
  sheetName: 'Aangan guest check-ins',
  timeZone: 'Asia/Kolkata',
  // Photos arrive already shrunk by the guest's phone (about 200-500 KB).
  // Anything far bigger than that isn't from the check-in page.
  maxPhotoBytes: 4 * 1024 * 1024,
  maxPhotos: 4,
};

const TAB_INDIAN = 'Indian guests';
const TAB_FOREIGN = 'Foreign guests (C-Form)';

// Column headers for each tab, in order. The last column holds data
// for the ID check and is hidden. Changing the order here changes the
// sheet layout for NEW sheets only; run setup() on a fresh copy if so.
const COLUMNS = {};
COLUMNS[TAB_INDIAN] = [
  'Checked in at',
  'Arrival date',
  'Nights',
  'Full name',
  'Date of birth',
  'Gender',
  'Phone',
  'Email',
  'Home address',
  'City',
  'State',
  'PIN code',
  'ID type',
  'ID number',
  'Coming from',
  'Going next',
  'House rules',
  'ID photos',
  'ID check',
  'Host notes',
  '_check',
];
COLUMNS[TAB_FOREIGN] = [
  'Checked in at',
  'Arrival date',
  'Nights',
  'Surname',
  'Given names',
  'Gender',
  'Date of birth',
  'Nationality',
  'Address abroad',
  'City abroad',
  'Country abroad',
  'Passport no.',
  'Passport place of issue',
  'Passport issued',
  'Passport expires',
  'Visa / OCI no.',
  'Visa type',
  'Visa place of issue',
  'Visa issued',
  'Visa valid till',
  'Arrived in India on',
  'Arrived in India from',
  'Purpose of visit',
  'Employed in India',
  'Next destination',
  'Phone in India',
  'Phone at home',
  'Email',
  'House rules',
  'ID photos',
  'ID check',
  'C-Form filed',
  'Host notes',
  '_check',
];
const DATE_COLUMNS = {};
DATE_COLUMNS[TAB_INDIAN] = ['Arrival date', 'Date of birth'];
DATE_COLUMNS[TAB_FOREIGN] = [
  'Arrival date',
  'Date of birth',
  'Passport issued',
  'Passport expires',
  'Visa issued',
  'Visa valid till',
  'Arrived in India on',
];

const ID_LABELS = {
  aadhaar: 'Aadhaar',
  'voter-id': 'Voter ID',
  'driving-licence': 'Driving Licence',
};

// ============================================================
// One-time setup. Run this once from the editor (select "setup"
// at the top, press Run). It creates the private folder and
// sheet, a desk code, and the every-5-minutes ID check. Running
// it again is safe: it reuses what already exists.
// ============================================================
function setup() {
  const props = PropertiesService.getScriptProperties();

  let folder = getFolder_();
  if (!folder) {
    folder = DriveApp.createFolder(SETTINGS.folderName);
    folder.setDescription(
      'Guest ID photos from the Aangan check-in page. Private: do not share publicly.',
    );
    props.setProperty('FOLDER_ID', folder.getId());
  }

  let sheet = getSpreadsheet_();
  if (!sheet) {
    sheet = SpreadsheetApp.create(SETTINGS.sheetName);
    DriveApp.getFileById(sheet.getId()).moveTo(folder);
    props.setProperty('SHEET_ID', sheet.getId());
  }
  sheet.setSpreadsheetTimeZone(SETTINGS.timeZone);
  [TAB_INDIAN, TAB_FOREIGN].forEach(function (name) {
    prepareTab_(sheet, name);
  });
  const blank = sheet.getSheetByName('Sheet1');
  if (blank && sheet.getSheets().length > 1) sheet.deleteSheet(blank);

  if (!props.getProperty('DESK_CODE')) props.setProperty('DESK_CODE', newDeskCode_());

  const hasTrigger = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === 'checkNewIds';
  });
  if (!hasTrigger) ScriptApp.newTrigger('checkNewIds').timeBased().everyMinutes(5).create();

  Logger.log('All set.');
  Logger.log('Sheet:  ' + sheet.getUrl());
  Logger.log('Photos: ' + folder.getUrl());
  Logger.log('Desk code: ' + props.getProperty('DESK_CODE'));
}

/** Makes a new desk code (e.g. if the QR card was shared outside the hostel). Print a new QR after. */
function changeDeskCode() {
  const code = newDeskCode_();
  PropertiesService.getScriptProperties().setProperty('DESK_CODE', code);
  Logger.log('New desk code: ' + code);
}

function newDeskCode_() {
  // No 0/O or 1/I, so it's easy to read off a card.
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
  return code;
}

function prepareTab_(spreadsheet, name) {
  let tab = spreadsheet.getSheetByName(name);
  if (!tab) tab = spreadsheet.insertSheet(name);
  if (tab.getLastRow() > 0) return; // already set up
  const headers = COLUMNS[name];
  tab.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  tab.setFrozenRows(1);
  tab.hideColumns(headers.length); // _check
  DATE_COLUMNS[name].forEach(function (header) {
    tab
      .getRange(2, headers.indexOf(header) + 1, tab.getMaxRows() - 1, 1)
      .setNumberFormat('d mmm yyyy');
  });
  tab.getRange(2, 1, tab.getMaxRows() - 1, 1).setNumberFormat('d mmm yyyy, h:mm am/pm');

  if (name === TAB_FOREIGN) {
    // Form C must be filed within 24 hours of arrival. Rows turn red
    // after 20 hours if the "C-Form filed" box isn't ticked yet.
    const filedCol = headers.indexOf('C-Form filed') + 1;
    const rows = tab.getMaxRows() - 1;
    tab.getRange(2, filedCol, rows, 1).insertCheckboxes();
    const letter = columnLetter_(filedCol);
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"", $' + letter + '2=FALSE, NOW()-$A2>20/24)')
      .setBackground('#f4c7c3')
      .setRanges([tab.getRange(2, 1, rows, headers.length - 1)])
      .build();
    tab.setConditionalFormatRules([rule]);
  }
}

function columnLetter_(col) {
  let s = '';
  while (col > 0) {
    const m = (col - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    col = Math.floor((col - 1) / 26);
  }
  return s;
}

function getFolder_() {
  const id = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
  return id ? DriveApp.getFolderById(id) : null;
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  return id ? SpreadsheetApp.openById(id) : null;
}

// ============================================================
// The web address the check-in page talks to.
// ============================================================

function doGet() {
  return ContentService.createTextOutput('Aangan check-in is running.');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const deskCode = PropertiesService.getScriptProperties().getProperty('DESK_CODE');
    if (
      !deskCode ||
      String(data.deskCode || '')
        .trim()
        .toUpperCase() !== deskCode
    ) {
      return reply_({ ok: false, error: 'desk-code' });
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      saveCheckIn_(data);
    } finally {
      lock.releaseLock();
    }
    return reply_({ ok: true });
  } catch (err) {
    console.error(err);
    return reply_({ ok: false, error: 'server', detail: String(err.message || err) });
  }
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// ---- Saving one guest ----

function saveCheckIn_(d) {
  const isIndian = d.nationalityGroup === 'indian';
  const g = d.guest || {};
  const now = new Date();
  const entryDate = Utilities.formatDate(now, SETTINGS.timeZone, 'yyyy-MM-dd');
  const guestName = isIndian ? g.fullName : (g.givenNames + ' ' + g.surname).trim();
  required_(guestName, 'name');
  required_(d.rulesAccepted === true ? 'yes' : '', 'house rules');

  // Photos -> private Drive folder, month by month.
  const photos = (d.photos || []).slice(0, SETTINGS.maxPhotos);
  if (photos.length === 0) throw new Error('No ID photo');
  const monthFolder = getMonthFolder_(now);
  const saved = photos.map(function (p) {
    const kind =
      String(p.kind || 'id')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 30) || 'id';
    const file = savePhoto_(monthFolder, guestName, entryDate, kind, p.dataUrl);
    return { id: file.getId(), url: file.getUrl(), kind: kind };
  });
  // Placeholder text; replaced with clickable links after the row is added.
  const photoLinks = saved.length + ' photo(s)';

  const stay = d.stay || {};
  const rules =
    'Agreed, signed "' + clean_(d.signature) + '" (rules of ' + clean_(d.rulesVersion) + ')';

  let tabName, row, check;
  if (isIndian) {
    tabName = TAB_INDIAN;
    check = {
      type: 'id',
      files: saved.map(function (s) {
        return s.id;
      }),
      typed: {
        fullName: g.fullName,
        dateOfBirth: g.dateOfBirth,
        idType: g.idType,
        idNumber: g.idNumber,
      },
    };
    row = [
      now,
      dateCell_(stay.arrivalDate),
      clean_(stay.nights),
      clean_(g.fullName),
      dateCell_(g.dateOfBirth),
      clean_(g.gender),
      clean_(g.phone),
      clean_(g.email),
      clean_(g.address),
      clean_(g.city),
      clean_(g.state),
      clean_(g.pin),
      ID_LABELS[g.idType] || clean_(g.idType),
      g.idType === 'aadhaar' ? 'XXXX XXXX ' + clean_(g.idNumber) : clean_(g.idNumber),
      clean_(stay.comingFrom),
      clean_(stay.goingNext),
      rules,
      photoLinks,
      '⏳ Checking…',
      '',
      JSON.stringify(check),
    ];
  } else {
    tabName = TAB_FOREIGN;
    check = {
      type: 'passport',
      files: saved
        .filter(function (s) {
          return s.kind === 'passport-photo-page';
        })
        .map(function (s) {
          return s.id;
        }),
      typed: {
        surname: g.surname,
        givenNames: g.givenNames,
        dateOfBirth: g.dateOfBirth,
        passportNo: g.passportNo,
        passportExpiry: g.passportExpiry,
      },
    };
    row = [
      now,
      dateCell_(stay.arrivalDate),
      clean_(stay.nights),
      clean_(g.surname),
      clean_(g.givenNames),
      clean_(g.gender),
      dateCell_(g.dateOfBirth),
      clean_(g.nationality),
      clean_(g.address),
      clean_(g.city),
      clean_(g.country),
      clean_(g.passportNo).toUpperCase(),
      clean_(g.passportPlace),
      dateCell_(g.passportIssued),
      dateCell_(g.passportExpiry),
      clean_(g.visaNo).toUpperCase(),
      clean_(g.visaType),
      clean_(g.visaPlace),
      dateCell_(g.visaIssued),
      dateCell_(g.visaValidTill),
      dateCell_(g.indiaArrivalDate),
      clean_(g.indiaArrivedFrom),
      clean_(g.purpose),
      clean_(g.employedInIndia),
      clean_(stay.goingNext),
      clean_(g.phone),
      clean_(g.phoneHome),
      clean_(g.email),
      rules,
      photoLinks,
      '⏳ Checking…',
      false,
      '',
      JSON.stringify(check),
    ];
  }

  const tab = getSpreadsheet_().getSheetByName(tabName);
  tab.appendRow(row);

  // Turn the photo list into clickable names ("aadhaar-front", ...).
  const photoCell = tab.getRange(tab.getLastRow(), COLUMNS[tabName].indexOf('ID photos') + 1);
  const text = saved
    .map(function (s) {
      return s.kind;
    })
    .join('\n');
  const links = SpreadsheetApp.newRichTextValue().setText(text);
  let start = 0;
  saved.forEach(function (s) {
    links.setLinkUrl(start, start + s.kind.length, s.url);
    start += s.kind.length + 1;
  });
  photoCell.setRichTextValue(links.build());
}

function required_(value, what) {
  if (!value || !String(value).trim()) throw new Error('Missing ' + what);
}

/**
 * Guest-typed text for a sheet cell. Trimmed and length-capped. A
 * leading = + - or @ would make Sheets treat it as a formula, so
 * those get a ' in front (shown as plain text).
 */
function clean_(value) {
  const s = String(value == null ? '' : value)
    .trim()
    .slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** "2026-11-20" -> a real date cell (shown as "20 Nov 2026"), or blank. */
function dateCell_(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : '';
}

function getMonthFolder_(now) {
  const root = getFolder_();
  const name = Utilities.formatDate(now, SETTINGS.timeZone, 'yyyy-MM MMMM');
  const found = root.getFoldersByName(name);
  return found.hasNext() ? found.next() : root.createFolder(name);
}

/** "Priya Sharma" -> "Priya-Sharma". Keeps letters in any script. */
function fileSafeName_(name) {
  return (
    String(name)
      .normalize('NFC')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'Guest'
  );
}

function savePhoto_(folder, guestName, entryDate, kind, dataUrl) {
  const m = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(dataUrl || '');
  if (!m) throw new Error('Photo is not an image');
  const bytes = Utilities.base64Decode(m[2]);
  if (bytes.length > SETTINGS.maxPhotoBytes) throw new Error('Photo too large');
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const base = fileSafeName_(guestName) + '_' + entryDate + '_' + kind;
  // Two guests with the same name on the same day get -2, -3, ...
  let fileName = base + '.' + ext;
  for (let n = 2; folder.getFilesByName(fileName).hasNext(); n++) {
    fileName = base + '-' + n + '.' + ext;
  }
  const blob = Utilities.newBlob(bytes, 'image/' + m[1], fileName);
  return folder.createFile(blob);
}

// ============================================================
// The ID check. Runs every 5 minutes (set up by setup()), so the
// guest isn't kept waiting while Google reads their photo.
// ============================================================
function checkNewIds() {
  const started = Date.now();
  const spreadsheet = getSpreadsheet_();
  if (!spreadsheet) return;
  [TAB_INDIAN, TAB_FOREIGN].forEach(function (tabName) {
    const tab = spreadsheet.getSheetByName(tabName);
    const headers = COLUMNS[tabName];
    const checkCol = headers.indexOf('ID check') + 1;
    const dataCol = headers.length;
    const lastRow = tab.getLastRow();
    if (lastRow < 2) return;
    const verdicts = tab.getRange(2, checkCol, lastRow - 1, 1).getValues();
    const checkData = tab.getRange(2, dataCol, lastRow - 1, 1).getValues();
    for (let i = 0; i < verdicts.length; i++) {
      if (Date.now() - started > 4 * 60 * 1000) return; // stay inside Google's time limit
      if (String(verdicts[i][0]).indexOf('⏳') !== 0) continue;
      let result;
      try {
        const check = JSON.parse(checkData[i][0]);
        const text = check.files.map(readTextFromPhoto_).join('\n');
        result =
          check.type === 'passport'
            ? checkPassportText(check.typed, text)
            : checkIdText(check.typed, text);
      } catch (err) {
        console.error(err);
        result = {
          status: 'unreadable',
          message: '❓ Couldn’t run the check. Have a look yourself.',
        };
      }
      const cell = tab.getRange(i + 2, checkCol);
      cell.setValue(result.message);
      cell.setBackground(
        result.status === 'ok' ? '#d9ead3' : result.status === 'warn' ? '#fce8b2' : '#eeeeee',
      );
    }
  });
}

/**
 * Reads the text in a photo with Google Drive's OCR: it makes a
 * temporary Google Doc from the image, reads the text, then
 * deletes the Doc. Needs the "Drive API" service (see README).
 */
function readTextFromPhoto_(fileId) {
  const blob = DriveApp.getFileById(fileId).getBlob();
  const doc = Drive.Files.create(
    { name: 'ocr-temp-' + fileId, mimeType: MimeType.GOOGLE_DOCS, parents: [getFolder_().getId()] },
    blob,
    { ocrLanguage: 'en', fields: 'id' },
  );
  try {
    return DocumentApp.openById(doc.id).getBody().getText();
  } finally {
    Drive.Files.remove(doc.id);
  }
}
