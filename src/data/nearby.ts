// ============================================================
// "Everything's a walk away": places guests can walk to from
// Aangan, shown on the Home page. Walking times are from the
// owners (via Siddhant, 2026-11-12).
//
// image: a photo in src/assets/images (no extension), or null
//   to show just the icon until a real photo is available.
// link: a Gokarna Guide article (with #section) to read more.
// ============================================================

export interface NearbyPlace {
  name: string;
  description: string;
  walk: string;
  icon: 'beach' | 'temple' | 'sunset' | 'cave';
  image: string | null;
  alt?: string;
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
    walk: '10 min walk',
    icon: 'temple',
    image: null, // waiting on a real photo
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
    image: null, // waiting on a real photo
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
    image: null, // waiting on a real photo
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
