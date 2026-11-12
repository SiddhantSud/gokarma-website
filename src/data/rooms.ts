// ============================================================
// All room content lives here. Add, remove or edit a room in
// this array and it appears on rooms.html, the Home page
// teaser, the landing page and the booking form's room list.
//
// `image` is a path inside src/assets/images, without the
// file extension. `id` is used in book.html?room=<id>.
// ============================================================
// The list itself lives in rooms.json, which /admin edits.
// Edit it there (or in the JSON file); this file only adds types.
import data from './rooms.json';

export interface Room {
  id: string;
  name: string;
  badge: string | null;
  image: string;
  alt: string;
  features: string[];
}

export const ROOMS = data.rooms as Room[];
