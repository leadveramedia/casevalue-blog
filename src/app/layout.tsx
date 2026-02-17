import type { Metadata } from "next";
import { GTMScript } from "@/components/GTMScript";
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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="antialiased">
        <GTMScript />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N4D25ZFF"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
