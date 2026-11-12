// ============================================================
// Reads the published Gokarna Guide articles (src/content/guide)
// in display order, for the Guide page, the Home teaser and the
// "Related reads" links.
// ============================================================
import { getCollection, type CollectionEntry } from 'astro:content';

export type GuideArticle = CollectionEntry<'guide'>;

export async function getGuideArticles(): Promise<GuideArticle[]> {
  const articles = await getCollection('guide', ({ data }) => !data.draft);
  return articles.sort(
    (a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** The article's page, e.g. "guide-solo-travel-in-gokarna.html". */
export function articleHref(article: GuideArticle): string {
  return `${article.id}.html`;
}
