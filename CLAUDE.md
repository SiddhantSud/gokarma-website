# CLAUDE.md — Aangan by Gokarma Living website

Context for any Claude session working in this repo. `README.md` is the
human-facing guide (written for the owners and non-developers); this file is
the working context for an AI assistant: what the project is, how it's built,
the rules that aren't obvious from the code, and the current state of things.

---

## 1. What this is and who it's for

- **The business**: _Aangan by Gokarma Living_, a backpacker hostel + cafe on
  Kudle hilltop, Gokarna, Karnataka, India. Dorms (4-bed and 6-bed mixed) plus a
  private "Vintage Room", with an on-site cafe.
- **The owners**: **Kushal & Geetika**.
- **Who builds it**: **Siddhant** (GitHub `SiddhantSud`) builds and maintains the
  site _on the owners' behalf_. He is **not** an owner. Anything that is
  supposed to sound like the owners, such as first-person story copy, welcome
  text, FAQ answers or opinions, has to come from Kushal & Geetika, relayed
  through Siddhant. Don't ask Siddhant to answer as them, and never write it for
  them.
- **Repo**: https://github.com/SiddhantSud/gokarma-website (public)
- **Live site**: https://siddhantsud.github.io/gokarma-website/ (GitHub Pages,
  built and published by a GitHub Action, HTTPS enforced)

---

## 2. The most important rule: real material only

This is a real small business, not a demo. The bar is **authenticity**:

- **Never invent** prices, amenities, room details, reviews, ratings,
  testimonials, owner quotes, bios, history or photos.
- New facts must come from material already gathered: the owners' answers,
  their Google/Booking/Hostelworld/StayFlexi listings, real guest reviews, and
  the photos in `src/assets/images/` and `photo-library/`.
