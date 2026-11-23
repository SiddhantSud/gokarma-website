# CLAUDE.md — Aangan by Gokarma Living website

Context for any Claude session working in this repo. `README.md` is the
human-facing guide (written for the owners and non-developers); this file is
the working context for an AI assistant: what the project is, how it's built,
the rules that aren't obvious from the code, and the current state of things.

---

## 1. What this is and who it's for

- **The business**: _Aangan by Gokarma Living_, a backpacker hostel + cafe on
  Kudle hilltop, Gokarna, Karnataka, India. Dorms (4-bed mixed, non-AC) plus a
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
  its food, its community or nearby scenery. **One exception, approved by
  Siddhant (2026-11-12):** the Temple, Kudle Beach and Main Beach cards on
  Home use Creative Commons photos from Wikimedia Commons
  (`src/assets/images/places/`), credited on the page as their licences
  require. Replace them when the owners send their own. Never copy photos
  from Google Images or other sites without a licence that allows it.

Facts that appear on several pages live in **`src/config/site.ts`**:

| Fact                                             | Field                                         | Source / status                                                                                                                                      |
| ------------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.9★ on Google, 359 reviews (checked 2026-11-12) | `rating`, `reviewCount`                       | Google listing at time of build; update by hand when it changes                                                                                      |
| "Dorm beds from around ₹850/night"               | `dormPriceFrom`                               | **Possibly outdated.** StayFlexi showed ₹650 (6-bed) and ₹700 (4-bed) + tax on 2026-10-29. Waiting on Siddhant/owners to decide whether to change it |
| Address "Kudle Beach Road, Gokarna 581326"       | `address`                                     | Real listing                                                                                                                                         |
| Map location 14.5364615, 74.3154106              | `geo`, `mapUrl`                               | Google Maps listing                                                                                                                                  |
| WhatsApp / phone `+91 78928 03231`               | `phoneDisplay`, `phoneLink`, `whatsappNumber` | Real                                                                                                                                                 |

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
  Gallery.astro                Gallery grid + PhotoSwipe lightbox (teaser mode, currently unused on Home)
  SwipeRow.astro               Horizontal scroll-snap row + prev/next buttons (src/scripts/swipe.ts)
  VibeStrip.astro              Home: portrait photo strip (src/data/vibe.ts)
  Nearby.astro                 Home: "Everything's a walk away" (src/data/nearby.ts)
  Amenities.astro              Home: minimal icon list, Lucide icons via @lucide/astro (src/data/amenities.ts)
  Reviews.astro                Home: guest quotes in a SwipeRow (src/data/reviews.ts)
  GettingHere.astro            Home: how to reach us (src/data/getting-here.ts)
  BookingWidget.astro          The "pick your dates" form + its script

