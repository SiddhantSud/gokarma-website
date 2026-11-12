// ============================================================
// "Everything's a walk away": places guests can walk to from
// Aangan, shown on the Home page. Walking times are from the
// owners (via Siddhant, 2026-11-12; temple corrected to 15 min).
//
// image: a photo in src/assets/images (no extension), or null
//   to show just the icon until a real photo is available.
// credit: required for photos that aren't Aangan's own. The
//   places/ photos are from Wikimedia Commons under Creative
//   Commons licences, used until the owners send their own.
//   Their licences require the credit shown on the page.
// link: a Gokarna Guide article (with #section) to read more.
// ============================================================
// The list itself lives in nearby.json, which /admin edits.
// Edit it there (or in the JSON file); this file only adds types.
import data from './nearby.json';

export interface NearbyPlace {
  name: string;
  description: string;
  walk: string;
  icon: 'beach' | 'temple' | 'sunset' | 'cave';
  image: string | null;
  alt?: string;
  credit?: { author: string; license: string; licenseUrl: string; source: string };
  link?: { href: string; label: string };
}

export const NEARBY = data.places as NearbyPlace[];
