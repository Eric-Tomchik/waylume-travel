"use client";

import { useMemo, useState } from "react";
import type { Advisory, FeedItem } from "@/lib/travelFeeds";
import { timeAgo } from "@/lib/travelFeeds";

function LiveStamp({ label }: { label: string }) {
  return <div className="live" style={{ marginBottom: 16 }}><i />{label}</div>;
}

/** Live news grid with optional source filtering. */
export function WireGrid({ items, filters }: { items: FeedItem[]; filters: boolean }) {
  const [source, setSource] = useState<string | null>(null);

  const sources = useMemo(
    () => Array.from(new Set(items.map((item) => item.source))),
    [items],
  );
  const shown = source ? items.filter((item) => item.source === source) : items;

  return (
    <>
      <LiveStamp label="Live · updated hourly" />
      {filters && sources.length > 1 ? (
        <div className="chips" style={{ marginBottom: 22 }}>
          <button type="button" className="chip" aria-pressed={source === null} onClick={() => setSource(null)}>
            All sources
          </button>
          {sources.map((name) => (
            <button key={name} type="button" className="chip" aria-pressed={source === name}
              onClick={() => setSource(source === name ? null : name)}>
              {name}
            </button>
          ))}
        </div>
      ) : null}
      <div className="feed">
        {shown.map((item) => (
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

/** Searchable board of current State Department advisories. */
export function AdvisoryFilter({ advisories }: { advisories: Advisory[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<3 | 4 | null>(null);

  const shown = advisories.filter((advisory) => {
    if (level && advisory.level !== level) return false;
    return advisory.country.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <>
      <LiveStamp label="Live · from travel.state.gov" />
      <div className="filters" style={{ alignItems: "center" }}>
        <input
          className="search"
          type="search"
          value={query}
          placeholder="Search a country…"
          aria-label="Search advisories by country"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="chips">
          <button type="button" className="chip" aria-pressed={level === null} onClick={() => setLevel(null)}>All levels</button>
          <button type="button" className="chip" aria-pressed={level === 3} onClick={() => setLevel(level === 3 ? null : 3)}>Level 3</button>
          <button type="button" className="chip" aria-pressed={level === 4} onClick={() => setLevel(level === 4 ? null : 4)}>Level 4</button>
        </div>
        <div className="filter-count"><b>{shown.length}</b> listed</div>
      </div>
      {shown.length ? (
        <div className="adv">
          {shown.map((advisory) => (
            <a key={advisory.country} href={advisory.link} target="_blank" rel="noopener noreferrer">
              <span>{advisory.country}</span>
              <span className={`lvl l${advisory.level}`}>
                {advisory.level === 4 ? "Level 4 · Do not travel" : "Level 3 · Reconsider"}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className="empty">
          No Level 3 or 4 advisory matches “{query}” right now — which is usually good news.
        </div>
      )}
    </>
  );
}
