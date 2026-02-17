/**
 * Convert text to a URL-safe slug for heading IDs.
 * Used by PortableTextComponents, TableOfContents, and sectionize.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
