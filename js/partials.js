// ============================================================
// Injects the shared header and footer (partials/header.html,
// partials/footer.html) into every page that has empty
// <div id="site-header"></div> / <div id="site-footer"></div>
// placeholders. This keeps navigation and the footer editable
// in exactly one place instead of copy-pasted across pages.
//
// After injecting, it also highlights the current page's nav
// link, using the page's <body data-page="..."> attribute to
// match the header link with the same data-page value.
// ============================================================

async function injectPartial(placeholderId, url) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  const response = await fetch(url);
  placeholder.innerHTML = await response.text();
}

async function loadPartials() {
  await Promise.all([
    injectPartial('site-header', 'partials/header.html'),
    injectPartial('site-footer', 'partials/footer.html'),
  ]);

  document.dispatchEvent(new CustomEvent('partials:loaded'));
}

loadPartials();
