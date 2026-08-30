"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HeartButton } from "@/components/wl/Interactive";
import {
  DESTINATIONS, MONTH_LABELS, REGIONS, SEASONS, VIBES,
  type Season, type Vibe,
} from "@/lib/destinationFinder";

type Region = (typeof REGIONS)[number];

const SEASON_MONTHS: Record<Season, number[]> = {
  "Jan–Mar": [0, 1, 2],
  "Apr–Jun": [3, 4, 5],
  "Jul–Sep": [6, 7, 8],
  "Oct–Dec": [9, 10, 11],
};

function Seasonality({ months }: { months: (0 | 1 | 2)[] }) {
  return (
    <div>
      <div className="season" aria-hidden>
        {months.map((score, index) => (
          <span key={index} className={score === 2 ? "good" : score === 1 ? "ok" : ""} />
        ))}
      </div>
      <div className="season-key" aria-hidden>
        {MONTH_LABELS.map((label, index) => <span key={index}>{label}</span>)}
      </div>
      <span className="sr-only">
        Best months: {months.map((score, index) => (score === 2 ? MONTH_LABELS[index] : null)).filter(Boolean).join(", ")}
      </span>
    </div>
  );
}

/** Filterable destination grid — the "where should I go" tool. */
export default function DestinationFinder() {
  const [season, setSeason] = useState<Season | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  const results = useMemo(() => DESTINATIONS.filter((destination) => {
    if (season && !destination.seasons.includes(season)) return false;
    if (vibe && !destination.vibes.includes(vibe)) return false;
    if (region && destination.region !== region) return false;
    return true;
  }), [season, vibe, region]);

  const active = season || vibe || region;

  function bestMonths(months: (0 | 1 | 2)[]) {
    const picked = season ? SEASON_MONTHS[season] : months.map((_, index) => index);
    const prime = picked.filter((index) => months[index] === 2).map((index) => MONTH_LABELS[index]);
    return prime.length ? `Prime: ${prime.join(" · ")}` : "Ask me about timing";
  }

  return (
    <>
      <div className="filters">
        <div className="filter-group">
          <span>When could you go?</span>
          <div className="chips">
            {SEASONS.map((option) => (
              <button key={option} type="button" className="chip" aria-pressed={season === option}
                onClick={() => setSeason(season === option ? null : option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span>What kind of trip?</span>
          <div className="chips">
            {VIBES.map((option) => (
              <button key={option} type="button" className="chip" aria-pressed={vibe === option}
                onClick={() => setVibe(vibe === option ? null : option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span>Where in the world?</span>
          <div className="chips">
            {REGIONS.map((option) => (
              <button key={option} type="button" className="chip" aria-pressed={region === option}
                onClick={() => setRegion(region === option ? null : option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-count">
          <b>{results.length}</b> {results.length === 1 ? "match" : "matches"}
          {active ? (
            <>
              {" · "}
              <button type="button" className="chip" style={{ padding: "5px 12px" }}
                onClick={() => { setSeason(null); setVibe(null); setRegion(null); }}>
                Reset
              </button>
            </>
          ) : null}
        </div>
      </div>

      {results.length ? (
        <div className="grid g3">
          {results.map((destination) => (
            <div className="card" key={destination.name}>
              <HeartButton name={destination.name} />
              <Link href={`/plan?destination=${encodeURIComponent(destination.name)}`} style={{ display: "contents" }}>
                <div className="ph" style={{ backgroundImage: `url('/photos/${destination.slot}.webp')` }}>
                  <span className="tag">{destination.region}</span>
                </div>
                <div className="bd">
                  <h3>{destination.name}</h3>
                  <p>{destination.blurb}</p>
                  <p style={{ color: "var(--foam)", fontSize: 13 }}>{destination.note}</p>
                  <Seasonality months={destination.months} />
                  <div className="meta">
                    <span>{bestMonths(destination.months)}</span>
                    <b>Ask about this →</b>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          Nothing matches that exact combination — but that doesn&apos;t mean it can&apos;t be done.{" "}
          <Link href="/plan" style={{ color: "var(--aqua)", textDecoration: "underline" }}>Tell me what you have in mind</Link>{" "}
          and I&apos;ll find it.
        </div>
      )}
    </>
  );
}
