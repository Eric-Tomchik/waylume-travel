"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Shortlist — destinations the visitor hearts, kept in localStorage
 * and shared between components through a window event.
 * ------------------------------------------------------------------ */

const KEY = "waylume:shortlist";
const EVENT = "waylume:shortlist-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function write(items: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode — the tray simply won't persist */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useShortlist() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((name: string) => {
    const current = read();
    write(current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  }, []);

  const remove = useCallback((name: string) => write(read().filter((item) => item !== name)), []);
  const clear = useCallback(() => write([]), []);

  return { items, toggle, remove, clear };
}

export function HeartButton({ name }: { name: string }) {
  const { items, toggle } = useShortlist();
  const saved = items.includes(name);

  return (
    <button
      type="button"
      className="heart"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from your shortlist` : `Save ${name} to your shortlist`}
      title={saved ? "Saved to your shortlist" : "Save to your shortlist"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(name);
      }}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}

/** Floating tray that appears once something is shortlisted. */
export function ShortlistTray() {
  const { items, remove, clear } = useShortlist();
  if (!items.length) return null;

  const href = `/plan?destination=${encodeURIComponent(items.join(", "))}`;

  return (
    <aside className="tray" aria-label="Your shortlist">
      <h5>Your shortlist · {items.length}</h5>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span>{item}</span>
            <button type="button" onClick={() => remove(item)} aria-label={`Remove ${item}`}>×</button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <a className="btn sm" href={href}>Send these to Eric</a>
        <button type="button" className="chip" onClick={clear}>Clear</button>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ *
 * Motion helpers
 * ------------------------------------------------------------------ */

/** Fades content in as it scrolls into view. */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!element || shown) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px 0px -8% 0px" },
    );
    observer.observe(element);
    // Safety net: never leave content hidden if the observer misses (printing,
    // in-page search, screenshot tools, odd browsers).
    const failsafe = window.setTimeout(() => setShown(true), 2500);
    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [element, shown]);

  return (
    <div
      ref={setElement}
      className={`reveal${shown ? " in" : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** Thin aqua bar across the top showing reading progress. */
export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      setWidth(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className="progress" style={{ width: `${width}%` }} aria-hidden />;
}

/** Hero backdrop that drifts slightly with the scroll position. */
export function ParallaxBackdrop({ image }: { image: string }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () => setOffset(Math.min(window.scrollY * 0.25, 220));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="bg"
      style={{ backgroundImage: `url('${image}')`, transform: `translate3d(0, ${offset}px, 0)` }}
    />
  );
}

/** Numbers that count up the first time they scroll into view. */
export function Counter({ to, prefix = "", suffix = "", decimals = 0 }: {
  to: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const duration = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setValue(to * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, to]);

  return (
    <span className="counter" ref={setElement}>
      {prefix}
      {value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Click any photo to open it full screen. */
export function Lightbox({ src, caption, children }: { src: string; caption: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div role="button" tabIndex={0} style={{ cursor: "zoom-in" }}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => event.key === "Enter" && setOpen(true)}
      >
        {children}
      </div>
      {open ? (
        <div className="lightbox" role="dialog" aria-label={caption} onClick={() => setOpen(false)}>
          <figure style={{ margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={caption} />
            <figcaption>{caption} — press Esc or click anywhere to close</figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
