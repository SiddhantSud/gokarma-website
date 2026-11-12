# The admin console

The admin console is where you edit the website's photos, Gokarna Guide
articles, rooms, guest quotes, prices and travel tips, without touching code.

**Address:** https://siddhantsud.github.io/gokarma-website/admin/

It isn't linked anywhere on the site and is hidden from Google. Opening the
address only shows a sign-in screen. Nothing can be changed without a GitHub
account that has access to the website's repository.

## Signing in (once per device)

You need a free GitHub account that Siddhant has added to the repository
(see "Adding someone" below). Then:

1. On GitHub, open **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. Name it "Aangan admin". For expiry, pick a year.
3. Under **Repository access**, choose **Only select repositories** and pick
   **SiddhantSud/gokarma-website**.
4. Under **Permissions → Repository permissions**, set:
   - **Contents:** Read and write
   - **Pull requests:** Read and write
   - (Metadata: Read-only is added automatically)
5. Generate the token and copy it.
6. Open the admin address, choose **Sign In Using Access Token**, and paste the
   token. The browser remembers it, so you only do this once per device.

Treat the token like a password. If a phone or laptop is lost, delete the token
on GitHub (same page as step 1) and make a new one.

## How changes go live

Saving never changes the live site straight away:

1. **Save** keeps your change as a draft.
2. When it's ready, mark it **Ready** and press **Publish**.
3. The site rebuilds itself and the change is live in about 2–3 minutes.

Every change is recorded with who made it and when, so anything can be undone.

## What you can edit

| In the console                          | What it changes                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Gokarna Guide articles**              | Add, edit or hide articles. Write in the editor like a normal document. Tick "Hide from the site" to keep one as a draft. |
| **Photos → Gallery page**               | Add, remove or reorder gallery photos. The first 4 also show on the Home page.                                            |
| **Photos → Home photo strip**           | The tall swipeable photos under "The Vibe".                                                                               |
| **Photos → Walkable places**            | Kudle Hilltop, the temple, the beaches: walking times, photos, links.                                                     |
| **Photos → Rooms**                      | Room names, photos and features. Don't change a room's ID.                                                                |
| **Details → Rating, price and contact** | Google rating and review count, "dorm beds from" price, phone, WhatsApp, Instagram, and the email for story submissions.  |
| **Details → Travel tips**               | What to tell the auto driver, and the usual fares. Empty fields stay hidden.                                              |
| **Details → Guest quotes**              | The "Stories We Have Lived" quotes. Copy them word for word from real reviews.                                            |

When you upload a photo, the site makes phone-sized and desktop-sized copies
automatically and removes the location data phones store in photos. Always
describe the photo in the "Describe the photo" field.

## Guest stories for the Gokarna Guide

The Guide page invites travellers to send in their own Gokarna stories. They
arrive by WhatsApp, or by email once an address is set in
**Details → Rating, price and contact**. Nothing is published automatically.

To publish one:

1. Make sure they ticked or stated permission to publish, and that the photos
   are their own.
2. In **Gokarna Guide articles**, choose **New article**, paste the story, add
   their photos, and put their name in **Author**.
3. Edit lightly, save, and publish as above.

## Adding or removing someone

Siddhant manages access on GitHub: **Repository → Settings → Collaborators →
Add people**, with the **Write** role. To remove someone, remove them there and
their token stops working straight away. Turn on two-step sign-in for every
account that has access.

## For developers

- The console is [Sveltia CMS](https://sveltiacms.app), loaded by
  `public/admin/index.html`. What it can edit is set in `public/admin/config.yml`.
- It uses the `editorial_workflow` publish mode: each save is a pull request,
  and Publish merges it. That fits the `master` rule that changes must arrive
  as pull requests.
- Articles are Markdown in `src/content/guide/`; the fields are checked by
  `src/content.config.ts`. Lists and facts are JSON in `src/data/`.
