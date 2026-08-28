import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The first deployment uses OpenNext's built-in cache. R2 can be added later
// if the site adopts ISR or a large Next.js data cache.
export default defineCloudflareConfig({});
