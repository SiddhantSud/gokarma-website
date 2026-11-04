# Aangan by Gokarma Living — Website

The website for the hostel: Home, Rooms, Booking, Our Story, a Gokarna Guide
with several articles, Gallery and Contact, plus a standalone page for social
media ads (`landing.html`).

Live at **https://siddhantsud.github.io/gokarma-website/**

It's built with [Astro](https://astro.build), a widely used tool for building
websites. Pages are written as HTML with a few small reusable pieces. When the
site is published, Astro turns them into plain HTML, CSS and JavaScript, and
makes small, fast versions of every photo.

## Previewing it on your computer

One-time setup: install [Node.js](https://nodejs.org) (version 22 or newer),
then in this folder run:

```bash
npm install
```

Then, whenever you want to preview:

```bash
npm run dev
```

and open the address it prints (http://localhost:4321/gokarma-website/). The
page reloads by itself every time you save a file.

To check that the whole site builds without errors, as it will when published:

```bash
npm run build
```

## Publishing changes

Changes go live by merging a pull request into `master` on GitHub. A GitHub
Action (`.github/workflows/deploy.yml`) then builds the site and publishes it,
usually in 2–3 minutes. You can follow it on the repo's **Actions** tab.

Every pull request is also built as a check. If the build fails, nothing is
published and the current site stays up.

## How it's structured

```
src/pages/                 one file per page; the file name is the page's
                             address (rooms.astro → rooms.html)
src/layouts/BaseLayout.astro   the frame around every page: <head>, SEO tags,
                             header, footer
src/layouts/ArticleLayout.astro  the frame for Gokarna Guide articles
src/components/            reusable pieces: header, footer, room card,
                             gallery, booking form, photo sections, ...

src/config/site.ts         facts shown on several pages: Google rating and
                             review count, starting price, phone/WhatsApp,
                             address, map
src/config/booking.ts      the StayFlexi booking link

src/data/rooms.ts          room content
src/data/gallery.ts        gallery photos
src/data/guide.ts          guide article cards

src/styles/theme.css       ALL colors & fonts — edit this to re-theme the
                             whole site
src/styles/base.css        layout/typography basics
src/styles/components.css  buttons, cards, nav, etc.

src/assets/images/         the photos used on the site (originals; Astro
                             makes the resized versions)
photo-library/             real photos that aren't on the site yet

public/                    files copied as-is: robots.txt, sitemap.xml
```

## Common edits

### Change the rating, review count, price or phone number
Open `src/config/site.ts` and change the value. Every page that shows it
updates on the next publish.

### Change the color palette
Open `src/styles/theme.css`. Every color and font used anywhere on the site is
a variable at the top of that file, with comments.

### Add or edit a room
Edit the `ROOMS` list in `src/data/rooms.ts`. It appears on the Rooms page,
the Home page, the landing page and in the booking form.

### Add a gallery photo
1. Put the photo in a folder under `src/assets/images/` (for example
   `src/assets/images/food/`).
2. Add an entry to `src/data/gallery.ts` with its path, without the file
   extension (for example `food/masala-dosa`) and a short description of
   what's in the photo.

That's it. Astro makes the phone-sized and desktop-sized versions when the
site is built, and those copies never contain the camera's location (GPS)
data.

### Add a Gokarna Guide article
1. Copy one of the `src/pages/guide-*.astro` files, rename it, and write the
   new article's text inside it.
2. Add an entry to `src/data/guide.ts` so it shows up on the Guide page and in
   "Related Reads".
3. Add its address to `public/sitemap.xml`.

### Online booking (StayFlexi)
The "pick your dates" form on the Home page, `book.html` and `landing.html`
sends guests to StayFlexi's booking page with their dates filled in. Guests
pick a bed or room, see live rates and pay there, and StayFlexi handles
confirmation emails and keeps availability in sync with every other booking
channel. The site itself never handles payments or guest details.

The booking link is set in `src/config/booking.ts`. It comes from the
StayFlexi dashboard: **More Apps** (four-blocks icon, top right) →
**Property Configuration** → **Booking engine** → **Booking Engine URL**.
If it's ever left empty, the form switches to WhatsApp instead and opens a
chat with the dates, guest count and room already written into the message.

Booking-page colors, partial payments and add-ons are all set in that same
StayFlexi **Booking engine** settings screen, not in this code.

## SEO notes

- Every page has its own title, description, canonical link and link-preview
  (Open Graph) tags, all set through `BaseLayout.astro`.
- Page addresses are the same as before the move to Astro (`rooms.html`,
  `guide-solo-travel-in-gokarna.html`, ...), so existing links keep working.
- `landing.html` is deliberately hidden from search (noindex, left out of the
  sitemap, disallowed in `robots.txt`). It's meant for ad traffic, not search
  rankings.
- The Home page includes `LodgingBusiness` structured data (address, phone,
  rating, map location) and each guide article includes `Article` structured
  data.
- If a custom domain is set up later, change `site` and `base` in
  `astro.config.mjs` and the addresses in `public/robots.txt` and
  `public/sitemap.xml`.
