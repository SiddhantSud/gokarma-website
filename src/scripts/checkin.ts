// ============================================================
// The guest check-in form (src/pages/checkin.astro).
//
// What it does in the guest's browser:
//   - shows the Indian or the foreign-guest questions,
//   - shrinks each ID photo on the phone before sending (a 4 MB
//     camera photo becomes about 300 KB, which matters on hostel
//     Wi-Fi), keeping it sharp enough to read,
//   - sends everything to the hosts' private Google script
//     (checkin-backend/), which saves the photos to Google Drive
//     and the details to a Google Sheet.
// Nothing is kept in the browser after sending.
// ============================================================
import { formatDateForDisplay, toDateValue } from '../lib/booking';

// ---- Photo settings ----
// 1600px on the long side keeps passport text and the <<< lines
// readable for the ID check, at a fraction of the original size.
const PHOTO_MAX_SIDE = 1600;
const PHOTO_QUALITY = 0.82;
const SEND_TIMEOUT_MS = 90_000;

const form = document.querySelector<HTMLFormElement>('[data-checkin-form]');
const done = document.querySelector<HTMLElement>('[data-checkin-done]');

if (form && done) setUpCheckIn(form, done);

function setUpCheckIn(form: HTMLFormElement, done: HTMLElement) {
  const endpoint = (form.dataset.endpoint ?? '').trim();
  const rulesVersion = form.dataset.rulesVersion ?? '';
  const errorBox = form.querySelector<HTMLElement>('[data-form-error]')!;
  const submitButton = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const photos = new Map<string, string>(); // photo kind -> compressed JPEG (data URL)

  // ---- Desk code ----
  // The QR card's link carries it (?code=...). Remembered on this
  // phone so staff can check several guests in. Asked for only if
  // it's missing.
  const deskInput = form.elements.namedItem('deskCode') as HTMLInputElement;
  const codeFromLink = new URLSearchParams(window.location.search).get('code');
  deskInput.value = codeFromLink ?? readSaved('aangan-desk-code') ?? '';
  if (codeFromLink) save('aangan-desk-code', codeFromLink);
  const deskField = form.querySelector<HTMLElement>('[data-desk-code-field]')!;
  deskField.hidden = deskInput.value !== '';
  deskInput.required = !deskField.hidden;

  // ---- Indian or foreign ----
  const showPath = (group: string) => {
    form.querySelectorAll<HTMLElement>('[data-after-choice]').forEach((el) => (el.hidden = false));
    form.querySelectorAll<HTMLFieldSetElement>('[data-path]').forEach((fieldset) => {
      const active = fieldset.dataset.path === group;
      fieldset.hidden = !active;
      fieldset.disabled = !active; // disabled fields are skipped by validation and not sent
    });
  };
  form.querySelectorAll<HTMLInputElement>('input[name="nationalityGroup"]').forEach((radio) => {
    radio.addEventListener('change', () => showPath(radio.value));
  });

  // ---- Dates: shown as "15 Nov 2026" over the date field ----
  const today = toDateValue(new Date());
  const dateInputs = form.querySelectorAll<HTMLInputElement>('input[type="date"]');
  dateInputs.forEach((input) => {
    if (input.hasAttribute('data-default-today')) input.value = today;
    if (input.hasAttribute('data-max-today')) input.max = today;
    const display = input.parentElement?.querySelector('.date-display');
    const show = () => {
      if (display) display.textContent = formatDateForDisplay(input.value) || 'Choose a date';
    };
    show();
    input.addEventListener('input', show);
    input.addEventListener('change', show);
    input.addEventListener('click', () => {
      try {
        input.showPicker?.();
      } catch {
        // Some browsers only allow this sometimes; the field still works.
      }
    });
  });
  form.classList.add('has-date-display');

  // ---- ID type changes the labels ----
  const idType = form.querySelector<HTMLSelectElement>('[data-id-type]')!;
  const idNumber = form.querySelector<HTMLInputElement>('[data-id-number]')!;
  const idNumberLabel = form.querySelector<HTMLElement>('[data-id-number-label]')!;
  const idFrontLabel = form.querySelector<HTMLElement>('[data-id-front-label]')!;
  const aadhaarTip = form.querySelector<HTMLElement>('[data-aadhaar-tip]')!;
  const updateIdLabels = () => {
    const label = idType.selectedOptions[0]?.text ?? 'ID';
    const isAadhaar = idType.value === 'aadhaar';
    idNumberLabel.textContent = isAadhaar ? 'Last 4 digits of your Aadhaar' : `${label} number`;
    idNumber.pattern = isAadhaar ? '[0-9]{4}' : '.{4,}';
    idNumber.maxLength = isAadhaar ? 4 : 20;
    idNumber.inputMode = isAadhaar ? 'numeric' : 'text';
    idFrontLabel.textContent = `Front of your ${label}`;
    aadhaarTip.hidden = !isAadhaar;
  };
  idType.addEventListener('change', updateIdLabels);
  updateIdLabels();

  // ---- Photos: shrink on the phone, show a preview ----
  form.querySelectorAll<HTMLInputElement>('input[data-photo]').forEach((input) => {
    const tile = input.closest<HTMLElement>('[data-photo-tile]')!;
    const preview = tile.querySelector<HTMLElement>('.photo-preview')!;
    const status = tile.querySelector<HTMLElement>('.photo-status')!;
    const kind = input.dataset.photo!;
    status.dataset.hint = status.textContent ?? ''; // restored for the next guest
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      photos.delete(kind);
      tile.classList.remove('has-photo', 'is-missing');
      if (!file) return;
      status.textContent = 'Shrinking your photo…';
      try {
        const dataUrl = await compressPhoto(file);
        photos.set(kind, dataUrl);
        preview.innerHTML = '';
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = '';
        preview.append(img);
        tile.classList.add('has-photo');
        status.textContent = `✓ Ready (${formatBytes(file.size)} → ${formatBytes(dataUrlBytes(dataUrl))}). Tap to retake.`;
      } catch {
        status.textContent = "That file didn't open as a photo. Try taking a new one.";
      }
    });
  });

  // ---- Signature must match the name given ----
  const signature = form.querySelector<HTMLInputElement>('[data-signature]')!;
  const typedName = () => {
    const value = (name: string) => {
      const field = form.elements.namedItem(name);
      // Two fields share some names (one per path); take the one that's switched on.
      const list = field instanceof RadioNodeList ? Array.from(field) : [field];
      const active = list.find(
        (el) => el instanceof HTMLInputElement && !el.matches(':disabled'),
      ) as HTMLInputElement | undefined;
      return active?.value ?? '';
    };
    const group = selectedGroup();
    return group === 'indian' ? value('fullName') : `${value('givenNames')} ${value('surname')}`;
  };

  // ---- Send ----
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.hidden = true;

    const group = selectedGroup();
    if (!group) {
      showError('First, tell us which passport you hold.');
      return;
    }
    // The signature should be the guest's own name: at least one word in common.
    const nameWords = simplify(typedName()).split(' ');
    const signed = simplify(signature.value).split(' ');
    const matches = signed.some((word) => word.length > 1 && nameWords.includes(word));
    signature.setCustomValidity(
      matches || !signature.value ? '' : 'Please sign with the same name you gave above.',
    );
    if (!form.reportValidity()) return;

    const missing = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[data-photo][data-required]'),
    ).filter((input) => !input.matches(':disabled') && !photos.has(input.dataset.photo!));
    if (missing.length > 0) {
      missing.forEach((input) => input.closest('[data-photo-tile]')?.classList.add('is-missing'));
      showError('We still need a photo of your ID. Tap the photo boxes marked in red.');
      missing[0]
        .closest('[data-photo-tile]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!endpoint) {
      showError("Online check-in isn't connected yet. Please check in at the counter.");
      return;
    }

    const payload = buildPayload(form, group, photos, rulesVersion);
    submitButton.disabled = true;
    submitButton.textContent = 'Sending… (a few seconds)';
    try {
      const result = await send(endpoint, payload);
      if (result.ok) {
        showDone(group === 'indian' ? payload.guest.fullName : payload.guest.givenNames);
      } else if (result.error === 'desk-code') {
        deskField.hidden = false;
        deskInput.required = true;
        deskInput.value = '';
        save('aangan-desk-code', '');
        showError("That desk code didn't work. Ask us at the counter for the code.");
        deskInput.focus();
      } else {
        showError(
          'Something went wrong on our side. Try once more, or show us your ID at the counter.',
        );
      }
    } catch {
      showError(
        "Couldn't reach us. Check you're connected to the Wi-Fi and try again. Nothing you typed is lost.",
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Check me in';
    }
  });

  function showError(message: string) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function selectedGroup(): string {
    const checked = form.querySelector<HTMLInputElement>('input[name="nationalityGroup"]:checked');
    return checked?.value ?? '';
  }

  // ---- Done screen, and "check in another guest" ----
  const doneName = done.querySelector<HTMLElement>('[data-done-name]')!;
  function showDone(name: string) {
    const firstName = name.trim().split(/\s+/)[0] ?? '';
    doneName.textContent = firstName ? `, ${firstName}` : '';
    form.hidden = true;
    done.hidden = false;
    done.focus();
    done.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  done.querySelector('[data-another]')?.addEventListener('click', () => {
    // Keep the stay details (a group usually arrives together); clear the person.
    const keep: Record<string, string> = {};
    [
      'arrivalDate',
      'nights',
      'goingNext',
      'deskCode',
      'indiaArrivalDate',
      'indiaArrivedFrom',
    ].forEach((name) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement) keep[name] = field.value;
    });
    form.reset();
    Object.entries(keep).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.value = value;
    });
    photos.clear();
    form.querySelectorAll<HTMLElement>('[data-photo-tile]').forEach((tile) => {
      tile.classList.remove('has-photo', 'is-missing');
      tile.querySelector('.photo-preview')!.textContent = '📷';
      const status = tile.querySelector<HTMLElement>('.photo-status')!;
      status.textContent = status.dataset.hint ?? '';
    });
    form.querySelectorAll<HTMLElement>('[data-after-choice], [data-path]').forEach((el) => {
      el.hidden = true;
    });
    dateInputs.forEach((input) => input.dispatchEvent(new Event('change')));
    updateIdLabels();
    done.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ============================================================
