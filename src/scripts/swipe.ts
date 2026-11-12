// ============================================================
// Previous/next buttons for the horizontal swipe rows (photo
// strip, guest reviews). Swiping and trackpad scrolling work on
// their own through CSS scroll-snap; the buttons are for mouse
// users. Each button moves the row by roughly one card.
//
// Markup: a [data-swipe] wrapper holding a .swipe-track and
// buttons with data-swipe-prev / data-swipe-next.
// ============================================================

document.querySelectorAll<HTMLElement>('[data-swipe]').forEach((wrapper) => {
  const track = wrapper.querySelector<HTMLElement>('.swipe-track');
  if (!track) return;

  const step = () => {
    const card = track.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
  };

  wrapper.querySelector('[data-swipe-prev]')?.addEventListener('click', () => {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  wrapper.querySelector('[data-swipe-next]')?.addEventListener('click', () => {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });
});
