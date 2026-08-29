"use client";

import { Bookmark, Check, Copy, Facebook, Linkedin, Mail, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { readSavedIdeas, SavedIdea, writeSavedIdeas } from "@/lib/savedIdeas";

type Props = Omit<SavedIdea, "savedAt"> & {
  compact?: boolean;
};

const SITE_ORIGIN = "https://www.waylumetravel.com";

export default function SaveShareActions({ id, kind, title, description, href, destination, compact = false }: Props) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = `${SITE_ORIGIN}${href.startsWith("/") ? href : `/${href}`}`;

  useEffect(() => {
    const refresh = () => setSaved(readSavedIdeas().some((item) => item.id === id));
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("waylume:saved-ideas", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("waylume:saved-ideas", refresh);
    };
  }, [id]);

  function toggleSave() {
    const current = readSavedIdeas();
    if (current.some((item) => item.id === id)) {
      writeSavedIdeas(current.filter((item) => item.id !== id));
      setSaved(false);
      return;
    }
    writeSavedIdeas([{ id, kind, title, description, href, destination, savedAt: Date.now() }, ...current]);
    setSaved(true);
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, text: description, url }).catch(() => undefined);
      return;
    }
    await copyLink();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — ${description}`);

  return (
    <div className={`save-share-actions${compact ? " compact" : ""}`}>
      <button type="button" className={saved ? "idea-action saved" : "idea-action"} onClick={toggleSave} aria-pressed={saved}>
        {saved ? <Check size={15} /> : <Bookmark size={15} />}{compact ? "" : saved ? "Saved" : "Save idea"}
      </button>
      <button type="button" className="idea-action native-share" onClick={() => void nativeShare()}>
        <Share2 size={15} />{compact ? "" : "Share"}
      </button>
      <details className="share-menu">
        <summary aria-label={`More ways to share ${title}`}>•••</summary>
        <div>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer"><Facebook size={15} /> Facebook</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noreferrer"><Share2 size={15} /> X / Twitter</a>
          <a href={`mailto:?subject=${encodeURIComponent(`Waylume inspiration: ${title}`)}&body=${encodedText}%0A%0A${encodedUrl}`}><Mail size={15} /> Email</a>
          <button type="button" onClick={() => void copyLink()}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy link"}</button>
        </div>
      </details>
    </div>
  );
}