// Helpers
// ============================================================

/** Reads the form into what the Google script expects. */
function buildPayload(
  form: HTMLFormElement,
  group: string,
  photos: Map<string, string>,
  rulesVersion: string,
) {
  // FormData skips disabled fields, so only the chosen path's answers are included.
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? '').trim();
  const idType = text('idType');
  const guestFields =
    group === 'indian'
      ? [
          'fullName',
          'dateOfBirth',
          'gender',
          'phone',
          'email',
          'address',
          'city',
          'state',
          'pin',
          'idType',
          'idNumber',
        ]
      : [
          'givenNames',
          'surname',
          'dateOfBirth',
          'gender',
          'nationality',
          'address',
          'city',
          'country',
          'phoneHome',
          'phone',
          'email',
          'passportNo',
          'passportPlace',
          'passportIssued',
          'passportExpiry',
          'visaType',
          'visaNo',
          'visaPlace',
          'visaIssued',
          'visaValidTill',
          'indiaArrivalDate',
          'indiaArrivedFrom',
          'purpose',
          'employedInIndia',
        ];
  const guest: Record<string, string> = {};
  guestFields.forEach((name) => (guest[name] = text(name)));

  // Photo names in Drive say what's in them: "aadhaar-front", "passport-photo-page", ...
  const photoList = Array.from(photos.entries()).map(([kind, dataUrl]) => ({
    kind: group === 'indian' ? kind.replace(/^id-/, `${idType}-`) : kind,
    dataUrl,
  }));

  return {
    deskCode: text('deskCode'),
    nationalityGroup: group,
    stay: {
      arrivalDate: text('arrivalDate'),
      nights: text('nights'),
      goingNext: text('goingNext'),
      comingFrom: text('comingFrom'),
    },
    guest,
    photos: photoList,
    rulesAccepted: data.get('rulesAccepted') === 'on',
    rulesVersion,
    signature: text('signature'),
  };
}

