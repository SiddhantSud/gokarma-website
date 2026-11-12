// ============================================================
// Guest quotes for "What our guests say" on the Home page.
// Every quote is copied word for word from a public review
// (trimmed with "…" where shortened). Never write or reword a
// quote. Add new ones the same way, with the date you copied it.
//
// Google quotes copied from the Google Maps listing on 2026-11-12;
// the Booking.com and Hostelworld quotes were on the site before.
// ============================================================
// The list itself lives in reviews.json, which /admin edits.
// Edit it there (or in the JSON file); this file only adds types.
import data from './reviews.json';

export interface Review {
  quote: string;
  name: string;
  source: 'Google' | 'Booking.com' | 'Hostelworld';
}

export const REVIEWS = data.reviews as Review[];
