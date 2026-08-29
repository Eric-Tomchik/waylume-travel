"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { readSavedIdeas } from "@/lib/savedIdeas";

export default function SavedIdeasLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(readSavedIdeas().length);
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("waylume:saved-ideas", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("waylume:saved-ideas", refresh);
    };
  }, []);

  return (
    <Link className="saved-link" href="/saved" aria-label={`${count} saved travel ideas`}>
      <Bookmark size={16} /> Saved{count > 0 && <span>{count}</span>}
    </Link>
  );
}
