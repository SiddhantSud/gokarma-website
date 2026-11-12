// ============================================================
// Locks and unlocks the GitHub token with the admin password.
//
// The token is never stored in plain text. setup.html encrypts it
// with a key made from the password (PBKDF2, 600,000 rounds) using
// AES-GCM, and saves the result as admin/key.json. The admin page
// asks for the password and decrypts it in the browser. A wrong
// password simply fails to decrypt.
//
// Because key.json is public, the password is the only lock:
// it must be a long passphrase, not a short password.
// ============================================================

const ITERATIONS = 600000;

const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromBase64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function keyFromPassword(password, salt, iterations) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Returns the contents for key.json. */
export async function lockToken(token, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFromPassword(password, salt, ITERATIONS);
  const data = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(token),
  );
  return {
    version: 1,
    kdf: 'PBKDF2-SHA256',
    iterations: ITERATIONS,
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(data),
  };
}

/** Returns the token, or throws if the password is wrong. */
export async function unlockToken(locked, password) {
  const key = await keyFromPassword(password, fromBase64(locked.salt), locked.iterations);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(locked.iv) },
    key,
    fromBase64(locked.data),
  );
  return new TextDecoder().decode(plain);
}
