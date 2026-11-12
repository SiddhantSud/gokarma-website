// ============================================================
// Astro settings. The site is published to GitHub Pages at
// https://siddhantsud.github.io/gokarma-website/
//
// build.format 'file' keeps every page at the same URL it had
// before the move to Astro (rooms.html, guide-*.html, ...), so
// existing links and Google's index keep working.
// ============================================================
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://siddhantsud.github.io',
  base: '/gokarma-website',
  build: {
    format: 'file',
  },

  // ---- Content-Security-Policy ----
  // Tells browsers to only run scripts and load files from this
  // site (plus the Google Maps embed on the contact page), so an
  // injected script can't run. Astro writes it into every page as
  // a <meta> tag and adds fingerprints (hashes) for its own
  // inline scripts and styles. GitHub Pages can't send security
  // headers, which is why it's a <meta> tag.
  //
  // If you add something from another site (an embed, a widget,
  // an analytics script), it has to be allowed here or the
  // browser will block it -- check the browser console.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        'frame-src https://maps.google.com https://www.google.com',
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        resources: ["'self'"],
      },
      styleDirective: {
        // Inline style="" attributes are allowed: the hero photos
        // are set that way, and the gallery viewer uses them.
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
});
