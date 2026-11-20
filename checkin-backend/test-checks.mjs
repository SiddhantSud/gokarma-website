// ============================================================
// Quick tests for Checks.gs, run on a computer with:
//   node checkin-backend/test-checks.mjs
// Apps Script files are plain JavaScript, so this loads
// Checks.gs into a sandbox and calls its functions. The sample
// ID text below is made up for the test (no real person).
// ============================================================
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('./Checks.gs', import.meta.url), 'utf8');
const sandbox = {};
createContext(sandbox);
runInContext(
  source + '\nthis.api = { checkIdText, checkPassportText, parseMrz, mrzCheckDigit };',
  sandbox,
);
const { checkIdText, checkPassportText, parseMrz, mrzCheckDigit } = sandbox.api;

// ---- MRZ check digits (ICAO 9303 specimen) ----
assert.equal(mrzCheckDigit('L898902C3'), '6');
assert.equal(mrzCheckDigit('740812'), '2');
assert.equal(mrzCheckDigit('120415'), '9');

// ---- Passport (ICAO specimen "ANNA MARIA ERIKSSON") ----
const passportText = `PASSPORT
Surname ERIKSSON
P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<
L898902C36UTO7408122F1204159ZE184226B<<<<<10`;
const mrz = parseMrz(passportText);
assert.equal(mrz.passportNo, 'L898902C3');
assert.equal(mrz.dateOfBirth, '1974-08-12');
assert.equal(mrz.expiry, '2012-04-15');
assert.equal(mrz.surname, 'ERIKSSON');
assert.equal(mrz.givenNames, 'ANNA MARIA');
assert.ok(mrz.passportNoValid && mrz.dateOfBirthValid && mrz.expiryValid);

const typedPassport = {
  surname: 'Eriksson',
  givenNames: 'Anna Maria',
  dateOfBirth: '1974-08-12',
  passportNo: 'L898902C3',
  passportExpiry: '2012-04-15',
};
assert.equal(checkPassportText(typedPassport, passportText).status, 'ok');
const wrongDob = checkPassportText({ ...typedPassport, dateOfBirth: '1974-12-08' }, passportText);
assert.equal(wrongDob.status, 'warn');
assert.match(wrongDob.message, /born 1974-08-12/);

// ---- Aadhaar (made-up sample) ----
const aadhaarText = `Government of India
Ravi Kumar Shetty
DOB: 07/03/1995
MALE
1234 5678 9012
Aadhaar - Aam Aadmi ka Adhikar`;
const typedAadhaar = {
  fullName: 'Ravi Kumar Shetty',
  dateOfBirth: '1995-03-07',
  idType: 'aadhaar',
  idNumber: '9012',
};
assert.equal(checkIdText(typedAadhaar, aadhaarText).status, 'ok');
const wrongName = checkIdText({ ...typedAadhaar, fullName: 'Ravi Shetty Rao' }, aadhaarText);
assert.equal(wrongName.status, 'warn');
assert.match(wrongName.message, /rao/);
assert.equal(checkIdText({ ...typedAadhaar, idNumber: '1111' }, aadhaarText).status, 'warn');
// Masked Aadhaar
assert.equal(
  checkIdText(typedAadhaar, aadhaarText.replace('1234 5678 9012', 'XXXX XXXX 9012')).status,
  'ok',
);
// Older cards print only the year of birth
const yearOnly = checkIdText(
  typedAadhaar,
  aadhaarText.replace('DOB: 07/03/1995', 'Year of Birth : 1995'),
);
assert.equal(yearOnly.status, 'ok');
assert.match(yearOnly.message, /birth year only/);

// ---- Driving licence (made-up sample) ----
const dlText = 'Driving Licence  KA19 20110012345  Name: PRIYA SHARMA  DOB 15-11-1998';
assert.equal(
  checkIdText(
    {
      fullName: 'Priya Sharma',
      dateOfBirth: '1998-11-15',
      idType: 'driving-licence',
      idNumber: 'KA19 20110012345',
    },
    dlText,
  ).status,
  'ok',
);

// ---- Unreadable photo ----
assert.equal(checkIdText(typedAadhaar, '  ~~ ').status, 'unreadable');

console.log('All ID check tests passed.');
