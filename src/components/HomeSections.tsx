"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { productLink } from "@/lib/whatsapp";
import Reveal from "./Reveal";
import LikeButton from "./LikeButton";

export function formatPrice(v: number | null): string {
  if (v == null) return "";
  return "$" + v.toLocaleString("es-MX");
}

/* ---------- Cinta marquesina ---------- */
export function Marquee() {
  const items = ["100% artesanal", "Ingredientes naturales", "Cutis Radiante 7D", "Piel luminosa"];
  const row = [...items, ...items, ...items];
  return (
    <div aria-hidden className="overflow-hidden border-y border-white/50 bg-white/50 py-3 backdrop-blur-xl">
      <div className="marquee-track gap-8">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-8">
            {row.map((t, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-8 whitespace-nowrap text-[12.5px] font-bold uppercase tracking-[0.24em] text-brand-600/80">
                {t} <span className="text-brand-300">💗</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Catálogo: todos los productos con el mismo diseño ---------- */
export function Catalogo({
  products,
  waNumber,
  waMessage,
  likes,
}: {
  products: Product[];
  waNumber: string;
  waMessage: string;
  likes: Record<string, number>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [index, setIndex] = useState(0);
  const total = products.length;

  function cardStep(): number {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    return (first?.offsetWidth ?? 340) + 20;
  }

  function updateIndex() {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.min(total - 1, Math.max(0, Math.round(track.scrollLeft / cardStep()))));
  }

  function go(dir: 1 | -1) {
    touched.current = true;
    trackRef.current?.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
  }

  // Avance automático hasta que la persona toca el carrusel.
  // Así se descubre que hay más productos sin adivinar el gesto.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stop = () => {
      touched.current = true;
    };
    const track = trackRef.current;
    track?.addEventListener("pointerdown", stop, { passive: true });
    track?.addEventListener("wheel", stop, { passive: true });
    const id = window.setInterval(() => {
      if (touched.current || document.hidden) return;
      const t = trackRef.current;
      if (!t) return;
      const step = cardStep();
      const last = Math.round(t.scrollLeft / step) >= total - 1;
      t.scrollTo({ left: last ? 0 : t.scrollLeft + step, behavior: "smooth" });
    }, 3800);
    return () => {
      window.clearInterval(id);
      track?.removeEventListener("pointerdown", stop);
      track?.removeEventListener("wheel", stop);
    };
  }, [total]);

  return (
    <section id="productos" className="mx-auto max-w-6xl px-5 py-12 md:py-16 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Nuestros productos</p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-[40px]">
          Elige tu favorito 💗
        </h2>
      </Reveal>

      <div className="relative">
        <div
          id="pista-productos"
          ref={trackRef}
          onScroll={updateIndex}
          className="no-scrollbar -mx-5 mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [mask-image:linear-gradient(to_right,#000_88%,transparent_100%)] lg:mx-0 lg:px-1"
        >
          {products.map((p, i) => {
            const grams = p.details.find(
              (d) => d.label.toLowerCase().includes("contenido") || d.label.toLowerCase().includes("presentación")
            )?.value;
            return (
              <Reveal
                key={p.slug}
                delay={Math.min(i, 2) * 80}
                className="w-[80vw] max-w-[340px] shrink-0 snap-center sm:w-[340px]"
              >
                <article data-buy={p.slug} className="card flex h-full flex-col overflow-hidden">
                  {p.main_image && (
                    <div className="photo-frame m-3 mb-0 aspect-square select-none !rounded-3xl bg-blush-50 ring-1 ring-white/70">
                      <Image
                        src={p.main_image}
                        alt={p.name}
                        fill
                        sizes="340px"
                        className="pointer-events-none object-contain"
                        loading="lazy"
                        draggable={false}
                      />
                      {grams && (
                        <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-cocoa-900">
                          {grams}
                        </span>
                      )}
                      <span className="absolute right-3 top-3">
                        <LikeButton slug={p.slug} count={likes[p.slug] ?? 0} />
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-brand-500">
                      {p.subtitle}
                    </p>
                    <h3 className="mt-1.5 font-serif text-[22px] font-bold leading-snug text-cocoa-900">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-cocoa-800/75">
                      {p.description}
                    </p>

                    {p.includes.length > 0 && (
                      <ul className="mt-3 space-y-1.5 rounded-2xl bg-brand-50/70 p-4">
                        {p.includes.map((inc) => (
                          <li key={inc} className="text-[13.5px] font-medium text-cocoa-900/85">
                            {inc}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mb-4 mt-4 flex items-end justify-between gap-3 border-t border-blush-100 pt-4">
                      <div>
                        {p.price != null && (
                          <p className="font-serif text-[26px] font-bold leading-none text-cocoa-900">
                            {formatPrice(p.price)}{" "}
                            <span className="font-sans text-[15px] font-semibold text-cocoa-800/60">
                              pesos
                            </span>
                          </p>
                        )}
                        <p className="mt-1 text-xs text-cocoa-800/55">
                          📦 El envío se paga por separado
                        </p>
                      </div>
                    </div>

                    <a
                      href={productLink(p, waNumber, waMessage)}
                      target="_blank"
                      rel="noopener"
                      className="btn-primary mt-auto w-full !px-5 !py-3.5 !text-[15px]"
                    >
                      {p.cta_label || "Mándame mensaje"}
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="glass flex items-center gap-2.5 rounded-full px-4 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden>
              {products.map((p, d) => (
                <span
                  key={p.slug}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    d === index ? "w-5 bg-brand-500" : "w-1.5 bg-brand-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold tabular-nums text-cocoa-900" aria-live="polite">
              {index + 1} de {total}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Productos anteriores"
              className="glass grid h-10 w-10 place-items-center rounded-full text-lg text-cocoa-900 shadow-card transition hover:text-brand-600 active:scale-90"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Más productos"
              className="glass grid h-10 w-10 place-items-center rounded-full text-lg text-cocoa-900 shadow-card transition hover:text-brand-600 active:scale-90"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Mayoreo (cinta compacta) ---------- */
export function Mayoreo({ waNumber }: { waNumber: string; waMessage: string }) {
  const clean = waNumber.replace(/\D/g, "");
  const href = `https://wa.me/${clean}?text=${encodeURIComponent(
    "Hola, me interesan los precios de MAYOREO 💗 (a partir de 10 piezas)"
  )}`;
  return (
    <section id="mayoreo" className="mx-auto max-w-6xl px-5 pb-12 md:pb-16 lg:px-8">
      <Reveal>
        <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-[1.75rem] border border-white/20 bg-cocoa-900 px-6 py-4 text-center text-white shadow-card sm:flex-row sm:justify-between sm:gap-4 sm:rounded-full sm:px-7 sm:text-left">
          <p className="text-[14px] font-semibold leading-snug sm:text-[15px]">
            💗 <span className="font-bold uppercase tracking-[0.14em]">Mayoreo:</span>{" "}
            <span className="text-white/80">desde 10 piezas del mismo producto</span>
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-600 shadow transition hover:-translate-y-0.5 active:scale-95"
          >
            Precios por WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Cómo usar (cinta compacta) ---------- */
export function Ritual() {
  const steps = [
    { n: "1", title: "Limpia", desc: "Jabón día y noche" },
    { n: "2", title: "Exfolia", desc: "Arroz 2 veces por semana" },
    { n: "3", title: "Trata", desc: "Ultra Master de noche" },
    { n: "4", title: "Nutre", desc: "Reparadora día y noche" },
    { n: "5", title: "Protege", desc: "Bloqueador cada mañana" },
  ];
  return (
    <section id="ritual" className="bg-gradient-to-b from-blush-50/60 to-white py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Cómo usar</p>
          <h2 className="mt-3 font-serif text-[26px] font-bold text-cocoa-900 md:text-[32px]">
            Tu rutina en 5 pasos
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="no-scrollbar -mx-5 mt-6 flex snap-x gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
            {steps.map((s) => (
              <div
                key={s.n}
                className="card flex w-[172px] shrink-0 snap-center items-center gap-3 p-4 text-left lg:w-auto"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 font-serif text-base font-bold text-white shadow-card">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-[15px] font-bold leading-tight text-cocoa-900">{s.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-cocoa-800/70">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-cocoa-800/55">
          ⚠️ Evita el contacto con los ojos. Si hay irritación, suspende el uso.
        </p>
      </div>
    </section>
  );
}
