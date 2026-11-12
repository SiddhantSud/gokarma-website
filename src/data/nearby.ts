// ============================================================
// "Everything's a walk away": places guests can walk to from
// Aangan, shown on the Home page.
//
// `walk` is the walking time as shown on the site. Leave it as
// null until the owners confirm it; the card then just says
// "Walkable".
// ============================================================

export interface NearbyPlace {
  name: string;
  description: string;
  walk: string | null;
  icon: 'beach' | 'temple' | 'sunset' | 'cave';
}

export const NEARBY: NearbyPlace[] = [
  {
    name: 'Kudle Beach',
    description: 'Down the hill on one side, and the start of the walk to Om Beach.',
    walk: '8–10 min walk',
    icon: 'beach',
  },
  {
    name: 'Main Beach & Mahabaleshwar Temple',
    description: 'On the other side: the old temple town and Gokarna’s main beach.',
    walk: null, // placeholder: waiting on the owners for the walking time
    icon: 'temple',
  },
  {
    name: 'Hilltop sunsets',
    description: 'Walk up to the cliffs for sunset over the Arabian Sea.',
    walk: null, // placeholder: waiting on the owners for the walking time
    icon: 'sunset',
  },
  {
    name: 'Shiva caves',
    description: 'A few minutes from the gate.',
    walk: '4–5 min walk',
    icon: 'cave',
  },
];
