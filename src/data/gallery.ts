// ============================================================
// Every photo shown on gallery.html. The Home page teaser
// strip shows the first 4 entries, so lead with the strongest
// shots. To add a photo: drop the file into a folder under
// src/assets/images, then add one entry here. Astro makes the
// resized versions automatically when the site is built.
// ============================================================

export interface GalleryPhoto {
  image: string;
  alt: string;
  caption: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    image: 'community/game-night',
    alt: 'Guests gathered for game night at the cafe',
    caption: 'Game night at the cafe',
  },
  {
    image: 'food/chicken-gokarma',
    alt: 'Chicken Gokarma served in a clay bowl on a banana leaf',
    caption: 'Chicken Gokarma — a guest favourite',
  },
  {
    image: 'scenery/sunset-cliff',
    alt: 'Guests watching the sunset from a clifftop near Gokarna',
    caption: 'Sunset, the way it should be watched',
  },
  {
    image: 'property/sign-board',
    alt: 'Hand-painted Gokarma Cafe and Hostel sign',
    caption: 'Hand-carved & hand-painted, just like everything else here',
  },
  {
    image: 'community/chess-night',
    alt: 'A late-night game of chess under the trees',
    caption: 'A quiet game of chess after dark',
  },
  {
    image: 'food/nutella-pancake',
    alt: 'Nutella pancake stack from the cafe',
    caption: 'Breakfast, sorted',
  },
  {
    image: 'scenery/cottage-row',
    alt: 'The cottages at Aangan, seen from the path',
    caption: 'The cottages, moss on the roof tiles and all',
  },
  {
    image: 'community/catan-night',
    alt: 'A game of Catan in progress at the cafe',
    caption: 'Catan night',
  },
  {
    image: 'food/thali-spread',
    alt: 'A thali spread of chapati, rice and curry',
    caption: 'Home-style, always',
  },
  {
    image: 'scenery/verandah',
    alt: 'A quiet moment on the verandah, looking out at the trees',
    caption: 'A quiet moment on the verandah',
  },
  {
    image: 'scenery/waterfall',
    alt: 'A waterfall near Gokarna, reached on a day trip',
    caption: 'An hour out, and worth every minute',
  },
  {
    image: 'food/prawns-gokarma',
    alt: 'Prawns Gokarma served with onion and lime',
    caption: 'Prawns Gokarma',
  },
  {
    image: 'community/board-game-action',
    alt: 'Guests deep into a board game at the cafe table',
    caption: 'Board games run late here',
  },
  {
    image: 'property/property-5',
    alt: 'A resident cat and a visiting goat at the entrance gate',
    caption: 'Regular visitors at the front gate',
  },
  {
    image: 'scenery/river-pool',
    alt: 'A guest cooling off in a forest river pool',
    caption: 'The reward at the end of a trek',
  },
  {
    image: 'food/dal-rice',
    alt: 'Dal and rice served on a banana leaf',
    caption: 'Simple, and exactly what you want after a beach day',
  },
];
