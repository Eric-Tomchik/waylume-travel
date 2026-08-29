import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare serves these already-compressed local assets directly.
  // Avoid bundling the native Sharp runtime into the Worker.
  images: { unoptimized: true },
};

export default nextConfig;
