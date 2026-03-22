// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Optimize image caching - 30 days TTL
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Add caching headers for API routes
  async headers() {
    return [
      {
        // Cache static assets
        source: "/:all*(svg|jpg|png|webp|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // API routes - no cache by default, let individual routes control
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
