// ============================================================
// The "pick your dates" booking form. Rendered into every
// element with a data-booking-widget attribute, so adding it to
// a page is one line of HTML:
//   <div data-booking-widget></div>
// (plus rooms-data.js, booking-config.js and this file loaded).
//
// Where the form sends the guest depends on
// js/data/booking-config.js:
//
//   StayFlexi URL filled in → StayFlexi's booking page, already
//   set to the chosen dates. The guest picks a bed or room, sees
//   live rates and pays there, and StayFlexi keeps availability
//   in sync with every other channel the hostel sells on.
//
//   StayFlexi URL empty → WhatsApp, with the dates, guest count
//   and room written into the message, ready to send.
//
// Only the dates are passed to StayFlexi on purpose: if a guest
// count is passed too, StayFlexi drops its cheapest matching
// room into the cart automatically, which would quietly pick a
// room for the guest instead of letting them choose.
// ============================================================

function isStayflexiReady() {
  const bookingUrl = BOOKING_CONFIG.stayflexiBookingUrl.trim();
  if (!bookingUrl) return false;

  try {
    new URL(bookingUrl);
    return true;
  } catch {
    console.warn('BOOKING_CONFIG.stayflexiBookingUrl is not a valid URL -- falling back to WhatsApp.');
    return false;
  }
}

// ---- Date helpers ----
// <input type="date"> works with 'YYYY-MM-DD' strings in the
// guest's local time. These build that format by hand because
// toISOString() converts to UTC first, which can land on the
// wrong day.
function toDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateValue(dateValue) {
  const [year, month, day] = dateValue.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dateValue, days) {
  const date = parseDateValue(dateValue);
  date.setDate(date.getDate() + days);
  return toDateValue(date);
}

// '2026-11-12' → 'Thu, 12 Nov 2026'
function formatDateForMessage(dateValue) {
  return parseDateValue(dateValue).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ---- Where the form sends the guest ----
function buildStayflexiUrl({ checkin, checkout }) {
  const url = new URL(BOOKING_CONFIG.stayflexiBookingUrl.trim());
  url.searchParams.set('checkin', checkin);
  url.searchParams.set('checkout', checkout);
  return url.toString();
}

function buildWhatsappBookingUrl({ checkin, checkout, guests, roomName }) {
  const lines = [
    "Hi! I'd like to book a stay at Aangan by Gokarma Living.",
    `Check-in: ${formatDateForMessage(checkin)}`,
    `Check-out: ${formatDateForMessage(checkout)}`,
    `Guests: ${guests}`,
  ];
  if (roomName) lines.push(`Room: ${roomName}`);

  return `https://wa.me/${BOOKING_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}

// ---- Form markup ----
// Inputs sit inside their <label>, so each widget on a page
// works without needing its own unique IDs.
function bookingFormHtml(preselectedRoomId) {
  const today = toDateValue(new Date());
  const tomorrow = addDays(today, 1);
  const sendsToStayflexi = isStayflexiReady();

  const dateFields = `
    <label class="booking-field">
      <span>Check-in</span>
      <input type="date" name="checkin" value="${today}" min="${today}" required>
    </label>
    <label class="booking-field">
      <span>Check-out</span>
      <input type="date" name="checkout" value="${tomorrow}" min="${tomorrow}" required>
    </label>
  `;

  // Guests + room only matter for the WhatsApp message;
  // StayFlexi's own page handles both.
  let whatsappOnlyFields = '';
  if (!sendsToStayflexi) {
    const guestOptions = Array.from({ length: BOOKING_CONFIG.maxGuests }, (_, i) => {
      const count = i + 1;
      return `<option value="${count}">${count}</option>`;
    }).join('');

    const roomOptions = ROOMS.map((room) => {
      const selected = room.id === preselectedRoomId ? 'selected' : '';
      return `<option value="${room.id}" ${selected}>${room.name}</option>`;
    }).join('');

    whatsappOnlyFields = `
      <label class="booking-field">
        <span>Guests</span>
        <select name="guests">${guestOptions}</select>
      </label>
      <label class="booking-field">
        <span>Room</span>
        <select name="room">
          <option value="">Not sure yet</option>
          ${roomOptions}
        </select>
      </label>
    `;
  }

  const nextStepNote = sendsToStayflexi
    ? 'Next, pick your bed or room, see live rates and confirm on our secure booking page (powered by StayFlexi).'
    : "This opens WhatsApp with your dates filled in. Just hit send and we'll confirm availability and rates.";

  return `
    <form class="booking-form">
      ${dateFields}
      ${whatsappOnlyFields}
      <button type="submit" class="btn btn-primary">Check Availability</button>
      <p class="booking-note">${nextStepNote}</p>
    </form>
  `;
}

// ---- Behavior ----
// Moving check-in forward pushes check-out along with it, so the
// form can never hold a zero- or negative-night stay.
function keepCheckoutAfterCheckin(form) {
  const checkinInput = form.elements.checkin;
  const checkoutInput = form.elements.checkout;

  checkinInput.addEventListener('change', () => {
    if (!checkinInput.value) return;

    const earliestCheckout = addDays(checkinInput.value, 1);
    checkoutInput.min = earliestCheckout;
    if (!checkoutInput.value || checkoutInput.value < earliestCheckout) {
      checkoutInput.value = earliestCheckout;
    }
  });
}

function handleBookingSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const checkin = formData.get('checkin');
  const checkout = formData.get('checkout');

  if (isStayflexiReady()) {
    window.location.href = buildStayflexiUrl({ checkin, checkout });
    return;
  }

  const room = ROOMS.find((r) => r.id === formData.get('room'));
  const whatsappUrl = buildWhatsappBookingUrl({
    checkin,
    checkout,
    guests: formData.get('guests'),
    roomName: room ? room.name : '',
  });
  window.open(whatsappUrl, '_blank', 'noopener');
}

// book.html?room=vintage-room (from a room card's "Book This
// Room" button) preselects that room in the form.
function renderBookingWidgets() {
  const preselectedRoomId = new URLSearchParams(window.location.search).get('room');

  document.querySelectorAll('[data-booking-widget]').forEach((container) => {
    container.innerHTML = bookingFormHtml(preselectedRoomId);

    const form = container.querySelector('.booking-form');
    keepCheckoutAfterCheckin(form);
    form.addEventListener('submit', handleBookingSubmit);
  });
}

renderBookingWidgets();
