// ============================================================
// /admin/thumbs.json: a small preview (160px WebP) of every photo
// in src/assets/images, made when the site builds. The admin page
// uses these for its thumbnails instead of downloading the
// multi-megabyte originals. Keys look like "rooms/4-bed-dorm-1.jpg".
// ============================================================
import type { APIRoute, ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

const allPhotos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}',
);

export const GET: APIRoute = async () => {
  const thumbs: Record<string, string> = {};
  for (const [file, load] of Object.entries(allPhotos)) {
    const key = file.replace(/^\/src\/assets\/images\//, '');
    const image = await getImage({ src: (await load()).default, width: 160, format: 'webp' });
    thumbs[key] = image.src;
  }
  return new Response(JSON.stringify(thumbs), {
    headers: { 'Content-Type': 'application/json' },
  });
};
