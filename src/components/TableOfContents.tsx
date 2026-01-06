import { slugifyHeading } from './PortableTextComponents';
import type { PortableTextBlock } from '@portabletext/types';

interface TableOfContentsProps {
  body?: PortableTextBlock[];
}

interface HeadingItem {
  text: string;
  id: string;
  level: 'h2' | 'h3';
}

/**
 * Extract text from a Portable Text block's children
 */
function extractTextFromBlock(block: PortableTextBlock): string {
  if (!block.children) return '';

  return block.children
    .map((child) => {
      if (typeof child === 'object' && 'text' in child) {
        return child.text;
      }
      return '';
    })
    .join('');
}

/**
 * Extract headings from Portable Text body
 */
function extractHeadings(body?: PortableTextBlock[]): HeadingItem[] {
  if (!body) return [];

  const headings: HeadingItem[] = [];

  for (const block of body) {
    if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
      const text = extractTextFromBlock(block);
      if (text) {
        headings.push({
          text,
          id: slugifyHeading(text),
          level: block.style as 'h2' | 'h3',
        });
      }
    }
  }

  return headings;
}

export function TableOfContents({ body }: TableOfContentsProps) {
  const headings = extractHeadings(body);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-xl p-6 border border-card-border">
      <h4 className="text-sm font-bold text-text uppercase tracking-wider mb-4">
        On This Page
      </h4>
      <nav aria-label="Table of contents">
        <ul className="space-y-3 text-sm">
          {headings.map((heading, index) => (
            <li key={`${heading.id}-${index}`}>
              <a
                href={`#${heading.id}`}
                className={`text-text-muted hover:text-accent transition-colors flex items-start ${
                  heading.level === 'h3' ? 'pl-4' : ''
                }`}
              >
                <span className="mr-2 text-accent">•</span>
                <span className="line-clamp-2">{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
