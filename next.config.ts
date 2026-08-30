import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake lucide-react and framer-motion — removes unused icons/features from bundle
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "react-markdown"],
  },

  images: {
    // Enable modern WebP/AVIF auto-conversion for all images
    formats: ["image/avif", "image/webp"],
    // Allow the pravatar CDN used in SocialProof avatars
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },

  // Brotli/gzip compress all responses
  compress: true,

  // Strip console.log in production builds
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default nextConfig;
