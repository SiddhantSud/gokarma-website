// ============================================================
// "How to reach us" on the Home page.
//
// Route facts (bus times, distances, trains) were researched on
// 2026-11-12 from KSRTC, booking sites and railway listings. They
// change, which is why every route links to where guests can
// check and book. Keep times approximate ("about").
//
// LAST_LEG holds what the owners tell guests for the final auto
// ride. Fields left as null are hidden on the site until the
// owners fill them in.
// ============================================================
import travelTips from './travel-tips.json';

export interface BookingLink {
  label: string;
  url: string;
}

export interface Route {
  from: string;
  mode: 'bus' | 'train' | 'plane';
  summary: string;
  steps: string[];
  links: BookingLink[];
}

export const ROUTES: Route[] = [
  {
    from: 'From Bangalore',
    mode: 'bus',
    summary: 'Overnight bus, about 9–10 hours',
    steps: [
      'KSRTC and private operators run overnight sleeper buses to Gokarna. Most leave Bangalore in the late evening and arrive the next morning.',
      'Get off at the Gokarna bus stand in town, then take an auto up to Aangan (see below).',
    ],
    links: [
      { label: 'KSRTC', url: 'https://ksrtc.in/' },
      { label: 'redBus', url: 'https://www.redbus.in/' },
      { label: 'AbhiBus', url: 'https://www.abhibus.com/' },
    ],
  },
  {
    from: 'From Mumbai',
    mode: 'train',
    summary: 'Konkan Railway train to Gokarna Road',
    steps: [
      'Take a Konkan Railway train to Gokarna Road station (GOK), such as the Matsyagandha Express. Check current timings before you book.',
      'Gokarna Road is about 8–10 km outside town. Take an auto from the station to Aangan.',
      'Overnight private buses from Mumbai to Gokarna also run if you prefer the road.',
    ],
    links: [
      { label: 'IRCTC (trains)', url: 'https://www.irctc.co.in/' },
      { label: 'Konkan Railway', url: 'https://konkanrailway.com/' },
      { label: 'redBus', url: 'https://www.redbus.in/' },
    ],
  },
  {
    from: 'By air',
    mode: 'plane',
    summary: 'Fly to Goa',
    steps: [
      'The nearest airport is Dabolim (Goa), about 136 km away. Take a taxi or a bus to Gokarna from there.',
    ],
    links: [],
  },
];

// ---- The last leg: auto from the Gokarna bus stand ----
// Lives in travel-tips.json so the owners can fill it in from
// /admin: what to tell the auto driver, and the usual fares.
// Empty (null) fields stay hidden on the site.
export const LAST_LEG = travelTips as {
  sayToDriver: string | null;
  fareFromBusStand: string | null;
  fareFromStation: string | null;
};
