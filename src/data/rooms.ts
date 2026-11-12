// ============================================================
// All room content lives here. Add, remove or edit a room in
// this array and it appears on rooms.html, the Home page
// teaser, the landing page and the booking form's room list.
//
// `image` is a path inside src/assets/images, without the
// file extension. `id` is used in book.html?room=<id>.
// ============================================================

export interface Room {
  id: string;
  name: string;
  badge: string | null;
  image: string;
  alt: string;
  features: string[];
}

export const ROOMS: Room[] = [
  {
    id: 'four-bed-dorm',
    name: '4-Bed Mixed Dorm',
    badge: null,
    image: 'rooms/4-bed-dorm-1',
    alt: '4-bed mixed dorm room with orange bunk beds',
    features: ['Attached bathroom', 'AC & ceiling fan', 'Personal locker & reading light'],
  },
  {
    id: 'six-bed-dorm',
    name: '6-Bed Mixed Dorm',
    badge: 'Great for Groups',
    image: 'rooms/6-bed-dorm-1',
    alt: '6-bed mixed dorm room with multiple bunk beds',
    features: ['Attached bathroom', 'AC & ceiling fan', 'Personal locker & reading light'],
  },
  {
    id: 'vintage-room',
    name: 'Vintage Room (Private)',
    badge: null,
    image: 'rooms/vintage-room-1',
    alt: 'Vintage private room with hand-painted walls and a low platform bed',
    features: ['Private double bed', 'Hand-painted walls, ceiling fan', 'Shared bathroom'],
  },
];
