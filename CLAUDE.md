# CLAUDE.md — Aangan by Gokarma Living website

Context for any Claude session working in this repo. `README.md` is the
human-facing guide (written for the owners and non-developers); this file is
the working context for an AI assistant: what the project is, how it's built,
the rules that aren't obvious from the code, and the current state of things.

---

## 1. What this is and who it's for

- **The business**: *Aangan by Gokarma Living*, a backpacker hostel + cafe on
  Kudle hilltop, Gokarna, Karnataka, India. Dorms (4-bed and 6-bed mixed) plus a
  private "Vintage Room", with an on-site cafe.
- **The owners**: **Kushal & Geetika**.
- **Who builds it**: **Siddhant** (GitHub `SiddhantSud`) builds and maintains the
  site *on the owners' behalf*. He is **not** an owner. Anything that is
  supposed to sound like the owners, such as first-person story copy, welcome
  text, FAQ answers or opinions, has to come from Kushal & Geetika, relayed
  through Siddhant. Don't ask Siddhant to answer as them, and never write it for
  them.
- **Repo**: https://github.com/SiddhantSud/gokarma-website (public)
- **Live site**: https://siddhantsud.github.io/gokarma-website/ (GitHub Pages,
  published from the root of `master`, HTTPS enforced)

---

## 2. The most important rule: real material only

This is a real small business, not a demo. The bar is **authenticity**:

- **Never invent** prices, amenities, room details, reviews, ratings,
  testimonials, owner quotes, bios, history or photos.
- New facts must come from material already gathered: the owners' answers,
  their Google/Booking/Hostelworld/StayFlexi listings, real guest reviews, and
  the photos in `images/`.
