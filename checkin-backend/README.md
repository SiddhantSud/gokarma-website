# Guest check-in: setup and daily use

Guests scan a QR card at the counter, fill in the check-in page on
their phone (`checkin.html` on the website) and take a photo of their
ID. This folder is the private back office it sends to: a small
Google Apps Script that lives in **your** Google account and saves

- the ID photos into a private Google Drive folder, named like
  `Priya-Sharma_2026-11-20_aadhaar-front.jpg`, one folder per month,
- the details into a private Google Sheet, with an **Indian guests**
  tab and a **Foreign guests (C-Form)** tab that has every field the
  FRRO's Form C asks for.

Nothing a guest sends is stored on the website or in this (public)
GitHub repo. The website only passes it through to your script.

These files are **not** part of the website build. They are copied
into Google's script editor by hand (steps below).

| File              | What it is                                                     |
| ----------------- | -------------------------------------------------------------- |
| `Code.gs`         | Receives check-ins, saves photos and rows, runs the ID check   |
| `Checks.gs`       | Compares what the guest typed with the text read off their ID  |
| `appsscript.json` | Script settings: India time zone, Drive OCR, web-app access    |
| `test-checks.mjs` | Tests for `Checks.gs` (`node checkin-backend/test-checks.mjs`) |

---

## One-time setup (about 15 minutes)

Use the Google account that should **own** the guest records. The
hostel's own account is best, so the records don't depend on one
person's login.

1. **Create the script.** Go to [script.google.com](https://script.google.com),
   click **New project**, and rename it (top left) to `Aangan check-in`.
2. **Show the settings file.** Click the gear (**Project Settings**) on
   the left and tick **Show "appsscript.json" manifest file in editor**.
3. **Paste the three files.** Back in the editor (`< >` on the left):
   - open `appsscript.json`, delete everything, paste this folder's
     `appsscript.json`;
   - open `Code.gs`, delete everything, paste this folder's `Code.gs`;
   - click **+** next to Files → **Script**, name it `Checks`, delete
     everything, paste `Checks.gs`.
   - Press **Save** (the disk icon).
4. **Run setup.** In the bar at the top, choose `setup` from the
   function list and click **Run**. Google asks for permission:
   **Review permissions** → pick the account → you'll see
   "Google hasn't verified this app" (normal for your own script) →
   **Advanced** → **Go to Aangan check-in** → **Allow**.
   When it finishes, the log at the bottom shows:
   - the link to the **Sheet**,
   - the link to the **photos folder**,
   - the **desk code** (6 letters/numbers). Note it down.
5. **Put it online.** Click **Deploy** → **New deployment** → the gear
   next to "Select type" → **Web app**. Set **Execute as: Me** and
   **Who has access: Anyone** (guests don't have your Google login;
   the desk code is what keeps strangers out). Click **Deploy** and
   copy the **Web app URL** (it ends in `/exec`).
6. **Connect the website.** Paste that URL into `endpointUrl` in
   `src/config/checkin.ts`, then publish the site as usual (PR and
   merge). Until this is done the check-in page tells guests to check
   in at the counter.
7. **Make the QR card.** The link is

   `https://siddhantsud.github.io/gokarma-website/checkin.html?code=YOURCODE`

   with your desk code instead of `YOURCODE`. Open it on your phone
   once to check it works, then turn it into a QR code (in Chrome:
   the share icon in the address bar → **Create QR code**) and print
   it next to the Wi-Fi details.

8. **Give the hosts access.** Open the Sheet and the photos folder and
   use **Share** to add Kushal and Geetika by email. Never use
   "Anyone with the link".

## Daily use

- **New guests** appear as a new row within seconds of pressing
  "Check me in". The **ID photos** cell has clickable links to the
  photos in Drive.
- **ID check** fills in within about 5 minutes:
  - ✅ **Matches the ID**: name, date of birth and ID number (last 4
    Aadhaar digits) were all found on the photo. For passports, the
    two `<<<` lines at the bottom were read and checked.
  - ⚠️ **Check: ...**: something didn't match or couldn't be found.
    Usually a blurry photo or a typo; have a look at the photo.
  - ❓ **Couldn't read**: the photo was too dark or blurry to read.
    Have a look yourself, and retake it if needed.

  It's a helper, not a verdict: a guest's ID is still for you to check.

- **Foreign guests: file Form C** on the FRRO site
  ([indianfrro.gov.in](https://indianfrro.gov.in/frro/FormC)) within
  24 hours of arrival. Every field it asks for is in the
  **Foreign guests (C-Form)** tab, and the passport photo it needs is in
  the photos folder. Tick **C-Form filed** when done. Rows turn **red**
  after 20 hours if the box isn't ticked yet.
- **Host notes** is a free column for you.

## Good to know

- **Aadhaar numbers:** only the last 4 digits are kept in the sheet.
  The photo still shows the full number unless the guest uploads a
  masked Aadhaar (the page suggests it).
- **Change the desk code** if the QR link ends up shared outside the
  hostel: in the script editor choose `changeDeskCode`, click **Run**,
  read the new code in the log, and print a new QR card.
- **Updating the script later:** paste the new code, then **Deploy** →
  **Manage deployments** → the pencil → **Version: New version** →
  **Deploy**. Updating this way keeps the same web address. A brand new
  deployment would give a new address, which would then need to go
  into `src/config/checkin.ts`.
- **House rules:** the page shows the rules from
  `src/data/house-rules.ts` (copied from the owners' indemnity Google
  Doc) and saves the date of that version with each guest's signature.
  If the wording changes, update that file and `rulesVersion` in
  `src/config/checkin.ts`.
- **Storage:** each guest's photos are about 0.5 to 1.5 MB, so the free
  15 GB of Google Drive holds tens of thousands of check-ins. Decide
  how long you keep old records, and delete month folders and rows
  past that.
- **Something not working?** In the script editor, **Executions** (on
  the left) lists every check-in and ID check with any error.
