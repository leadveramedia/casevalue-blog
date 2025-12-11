import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

// Types
export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  mainImage?: SanityImageSource;
  author: string;
  categories?: string[];
  featured?: boolean;
  imageAlt?: string;
  body?: PortableTextBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

// Create and configure the Sanity client
export const client = createClient({
  projectId: 's8mux3ix',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Helper function to generate optimized image URLs
const builder = createImageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => {
  const imageBuilder = builder.image(source);

  // Override url() to add WebP format for Unsplash images
  const originalUrl = imageBuilder.url.bind(imageBuilder);
  imageBuilder.url = function() {
    let url = originalUrl();
    if (url.includes('images.unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}fm=webp&q=80`;
    }
    return url;
  };

  return imageBuilder;
};

/**
 * Generate responsive image srcset for different viewport sizes
 */
export const generateSrcSet = (
  source: SanityImageSource,
  widths: number[] = [400, 600, 800, 1200],
  aspectRatio: number | null = null
): string => {
  return widths
    .map((width) => {
      let imageBuilder = urlFor(source).width(width).format('webp');
      if (aspectRatio) {
        const height = Math.round(width * aspectRatio);
        imageBuilder = imageBuilder.height(height);
      }
      return `${imageBuilder.url()} ${width}w`;
    })
    .join(', ');
};

// Queries

/**
 * Fetch all published blog posts, ordered by publish date (newest first)
 */
export const getAllPosts = async (): Promise<BlogPost[]> => {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author,
    categories,
    featured,
    "imageAlt": mainImage.alt
  }`;

  return await client.fetch(query);
};

/**
 * Fetch a single blog post by slug
 */
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    mainImage,
    publishedAt,
    author,
    categories,
    excerpt,
    seo,
    "imageAlt": mainImage.alt
  }`;

  return await client.fetch(query, { slug });
};

/**
 * Fetch all post slugs for static generation
 */
export const getAllPostSlugs = async (): Promise<{ slug: { current: string } }[]> => {
  const query = `*[_type == "blogPost"] { slug }`;
  return await client.fetch(query);
};

/**
 * Fetch recent posts (limit to specified number)
 */
export const getRecentPosts = async (limit: number = 5): Promise<BlogPost[]> => {
  const query = `*[_type == "blogPost"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author,
    "imageAlt": mainImage.alt
  }`;

  return await client.fetch(query);
};

/**
 * Fetch related posts by category
 */
export const getRelatedPosts = async (
  currentSlug: string,
  categories: string[] = [],
  limit: number = 4
): Promise<BlogPost[]> => {
  if (!categories || categories.length === 0) {
    const posts = await getRecentPosts(limit + 1);
    return posts.filter(p => p.slug.current !== currentSlug).slice(0, limit);
  }

  const query = `*[_type == "blogPost" && count((categories)[@ in $categories]) > 0 && slug.current != $currentSlug] | order(publishedAt desc)[0...${limit * 2}] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author,
    categories,
    "imageAlt": mainImage.alt,
    "matchScore": count((categories)[@ in $categories])
  } | order(matchScore desc, publishedAt desc)[0...${limit}]`;

  const posts = await client.fetch(query, { categories, currentSlug });

  if (!posts || posts.length === 0) {
    const recentPosts = await getRecentPosts(limit + 1);
    return recentPosts.filter(p => p.slug.current !== currentSlug).slice(0, limit);
  }

  return posts;
};
