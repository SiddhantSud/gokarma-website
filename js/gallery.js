// ============================================================
// Renders gallery photos from js/data/gallery-data.js into:
//   #galleryGrid   -- full grid (gallery.html), with lightbox
//   #galleryTeaser -- shorter teaser strip (index.html), no lightbox
// ============================================================

function galleryItemHtml(photo, index) {
  return `
    <div class="photo-box gallery-box reveal" data-index="${index}" tabindex="0" role="button" aria-label="View larger: ${photo.alt}">
      ${responsiveImg(photo, { sizes: '(max-width: 700px) 50vw, 320px' })}
    </div>
  `;
}

function renderGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  if (grid) {
    grid.innerHTML = GALLERY_PHOTOS.map(galleryItemHtml).join('');
    setupLightbox(grid, GALLERY_PHOTOS);
  }

  const teaser = document.getElementById('galleryTeaser');
  if (teaser) {
    teaser.innerHTML = GALLERY_PHOTOS.slice(0, 4).map(galleryItemHtml).join('');
  }

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

// ---- Lightbox: click a gallery photo to view it larger,
// navigate with prev/next or arrow keys, close with Esc or by
// clicking outside the image. ----
function setupLightbox(grid, photos) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];
    const widths = photo.widths || [480, 900, 1600];
    const largest = widths[widths.length - 1];
    lightboxImg.src = `${photo.image}-${largest}w.jpg`;
    lightboxImg.alt = photo.alt;
    lightbox.hidden = false;
  }

  function close() {
    lightbox.hidden = true;
    lightboxImg.src = '';
  }

  grid.addEventListener('click', (event) => {
    const item = event.target.closest('[data-index]');
    if (item) show(Number(item.dataset.index));
  });

  grid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const item = event.target.closest('[data-index]');
    if (item) {
      event.preventDefault();
      show(Number(item.dataset.index));
    }
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(currentIndex - 1));
  nextBtn.addEventListener('click', () => show(currentIndex + 1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(currentIndex - 1);
    if (event.key === 'ArrowRight') show(currentIndex + 1);
  });
}

renderGalleryGrid();
