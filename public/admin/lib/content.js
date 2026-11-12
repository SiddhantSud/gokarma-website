// ============================================================
// What the admin page can edit: every editable file on the site
// and the fields in it. Adding a field to the site? Add it here
// too, or the admin page won't show it.
//
// Field types: text, longtext, number, checkbox, select, photo,
// date, list (of plain text), object (group of fields).
// ============================================================

export const SECTIONS = [
  {
    id: 'facts',
    label: 'Rating, price & contact',
    file: 'src/data/facts.json',
    note: 'Shown on several pages. Every value must be real.',
    fields: [
      {
        key: 'rating',
        label: 'Google rating',
        type: 'text',
        hint: 'From the Google listing, e.g. 4.9',
      },
      { key: 'reviewCount', label: 'Number of Google reviews', type: 'number' },
      { key: 'dormPriceFrom', label: 'Dorm beds from (₹ per night)', type: 'number' },
      { key: 'phoneDisplay', label: 'Phone, as shown', type: 'text' },
      { key: 'phoneLink', label: 'Phone, +91 and digits', type: 'text' },
      { key: 'whatsappNumber', label: 'WhatsApp, 91 and digits only', type: 'text' },
      { key: 'instagramUrl', label: 'Instagram link', type: 'text' },
      {
        key: 'submissionsEmail',
        label: 'Email for guest stories',
        type: 'text',
        optional: true,
        hint: 'Leave empty to receive stories on WhatsApp',
      },
    ],
  },
  {
    id: 'travel',
    label: 'Travel tips',
    file: 'src/data/travel-tips.json',
    note: 'Shown in "How to reach us" on the Home page. Empty boxes stay hidden.',
    fields: [
      { key: 'sayToDriver', label: 'What to tell the auto driver', type: 'text', optional: true },
      {
        key: 'fareFromBusStand',
        label: 'Usual auto fare from the bus stand',
        type: 'text',
        optional: true,
        hint: 'e.g. ₹150–200',
      },
      {
        key: 'fareFromStation',
        label: 'Usual auto fare from Gokarna Road station',
        type: 'text',
        optional: true,
      },
    ],
  },
  { id: 'articles', label: 'Gokarna Guide articles', articles: true },
  {
    id: 'gallery',
    label: 'Gallery photos',
    file: 'src/data/gallery.json',
    listKey: 'photos',
    itemLabel: 'photo',
    note: 'The first 4 also show on the Home page, so put the best first.',
    title: (item) => item.caption,
    fields: [
      { key: 'image', label: 'Photo', type: 'photo' },
      { key: 'caption', label: 'Caption', type: 'text' },
      {
        key: 'alt',
        label: 'Describe the photo',
        type: 'text',
        hint: 'For screen readers and Google',
      },
    ],
  },
  {
    id: 'vibe',
    label: 'Home photo strip',
    file: 'src/data/vibe.json',
    listKey: 'cards',
    itemLabel: 'card',
    note: 'The tall swipeable photos under "The Vibe" on the Home page.',
    title: (item) => item.label,
    fields: [
      { key: 'image', label: 'Photo', type: 'photo' },
      { key: 'label', label: 'Label on the photo', type: 'text' },
      { key: 'alt', label: 'Describe the photo', type: 'text' },
    ],
  },
  {
    id: 'places',
    label: 'Walkable places',
    file: 'src/data/nearby.json',
    listKey: 'places',
    itemLabel: 'place',
    title: (item) => `${item.name} · ${item.walk}`,
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'walk', label: 'Walking time', type: 'text', hint: 'e.g. 10 min walk' },
      { key: 'description', label: 'One line about it', type: 'text' },
      { key: 'image', label: 'Photo', type: 'photo', optional: true },
      { key: 'alt', label: 'Describe the photo', type: 'text', optional: true },
      {
        key: 'icon',
        label: 'Icon (shown when there is no photo)',
        type: 'select',
        options: ['beach', 'temple', 'sunset', 'cave'],
      },
      {
        key: 'link',
        label: 'Link to a Guide article',
        type: 'object',
        optional: true,
        fields: [
          { key: 'href', label: 'Page, e.g. guide-x.html#section', type: 'text' },
          { key: 'label', label: 'Link text', type: 'text' },
        ],
      },
      {
        key: 'credit',
        label: 'Photo credit (only for photos that are not ours)',
        type: 'object',
        optional: true,
        fields: [
          { key: 'author', label: 'Photographer', type: 'text' },
          { key: 'license', label: 'Licence', type: 'text' },
          { key: 'licenseUrl', label: 'Licence link', type: 'text' },
          { key: 'source', label: 'Where the photo came from', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'rooms',
    label: 'Rooms',
    file: 'src/data/rooms.json',
    listKey: 'rooms',
    itemLabel: 'room',
    title: (item) => item.name,
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'image', label: 'Photo', type: 'photo' },
      { key: 'alt', label: 'Describe the photo', type: 'text' },
      {
        key: 'badge',
        label: 'Ribbon',
        type: 'text',
        optional: true,
        hint: 'e.g. Great for Groups',
      },
      { key: 'features', label: 'Features (one per line)', type: 'list' },
      {
        key: 'id',
        label: 'ID',
        type: 'text',
        hint: "Used in booking links. Don't change it for an existing room.",
      },
    ],
  },
  {
    id: 'reviews',
    label: 'Guest quotes',
    file: 'src/data/reviews.json',
    listKey: 'reviews',
    itemLabel: 'quote',
    note: 'Copy quotes word for word from real reviews. Never write or reword them.',
    title: (item) => `${item.name} · ${item.source}`,
    fields: [
      { key: 'quote', label: 'Quote', type: 'longtext' },
      { key: 'name', label: 'Guest name', type: 'text' },
      {
        key: 'source',
        label: 'Where it is from',
        type: 'select',
        options: ['Google', 'Booking.com', 'Hostelworld'],
      },
    ],
  },
];

