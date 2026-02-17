import { slugifyHeading } from './slugify';
import type { PortableTextBlock } from '@portabletext/types';

export interface ContentSection {
  /** The h2 heading's slug-id, or null for the preamble (blocks before the first h2) */
  headingId: string | null;
  /** The blocks belonging to this section (includes the h2 itself as the first block if headingId is set) */
  blocks: PortableTextBlock[];
}

/**
 * Extract plain text from a Portable Text block's children spans.
 */
function extractTextFromBlock(block: PortableTextBlock): string {
  if (!block.children) return '';
  return block.children
    .map((child) => ('text' in child ? (child.text as string) : ''))
    .join('');
}

/**
 * Group Portable Text blocks into sections based on h2 headings.
 * Content before the first h2 forms a "preamble" section with headingId: null.
 * Each h2 starts a new section that includes the h2 block and all subsequent
 * blocks until the next h2 or end of content.
 */
export function sectionizeBody(body: PortableTextBlock[]): ContentSection[] {
  if (!body || body.length === 0) return [];

  const sections: ContentSection[] = [];
  let currentSection: ContentSection = { headingId: null, blocks: [] };

  for (const block of body) {
    if (block._type === 'block' && block.style === 'h2') {
      // Save previous section if it has content
      if (currentSection.blocks.length > 0) {
        sections.push(currentSection);
      }
      // Start a new section with this h2
      const headingText = extractTextFromBlock(block);
      currentSection = {
        headingId: slugifyHeading(headingText),
        blocks: [block],
      };
    } else {
      currentSection.blocks.push(block);
    }
  }

  // Push the last section
  if (currentSection.blocks.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}
