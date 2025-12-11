import { getAllPostSlugs } from '@/lib/sanity';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostSlugs();

  const blogUrls = posts.map((post) => ({
    url: `https://casevalue.law/blog/${post.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://casevalue.law/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
