// ============================================================
// Looks up a photo in src/assets/images by its short path, e.g.
//   await photo('rooms/4-bed-dorm-1')
// so data files and pages can name photos as plain strings.
//
// Astro then makes the resized/WebP versions at build time
// (see src/components/Photo.astro). A typo in a path stops the
// build with a clear error instead of shipping a broken image.
// ============================================================

import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

// Not loaded up front: only photos a page actually uses end up
// in the built site.
const allPhotos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}',
);

/**
 * Accepts the short form used in code ('rooms/4-bed-dorm-1') or
 * the form the /admin editor saves ('images/rooms/4-bed-dorm-1.jpg').
 */
function normalise(path: string): string {
  return path
    .replace(/^\/+/, '')
    .replace(/^images\//, '')
    .replace(/\.(jpe?g|png|webp)$/i, '');
}

export async function photo(path: string): Promise<ImageMetadata> {
  const wanted = normalise(path);
  const match = Object.entries(allPhotos).find(([file]) =>
    file.replace(/\.(jpe?g|png|webp)$/i, '').endsWith(`/images/${wanted}`),
  );
  if (!match) {
    throw new Error(`No photo found at src/assets/images/${wanted} (.jpg/.png/.webp)`);
  }
  const module = await match[1]();
  return module.default;
}

/**
 * URL of a single resized copy of a photo, for places that need
 * a plain URL rather than an <img>: CSS backgrounds and the
 * Open Graph preview image.
 */
export async function photoUrl(path: string, width = 1600): Promise<string> {
  const image = await getImage({ src: await photo(path), width, format: 'jpg' });
  return image.src;
}
