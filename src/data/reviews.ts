// ============================================================
// Guest quotes for "What our guests say" on the Home page.
// Every quote is copied word for word from a public review
// (trimmed with "…" where shortened). Never write or reword a
// quote. Add new ones the same way, with the date you copied it.
//
// Google quotes copied from the Google Maps listing on 2026-11-12;
// the Booking.com and Hostelworld quotes were on the site before.
// ============================================================

export interface Review {
  quote: string;
  name: string;
  source: 'Google' | 'Booking.com' | 'Hostelworld';
}

export const REVIEWS: Review[] = [
  {
    quote:
      "This place gives you that rare homely vibe which you don't find in hotels anymore. … The hospitality by Geetika and Kushal is genuinely heartfelt, not formal.",
    name: 'Sanket S.',
    source: 'Google',
  },
  {
    quote:
      'This place made my first solo trip truly unforgettable. Surrounded by nature, with a calm and peaceful atmosphere, it felt like a little home away from home rather than just a hostel.',
    name: 'Divyadharshini A.',
    source: 'Google',
  },
  {
    quote:
      'The food was SO good... including their cinnamon coffee which I had 6 times in 30 hours, which probably says enough :P',
    name: 'Batul H.',
    source: 'Google',
  },
  {
    quote:
      'Their super friendly dogs and cats roaming around. They are so human-friendly, it just adds that final homely touch.',
    name: 'Sanket S.',
    source: 'Google',
  },
  {
    quote:
      'The chicken gokarma and dal tadka were both packed with flavor, and the dosas were crispy and perfectly made.',
    name: 'Vaibhav S.',
    source: 'Google',
  },
  {
    quote: 'Warm hosts who make you feel like you belong the moment you walk in.',
    name: 'Pravin',
    source: 'Booking.com',
  },
  {
    quote:
      "Kushal and Geet have gone from being great hosts to great friends. There's magic in this space.",
    name: 'Shruthi',
    source: 'Hostelworld',
  },
  {
    quote: 'Super chill place with zero formalities, just good energy all around.',
    name: 'Jyothsna',
    source: 'Google',
  },
];
