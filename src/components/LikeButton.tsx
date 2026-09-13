"use client";

import { useState } from "react";

function getLiked(): string[] {
  try {
    return JSON.parse(localStorage.getItem("cr7d_liked") ?? "[]");
  } catch {
    return [];
  }
}

function saveLiked(slug: string) {
  try {
    const list = getLiked();
    if (!list.includes(slug)) {
      localStorage.setItem("cr7d_liked", JSON.stringify([...list, slug]));
    }
  } catch {
    // modo privado: igual se muestra el corazón lleno esta vez
  }
}

/** Corazón con contador para cada producto. Un like por persona. */
export default function LikeButton({ slug, count }: { slug: string; count: number }) {
  const [liked, setLiked] = useState(() => getLiked().includes(slug));
  const [n, setN] = useState(count);
  const [busy, setBusy] = useState(false);

  async function like() {
    if (liked || busy) return;
    setBusy(true);
    setLiked(true);
    setN((v) => v + 1);
    saveLiked(slug);
    try {
      const r = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && typeof d.count === "number") setN(d.count);
    } catch {
      // se queda el conteo optimista
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={like}
      aria-label={liked ? "Te gusta este producto" : "Me gusta este producto"}
      aria-pressed={liked}
      className={`glass flex items-center gap-1.5 rounded-full px-3 py-2 shadow-card transition active:scale-90 ${
        liked ? "text-brand-600" : "text-cocoa-800/70 hover:text-brand-600"
      }`}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={liked ? "scale-110" : ""}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span className="text-[13px] font-bold tabular-nums">{n > 0 ? n : ""}</span>
    </button>
  );
}
