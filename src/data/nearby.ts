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

export const NEARBY: NearbyPlace[] = [
  {
    name: 'Kudle Hilltop',
    description: 'Walk up the hill for sunset over the sea.',
    walk: '5 min walk',
    icon: 'sunset',
    image: 'scenery/sunset-cliff',
    alt: 'Guests watching the sunset from a clifftop near Gokarna',
    link: {
      href: 'guide-offbeat-adventures-in-gokarna.html#staying-offbeat',
      label: 'Life on Kudle hilltop',
    },
  },
  {
    name: 'Mahabaleshwar Temple',
    description: 'Gokarna’s ancient temple, in the heart of the old temple town.',
    walk: '15 min walk',
    icon: 'temple',
    image: 'places/mahabaleshwar-temple',
    alt: 'The carved stone tower of the Mahabaleshwar Temple in Gokarna',
    credit: {
      author: 'Nvvchar',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      source:
        'https://commons.wikimedia.org/wiki/File:Dravidian_style_Gopura_of_Mahabaleshwar_temple_at_Gokaran.jpg',
    },
    link: {
      href: 'guide-offbeat-adventures-in-gokarna.html#temple-town',
      label: 'The quieter side of temple town',
    },
  },
  {
    name: 'Kudle Beach',
    description: 'Down the hill on one side, and the start of the walk to Om Beach.',
    walk: '10–15 min walk',
    icon: 'beach',
    image: 'places/kudle-beach',
    alt: 'Kudle Beach curving between green hills, seen from above',
    credit: {
      author: 'Happyshopper',
      license: 'CC BY 2.5',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.5',
      source: 'https://commons.wikimedia.org/wiki/File:Kudle_beach_gokarna.jpg',
    },
    link: {
      href: 'guide-backpacking-gokarna-on-a-budget.html#five-beach-walk',
      label: 'The five-beach walk',
    },
  },
  {
    name: 'Main Beach',
    description: 'Gokarna’s town beach, where the coastal walk begins.',
    walk: '15 min walk',
    icon: 'beach',
    image: 'places/main-beach',
    alt: 'Gokarna Main Beach and the town, seen from the hill',
    credit: {
      author: 'Alexey Komarov',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Gokarna_Main_Beach_in_January_2023.jpg',
    },
    link: {
      href: 'guide-backpacking-gokarna-on-a-budget.html#five-beach-walk',
      label: 'The five-beach walk',
    },
  },
  {
    name: 'Shiva caves',
    description: 'A few minutes from the gate.',
    walk: '4–5 min walk',
    icon: 'cave',
    image: null, // waiting on a real photo
  },
];
