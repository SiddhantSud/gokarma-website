// ============================================================
// Every photo shown on gallery.html. The Home page teaser
// strip shows the first 4 entries, so lead with the strongest
// shots. To add a photo: drop the file into a folder under
// src/assets/images, then add one entry here. Astro makes the
// resized versions automatically when the site is built.
// ============================================================
// The list itself lives in gallery.json, which /admin edits.
// Edit it there (or in the JSON file); this file only adds types.
import data from './gallery.json';

export interface GalleryPhoto {
  image: string;
  alt: string;
  caption: string;
}

export const GALLERY_PHOTOS = data.photos as GalleryPhoto[];
