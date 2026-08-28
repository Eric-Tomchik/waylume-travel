"use client";

import { useEffect, useState } from "react";

type Props = {
  className?: string;
  alt?: string;
  cropMark?: boolean;
};

const MARK_CHUNKS = Array.from({ length: 15 }, (_, index) =>
  `/brand/mark-${String(index).padStart(2, "0")}.b64`,
);

export default function WaylumeLogo({ className = "", alt = "Waylume Travel" }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      MARK_CHUNKS.map(async path => {
        const response = await fetch(path, { cache: "force-cache" });
        if (!response.ok) throw new Error(`Unable to load ${path}`);
        return (await response.text()).trim();
      }),
    )
      .then(parts => {
        const encoded = parts.join("");
        if (!cancelled && encoded.startsWith("UklGR") && encoded.length > 20000) {
          setSrc(`data:image/webp;base64,${encoded}`);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  if (!src) {
    return <span className={className} aria-label={alt} role="img" />;
  }

  return <img src={src} alt={alt} className={className} />;
}
