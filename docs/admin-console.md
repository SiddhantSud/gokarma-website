# The admin page

The admin page is where you edit the website's content: prices and contact
details, travel tips, Gokarna Guide articles, gallery photos, the Home photo
strip, walkable places, rooms and guest quotes. No code needed.

**Address:** https://siddhantsud.github.io/gokarma-website/admin/

It isn't linked anywhere on the site and is hidden from Google. It opens with a
password.

## Using it

1. Open the address and type the admin password.
2. Pick a section on the left. Everything already on the website is there.
3. Edit, add, remove or reorder. Lists (gallery, rooms…) open when you click an
   item. Use ↑ ↓ to reorder and ✕ to remove.
4. For photos, click **Choose a new photo** and pick one from your phone or
   computer. Always fill in **Describe the photo**.
5. The top bar shows how many changes aren't published yet. Press **Publish**
   when you're done. The website updates in about 2–3 minutes.
6. Press **Lock** when you're finished, especially on a shared computer.

Nothing changes on the website until you press Publish. Every publish is saved
in the site's history, so anything can be undone.

Uploaded photos are resized automatically for phones and computers, and the
location data that phones store in photos is removed.

### Articles

- **Gokarna Guide articles** lists every article. Click one to edit it, or
  **+ New article** to start one. New articles start hidden ("draft"). Untick
  **Hide from the site** when the article is ready, then Publish.
- In the article text, start a line with `##` for a heading and `-` for a bullet
  point, and wrap words in `**double stars**` for bold.

### Guest stories

The Gokarna Guide page invites travellers to send in their own stories. They
arrive on WhatsApp, or by email once an address is set under **Rating, price &
contact → Email for guest stories**. Nothing is published automatically.

To publish one: check they gave permission and the photos are theirs, create a
new article, paste the story, add their photos, put their name in **Author**,
edit lightly, untick "Hide from the site", and Publish.

## One-time setup (Siddhant)

The page saves changes to GitHub, where the website's files live, so it needs a
GitHub access token. Setup locks that token with the admin password; after that,
people only ever type the password.

1. Create a **fine-grained token** on GitHub: Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → Generate new token.
   - Repository access: **Only select repositories → gokarma-website**
   - Permissions: **Contents: Read and write**, **Pull requests: Read and write**
   - Expiry: up to a year (put a reminder in your calendar to renew it)
2. Open **…/gokarma-website/admin/setup.html**, paste the token, choose the
   admin password twice, and press **Lock the token and save**.
3. Wait 2–3 minutes for the site to rebuild, then open the admin page and sign
   in with the password.

**The password must be long**: four or five random words, at least 16
characters. The locked token is stored on the public website, so the password is
the only thing protecting it.

### Changing the password, replacing the token, or removing access

Run **setup.html** again with a token and a new password. To shut the admin page
off completely, delete the token on GitHub; the page then can't change anything.
If the password leaks, delete the token straight away, make a new one, and run
setup again with a new password.

## For developers

- Plain HTML/CSS/JS in `public/admin/` (no framework, no build step). It has its
  own CSP, which allows only `api.github.com` and `raw.githubusercontent.com`
  (for thumbnails).
  - `lib/crypto.js`: PBKDF2-SHA256 (600k rounds) + AES-GCM lock/unlock.
    `key.json` holds the locked token.
  - `lib/github.js`: reads from master; publishes all changes as one commit on a
    new branch, opens a PR, squash-merges it and deletes the branch. This fits
    the `master` PR rule.
  - `lib/content.js`: what's editable and the fields of each. **Add new
    editable fields here.**
  - `admin.js`: the UI. It builds everything with DOM methods, never innerHTML.
- Content files: articles in `src/content/guide/*.md` (schema in
  `src/content.config.ts`), lists and facts in `src/data/*.json`. These are
  excluded from Prettier because the admin page writes them in its own format.
- The decrypted token lives in `sessionStorage` until the tab closes or Lock is
  pressed.