// ---- Gokarna Guide articles (Markdown files) ----
export const ARTICLES_FOLDER = 'src/content/guide';

export const ARTICLE_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' },
  {
    key: 'tag',
    label: 'Label above the title',
    type: 'text',
    hint: 'e.g. Solo Travel, Food, Treks',
  },
  { key: 'subtitle', label: 'Line under the title', type: 'text', optional: true },
  {
    key: 'author',
    label: 'Author',
    type: 'text',
    optional: true,
    hint: 'Leave empty for articles by Aangan',
  },
  { key: 'image', label: 'Main photo', type: 'photo' },
  { key: 'imageAlt', label: 'Describe the main photo', type: 'text' },
  { key: 'excerpt', label: 'Short summary for the card', type: 'longtext' },
  {
    key: 'description',
    label: 'Google description',
    type: 'longtext',
    hint: 'One or two sentences shown in search results',
  },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'order', label: 'Position in the list', type: 'number', hint: 'Lower numbers come first' },
  { key: 'ctaTitle', label: '"Stay with us" box title', type: 'text', optional: true },
  { key: 'ctaText', label: '"Stay with us" box text', type: 'text', optional: true },
  { key: 'draft', label: 'Hide from the site (draft)', type: 'checkbox' },
];

// Fields kept in the file but not shown in the form.
const FRONTMATTER_ORDER = [
  'title',
  'seoTitle',
  'description',
  'tag',
  'subtitle',
  'author',
  'excerpt',
  'image',
  'imageAlt',
  'date',
  'order',
  'ctaTitle',
  'ctaText',
  'backdrop',
  'relatedBackdrop',
  'draft',
];

/** Splits an article file into { data, body }. */
export function parseArticle(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: text };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!pair) continue;
    const [, key, raw] = pair;
    let value = raw.trim();
    if (value.startsWith('"')) value = JSON.parse(value);
    else if (value.startsWith("'")) value = value.slice(1, -1).replace(/''/g, "'");
    else if (value === 'true' || value === 'false') value = value === 'true';
    else if (/^-?\d+(\.\d+)?$/.test(value)) value = Number(value);
    data[key] = value;
  }
  return { data, body: match[2].replace(/^\r?\n/, '') };
}

/** Builds the article file text from { data, body }. */
export function serialiseArticle(data, body) {
  const keys = [
    ...FRONTMATTER_ORDER,
    ...Object.keys(data).filter((k) => !FRONTMATTER_ORDER.includes(k)),
  ];
  const lines = ['---'];
  for (const key of keys) {
    const value = data[key];
    if (value === undefined || value === null || value === '') continue;
    if (typeof value === 'boolean' || typeof value === 'number') lines.push(`${key}: ${value}`);
    else lines.push(`${key}: ${JSON.stringify(String(value))}`);
  }
  lines.push('---', '');
  return `${lines.join('\n')}${body.trim()}\n`;
}

/** "My Trek to Om Beach" → "guide-my-trek-to-om-beach" */
export function articleFileName(title) {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `guide-${slug || 'article'}`;
}
