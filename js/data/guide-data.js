// ============================================================
// Metadata for every Gokarna Guide article. Used to render the
// card grid on guide.html and the "Related reads" links at the
// bottom of each article. The actual article text lives in
// each article's own HTML file (kept as real static content
// for SEO -- not generated from this data).
//
// To add a new article: write the .html file, then add one
// entry here so it shows up on the guide hub and in "related
// reads" widgets.
// ============================================================

const GUIDE_POSTS = [
  {
    slug: 'guide-backpacking-gokarna-on-a-budget.html',
    tag: 'Budget Travel',
    title: 'Backpacking Gokarna on a Budget',
    excerpt:
      'How to see Gokarna’s beaches, temples, and cafes without overspending — what things actually cost and where to save.',
    image: 'images/property/property-2',
    widths: [480, 900, 1600],
  },
  {
    slug: 'guide-solo-travel-in-gokarna.html',
    tag: 'Solo Travel',
    title: 'Solo Travel in Gokarna: A Practical Guide',
    excerpt:
      'Is Gokarna safe for solo travelers? Real, practical notes on getting around, meeting people, and staying safe.',
    image: 'images/property/dorm-outside-1',
    widths: [480, 900, 1600],
  },
  {
    slug: 'guide-offbeat-adventures-in-gokarna.html',
    tag: 'Offbeat Gokarna',
    title: 'Offbeat Adventures in Gokarna (Beyond the Beaches)',
    excerpt:
      'Past the five-beach trek: the quieter temples, day trips, and why the stay itself can be the adventure.',
    image: 'images/property/property-4',
    widths: [480, 900, 1600],
  },
];
