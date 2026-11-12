// ============================================================
// Content collections: the Gokarma Guide articles, one Markdown
// file each in src/content/guide/. They can be written and
// edited from /admin, or by hand. The file name (without .md)
// becomes the page address, e.g. guide-solo-travel-in-gokarna
// → guide-solo-travel-in-gokarna.html.
//
// Fields are checked when the site builds: a missing title or a
// misspelt photo path stops the build with a clear message.
// ============================================================
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guide = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guide' }),
  schema: z.object({
    title: z.string(),
    /** Browser-tab / Google title. Default: "<title> | Aangan by Gokarma Living". */
    seoTitle: z.string().optional(),
    /** Google's description of the page. */
    description: z.string(),
    /** Small label above the title, e.g. "Solo Travel". */
    tag: z.string(),
    /** Line under the title. */
    subtitle: z.string().optional(),
    /** Short summary on the article's card. */
    excerpt: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    date: z.coerce.date(),
    /** Who wrote it; leave empty for articles by Aangan. */
    author: z.string().optional(),
    /** Lower numbers come first in the Guide list. */
    order: z.number().default(100),
    ctaTitle: z.string().optional(),
    ctaText: z.string().optional(),
    backdrop: z.string().optional(),
    relatedBackdrop: z.string().optional(),
    /** Drafts are saved but not published. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { guide };