- If something is genuinely missing and a placeholder is unavoidable, **label
  it as a placeholder** in the code and tell Siddhant ("placeholder, swap once
  you have X"). Never present invented content as researched.
- Owner-voice questions get **parked and relayed** to Siddhant to ask the
  owners. `content-questionnaire.md` holds the question set for owners and
  guests, including the consent checklist before quoting a guest.
- No stock photos. Every image on the site is a real photo of the property,
  its food, its community or nearby scenery.

Facts currently on the site and where they come from:

| Fact | Where it appears | Source / status |
|---|---|---|
| 4.9★ on Google, 321 reviews | `index.html` (marquee, JSON-LD, reviews eyebrow), `landing.html`, `book.html` | Google listing at time of build; update by hand when it changes |
| "Dorm beds from around ₹850/night" | `index.html`, `rooms.html`, `book.html`, `landing.html`, budget guide article | **Possibly outdated.** StayFlexi showed ₹650 (6-bed) and ₹700 (4-bed) + tax on 2026-10-29. Waiting on Siddhant/owners to decide whether to change it |
| Address "Kudle Beach Road, Gokarna 581326" | `index.html` JSON-LD, contact page | Real listing |
| WhatsApp / phone `+91 78928 03231` | many places (see §7) | Real |

---

## 3. Tech stack and the reasons for it

- **Plain HTML, CSS and vanilla JavaScript. No framework, no npm, no bundler,
  no build step.** This was a deliberate choice so the owners or any helper can
  edit files directly and GitHub Pages can serve the repo as-is. Don't
  introduce React, Tailwind, a static-site generator, npm dependencies or a
  build pipeline without Siddhant explicitly asking for it.
- Scripts are classic `<script src>` tags (not ES modules) that share globals:
  `ROOMS`, `GALLERY_PHOTOS`, `GUIDE_POSTS`, `BOOKING_CONFIG`,
  `responsiveImg()`, `revealObserver` and others. **Load order matters** (§5).
- External resources: Google Fonts only (Fraunces for display, Poppins for
  body). Nothing else is loaded from a CDN.
- Hosting is a static site, so there's **no backend and nowhere to keep
  secrets**. Anything that needs an API key (for example StayFlexi's Flex API)
  is out of scope unless a backend gets added.

---

## 4. Running it locally

The header and footer are fetched at runtime (`js/partials.js` uses `fetch()`),
so opening a page with `file://` breaks them. Serve the folder instead:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Nothing else is needed. To change images you
also need Pillow (`pip install Pillow`) for `scripts/resize-images.py`.

There are no automated tests or linters. To check a change, open the affected
pages in a browser, at phone width (~375px) as well as desktop, and look at
the console. Most guests arrive on a phone from Instagram or WhatsApp links,
so mobile is the primary layout.

---

## 5. Project layout

```
index.html              Home: hero + booking form, marquee, room/gallery/guide teasers, reviews
rooms.html              Full room grid (rendered from rooms-data.js)
book.html               Booking page. Every "Book Now" / "Book This Room" lands here
story.html              Our Story (waiting on the owners' real first-person copy)
gallery.html            Photo grid + lightbox
guide.html              Gokarna Guide hub (cards from guide-data.js)
guide-*.html            Guide articles, written as static HTML for SEO
contact.html            Contact / WhatsApp / map
landing.html            Standalone ad landing page (see §8). Has its OWN header/footer
partials/header.html    Shared nav, injected into every page except landing.html
partials/footer.html    Shared footer, same

css/theme.css           ALL design tokens (colors, fonts, type scale, radii, glass, overlays, motion)
css/base.css            Reset, layout, typography, .reveal animation
css/components.css      Nav, buttons, cards, hero, marquee, section-photo panels, booking form, lightbox

js/utils.js             responsiveImg()/buildSrcset() + the shared revealObserver. LOAD FIRST
js/data/*.js            Content data: rooms, gallery, guide posts, booking config
js/rooms.js             Renders #roomsGrid / #roomsTeaser
js/gallery.js           Renders #galleryGrid / #galleryTeaser + lightbox
js/guide.js             Renders #guideGrid / #guideTeaser / #relatedReads
js/booking.js           Renders every [data-booking-widget] form
js/partials.js          Fetches header/footer, then fires a `partials:loaded` event
js/main.js              On partials:loaded: mobile menu, active nav link, footer year, glass nav

images/<category>/      rooms, property, food, community, scenery (+ kushal-geetika.png)
scripts/resize-images.py  Generates -480w/-900w/-1600w variants
content-questionnaire.md  Questions to gather real owner and guest content
robots.txt, sitemap.xml   SEO
```

### Script load order (copy it from an existing page)

```html
<script src="js/utils.js"></script>              <!-- 1. helpers + revealObserver -->
<script src="js/data/rooms-data.js"></script>    <!-- 2. whichever data files the page needs -->
<script src="js/data/booking-config.js"></script>
<script src="js/rooms.js"></script>              <!-- 3. renderers that use that data -->
<script src="js/booking.js"></script>
<script src="js/partials.js"></script>           <!-- 4. header/footer injection -->
<script src="js/main.js"></script>               <!-- 5. behavior that waits on partials:loaded -->
```

`booking.js` needs both `rooms-data.js` (room dropdown in the WhatsApp
fallback) and `booking-config.js`. Every renderer needs `utils.js` loaded
before it.

### Page conventions

- `<body data-page="home|rooms|story|guide|gallery|contact">` matches the nav
  link with the same `data-page` value so it gets highlighted.
- Header/footer placeholders: `<div id="site-header"></div>` and
  `<div id="site-footer"></div>`.
- Every page has its own `<title>`, meta description, canonical, Open Graph
  tags and absolute URLs on the GitHub Pages domain.

---

## 6. How the main systems work

### Data-driven content
Rooms, gallery photos and guide-card metadata live in `js/data/*.js` as plain
arrays. Renderers look for container IDs and fill whichever ones exist on the
page. To add or change content, **edit the data file, not the HTML**. The
exception is guide article bodies, which are written directly into their
`guide-*.html` files so search engines see real text.

### Responsive images
- Each photo is stored as a base path (no extension or width), for example
  `images/rooms/4-bed-dorm-1`, plus the generated variants
  `4-bed-dorm-1-480w.jpg`, `-900w.jpg` and `-1600w.jpg`.
- `scripts/resize-images.py` creates the variants for `images/rooms`,
  `property`, `food`, `community` and `scenery`. It skips any width at or above
  the original's width and skips existing variants, so it's safe to re-run.
- Each data entry lists its own `widths`. **It must match the files that
  actually exist.** Smaller source photos only get `[480, 900]`. Check
  `images/` before writing an entry.
- In data files, use `responsiveImg(photo, { sizes, className, loading })`
  from `utils.js`. In static HTML, write the `srcset` by hand in the same
  pattern.

### Visual system (glass nav, photo sections, marquee)
- **Glass nav**: the header is transparent over the hero and gets
  `.is-scrolled` (blurred translucent background, dark text) after 40px of
  scroll. That's handled by `setupGlassNav()` in `main.js`, and by an inline
  script in `landing.html`.
- **Photo-backed sections**: `<section class="section-photo" data-bg="...">`.
  Every content section sits on a real photo with a duotone overlay
  (`--overlay-from`/`--overlay-to`), with a large-radius panel
  (`--radius-panel`) lifted over it. Section backgrounds are **never plain
  colors**, which was an explicit owner direction. **The footer stays solid**,
  which was also explicit.
- `data-bg` is lazy-loaded by `revealObserver`, which sets the background image
  when the section nears the viewport. Prefer `-1600w` for large sections and
  don't reuse one photo on many sections of the same page.
- **Scroll reveal**: add `class="reveal"`. Renderers call
  `revealObserver.observe()` on elements they create. Motion respects
  `prefers-reduced-motion`.
- **Marquee**: the looping trust ticker under the Home hero. The `.marquee-group`
  is duplicated on purpose so the loop is seamless, so edit both copies.
- The visual direction came from a reference site the owner liked
  (aikyaacollective.com): glass pill nav, marquee, lifted rounded panels and a
  circular-arrow affordance. The full plan is in
  `C:\Users\siddh\.claude\plans\purrfect-whistling-hejlsberg.md` on
  Siddhant's machine.

### Theming
**All colors and fonts are CSS variables in `css/theme.css`.** Never hardcode a
hex value in `base.css` or `components.css`. Add a token instead. The current
palette (terracotta, forest green, sand, plus a `--color-pop` amber accent used
sparingly) is a **placeholder** taken from the property photos. The owners
haven't chosen a real brand palette yet.

### Booking (StayFlexi)
- The owners use **StayFlexi** as their property management system and booking
  engine. Hotel ID **30713**.
- `js/data/booking-config.js` is the one file to change:
  - `stayflexiBookingUrl: 'https://bookingengine.stayflexi.com/?hotel_id=30713'` (live)
  - `whatsappNumber: '917892803231'`
  - `maxGuests: 8`
- Add `<div data-booking-widget></div>` anywhere to get a check-in/check-out
  form. It's used in the Home hero, on `book.html` and on `landing.html`.
- When submitted, the form **redirects** to the StayFlexi booking engine with
  `checkin`/`checkout` as `YYYY-MM-DD` query params. The guest picks a room and
  pays there, so this site never touches payments or guest data.
- Things verified by reading StayFlexi's booking-engine JS and testing the real
  property page. **Don't change them without re-verifying:**
  - **Only dates are passed.** Passing `num_guests` (or `widget`) makes
    StayFlexi auto-add the cheapest fitting room to the cart, which picks a
    room for the guest.
  - **`source` is left out**, so bookings count as `STAYFLEXI_OD`, the default
    direct source.
  - **A redirect is used, not an iframe**, because of payment flows, even
    though StayFlexi doesn't send X-Frame-Options.
  - The official **Flex API** needs partner keys and a backend, so it isn't
    used.
- **Fallback**: if `stayflexiBookingUrl` is empty or invalid, the form shows
  Guests and Room dropdowns and opens WhatsApp with the details prefilled.
  `book.html?room=<id>` preselects a room in that fallback.
- Dates are built from local time by hand (`toDateValue`), **not**
  `toISOString()`, which would shift to UTC and can give the wrong day in IST.
- Owner-side problems seen on the StayFlexi listing (2026-10-29), for the
  owners to fix in StayFlexi rather than in this repo: three 4-bed dorm
  listings that look like duplicates, the location shown as "Belgaum Division"
  instead of Gokarna, and StayFlexi's default logo instead of theirs.

---

## 7. Common edits (quick reference)

| Task | Where |
|---|---|
| Re-theme colors or fonts | `css/theme.css` only |
| Add or edit a room | `js/data/rooms-data.js` (the `id` is used in `book.html?room=`) |
| Add a gallery photo | Put it in `images/<category>/`, run `python scripts/resize-images.py`, add to `js/data/gallery-data.js` (first 4 entries = Home teaser, so lead with the strongest) |
| Add a guide article | Copy a `guide-*.html`, write real content, add to `js/data/guide-data.js`, add to `sitemap.xml` |
| Change nav or footer | `partials/header.html` / `partials/footer.html`, **and** the separate header/footer inside `landing.html` |
| Change the booking destination | `js/data/booking-config.js` |
| Change the WhatsApp number | Search for `917892803231` across the repo (config, footer, page buttons, `landing.html`) |
| Update rating or review count | Search for `4.9` / `321` (marquee ×2, JSON-LD, reviews section, `book.html`, `landing.html`) |
| Change the "from ₹850" claim | Search for `850` (several pages + budget guide) |
| Move to a custom domain | Find and replace `https://siddhantsud.github.io/gokarma-website/` everywhere (canonicals, OG, JSON-LD, `sitemap.xml`, `robots.txt`) |

---

## 8. SEO and the landing page

- Every indexable page has a unique title, description, canonical and OG tags.
  The Home page has `LodgingBusiness` JSON-LD and guide articles have `Article`
  JSON-LD.
- `landing.html` is for **paid/social ad traffic**. It's `noindex, follow`,
  left out of `sitemap.xml`, disallowed in `robots.txt`, and not linked from
  the nav. It has its **own static header/footer** (no `partials.js` or
  `main.js`), so changes to the shared nav, footer or glass-nav behavior must
  be made there separately.
- When adding a page, add it to `sitemap.xml` (unless it's ad-only) and give it
  a full `<head>` like the existing pages.

---

## 9. Git and deployment workflow

- `master` is what's live. **Pushing or merging to `master` deploys
  immediately** through GitHub Pages ("legacy" build from the branch root), so
  treat a merge to `master` as a production release and get Siddhant's OK
  first.
- Work on a feature branch and open a PR into `master`. Past PRs: #1 (authentic
  photos) and #2 (glass nav, photo backdrops, marquee). Both are merged.
- Ask before creating repos, pushing, merging or changing GitHub settings.
- The `gh` CLI is installed and authenticated on Siddhant's machine.
- Commit messages: imperative, descriptive subject lines (see `git log`).

---

## 10. Status and open items (as of 2026-11-02)

- **Live**: the multi-page site with real photos, the glass-nav/photo-backdrop
  redesign and SEO.
- **In progress**: branch `stayflexi-booking` holds the StayFlexi booking form
  (`book.html`, `js/booking.js`, `js/data/booking-config.js`, plus edits to
  Home, Rooms, the landing page, the header, the CSS and the sitemap). It
  hasn't been committed or pushed yet.
- **Waiting on the owners** (through Siddhant):
  - First-person voice copy for Our Story and other owner-voice sections (see
    `content-questionnaire.md`). The voice rewrite is paused until real
    answers arrive.
  - Guest testimonials, with consent to quote.
  - A real brand color palette.
  - Whether to update the "from around ₹850/night" claim to match live
    StayFlexi rates.
  - Fixing the StayFlexi listing problems in §6.

---

## 11. Style notes for code in this repo

- Match the existing style: section-banner comments
  (`// ====...` / `/* ====... */`) at the top of each file explaining *what it
  does and why*, and short `// ---- Subsection ----` headers inside. Comments
  are written for a non-expert maintainer.
- Small named functions, template-literal HTML, no classes, no dependencies.
- New design values go into `theme.css` as variables.
- Keep things accessible: real `alt` text that describes the actual photo,
  `aria-*` on toggles, labels wrapping inputs, and reduced-motion respected.
- Keep `README.md` in sync when a workflow changes. It's the owners' manual.
