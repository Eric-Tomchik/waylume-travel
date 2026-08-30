import { getAdvisories, getTravelNews } from "@/lib/travelFeeds";
import { AdvisoryFilter, WireGrid } from "@/components/wl/LiveClient";

/** Live headlines from the travel press. Renders nothing if every source is down. */
export async function NewsWire({ limit = 6, filters = false }: { limit?: number; filters?: boolean }) {
  const items = await getTravelNews(limit);
  if (!items.length) return null;
  return <WireGrid items={items} filters={filters} />;
}

/** Current U.S. State Department Level 3 / Level 4 advisories. */
export async function AdvisoryBoard() {
  const advisories = await getAdvisories(24);
  if (!advisories.length) return null;
  return <AdvisoryFilter advisories={advisories} />;
}
