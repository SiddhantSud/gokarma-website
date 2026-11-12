// ============================================================
// Facts about the hostel that appear on more than one page.
// Change a value here and every page that shows it updates on
// the next build -- no find-and-replace across files.
//
// Every value here must be real (from the owners or their
// Google / StayFlexi listings). See CLAUDE.md, section 2.
// ============================================================

export const SITE = {
  name: 'Aangan by Gokarma Living',
  shortName: 'Aangan',

  // ---- Google rating ----
  // From the Google listing (checked 2026-11-12). Update by hand when it changes.
  rating: '4.9',
  reviewCount: 359,

  // ---- Price shown as "Dorm beds start from around ₹___/night" ----
  // Possibly outdated: StayFlexi showed ₹650-700 + tax on 2026-10-29.
  // Waiting on the owners to confirm before changing it.
  dormPriceFrom: 850,

  // ---- Contact ----
  phoneDisplay: '+91 78928 03231',
  phoneLink: '+917892803231', // used in tel: links
  whatsappNumber: '917892803231', // country code + number, no "+" or spaces
  instagramUrl: 'https://instagram.com/hostel_gokarna',

  // ---- Location ----
  address: {
    street: 'Kudle Beach Road',
    locality: 'Gokarna',
    region: 'Karnataka',
    postalCode: '581326',
    country: 'IN',
  },
  // From the Google Maps listing.
  geo: { latitude: 14.5364615, longitude: 74.3154106 },
  mapUrl: 'https://maps.google.com/?cid=13197816616526846002',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Aangan%20by%20Gokarma%20Living%2C%20Gokarna&t=&z=15&ie=UTF8&iwloc=&output=embed',
};

// ---- "Aangan" in other languages ----
// The logo cycles through these on a timer. Aangan means the
// open courtyard of a home; each entry is that word in the
// language. Have a native speaker check before adding more.
export const AANGAN_WORDS: { lang: string; word: string }[] = [
  { lang: 'en', word: 'Aangan' },
  { lang: 'hi', word: 'आँगन' }, // Hindi
  { lang: 'ta', word: 'முற்றம்' }, // Tamil
  { lang: 'ml', word: 'മുറ്റം' }, // Malayalam
  { lang: 'te', word: 'ప్రాంగణం' }, // Telugu
  { lang: 'mr', word: 'अंगण' }, // Marathi
];

/** A wa.me link that opens WhatsApp with `message` already typed. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
