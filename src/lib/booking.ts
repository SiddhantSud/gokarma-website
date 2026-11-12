// ============================================================
// Helpers for the booking form (src/components/BookingWidget.astro):
// date handling and the two places a booking can be sent.
// ============================================================

export function isValidBookingUrl(url: string): boolean {
  if (!url.trim()) return false;
  try {
    new URL(url.trim());
    return true;
  } catch {
    console.warn('BOOKING.stayflexiBookingUrl is not a valid URL -- falling back to WhatsApp.');
    return false;
  }
}

// ---- Dates ----
// <input type="date"> works with 'YYYY-MM-DD' strings in the
// guest's local time. These build that format by hand because
// toISOString() converts to UTC first, which can land on the
// wrong day in India.
export function toDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateValue(dateValue: string): Date {
  const [year, month, day] = dateValue.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateValue: string, days: number): string {
  const date = parseDateValue(dateValue);
  date.setDate(date.getDate() + days);
  return toDateValue(date);
}

// '2026-11-12' → 'Thu, 12 Nov 2026'
function formatDateForMessage(dateValue: string): string {
  return parseDateValue(dateValue).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ---- Where the form sends the guest ----
interface Stay {
  checkin: string;
  checkout: string;
}

/** StayFlexi's booking page with the dates filled in. Only dates -- see BookingWidget.astro. */
export function buildStayflexiUrl(bookingUrl: string, { checkin, checkout }: Stay): string {
  const url = new URL(bookingUrl.trim());
  url.searchParams.set('checkin', checkin);
  url.searchParams.set('checkout', checkout);
  return url.toString();
}

/** A WhatsApp chat with the booking request already typed out. */
export function buildWhatsappBookingUrl(
  whatsappNumber: string,
  { checkin, checkout, guests, roomName }: Stay & { guests: string; roomName: string },
): string {
  const lines = [
    "Hi! I'd like to book a stay at Aangan by Gokarma Living.",
    `Check-in: ${formatDateForMessage(checkin)}`,
    `Check-out: ${formatDateForMessage(checkout)}`,
    `Guests: ${guests}`,
  ];
  if (roomName) lines.push(`Room: ${roomName}`);

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}
