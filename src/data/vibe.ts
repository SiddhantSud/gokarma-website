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
// The list itself lives in vibe.json, which /admin edits.
// Edit it there (or in the JSON file); this file only adds types.
import data from './vibe.json';

export interface VibeCard {
  label: string;
  image: string;
  alt: string;
}

export const VIBE_CARDS = data.cards as VibeCard[];
