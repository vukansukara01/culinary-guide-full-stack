import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lighthouse Best Practices — source maps for production bundles
  productionBrowserSourceMaps: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Manji set — Next neće generisati prevelike varijante
    deviceSizes: [320, 384, 640, 750, 828],
    imageSizes: [96, 128, 160, 256, 360],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9090",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9090",
      },
    ],
  },
};

export default nextConfig;
