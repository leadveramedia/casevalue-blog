import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import {
  getPostBySlug,
  getAllPostSlugs,
  getRecentPosts,
  getRelatedPosts,
  urlFor,
} from '@/lib/sanity';
import { portableTextComponents } from '@/components/PortableTextComponents';
import { CaseWorthCard } from '@/components/CaseWorthCard';
import { TableOfContents } from '@/components/TableOfContents';
import { InlineCTA } from '@/components/InlineCTA';
import { getQuestionnaireUrl, getCategoryDisplayName } from '@/lib/questionnaires';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/types';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords,
    alternates: {
      canonical: `https://casevalue.law/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://casevalue.law/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).url()] : [],
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

function formatCategory(category: string): string {
  return category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Split body content to insert CTA after the 2nd paragraph
 */
function splitBodyForCTA(body?: PortableTextBlock[]): {
  beforeCTA: PortableTextBlock[];
  afterCTA: PortableTextBlock[];
} {
  if (!body || body.length === 0) {
    return { beforeCTA: [], afterCTA: [] };
  }

  // Find the index after the 2nd paragraph (normal block)
  let paragraphCount = 0;
  let splitIndex = 0;

  for (let i = 0; i < body.length; i++) {
    const block = body[i];
    if (block._type === 'block' && block.style === 'normal') {
      paragraphCount++;
      if (paragraphCount === 2) {
        splitIndex = i + 1;
        break;
      }
    }
  }

  // If we didn't find 2 paragraphs, put CTA after first content block
  if (splitIndex === 0 && body.length > 0) {
    splitIndex = Math.min(1, body.length);
  }

  return {
    beforeCTA: body.slice(0, splitIndex),
    afterCTA: body.slice(splitIndex),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch related and recent posts in parallel
  const [relatedPosts, recentPosts] = await Promise.all([
    getRelatedPosts(slug, post.categories || [], 4),
    getRecentPosts(6),
  ]);

  // Filter out current post from recent posts
  const filteredRecentPosts = recentPosts
    .filter(p => p.slug.current !== slug)
    .slice(0, 5);

  // Get questionnaire URL and category display name for CTAs
  const questionnaireUrl = getQuestionnaireUrl(post.categories);
  const categoryDisplayName = getCategoryDisplayName(post.categories);

  // Split body content for inline CTA insertion
  const { beforeCTA, afterCTA } = splitBodyForCTA(post.body);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://casevalue.law',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://casevalue.law/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://casevalue.law/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-hero">
        {/* Back to Blog Link */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Container */}
        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6" aria-label="Breadcrumb">
            <Link href="https://casevalue.law" className="hover:text-text transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-text truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Hero Image */}
          {post.mainImage && (
            <div className="aspect-video overflow-hidden rounded-3xl mb-8 shadow-card border-2 border-card-border relative">
              <Image
                src={urlFor(post.mainImage).width(1000).height(563).format('webp').url()}
                alt={post.imageAlt || post.title}
                width={1000}
                height={563}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map(category => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-accent/20 text-accent rounded-full border border-accent/30 font-semibold"
                >
                  <Tag className="w-3 h-3" />
                  {formatCategory(category)}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-text-muted mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-text-muted pb-8 mb-8 border-b border-card-border">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>
          </div>

          {/* Two-column layout for article body + sidebar */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-8">
              {/* Article Body - Before CTA */}
              <div className="prose prose-invert prose-lg max-w-none">
                {beforeCTA.length > 0 && (
                  <PortableText
                    value={beforeCTA}
                    components={portableTextComponents}
                  />
                )}
              </div>

              {/* Inline CTA */}
              <InlineCTA
                questionnaireUrl={questionnaireUrl}
                categoryName={categoryDisplayName}
              />

              {/* Article Body - After CTA */}
              <div className="prose prose-invert prose-lg max-w-none">
                {afterCTA.length > 0 && (
                  <PortableText
                    value={afterCTA}
                    components={portableTextComponents}
                  />
                )}
              </div>

              {/* Disclaimer */}
              <div className="mt-12 p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
                <p className="text-sm text-yellow-200/90">
                  <strong>Disclaimer:</strong> This blog post is for informational purposes only and does not constitute legal advice.
                  For specific legal guidance regarding your situation, please consult with a qualified attorney.
                </p>
              </div>
            </div>

            {/* Sidebar Column - Hidden on mobile */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Case Worth Card */}
                <CaseWorthCard questionnaireUrl={questionnaireUrl} />

                {/* Table of Contents */}
                <TableOfContents body={post.body} />
              </div>
            </aside>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-card-border">
            <h2 className="text-3xl font-bold text-text mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost.slug.current}`}
                  className="group bg-card backdrop-blur-3xl rounded-xl overflow-hidden border-2 border-card-border hover:border-accent/50 transition-all duration-300 shadow-card hover:shadow-glow-gold-soft"
                >
                  {relatedPost.mainImage && (
                    <div className="aspect-video overflow-hidden bg-primary relative">
                      <Image
                        src={urlFor(relatedPost.mainImage).width(600).height(338).format('webp').url()}
                        alt={relatedPost.imageAlt || relatedPost.title}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-text mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Previous Posts */}
        {filteredRecentPosts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-card-border">
            <h2 className="text-3xl font-bold text-text mb-8">Previous Posts</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredRecentPosts.map(recentPost => (
                <Link
                  key={recentPost._id}
                  href={`/blog/${recentPost.slug.current}`}
                  className="group bg-card backdrop-blur-3xl rounded-xl overflow-hidden border-2 border-card-border hover:border-accent/50 transition-all duration-300 shadow-card hover:shadow-glow-gold-soft"
                >
                  {recentPost.mainImage && (
                    <div className="aspect-video overflow-hidden bg-primary relative">
                      <Image
                        src={urlFor(recentPost.mainImage).width(300).height(169).format('webp').url()}
                        alt={recentPost.imageAlt || recentPost.title}
                        width={300}
                        height={169}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-text mb-1 group-hover:text-accent transition-colors line-clamp-2">
                      {recentPost.title}
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-2">
                      {recentPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
