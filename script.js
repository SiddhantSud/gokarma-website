// ============================================
// 1. Mobile menu toggle
// Opens/closes the nav when the hamburger (☰) is tapped.
// ============================================
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// Close the mobile menu automatically after a link is clicked
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
  });
});

// ============================================
// 2. Contact form
// This is a simple front-end-only form. It doesn't send
// anything to a server yet — it just shows a confirmation
// message. See README.md for how to connect it to email
// or a booking service.
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading

  const name = document.getElementById('name').value;

  formStatus.textContent =
    `Thanks, ${name}! Your message has been noted. We'll reply to your email soon.`;

  contactForm.reset();
});

// ============================================
// 3. Auto-update the footer year
// So you never have to manually change "© 2024" again.
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();
