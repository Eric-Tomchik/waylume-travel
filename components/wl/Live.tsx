import { getAdvisories, getTravelNews, timeAgo } from "@/lib/travelFeeds";

function LiveStamp({ label }: { label: string }) {
  return (
    <div className="live" style={{ marginBottom: 16 }}>
      <i />
      {label}
    </div>
  );
}

/** Live headlines from the travel press. Renders nothing if every source is down. */
export async function NewsWire({ limit = 6 }: { limit?: number }) {
  const items = await getTravelNews(limit);
  if (!items.length) return null;

  return (
    <>
      <LiveStamp label="Live · updated hourly" />
      <div className="feed">
        {items.map((item) => (
          <a key={item.link} href={item.link} target="_blank" rel="noopener noreferrer">
            <span className="src">{item.source}</span>
            <h4>{item.title}</h4>
            {item.summary ? <p>{item.summary.slice(0, 150)}…</p> : null}
            <span className="when">{item.category} · {timeAgo(item.published)}</span>
          </a>
        ))}
      </div>
    </>
  );
}

/** Current U.S. State Department Level 3 / Level 4 advisories. */
export async function AdvisoryBoard() {
  const advisories = await getAdvisories();
  if (!advisories.length) return null;

  return (
    <>
      <LiveStamp label="Live · from travel.state.gov" />
      <div className="adv">
        {advisories.map((advisory) => (
          <a key={advisory.country} href={advisory.link} target="_blank" rel="noopener noreferrer">
            <span>{advisory.country}</span>
            <span className={`lvl l${advisory.level}`}>
              {advisory.level === 4 ? "Level 4 · Do not travel" : "Level 3 · Reconsider"}
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
