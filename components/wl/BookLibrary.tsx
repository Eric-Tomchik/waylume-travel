"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BOOKS, BOOK_CATEGORIES, amazonLink, type Book } from "@/lib/books";

const FILTERS = ["All", ...BOOK_CATEGORIES] as const;

function matches(book: Book, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    book.title.toLowerCase().includes(q) ||
    book.author.toLowerCase().includes(q) ||
    book.note.toLowerCase().includes(q) ||
    book.category.toLowerCase().includes(q)
  );
}

export default function BookLibrary() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const shown = useMemo(
    () =>
      BOOKS.filter(
        (book) => (filter === "All" || book.category === filter) && matches(book, query),
      ),
    [filter, query],
  );

  return (
    <div className="lib">
      <div className="lib-controls">
        <div className="lib-chips" role="tablist" aria-label="Filter by category">
          {FILTERS.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={filter === name}
              className={`lib-chip${filter === name ? " on" : ""}`}
              onClick={() => setFilter(name)}
            >
              {name}
              <span className="n">
                {name === "All" ? BOOKS.length : BOOKS.filter((b) => b.category === name).length}
              </span>
            </button>
          ))}
        </div>
        <label className="lib-search">
          <span className="sr-only">Search the library</span>
          <input
            type="search"
            value={query}
            placeholder="Search a title, author or mood…"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <p className="lib-count" aria-live="polite">
        Showing {shown.length} of {BOOKS.length} books
      </p>

      {shown.length === 0 ? (
        <p className="lib-empty">
          Nothing matches that yet — try a country, an author, or clear the search.
        </p>
      ) : (
        <div className="lib-grid">
          {shown.map((book) => (
            <a
              key={book.slug}
              className="lib-card"
              href={amazonLink(book)}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
            >
              <span className="lib-cover">
                <Image
                  src={book.cover}
                  alt={`${book.title} — book cover`}
                  width={420}
                  height={640}
                  sizes="(max-width: 700px) 45vw, 220px"
                />
              </span>
              <span className="lib-body">
                <span className="lib-cat">{book.category}</span>
                <span className="lib-title">{book.title}</span>
                <span className="lib-author">{book.author}</span>
                <span className="lib-note">{book.note}</span>
                <span className="lib-buy">View on Amazon →</span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
