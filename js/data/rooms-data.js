// ============================================================
// All room content lives here. To add, remove, or edit a room,
// change this array only -- rooms.js renders it automatically
// on both rooms.html and the Home page teaser.
// ============================================================

const ROOMS = [
  {
    id: 'four-bed-dorm',
    name: '4-Bed Mixed Dorm',
    badge: null,
    image: 'images/rooms/4-bed-dorm-1',
    widths: [480, 900, 1600],
    alt: '4-bed mixed dorm room with orange bunk beds',
    features: [
      'Attached bathroom',
      'AC & ceiling fan',
      'Personal locker & reading light',
    ],
    whatsappText:
      "Hi! I'd like to check availability for the 4-Bed Mixed Dorm at Aangan by Gokarma Living.",
  },
  {
    id: 'six-bed-dorm',
    name: '6-Bed Mixed Dorm',
    badge: 'Great for Groups',
    image: 'images/rooms/6-bed-dorm-1',
    widths: [480, 900, 1600],
    alt: '6-bed mixed dorm room with multiple bunk beds',
    features: [
      'Attached bathroom',
      'AC & ceiling fan',
      'Personal locker & reading light',
    ],
    whatsappText:
      "Hi! I'd like to check availability for the 6-Bed Mixed Dorm at Aangan by Gokarma Living.",
  },
  {
    id: 'vintage-room',
    name: 'Vintage Room (Private)',
    badge: null,
    image: 'images/rooms/vintage-room-1',
    widths: [480, 900, 1600],
    alt: 'Vintage private room with hand-painted walls and a low platform bed',
    features: [
      'Private double bed',
      'Hand-painted walls, ceiling fan',
      'Shared bathroom',
    ],
    whatsappText:
      "Hi! I'd like to check availability for the Vintage Room at Aangan by Gokarma Living.",
  },
];
