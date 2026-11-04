// ============================================================
// Booking settings, read by src/components/BookingWidget.astro.
//
// stayflexiBookingUrl
//   The "Booking Engine URL" from the StayFlexi dashboard (More
//   Apps, the four-blocks icon at top right → Property
//   Configuration → Booking engine). If it's left empty (''),
//   every booking form on the site falls back to WhatsApp
//   instead, with the guest's dates already written into the
//   message.
//
// maxGuests
//   The highest number in the "Guests" dropdown (only shown in
//   the WhatsApp fallback -- StayFlexi asks about beds/rooms on
//   its own page).
//
// The WhatsApp number itself lives in src/config/site.ts.
// ============================================================

export const BOOKING = {
  stayflexiBookingUrl: 'https://bookingengine.stayflexi.com/?hotel_id=30713',
  maxGuests: 8,
};
