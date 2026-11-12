// ============================================================
// The amenities grid on the Home page. `icon` is the name of a
// Lucide icon (lucide.dev/icons), rendered by
// src/components/Amenities.astro.
// ============================================================

export type AmenityIcon =
  'bed' | 'wifi' | 'laundry' | 'cafe' | 'shower' | 'pets' | 'games' | 'upi' | 'parking' | 'water';

export interface Amenity {
  label: string;
  icon: AmenityIcon;
}

export const AMENITIES: Amenity[] = [
  { label: 'Comfy beds', icon: 'bed' },
  { label: 'Free Wi-Fi', icon: 'wifi' },
  { label: 'Laundry', icon: 'laundry' },
  { label: 'Cafe', icon: 'cafe' },
  { label: 'Showers', icon: 'shower' },
  { label: 'Pet friendly', icon: 'pets' },
  { label: 'Board games', icon: 'games' },
  { label: 'UPI payments', icon: 'upi' },
  { label: 'Parking', icon: 'parking' },
  { label: 'Water dispenser', icon: 'water' },
];
