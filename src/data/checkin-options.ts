// ============================================================
// Dropdown and suggestion lists for the check-in form
// (checkin.html): ID types, Indian states, countries, visa types
// and reasons for visiting. Kept here so the page file only has
// the layout.
// ============================================================

// ---- Indian IDs we accept ----
export const INDIAN_ID_TYPES = [
  { id: 'aadhaar', label: 'Aadhaar' },
  { id: 'voter-id', label: 'Voter ID' },
  { id: 'driving-licence', label: 'Driving Licence' },
] as const;

// ---- States and union territories ----
export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// ---- Countries ----
// ISO country codes, turned into English names at build time by
// the JavaScript runtime itself (Intl.DisplayNames), so the list
// doesn't need hand-typing. Used as suggestions, not a strict list.
const COUNTRY_CODES =
  'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW'.split(
    ' ',
  );

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
export const COUNTRIES = COUNTRY_CODES.map((code) => regionNames.of(code) ?? code).sort((a, b) =>
  a.localeCompare(b),
);

// ---- For foreign guests (what Form C asks for) ----
export const VISA_TYPES = [
  'e-Tourist Visa',
  'Tourist Visa',
  'e-Business Visa',
  'Business Visa',
  'Employment Visa',
  'Student Visa',
  'Conference Visa',
  'Medical Visa',
  'OCI Card',
  'Other',
];

export const VISIT_PURPOSES = [
  'Tourism',
  'Yoga / spiritual',
  'Visiting friends or family',
  'Business',
  'Conference',
  'Medical',
  'Other',
];
