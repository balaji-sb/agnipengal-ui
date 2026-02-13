import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
       {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  async rewrites() {
    console.log("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
    return [
      {
        source: '/api/:path((?!auth).*)',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*` 
          : 'http://localhost:5002/api/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