src/config/site.ts           Facts shown on many pages (§2) + whatsappLink()
src/config/booking.ts        StayFlexi URL, maxGuests
src/data/*.ts                  Content lists (typed): rooms, gallery, guide, vibe, nearby,
                               amenities, reviews, getting-here
src/lib/images.ts            photo('rooms/4-bed-dorm-1') / photoUrl() / backdropUrls() lookups
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
  Hero sections set `--hero-small` / `--hero-large` inline, built with `backdropUrls()`.

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
  `photoUrl(path, width)` gives one JPEG URL (used for Open Graph and
  JSON-LD). Photo backdrops (`PhotoSection`, the hero) use
  `backdropUrls(path)`: an 800px and a 1280px WebP at quality 50, and phones
  get the 800px one. They sit under a dark overlay, so the lower quality
  doesn't show. The hero photo is preloaded (`heroPhoto` prop on
  `BaseLayout`). This cut Home from about 4.1 MB to 1.2 MB on a phone and
  1.8 MB on a laptop (2026-11-23). `<Photo>` uses quality 70. All photos are in the repo; the
  only web links are the Wikimedia credit links their licences require.
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

- **Nav bar** (Siddhant, 2026-11-22): fully transparent at the top of the
  page, then solid deep maroon (`--color-band`) with turmeric links and logo
  after 40px of scroll (`.is-scrolled`, set in `src/scripts/site.ts`). Book
  Now is always a turmeric button with maroon text. The bar is slim (about
  56px). **Nothing in the nav is underlined**; hover and the current page
  turn cream. The phone dropdown is maroon too.
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

### Logo (Aangan)

- Siddhant designed the logo for **Aangan** (not Gokarma Living), delivered
  2026-11-14. The full kit (SVGs, README with usage rules, preview sheet)
  is kept in `brand-kit/`, outside the build. Follow `brand-kit/README.md`:
  no stretching, recolouring or effects, clear space of 1/4 of the width,
  seal at 96px or more.
- Published copies live in `public/brand/` and are used as: the courtyard
  mark in the header (cream `-reversed` over the hero, full colour once the
  header turns to glass), the reversed seal in the footer, and the
  full-colour seal above the Our Story heading. Favicons, apple-touch icon
  and `site.webmanifest` (icon-192/512) are in `public/`.
- The kit's fonts (Caprasimo, Figtree) and palette are not applied to the
  site yet. That's Siddhant's call.

### Theming

**All colors and fonts are CSS variables in `src/styles/theme.css`.** Never
hardcode a color anywhere else; add a variable instead. The only exceptions
are `theme-color` in `BaseLayout.astro` and `public/site.webmanifest`, which
can't read CSS variables; keep them equal to `--color-deep`. (The `/admin`
page has its own small stylesheet and is not part of the public site.)

**Colour changes are global (Siddhant, 2026-11-21).** The brand is deep
maroon (`--color-deep` #3c0008) and turmeric yellow (`--color-turmeric`
#f2b01e) on yellow-tinted cream (`--color-bg` #fdf5df). Components never
point at the palette by hex; they use role variables (`--color-button*`,
`--color-band*` for the footer, Home ticker, the "Ready to book?" boxes and
`PageBanner` (the maroon top banner on Rooms, Our Story, Guide, Contact and
Gallery), `--color-pop`
for small highlights), which point at the palette. The lighter red-oxide
`--color-maroon` #7a2a22 is for text-level accents on cream (links, eyebrows,
icons). Forest green was retired on 2026-11-21.

When Siddhant asks for a colour or style change, apply it to **every page**,
not only the one he's looking at: change the variable, then check Home,
Rooms, Book, Our Story, Guide, one article, Contact, Gallery and the footer
at phone width. Earlier changes landed on Home only and he noticed.

### Booking (StayFlexi)

- The owners use **StayFlexi** as their property management system and booking
  engine. Hotel ID **30713**. URL in `src/config/booking.ts`:
  `https://bookingengine.stayflexi.com/?hotel_id=30713`.
- `<BookingWidget class="booking-glass" />` renders the form at build time.
  Its script sets today/tomorrow as defaults **in the guest's browser**
  (the build date would be stale), keeps check-out after check-in, and on
  submit **redirects** to StayFlexi with `checkin`/`checkout` as `YYYY-MM-DD`.
  It's used on Home (Check Availability) and `landing.html` (twice).
- **No booking page of our own (Siddhant, 2026-11-23).** Every Book Now,
  Book This Room and Book Your Stay link (nav, Home, Rooms, Guide, articles)
  goes straight to `BOOKING.stayflexiBookingUrl`. `book.html` is only a
  noindex redirect to StayFlexi, kept so old links don't break.
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
  (`?room=<id>` preselection only applies in that fallback.)
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
| Add or edit a room                          | `src/data/rooms.ts`                                                                                       |
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
    CSS, components.css split, self-hosted fonts, CSP) is done (PR #8).
- **Home redesign** (2026-11-12, branch `home-redesign`): nav reads Stay /
  Our Story / Gokarna Guide / Gallery / Contact Us, and "Aangan" links home.
  Home order is hero, vibe + photo strip, walkable places, amenities, guest
  reviews, how to reach, rooms, then CTA (the "Plan Your Trip" guide teaser was removed 2026-11-15). The amenities and
  how-to-reach styling follow revibehostel.com, which Siddhant gave as the
  reference.
  - Follow-up (same day): the booking form moved from the hero to a "Check
    Availability" section after The Vibe (the hero has a button that jumps
    to it). "What our guests say" was renamed "Stories We Have Lived". The
    logo word cycles through Aangan in Hindi, Tamil, Malayalam, Telugu,
    Marathi and Kannada (`AANGAN_WORDS` in `src/config/site.ts`, needs a native-speaker
    check). The nav collapses below 960px. Walking times from the owners:
    Kudle Hilltop 5 min, Mahabaleshwar Temple 15, Kudle Beach 10–15,
    Main Beach 15.
  - **Animals:** only cats, dogs and birds may be mentioned (Siddhant's
    instruction).
  - Waiting on the owners: what to tell the auto driver and the auto fares
    (`LAST_LEG` in `src/data/getting-here.ts`), photos for the
    Temple, Kudle Beach, Main Beach and Shiva caves cards
    (`src/data/nearby.ts`, icon shown until then), and photos of the cats
    and dogs, garden/trees, a work/Wi-Fi corner, art/murals.
- **Refinements (2026-11-15, Siddhant):** nav is Our Story / Gokarna Guide /
  Contact Us + Book Now (Rooms and Gallery pages still exist, reached from
  Home and Book Now). **All rooms are non-AC.** The old 6-bed dorm is now a
  4-bed dorm, so there is one "4-Bed Mixed Dorm" card and its photos
  (`6-bed-dorm-*` files) sit under it on the Rooms page. The "from ₹850"
  line is removed from every page (`dormPriceFrom` is unused). The sunset
  spot is called **Jatayu Teerth** (article URL unchanged). Guide cards show no topic tags (2026-11-23; the `tag` field stays in the article files for the admin page but isn't displayed). Articles no
  longer show the tag, the line under the title or "Read and watch more";
  gallery photos auto-change. Photo credits for the Wikimedia photos stay,
  because their licences require them. Booking dates display as
  "15 Nov 2026" over the native date field. Siddhant will send his own
  photos for the articles to replace the Wikimedia ones.
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

## 12. Admin page (/admin)

- `public/admin/` is a small custom admin page (plain HTML/CSS/JS) at
  `/gokarma-website/admin/`, opened with a **password**. Siddhant chose this
  over Sveltia CMS on 2026-11-12: he wanted a simple password page that shows
  all existing content. It isn't linked anywhere, has `noindex`, and is
  disallowed in robots.txt. The owner guide is `docs/admin-console.md`.
- How it works without a server: a GitHub fine-grained token (Contents and
  Pull requests read/write, this repo only) is encrypted with the admin
  password (PBKDF2-SHA256 600k + AES-GCM) by `setup.html` and published as
  `public/admin/key.json`. The password unlocks it in the browser. **The
  password is the only lock**, so it must be a long passphrase.
- Publish: all changes become one commit on a new branch → PR → squash-merge
  via the API → the deploy runs. That satisfies the `master` PR rule.
- What's editable is defined in `public/admin/lib/content.js`. If you add an
  editable field to the site, add it there too.
- **Editable content lives outside code**:
  - Guide articles are Markdown in `src/content/guide/*.md`, with the schema
    in `src/content.config.ts`. They're rendered by `src/pages/[article].astro`,
    and the file name is the URL. Heading anchors are auto-generated slugs.
  - Lists are JSON in `src/data/*.json` (gallery, vibe, rooms, reviews,
    nearby, facts, travel-tips). The `.ts` files next to them only add types.
    `SITE` in `src/config/site.ts` spreads `facts.json`.
  - Photo paths look like `images/<folder>/<file>.jpg`, and `photo()` also
    accepts the short form. Uploads land in `src/assets/images/uploads/`.
  - `src/content/` and `src/data/*.json` are excluded from Prettier, because
    the admin page writes them in its own format and CI would otherwise fail.
- **Guest story submissions**: `SubmitStory.astro` on the Guide page sends
  stories by email (`submissionsEmail` in facts.json) or, while that's
  empty, by WhatsApp. Nothing auto-publishes.
