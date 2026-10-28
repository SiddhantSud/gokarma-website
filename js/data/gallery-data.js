// ============================================================
// Every photo shown on gallery.html (and the Home page teaser
// strip, which shows the first 4 entries — lead with the
// strongest shots). To add a photo: drop the file in
// images/property, images/rooms, images/food, images/community,
// or images/scenery, run scripts/resize-images.py, then add one
// entry here. `widths` must match whatever sizes the resize
// script actually generated for that photo (check the images/
// folder if unsure — a few smaller source photos only got
// 480/900, not the full 480/900/1600 set).
// ============================================================

const GALLERY_PHOTOS = [
  {
    image: 'images/community/game-night',
    widths: [480, 900, 1600],
    alt: 'Guests gathered for game night at the cafe',
    caption: 'Game night at the cafe',
  },
  {
    image: 'images/food/chicken-gokarma',
    widths: [480, 900, 1600],
    alt: 'Chicken Gokarma served in a clay bowl on a banana leaf',
    caption: 'Chicken Gokarma — a guest favourite',
  },
  {
    image: 'images/scenery/sunset-cliff',
    widths: [480, 900, 1600],
    alt: 'Guests watching the sunset from a clifftop near Gokarna',
    caption: 'Sunset, the way it should be watched',
  },
  {
    image: 'images/property/sign-board',
    widths: [480, 900, 1600],
    alt: 'Hand-painted Gokarma Cafe and Hostel sign',
    caption: 'Hand-carved &amp; hand-painted, just like everything else here',
  },
  {
    image: 'images/community/chess-night',
    widths: [480, 900],
    alt: 'A late-night game of chess under the trees',
    caption: 'A quiet game of chess after dark',
  },
  {
    image: 'images/food/nutella-pancake',
    widths: [480, 900, 1600],
    alt: 'Nutella pancake stack from the cafe',
    caption: 'Breakfast, sorted',
  },
  {
    image: 'images/scenery/cottage-row',
    widths: [480, 900, 1600],
    alt: 'The cottages at Aangan, seen from the path',
    caption: 'The cottages, moss on the roof tiles and all',
  },
  {
    image: 'images/community/catan-night',
    widths: [480, 900, 1600],
    alt: 'A game of Catan in progress at the cafe',
    caption: 'Catan night',
  },
  {
    image: 'images/food/thali-spread',
    widths: [480, 900, 1600],
    alt: 'A thali spread of chapati, rice and curry',
    caption: 'Home-style, always',
  },
  {
    image: 'images/scenery/verandah',
    widths: [480, 900, 1600],
    alt: 'A quiet moment on the verandah, looking out at the trees',
    caption: 'A quiet moment on the verandah',
  },
  {
    image: 'images/scenery/waterfall',
    widths: [480, 900],
    alt: 'A waterfall near Gokarna, reached on a day trip',
    caption: 'An hour out, and worth every minute',
  },
  {
    image: 'images/food/prawns-gokarma',
    widths: [480, 900, 1600],
    alt: 'Prawns Gokarma served with onion and lime',
    caption: 'Prawns Gokarma',
  },
  {
    image: 'images/community/board-game-action',
    widths: [480, 900, 1600],
    alt: 'Guests deep into a board game at the cafe table',
    caption: 'Board games run late here',
  },
  {
    image: 'images/property/property-5',
    widths: [480],
    alt: 'A resident cat and a visiting goat at the entrance gate',
    caption: 'Regular visitors at the front gate',
  },
  {
    image: 'images/scenery/river-pool',
    widths: [480, 900],
    alt: 'A guest cooling off in a forest river pool',
    caption: 'The reward at the end of a trek',
  },
  {
    image: 'images/food/dal-rice',
    widths: [480, 900, 1600],
    alt: 'Dal and rice served on a banana leaf',
    caption: 'Simple, and exactly what you want after a beach day',
  },
];
