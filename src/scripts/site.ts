// ============================================================
// Small behaviors shared by every page: the mobile menu, the
// glass header on scroll, the footer year, and the scroll-in
// animations / lazy section photos. Loaded once by
// src/layouts/BaseLayout.astro.
// ============================================================

// ---- Mobile menu ----
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
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

// ---- Glass header ----
// The header starts transparent over the page's first photo,
// then gets .is-scrolled (blurred "glass" background, dark
// text) once the page scrolls a little. Checked once on load
// too, in case the page opens already scrolled.
const header = document.querySelector('.site-header');
const SCROLL_THRESHOLD = 40;

if (header) {
  const updateHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

// ---- Footer year ----
// The build already writes the year in; this keeps it right if
// the site hasn't been rebuilt since New Year.
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ---- Scroll-reveal + lazy section photos ----
// Elements with class="reveal" fade/slide in (see base.css),
// and .section-photo backdrops (data-bg) get their photo applied
// the first time they come near the screen -- CSS backgrounds
// aren't lazy-loaded by the browser on their own.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;

      if (el.dataset.bg) {
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
      }

      el.classList.add('is-visible');
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.1, rootMargin: '150px 0px' },
);

document.querySelectorAll('.reveal, [data-bg]').forEach((el) => revealObserver.observe(el));

// ---- "Aangan" in other languages ----
// The logo word fades between Aangan in English, Hindi, Tamil,
// Malayalam, Telugu and Marathi (list in src/config/site.ts).
// Skipped for visitors who've asked their device to reduce motion.
const logoWord = document.querySelector<HTMLElement>('.logo-word[data-words]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (logoWord && !reduceMotion) {
  const words: { lang: string; word: string }[] = JSON.parse(logoWord.dataset.words ?? '[]');
  const SHOW_FOR_MS = 2500;
  const FADE_MS = 300;
  let index = 0;

  window.setInterval(() => {
    index = (index + 1) % words.length;
    logoWord.classList.add('is-fading');
    window.setTimeout(() => {
      logoWord.textContent = words[index].word;
      logoWord.lang = words[index].lang;
      logoWord.classList.remove('is-fading');
    }, FADE_MS);
  }, SHOW_FOR_MS);
}
