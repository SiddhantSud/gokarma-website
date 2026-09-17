# Wanderer's Nest Hostel Website

A simple, one-page website for a backpacker hostel. Built with plain **HTML, CSS,
and JavaScript** only — no frameworks, no build tools, no installation needed.

## Files

- `index.html` — all the page content and structure
- `style.css` — all the styling (colors, layout, fonts)
- `script.js` — small bits of interactivity (mobile menu, contact form, footer year)
- `images/` — put your real photos here

## How to view it

Just double-click `index.html` and it opens in your browser. No server required.

## How to customize

### Change text
Open `index.html` in any text editor and edit the words directly — headings,
paragraphs, prices, addresses, etc. are all plain, readable text.

### Change colors / fonts
Open `style.css` and look at the top of the file under `:root { ... }`.
Changing `--color-primary` there updates the accent color everywhere on the site.

### Add real photos
1. Save your photos into the `images/` folder (e.g. `images/hero.jpg`,
   `images/dorm.jpg`).
2. In `index.html`, find a `<div class="placeholder-box ...">` and replace it
   with an `<img>` tag, for example:
   ```html
   <img src="images/dorm.jpg" alt="Mixed dorm room" />
   ```
3. For the big hero background photo, open `style.css`, find `.hero {` and
   change `url('images/hero.jpg')` to point at your file.

### Update the map
In `index.html`, find the `<iframe class="map-frame" ...>` in the Location
section. Go to Google Maps, search your address, click Share → Embed a map,
and paste the new link into the `src="..."` attribute.

### Connect the contact form to real email / bookings
Right now the "Send Message" button just shows a thank-you message on the
page (see `script.js`). To actually receive messages, the easiest options are:

- **Formspree** (free, no backend needed): sign up at formspree.io, then set
  the form's `action` attribute in `index.html` to the URL they give you, and
  add `method="POST"`.
- **A hotel/hostel booking platform** (Hostelworld, Booking.com, etc.): replace
  the "Book Now" links with a link to your listing on that platform instead.

## How to publish it online (free options)

- **GitHub Pages**: create a GitHub repo, upload these files, then enable
  Pages in the repo settings.
- **Netlify / Vercel**: drag and drop this folder onto netlify.com/drop for an
  instant live link.
