// ============================================================
// The swipeable strip of portrait photos under the Home intro
// ("the vibe"). Each card is one real photo and a short label.
// `image` is a path inside src/assets/images, without the
// file extension.
//
// Only cats, dogs and birds are mentioned as animals on the site
// (Siddhant, 2026-11-12). Waiting on photos from the owners:
// the cats and dogs, the garden and trees, a work/Wi-Fi corner,
// art and murals.
// ============================================================

export interface VibeCard {
  label: string;
  image: string;
  alt: string;
}

export const VIBE_CARDS: VibeCard[] = [
  {
    label: 'Outdoor living',
    image: 'scenery/cottage-row',
    alt: 'The cottages at Aangan, seen from the path',
  },
  {
    label: 'Under the trees',
    image: 'property/property-2',
    alt: "Forest path through Aangan's property",
  },
  {
    label: 'Sunset walks',
    image: 'scenery/sunset-cliff',
    alt: 'Guests watching the sunset from a clifftop near Gokarna',
  },
  {
    label: 'Board games',
    image: 'community/catan-night',
    alt: 'A game of Catan in progress at the cafe',
  },
  {
    label: 'Top-rated cafe',
    image: 'food/thali-spread',
    alt: 'A thali spread of chapati, rice and curry',
  },
  {
    label: 'Hand-painted everything',
    image: 'property/sign-board',
    alt: 'Hand-painted Gokarma Cafe and Hostel sign',
  },
];
