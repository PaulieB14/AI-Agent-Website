// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable TypeScript path aliases
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
