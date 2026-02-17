import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import { getAllPosts, urlFor } from '@/lib/sanity';
import { CategoryFilter } from '@/components/CategoryFilter';
import type { Metadata } from 'next';

// Number of posts to show on the index page (reduces HTML size)
const POSTS_PER_PAGE = 24;

export const metadata: Metadata = {
  title: 'Legal Blog',
  description: 'Expert insights on personal injury law, medical malpractice, motor vehicle accidents, and more. Learn about your legal rights and case values.',
  keywords: ['legal blog', 'personal injury law', 'texas law', 'case value', 'statute of limitations'],
  alternates: {
    canonical: 'https://casevalue.law/blog',
  },
  openGraph: {
    title: 'Legal Blog - CaseValue.law',
    description: 'Expert insights on personal injury law, medical malpractice, motor vehicle accidents, and more.',
    url: 'https://casevalue.law/blog',
    type: 'website',
  },
};

// Revalidate every hour
export const revalidate = 3600;

function formatCategory(category: string): string {
  return category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function BlogPage() {
  const posts = await getAllPosts(POSTS_PER_PAGE);

  // Get unique categories from all posts
  const categories = ['all', ...new Set(posts.flatMap(post => post.categories || []))];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-text mb-4">
            Legal <span className="text-transparent bg-clip-text bg-gradient-gold">Insights</span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Understand your rights, learn what affects case value, and make informed decisions about your legal situation.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              No signup required
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-green-500" />
              Confidential
            </span>
          </div>
        </div>

        {/* Category Filter - Client Component */}
        {categories.length > 1 && (
          <CategoryFilter categories={categories} />
        )}

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="posts-grid">
            {posts.map((post, index) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group block bg-card rounded-3xl overflow-hidden border-2 border-card-border hover:border-accent/50 transition-all duration-300 shadow-card hover:shadow-glow-gold-soft hover:scale-[1.02]"
                data-categories={post.categories?.join(',') || ''}
              >
                {/* Post Image */}
                {post.mainImage && (
                  <div className="aspect-video overflow-hidden bg-primary relative">
                    <Image
                      src={urlFor(post.mainImage).width(600).height(338).format('webp').url()}
                      alt={post.imageAlt || post.title}
                      width={600}
                      height={338}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : undefined}
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.slice(0, 2).map(category => (
                        <span
                          key={category}
                          className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-semibold"
                        >
                          {formatCategory(category)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-text mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-text-muted mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-text-muted border-t border-card-border pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-card backdrop-blur-xl border-2 border-card-border rounded-3xl p-8 shadow-card">
              <p className="text-text text-lg mb-2">No blog posts found</p>
              <p className="text-text-muted">Check back soon for new content!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