/**
 * Sends the check-in. Sent as plain text on purpose: that's the one
 * kind of cross-site request Google's script addresses accept from
 * a browser without extra permission checks.
 */
async function send(endpoint: string, payload: unknown): Promise<{ ok: boolean; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Shrinks a photo to at most PHOTO_MAX_SIDE px and re-saves it as JPEG. */
async function compressPhoto(file: File): Promise<string> {
  const image = await loadImage(file);
  const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No canvas');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', PHOTO_QUALITY);
}

/** Opens the photo upright (phones store sideways photos with a rotation note). */
async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // Older browsers: read the file and let an <img> decode it.
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    return img;
  }
}

function dataUrlBytes(dataUrl: string): number {
  return Math.round(((dataUrl.length - dataUrl.indexOf(',') - 1) * 3) / 4);
}

function formatBytes(bytes: number): string {
  return bytes > 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.round(bytes / 1000)} KB`;
}

/** For comparing names: lower case, single spaces, no accents. */
function simplify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// ---- Remembering the desk code on this phone (if the browser allows) ----
function readSaved(key: string): string | null {
  try {
    return localStorage.getItem(key) || null;
  } catch {
    return null;
  }
}

function save(key: string, value: string) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // Private browsing: the code just has to come from the link each time.
  }
}
