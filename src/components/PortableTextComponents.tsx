import Image from 'next/image';
import { urlFor, generateSrcSet } from '@/lib/sanity';
import type { PortableTextComponents } from '@portabletext/react';

/**
 * Convert text to a URL-safe slug for heading IDs
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Extract text content from React children (handles nested elements)
 */
function getTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    const element = children as { props: { children?: React.ReactNode } };
    return getTextFromChildren(element.props.children);
  }
  return '';
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <Image
          src={urlFor(value).width(1000).format('webp').url()}
          alt={value.alt || ''}
          width={1000}
          height={563}
          className="w-full rounded-xl"
          loading="lazy"
        />
        {value.caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-400 italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h2: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = slugifyHeading(text);
      return (
        <h2 id={id} className="text-3xl font-bold text-text mt-12 mb-4 scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = getTextFromChildren(children);
      const id = slugifyHeading(text);
      return (
        <h3 id={id} className="text-2xl font-bold text-text mt-10 mb-3 scroll-mt-24">
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-text mt-8 mb-3">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-6 my-6 italic text-text-muted bg-card/50 py-4 rounded-r-xl backdrop-blur-xl">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-text-muted leading-relaxed mb-6">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const isInternal = value.href?.startsWith('/') || value.href?.includes('casevalue.law');
      return (
        <a
          href={value.href}
          target={isInternal ? '_self' : '_blank'}
          rel={isInternal ? undefined : 'noopener noreferrer'}
          className="text-accent hover:text-accent-hover underline font-semibold"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-bold text-text">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-card text-accent px-2 py-1 rounded text-sm font-mono border border-card-border">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-text-muted ml-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-text-muted ml-4">
        {children}
      </ol>
    ),
  },
};
