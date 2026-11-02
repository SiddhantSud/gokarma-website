// ============================================================
// Booking settings -- the ONE file to edit when the StayFlexi
// account is ready. js/booking.js reads these values.
//
// stayflexiBookingUrl
//   Copy the "Booking Engine URL" from the StayFlexi dashboard
//   (More Apps, the four-blocks icon at top right → Property
//   Configuration → Booking engine) and paste it between the
//   quotes. It looks something like:
//     https://bookingengine.stayflexi.com/?hotel_id=12345
//   While it's left empty (''), every booking form on the site
//   falls back to WhatsApp instead, with the guest's dates
//   already written into the message -- so nothing breaks
//   before StayFlexi is set up.
//
// whatsappNumber
//   Used by that fallback. Country code + number, no "+" or
//   spaces.
//
// maxGuests
//   The highest number in the "Guests" dropdown (only shown in
//   the WhatsApp fallback -- StayFlexi asks about beds/rooms on
//   its own page).
// ============================================================

const BOOKING_CONFIG = {
  stayflexiBookingUrl: 'https://bookingengine.stayflexi.com/?hotel_id=30713',
  whatsappNumber: '917892803231',
  maxGuests: 8,
};
