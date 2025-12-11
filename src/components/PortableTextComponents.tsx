import Image from 'next/image';
import { urlFor, generateSrcSet } from '@/lib/sanity';
import type { PortableTextComponents } from '@portabletext/react';

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
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-text mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-text mt-10 mb-3">{children}</h3>
    ),
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
    link: ({ children, value }) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:text-accent-hover underline font-semibold"
      >
        {children}
      </a>
    ),
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
