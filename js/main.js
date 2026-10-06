// ============================================================
// Shared behavior used on every page: mobile menu toggle,
// active nav-link highlighting, auto-updating footer year,
// and gentle scroll-reveal animations.
//
// Runs after partials.js has injected the header/footer, since
// the mobile menu button and the footer year both live inside
// those injected partials.
// ============================================================

document.addEventListener('partials:loaded', () => {
  setupMobileMenu();
  highlightActiveNavLink();
  setFooterYear();
});

function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Adds a highlight class to whichever nav link matches this
// page's <body data-page="..."> attribute.
function highlightActiveNavLink() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  const link = document.querySelector(`.main-nav a[data-page="${currentPage}"]`);
  if (link) link.classList.add('is-active');
}

function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ---- Scroll-reveal ----
// Elements with class="reveal" fade/slide into place the first
// time they enter the viewport. revealObserver is defined in
// utils.js (loaded first) so data-driven renderers can reuse it
// for elements they create after this initial pass runs.
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
