// ============================================================
// Renders room cards from js/data/rooms-data.js into whichever
// container(s) exist on the current page:
//   #roomsGrid   -- full grid (rooms.html)
//   #roomsTeaser -- shorter teaser strip (index.html)
// ============================================================

function roomCardHtml(room) {
  const featureItems = room.features.map((f) => `<li>${f}</li>`).join('');
  const whatsappUrl = `https://wa.me/917892803231?text=${encodeURIComponent(room.whatsappText)}`;
  const badgeHtml = room.badge ? `<div class="ribbon">${room.badge}</div>` : '';
  const cardClass = room.badge ? 'card featured' : 'card';

  return `
    <div class="${cardClass} reveal">
      ${badgeHtml}
      <div class="photo-box small">
        ${responsiveImg(room, { sizes: '(max-width: 700px) 100vw, 340px' })}
      </div>
      <h3>${room.name}</h3>
      <ul>${featureItems}</ul>
      <a href="${whatsappUrl}" class="btn ${room.badge ? 'btn-primary' : 'btn-outline'}" target="_blank" rel="noopener">
        Check Availability
      </a>
    </div>
  `;
}

function renderRooms() {
  const fullGrid = document.getElementById('roomsGrid');
  if (fullGrid) {
    fullGrid.innerHTML = ROOMS.map(roomCardHtml).join('');
  }

  const teaser = document.getElementById('roomsTeaser');
  if (teaser) {
    teaser.innerHTML = ROOMS.slice(0, 3).map(roomCardHtml).join('');
  }

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

renderRooms();
