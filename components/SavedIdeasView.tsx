"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Copy, Mail, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { readSavedIdeas, SavedIdea, writeSavedIdeas } from "@/lib/savedIdeas";

export default function SavedIdeasView() {
  const [items, setItems] = useState<SavedIdea[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setItems(readSavedIdeas());
    setHydrated(true);
  }, []);

  const boardText = useMemo(() => items.map((item) => `• ${item.title}: https://www.waylumetravel.com${item.href}`).join("\n"), [items]);

  function remove(id: string) {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    writeSavedIdeas(next);
  }

  async function copyBoard() {
    await navigator.clipboard.writeText(`My Waylume Travel inspiration\n\n${boardText}`).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (!hydrated) return <div className="saved-loading">Opening your inspiration board…</div>;

  if (items.length === 0) {
    return (
      <div className="saved-empty">
        <span><Bookmark size={28} /></span>
        <h2>Your inspiration board is ready for ideas.</h2>
        <p>Save destinations, planning guides, and trip styles as you browse. They will collect here on this device.</p>
        <Link className="button" href="/destinations">Explore destinations <ArrowRight size={17} /></Link>
      </div>
    );
  }

  return (
    <div className="saved-board">
      <div className="saved-toolbar">
        <p><strong>{items.length}</strong> saved {items.length === 1 ? "idea" : "ideas"} on this device</p>
        <div>
          <button className="ghost" type="button" onClick={() => void copyBoard()}><Copy size={15} /> {copied ? "Copied" : "Copy board"}</button>
          <a className="ghost" href={`mailto:?subject=${encodeURIComponent("My Waylume Travel inspiration")}&body=${encodeURIComponent(`Here are the ideas I saved with Waylume:\n\n${boardText}`)}`}><Mail size={15} /> Email board</a>
        </div>
      </div>
      <div className="saved-grid">
        {items.map((item) => (
          <article key={item.id}>
            <div><small>{item.kind}</small><h2><Link href={item.href}>{item.title}</Link></h2><p>{item.description}</p></div>
            <div className="saved-card-actions">
              <Link href={item.href}>Open idea <ArrowRight size={15} /></Link>
              <button type="button" onClick={() => remove(item.id)} aria-label={`Remove ${item.title}`}><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
      </div>
      <aside className="saved-plan-card">
        <Sparkles size={22} />
        <div><strong>Turn the collection into one clear trip.</strong><p>Share what you saved with Waylume AI, refine the direction, and send the finished brief for current supplier research.</p></div>
        <Link className="button" href="/concierge">Build with Waylume AI <ArrowRight size={16} /></Link>
      </aside>
    </div>
  );
}
