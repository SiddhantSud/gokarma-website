// ============================================================
// Card details for every Gokarna Guide article. Used for the
// card grid on guide.html, the Home page teaser and the
// "Related reads" links under each article. The article text
// itself lives in its own page in src/pages/.
//
// To add an article: create its page in src/pages/, add one
// entry here, and add its URL to public/sitemap.xml.
// ============================================================

export interface GuidePost {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
}

export const GUIDE_POSTS: GuidePost[] = [
  {
    slug: 'guide-backpacking-gokarna-on-a-budget.html',
    tag: 'Budget Travel',
    title: 'Backpacking Gokarna on a Budget',
    excerpt:
      'How to see Gokarna’s beaches, temples, and cafes without overspending — what things actually cost and where to save.',
    image: 'property/property-2',
  },
  {
    slug: 'guide-solo-travel-in-gokarna.html',
    tag: 'Solo Travel',
    title: 'Solo Travel in Gokarna: A Practical Guide',
    excerpt:
      'Is Gokarna safe for solo travelers? Real, practical notes on getting around, meeting people, and staying safe.',
    image: 'property/dorm-outside-1',
  },
  {
    slug: 'guide-offbeat-adventures-in-gokarna.html',
    tag: 'Offbeat Gokarna',
    title: 'Offbeat Adventures in Gokarna (Beyond the Beaches)',
    excerpt:
      'Past the five-beach trek: the quieter temples, day trips, and why the stay itself can be the adventure.',
    image: 'property/property-4',
  },
];
