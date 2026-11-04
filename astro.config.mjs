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
});
