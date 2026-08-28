"use client";

import { useEffect, useState } from "react";

type Props = {
  className?: string;
  alt?: string;
  cropMark?: boolean;
};

export default function WaylumeLogo({ className = "", alt = "Waylume Travel", cropMark = false }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/waylume-logo.webp", { cache: "force-cache" })
      .then(response => response.text())
      .then(encoded => {
        const value = encoded.trim();
        if (!cancelled && value.startsWith("UklGR")) {
          setSrc(`data:image/webp;base64,${value}`);
        }
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  if (!src) {
    return <span className={className} aria-label={alt} role="img" />;
  }

  if (cropMark) {
    return (
      <span className={className} role="img" aria-label={alt} style={{ display: "inline-block", overflow: "hidden", position: "relative" }}>
        <img
          src={src}
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", width: "143%", maxWidth: "none", height: "auto", left: "-21.5%", top: "-14%" }}
        />
      </span>
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
