import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Load static assets from Vercel directly when proxied through Netlify
  // This ensures CSS/JS loads correctly when blog is accessed via casevalue.law/blog
  assetPrefix: 'https://casevalue-blog.vercel.app',

  // Allow external images from Sanity CDN and Unsplash
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
