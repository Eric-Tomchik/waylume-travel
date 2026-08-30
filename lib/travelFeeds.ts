/**
 * Live travel-news and safety feeds.
 *
 * Server-side only. Everything is fetched with Next's data cache so the Worker
 * revalidates in the background instead of blocking a request, and every source
 * fails soft: a dead feed drops out of the grid rather than breaking the page.
 */

export type FeedItem = {
  title: string;
  link: string;
  summary: string;
  source: string;
  category: string;
  published: number | null;
};

export type Advisory = {
  country: string;
  level: 3 | 4;
  link: string;
};

type Source = { name: string; url: string; category: string };

const SOURCES: Source[] = [
  { name: "Condé Nast Traveler", url: "https://www.cntraveler.com/feed/rss", category: "Inspiration" },
  { name: "The New York Times · Travel", url: "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml", category: "Reporting" },
  { name: "Skift", url: "https://skift.com/feed/", category: "Industry" },
  { name: "Travel Off Path", url: "https://www.traveloffpath.com/feed/", category: "Entry rules" },
  { name: "Matador Network", url: "https://matadornetwork.com/feed/", category: "Destinations" },
  { name: "The Points Guy", url: "https://thepointsguy.com/feed/", category: "Points & miles" },
];

const ADVISORY_FEED = "https://travel.state.gov/_res/rss/TAsTWs.xml";
const REVALIDATE_NEWS = 3600; // 1 hour
const REVALIDATE_ADVISORIES = 21600; // 6 hours
const FETCH_TIMEOUT_MS = 8000;

function decode(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decode(match[1]) : "";
}

function link(block: string): string {
  const href = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  if (href) return href[1];
  return tag(block, "link");
}

async function fetchText(url: string, revalidate: number): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "WaylumeTravel/1.0 (+https://www.waylumetravel.com)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

function parseItems(xml: string, source: Source, limit: number): FeedItem[] {
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? [];
  return blocks.slice(0, limit).map((block) => {
    const summary = tag(block, "description") || tag(block, "summary") || tag(block, "content:encoded");
    const dateText = tag(block, "pubDate") || tag(block, "updated") || tag(block, "published");
    const parsed = dateText ? Date.parse(dateText) : NaN;
    return {
      title: tag(block, "title"),
      link: link(block),
      summary,
      source: source.name,
      category: source.category,
      published: Number.isNaN(parsed) ? null : parsed,
    };
  }).filter((item) => item.title && item.link);
}

/** Headlines from every working source, interleaved so no publisher dominates. */
export async function getTravelNews(limit = 12): Promise<FeedItem[]> {
  const results = await Promise.all(
    SOURCES.map(async (source) => {
      const xml = await fetchText(source.url, REVALIDATE_NEWS);
      return xml ? parseItems(xml, source, 6) : [];
    }),
  );

  const mixed: FeedItem[] = [];
  for (let rank = 0; mixed.length < limit && rank < 6; rank += 1) {
    for (const list of results) {
      if (list[rank]) mixed.push(list[rank]);
      if (mixed.length >= limit) break;
    }
  }
  return mixed;
}

/** Current U.S. State Department Level 3 and Level 4 travel advisories. */
export async function getAdvisories(limit = 8): Promise<Advisory[]> {
  const xml = await fetchText(ADVISORY_FEED, REVALIDATE_ADVISORIES);
  if (!xml) return [];

  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const advisories: Advisory[] = [];
  for (const block of blocks) {
    const title = tag(block, "title");
    const level = title.includes("Level 4") ? 4 : title.includes("Level 3") ? 3 : null;
    if (!level) continue;
    advisories.push({
      country: title.split(" - Level")[0].replace(/ Travel Advisory$/i, "").trim(),
      level,
      link: link(block),
    });
  }
  advisories.sort((a, b) => b.level - a.level);
  return advisories.slice(0, limit);
}

export function timeAgo(published: number | null): string {
  if (!published) return "recently";
  const hours = (Date.now() - published) / 36e5;
  if (hours < 1) return "just now";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}
