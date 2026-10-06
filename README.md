# Aangan by Gokarma Living — Website

A multi-page website for the hostel: a full site (Home, Rooms, Our Story, a Gokarna
Guide with several articles, Gallery, Contact) plus a standalone single-page version
for use as a social media ad landing page. Built with plain **HTML, CSS, and
JavaScript only** — no frameworks, no build tools/npm required to run it.

## Previewing it locally

Because the header and footer are shared across every page via a small JavaScript
include (see "How it's structured" below), **you need a local server to preview the
site** — double-clicking `index.html` won't load the header/footer, since browsers
block that kind of file loading for security reasons when there's no server involved.

One command, from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. (This restriction only affects
local previewing — once deployed to GitHub Pages, Netlify, etc., everything is served
over a real connection and works normally.)

## How it's structured

```
index.html, rooms.html, story.html, gallery.html,        the actual pages
contact.html, guide.html, guide-*.html

landing.html                                              standalone page for social
                                                            media ad links (not linked
                                                            from the main site nav)

partials/header.html, partials/footer.html                nav & footer — edited in
                                                            ONE place, injected into
                                                            every page by js/partials.js

css/theme.css                                              ALL colors & fonts —
                                                            edit this to re-theme
                                                            the whole site
css/base.css                                               layout/typography basics
css/components.css                                         buttons, cards, nav, etc.

js/data/rooms-data.js                                      room content
js/data/gallery-data.js                                    gallery photos
js/data/guide-data.js                                      guide article metadata
js/rooms.js, gallery.js, guide.js                          turn the data above into
                                                            the cards/grids you see
js/partials.js                                             injects header/footer
js/main.js                                                 mobile menu, footer year,
                                                            scroll animations

images/rooms/, images/property/                            source photos, plus
                                                            auto-generated -480w/
                                                            -900w/-1600w versions for
                                                            fast loading on phones

scripts/resize-images.py                                   regenerates those resized
                                                            versions (needs Pillow:
                                                            pip install Pillow)
```

## Common edits

### Change the color palette
Open `css/theme.css`. Every color and font used anywhere on the site is a variable
at the top of that file, with comments. Change a value there and it updates
everywhere at once — no other file needs to change.

### Add or edit a room
Open `js/data/rooms-data.js` and add/edit an object in the `ROOMS` array. It will
automatically appear on `rooms.html` and in the Home page teaser.

### Add a gallery photo
1. Put the photo in `images/property/` or `images/rooms/`.
2. Run `python scripts/resize-images.py` (regenerates the small/medium/large
   versions — safe to re-run any time, it skips photos it's already processed).
3. Add an entry to `js/data/gallery-data.js`.

### Add a Gokarna Guide article
1. Copy one of the existing `guide-*.html` files as a starting point and write the
   new article's content directly in the HTML (kept as real text, not
   auto-generated, so search engines can read it immediately).
2. Add an entry to `js/data/guide-data.js` so it shows up on `guide.html` and in the
   "Related Reads" links on other articles.

### Update the WhatsApp number
Search the project for `917892803231` (the WhatsApp booking number without the `+`
or spaces) and replace every occurrence, including in `partials/header.html`,
`partials/footer.html`, and each page's own booking buttons.

## SEO notes

- Every page has its own `<title>`, meta description, and canonical link.
- `robots.txt`, `sitemap.xml`, and every page's canonical/Open Graph/JSON-LD
  tags currently point at the GitHub Pages URL
  (`https://siddhantsud.github.io/gokarma-website/`). If a custom domain is
  set up later, find-and-replace that URL everywhere (canonical links, Open
  Graph tags, the JSON-LD blocks, `sitemap.xml`, and `robots.txt`).
- `landing.html` is deliberately excluded from the sitemap and marked
  `noindex` — it's meant for ad traffic, not search rankings, so it doesn't
  compete with the main pages.
- The Home page includes `LodgingBusiness` structured data (address, phone,
  rating) and each guide article includes `Article` structured data — this
  helps Google understand the content, and can unlock richer search result
  listings.

## Publishing it online (free options)

- **GitHub Pages**: create a GitHub repo, upload these files, then enable Pages in
  the repo settings.
- **Netlify / Vercel**: drag and drop this folder onto netlify.com/drop for an
  instant live link.

Either option serves the site over a real connection, so the header/footer
include works automatically — no server setup needed on your end beyond that.
