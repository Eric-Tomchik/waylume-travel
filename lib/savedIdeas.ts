export type SavedIdea = {
  id: string;
  kind: "destination" | "article" | "collection";
  title: string;
  description: string;
  href: string;
  destination?: string;
  savedAt: number;
};

export const SAVED_IDEAS_KEY = "waylume-saved-inspiration-v1";

export function readSavedIdeas(): SavedIdea[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_IDEAS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is SavedIdea => Boolean(item?.id && item?.title && item?.href)) : [];
  } catch {
    return [];
  }
}

export function writeSavedIdeas(items: SavedIdea[]) {
  window.localStorage.setItem(SAVED_IDEAS_KEY, JSON.stringify(items.slice(0, 60)));
  window.dispatchEvent(new CustomEvent("waylume:saved-ideas"));
}
