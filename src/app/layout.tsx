import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s - CaseValue.law',
    default: 'Legal Blog - CaseValue.law',
  },
  description: 'Expert insights on personal injury law, medical malpractice, motor vehicle accidents, and more.',
  metadataBase: new URL('https://casevalue.law'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
