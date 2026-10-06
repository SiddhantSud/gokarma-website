// ============================================================
// Renders Gokarna Guide article cards from js/data/guide-data.js
// into whichever container(s) exist on the current page:
//   #guideGrid    -- full card grid (guide.html)
//   #guideTeaser  -- shorter teaser strip (index.html)
//   #relatedReads -- "related reads" links at the bottom of an
//                    article (excludes the current article,
//                    identified by <body data-slug="...">)
// ============================================================

function guideCardHtml(post) {
  return `
    <a href="${post.slug}" class="card guide-card reveal">
      <div class="photo-box small">
        ${responsiveImg(post, { sizes: '(max-width: 700px) 100vw, 340px' })}
      </div>
      <span class="tag">${post.tag}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
    </a>
  `;
}

function relatedReadHtml(post) {
  return `<li><a class="explore-link" href="${post.slug}">${post.title} →</a></li>`;
}

function renderGuide() {
  const grid = document.getElementById('guideGrid');
  if (grid) {
    grid.innerHTML = GUIDE_POSTS.map(guideCardHtml).join('');
  }

  const teaser = document.getElementById('guideTeaser');
  if (teaser) {
    teaser.innerHTML = GUIDE_POSTS.map(guideCardHtml).join('');
  }

  const related = document.getElementById('relatedReads');
  if (related) {
    const currentSlug = document.body.dataset.slug;
    const others = GUIDE_POSTS.filter((post) => post.slug !== currentSlug);
    related.innerHTML = others.map(relatedReadHtml).join('');
  }

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

renderGuide();
