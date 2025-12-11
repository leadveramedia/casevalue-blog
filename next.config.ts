import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Configure basePath if deploying to a subdirectory
  // basePath: '/blog',
};

export default nextConfig;
