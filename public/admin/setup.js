// ============================================================
// setup.html: checks the GitHub token works, locks it with the
// admin password (lib/crypto.js), and publishes the locked copy
// as public/admin/key.json. The plain token never leaves this
// browser except to talk to GitHub.
// ============================================================
import { lockToken } from './lib/crypto.js';
import { GitHub } from './lib/github.js';

const form = document.getElementById('setupForm');
const message = document.getElementById('setupMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { token, password, confirm } = form.elements;
  if (password.value !== confirm.value) {
    message.textContent = "The two passwords don't match.";
    return;
  }
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    message.textContent = 'Checking the token…';
    const github = new GitHub(token.value.trim());
    await github.checkAccess();

    message.textContent = 'Locking it with the password…';
    const locked = await lockToken(token.value.trim(), password.value);

    await github.publish(
      [{ path: 'public/admin/key.json', text: `${JSON.stringify(locked, null, 2)}\n` }],
      'Set up the admin page password',
      (step) => {
        message.textContent = step;
      },
    );
    form.reset();
    message.style.color = '#2e6b3a';
    message.textContent =
      'Done! In about 2–3 minutes the admin page will open with the password. Keep the password somewhere safe.';
  } catch (error) {
    message.textContent = `Couldn't finish: ${error.message}`;
  } finally {
    button.disabled = false;
  }
});
