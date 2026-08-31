import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The first deployment uses OpenNext's built-in cache. R2 can be added later
// if the site adopts ISR or a large Next.js data cache.
const config = defineCloudflareConfig({});

// `npm run build` now runs the OpenNext build (so Cloudflare Workers Builds
// produces .open-next/worker.js with the default build command). Point OpenNext
// at the plain Next.js build to avoid recursing into itself.
export default {
  ...config,
  buildCommand: "npm run build:next",
};
