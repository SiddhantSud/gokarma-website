// ============================================================
// Guest check-in settings, read by src/pages/checkin.astro.
//
// endpointUrl
//   The "Web app URL" Google gives you when you deploy the
//   check-in script (checkin-backend/README.md, step 5). It ends
//   in /exec. While it's empty (''), the check-in page still
//   shows, but tells guests to check in at the counter instead.
//
//   This address is safe to have in a public repo: it can only
//   RECEIVE check-ins (with the desk code), never hand any back.
//
// rulesVersion
//   The date the house rules in src/data/house-rules.ts were last
//   changed. It's saved with every guest's signature, so you can
//   tell which version of the rules they agreed to. Change it
//   whenever you change the rules.
// ============================================================

export const CHECKIN = {
  // PLACEHOLDER: paste the web app URL here once the script is deployed.
  endpointUrl: '',
  rulesVersion: '2026-11-20',
};