- If something is genuinely missing and a placeholder is unavoidable, **label
  it as a placeholder** in the code and tell Siddhant ("placeholder, swap once
  you have X"). Never present invented content as researched.
- Owner-voice questions get **parked and relayed** to Siddhant to ask the
  owners. `content-questionnaire.md` holds the question set for owners and
  guests, including the consent checklist before quoting a guest.
- No stock photos. Every image on the site is a real photo of the property,
  its food, its community or nearby scenery.

Facts that appear on several pages live in **`src/config/site.ts`**:

| Fact                                       | Field                                         | Source / status                                                                                                                                      |
| ------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.9★ on Google, 321 reviews                | `rating`, `reviewCount`                       | Google listing at time of build; update by hand when it changes                                                                                      |
| "Dorm beds from around ₹850/night"         | `dormPriceFrom`                               | **Possibly outdated.** StayFlexi showed ₹650 (6-bed) and ₹700 (4-bed) + tax on 2026-10-29. Waiting on Siddhant/owners to decide whether to change it |
| Address "Kudle Beach Road, Gokarna 581326" | `address`                                     | Real listing                                                                                                                                         |
| Map location 14.5364615, 74.3154106        | `geo`, `mapUrl`                               | Google Maps listing                                                                                                                                  |
| WhatsApp / phone `+91 78928 03231`         | `phoneDisplay`, `phoneLink`, `whatsappNumber` | Real                                                                                                                                                 |

---

## 3. Tech stack and the reasons for it

- **Astro 7** static site (`astro@7.4.1`, pinned exactly), moved from
  hand-written HTML on 2026-11-04 at Siddhant's request, for readability and
  common tooling. Output is still plain static HTML/CSS/JS on GitHub Pages.
- `astro.config.mjs` sets `site`, `base: '/gokarma-website'` and
  `build.format: 'file'`, so every page keeps its old URL (`rooms.html`,
  `guide-*.html`). **Keep `build.format: 'file'`**, because changing it
  changes every URL.
- Internal links are written as relative file names (`href="rooms.html"`),
  which works because every page sits at the site root. Asset URLs from Astro
  already include the base path.
- Dependencies are deliberately few: `astro`, `photoswipe` (gallery
  lightbox) and the two self-hosted font packages (`@fontsource/poppins`,
  `@fontsource-variable/fraunces`). Dev tools: Prettier, ESLint and
  `@astrojs/check` (TypeScript 6.0, since typescript-eslint and
  `@astrojs/check` don't support 7 yet). Don't add UI frameworks (React, Tailwind, ...) without Siddhant
  asking. Pin new packages to an exact version that's at least two weeks old.
- Client-side JavaScript is small, bundled `<script>` blocks: `src/scripts/site.ts`
  (menu, glass nav, reveal), the booking form script in `BookingWidget.astro`,
  and PhotoSwipe in `Gallery.astro`. Everything else is rendered at build time.
- Fonts are self-hosted (imported in `BaseLayout.astro`): Fraunces Variable
  for display, Poppins 400–700 for body. The only third party a page loads
  is the Google Maps embed on the contact page.
- **Content-Security-Policy**: `security.csp` in `astro.config.mjs` makes
  Astro write a CSP `<meta>` tag into every page, with hashes for its own
  inline scripts and styles. It allows only same-site scripts, styles, fonts
  and images, `style=""` attributes, and Google Maps frames. Anything new
  from another site (an embed, a widget, analytics) must be added there or
  the browser blocks it. Check the console for "Content Security Policy"
  errors. GitHub Pages can't send headers, so it's a meta tag (which means
  `frame-ancestors` isn't available).
- Hosting is a static site, so there's **no backend and nowhere to keep
  secrets**. Anything that needs an API key (for example StayFlexi's Flex API)
  is out of scope unless a backend gets added.

---

## 4. Running it locally

```bash
npm install        # once
npm run dev        # live-reloading preview at http://localhost:4321/gokarma-website/
npm run build      # full production build into dist/
npm run preview    # serve dist/ to check the production build
npm run format     # auto-format everything with Prettier
npm run verify     # what CI runs: format check, ESLint, astro check, build
```

Needs Node.js 22.22+ (Astro 7's minimum). There are no automated tests. Run
`npm run verify` before opening a PR. CI runs the same checks and blocks
publishing if any fail. Then look at the affected pages at phone width (~375px) and desktop. Most guests
arrive on a phone from Instagram or WhatsApp links, so mobile is the primary
layout.

---

## 5. Project layout

```
src/pages/*.astro            One file per page. File name = URL (rooms.astro → rooms.html)
  index, rooms, book, story, gallery, guide, contact, landing, guide-*.astro
src/layouts/BaseLayout.astro   <head> (title, description, canonical, Open Graph, fonts,
                               JSON-LD), header, footer, site.ts. variant="landing" for landing.html
src/layouts/ArticleLayout.astro  Guide article frame + Article JSON-LD + related reads

src/components/
  Header.astro, Footer.astro   Nav (active link from the `page` prop) and footer
  PhotoSection.astro           <section class="section-photo"> with a lazy photo backdrop + panel
  Photo.astro                  Responsive <picture> (WebP + JPEG, 480/900/1600w)
  RoomCard.astro, GuideCard.astro, RelatedReads.astro, Marquee.astro
  Gallery.astro                Gallery grid + PhotoSwipe lightbox (teaser mode for Home)
  BookingWidget.astro          The "pick your dates" form + its script

src/config/site.ts           Facts shown on many pages (§2) + whatsappLink()
src/config/booking.ts        StayFlexi URL, maxGuests
src/data/rooms.ts, gallery.ts, guide.ts   Content lists (typed)
src/lib/images.ts            photo('rooms/4-bed-dorm-1') / photoUrl() lookups
src/lib/booking.ts           Date helpers + StayFlexi/WhatsApp URL builders
src/scripts/site.ts          Mobile menu, glass nav, footer year, reveal + lazy backgrounds
src/styles/theme.css, base.css   Design tokens; reset, layout, utilities (grid-min-*, text-left, mt-sm)
src/styles/components.css      Imports src/styles/components/*.css in cascade order (one file per part)

src/assets/images/<category>/  Original photos used on the site (rooms, property, food,
                               community, scenery, kushal-geetika.png)
photo-library/                 Real photos not used on the site yet (kept out of the build)
public/robots.txt, sitemap.xml Copied as-is
.github/workflows/deploy.yml   Build on every PR; build + publish on every merge to master
content-questionnaire.md       Questions to gather real owner and guest content
```

### Page conventions

- Every page uses `BaseLayout` (or `ArticleLayout`) and passes `title`,
  `description`, `path` (its own file name, for the canonical URL), `page`
  (which nav link to highlight) and usually `ogImage` (a photo path).
- Content sections are `<PhotoSection bg="scenery/cottage-row" panel="alt">`.
  Hero sections keep their inline `background-image`, built with `photoUrl()`.

---

## 6. How the main systems work

### Content and data

Rooms, gallery photos and guide cards are typed arrays in `src/data/*.ts`,
rendered at build time. To change content, **edit the data file, not the
page**. Guide article text is written directly in each `guide-*.astro` page.

### Photos

- Photos are referenced by short path without extension:
  `photo('rooms/4-bed-dorm-1')` → `src/assets/images/rooms/4-bed-dorm-1.jpg`.
  A wrong path **fails the build** with a clear error.
- `<Photo src=... alt=... sizes=...>` outputs WebP + JPEG at 480/900/1600px
  (widths above the original are skipped; the plain `src` is capped at 1600).
  `photoUrl(path, width)` gives one JPEG URL for CSS backgrounds and
  Open Graph.
- Built copies are re-encoded by sharp, which **drops all EXIF, including
  GPS**. Originals in `src/assets/` are never published. (The old static site
  served originals. Their GPS was stripped on 2026-11-02 in PR #4, and the old
  GPS-tagged versions remain in git history. Siddhant decided that's fine, so
  don't rewrite history for it.)
- Any photo under `src/assets/images/` that no page renders still gets copied
  into the build unprocessed (full size). This happens because
  `src/lib/images.ts` globs the whole folder. That's why unused photos live in
  `photo-library/`, outside `src/`. Move a photo into `src/assets/images/`
  only when you use it.
- `img { height: auto }` in base.css matters: Astro adds width/height
  attributes (which prevents layout shift).

### Visual system (glass nav, photo sections, marquee)

- **Glass nav**: the header is transparent over the hero and gets
  `.is-scrolled` after 40px of scroll (`src/scripts/site.ts`). This works on
  landing.html too, since it uses the same layout.
- **Photo-backed sections**: every content section sits on a real photo with
  a duotone overlay and a large-radius panel lifted over it. Section
  backgrounds are **never plain colors** (explicit owner direction). **The
  footer stays solid** (also explicit). The backdrop (`data-bg`) is applied
  lazily by the IntersectionObserver in `site.ts`. Don't reuse one photo on
  many sections of the same page.
- **Scroll reveal**: add `class="reveal"`. Motion respects
  `prefers-reduced-motion`.
- **Marquee**: `<Marquee items={[...]}>`. It renders the phrases twice for a
  seamless loop.
- The visual direction came from a reference site the owner liked
  (aikyaacollective.com). The plan is in
  `C:\Users\siddh\.claude\plans\purrfect-whistling-hejlsberg.md` on
  Siddhant's machine.

### Theming

**All colors and fonts are CSS variables in `src/styles/theme.css`.** Never
hardcode a hex value elsewhere; add a token instead. The current palette is a
**placeholder** taken from the property photos. The owners haven't chosen a
real brand palette yet.

### Booking (StayFlexi)

- The owners use **StayFlexi** as their property management system and booking
  engine. Hotel ID **30713**. URL in `src/config/booking.ts`:
  `https://bookingengine.stayflexi.com/?hotel_id=30713`.
- `<BookingWidget class="booking-glass" />` renders the form at build time.
  Its script sets today/tomorrow as defaults **in the guest's browser**
  (the build date would be stale), keeps check-out after check-in, and on
  submit **redirects** to StayFlexi with `checkin`/`checkout` as `YYYY-MM-DD`.
  It's used on the Home hero, `book.html` and `landing.html` (twice).
- Things verified by reading StayFlexi's booking-engine JS and testing the real
  property page. **Don't change them without re-verifying:**
  - **Only dates are passed.** Passing `num_guests` (or `widget`) makes
    StayFlexi auto-add the cheapest fitting room to the cart.
  - **`source` is left out**, so bookings count as `STAYFLEXI_OD`, the default
    direct source.
  - **A redirect is used, not an iframe**, because of payment flows.
  - The official **Flex API** needs partner keys and a backend, so it isn't
    used.
- **Fallback**: if the StayFlexi URL is empty or invalid, the form also shows
  Guests and Room dropdowns and opens WhatsApp with the details prefilled.
  `book.html?room=<id>` preselects a room in that fallback.
- Dates are built from local time by hand (`toDateValue` in
  `src/lib/booking.ts`), **not** `toISOString()`, which would shift to UTC.
- The StayFlexi handoff was re-tested after the Astro move on 2026-11-04 and
  the dates carried over.
- Owner-side problems seen on the StayFlexi listing (2026-10-29), for the
  owners to fix in StayFlexi: three 4-bed dorm listings that look like
  duplicates, the location shown as "Belgaum Division" instead of Gokarna,
  and StayFlexi's default logo.

---

## 7. Common edits (quick reference)

| Task                                        | Where                                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Rating, review count, price, phone, address | `src/config/site.ts`                                                                                      |
| Re-theme colors or fonts                    | `src/styles/theme.css`                                                                                    |
| Add or edit a room                          | `src/data/rooms.ts` (the `id` is used in `book.html?room=`)                                               |
| Add a gallery photo                         | File into `src/assets/images/<category>/`, then an entry in `src/data/gallery.ts` (first 4 = Home teaser) |
| Add a guide article                         | Copy a `src/pages/guide-*.astro`, add to `src/data/guide.ts` and `public/sitemap.xml`                     |
| Change nav or footer                        | `src/components/Header.astro` / `Footer.astro` (landing variant is in `BaseLayout.astro`)                 |
| Change the booking destination              | `src/config/booking.ts`                                                                                   |
| Add a page                                  | New `src/pages/<name>.astro` using `BaseLayout`, then add it to `public/sitemap.xml`                      |
| Move to a custom domain                     | `site`/`base` in `astro.config.mjs`, plus `public/robots.txt` and `public/sitemap.xml`                    |

---

## 8. SEO and the landing page

- Every page gets a unique title, description, canonical and Open Graph tags
  from `BaseLayout`. The Home page has `LodgingBusiness` JSON-LD (address,
  phone, rating, `geo`, `hasMap`) and guide articles have `Article` JSON-LD.
- `landing.html` is for **paid/social ad traffic**: `variant="landing"` gives
  it `noindex, follow`, no canonical, a centered logo instead of the nav and a
  short footer. It's left out of `sitemap.xml` and disallowed in `robots.txt`.
- `public/sitemap.xml` is hand-maintained (same URLs as before the Astro move).

---

## 9. Git and deployment workflow

- **Merging into `master` publishes the site**: `.github/workflows/deploy.yml`
  builds with `withastro/action` and publishes with `actions/deploy-pages`
  (Pages source = "GitHub Actions"). It's live about 2–3 minutes after the
  merge. A failed build publishes nothing. Treat a merge as a production
  release and get Siddhant's OK first.
- Every PR runs the `checks` job (Prettier, ESLint, `astro check`) and the
  build, with no publish. Deploy only runs if both pass.
- **`master` is protected**: changes go in only through a PR (no approvals
  required), the rule applies to admins too, and force-pushes and branch
  deletion are blocked.
- Work on a feature branch from the latest `origin/master`, open a PR, and
  squash-merge it (`gh pr merge <n> --squash --delete-branch`).
- Merged PRs: #1 authentic photos, #2 glass nav/photo backdrops/marquee,
  #3 StayFlexi booking form + this file, #4 photo GPS removal, #5 map
  coordinates in JSON-LD, #7 move to Astro.
- Line endings are LF everywhere (`.gitattributes`), so Prettier's check
  passes on Windows too.
- Dependabot alerts and security updates are on (they now cover npm). GitHub
  secret scanning and push protection are on.
- Ask before creating repos, pushing, merging or changing GitHub settings.
- The `gh` CLI is installed and authenticated on Siddhant's machine.
- Commit messages: imperative, descriptive subject lines (see `git log`).

---

## 10. Status and open items (as of 2026-11-12)

- **Live**: the multi-page site with real photos, the glass-nav/photo-backdrop
  redesign, SEO, and the StayFlexi booking form.
- **Code review** (2026-11-02, https://claude.ai/artifact/ACH3csd9DLBBawmaVD91Jp):
  - Phase 1 (security fixes) is done.
  - Phase 2 (move to Astro, PhotoSwipe, one site config) is done (PR #7).
  - Phase 3 (Prettier/ESLint/astro check in CI, inline styles moved into
    CSS, components.css split, self-hosted fonts, CSP) is in the PR from
    branch `phase-3-polish`.
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

- Each file opens with a banner comment (`// ====...`) explaining _what it
  does and why_, with short `// ---- Subsection ----` headers inside.
  Comments are written for a non-expert maintainer.
- Small components with typed `Props`, plain functions, no classes. Data in
  `src/data/`, facts in `src/config/`, never hardcoded in a page.
- New design values go into `theme.css` as variables. No `style=""`
  attributes for static styling; add a class (only computed values such as
  the hero photo URL stay inline).
- Formatting is Prettier's (single quotes, 100 columns). Don't hand-format.
- Keep things accessible: real `alt` text that describes the actual photo,
  `aria-*` on toggles, labels wrapping inputs, and reduced-motion respected.
- Keep `README.md` in sync when a workflow changes. It's the owners' manual.
