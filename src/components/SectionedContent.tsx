import { PortableText } from '@portabletext/react';
import { portableTextComponents } from './PortableTextComponents';
import { sectionizeBody } from '@/lib/sectionize';
import type { PortableTextBlock } from '@portabletext/types';

interface SectionedContentProps {
  body: PortableTextBlock[];
}

export function SectionedContent({ body }: SectionedContentProps) {
  const sections = sectionizeBody(body);

  return (
    <>
      {sections.map((section, index) => {
        if (section.headingId === null) {
          // Preamble: content before the first h2
          return (
            <div key={`preamble-${index}`}>
              <PortableText value={section.blocks} components={portableTextComponents} />
            </div>
          );
        }

        return (
          <section key={section.headingId} aria-labelledby={section.headingId}>
            <PortableText value={section.blocks} components={portableTextComponents} />
          </section>
        );
      })}
    </>
  );
}
