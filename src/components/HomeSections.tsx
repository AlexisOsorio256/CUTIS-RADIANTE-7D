"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { buildWaLink } from "@/lib/whatsapp";
import Reveal from "./Reveal";

export function formatPrice(v: number | null): string {
  if (v == null) return "";
  return "$" + v.toLocaleString("es-MX");
}

function productLabel(p: Product): string {
  return p.price != null ? `${p.name} (${formatPrice(p.price)})` : p.name;
}

export function productLink(p: Product, waNumber: string, waMessage: string): string {
  if (p.wa_message.trim()) {
    const clean = waNumber.replace(/\D/g, "");
    return `https://wa.me/${clean}?text=${encodeURIComponent(p.wa_message.trim())}`;
  }
  return buildWaLink(waNumber, waMessage, productLabel(p));
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

/* ---------- Catálogo ---------- */
export function Catalogo({
  products,
  waNumber,
  waMessage,
}: {
  products: Product[];
  waNumber: string;
  waMessage: string;
}) {
  const singles = products.filter((p) => p.includes.length === 0);
  const kits = products.filter((p) => p.includes.length > 0);

  return (
    <section id="productos" className="mx-auto max-w-6xl px-5 py-12 md:py-16 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Nuestros productos</p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-[40px]">
          Elige tu favorito 💗
        </h2>
        <p className="mt-3 text-[15px] text-cocoa-800/65">Precios en pesos</p>
      </Reveal>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {singles.map((p, i) => {
          const grams = p.details.find(
            (d) => d.label.toLowerCase().includes("contenido") || d.label.toLowerCase().includes("presentación")
          )?.value;
          return (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <article className="card flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                {p.main_image && (
                  <div className="photo-frame m-3 mb-0 aspect-[4/3] !rounded-3xl">
                    <Image
                      src={p.main_image}
                      alt={p.name}
                      fill
                      sizes="(max-width:768px) 92vw, 360px"
                      className="object-cover"
                      loading="lazy"
                    />
                    {grams && (
                      <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-cocoa-900">
                        {grams}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-brand-500">
                    {p.subtitle}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[22px] font-bold leading-snug text-cocoa-900">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-cocoa-800/75">
                    {p.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-blush-100 pt-4">
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
                    className="btn-primary mt-4 w-full !px-5 !py-3.5 !text-[15px]"
                  >
                    {p.cta_label || "Mándame mensaje"}
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}

        {/* Kit dentro de los productos: tarjeta panorámica sin foto repetida */}
        {kits.map((p) => (
          <Reveal key={p.slug} className="sm:col-span-2 lg:col-span-3">
          <article className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-brand-500 via-brand-600 to-cocoa-900 p-7 text-white shadow-float md:p-10">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            </div>
            <div className="relative grid gap-7 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
                  ✨ Lo más completo
                </p>
                <h3 className="mt-3 font-serif text-3xl font-bold md:text-4xl">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  {p.subtitle}
                </p>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/85">
                  {p.description}
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {p.includes.map((inc) => (
                    <li
                      key={inc}
                      className="rounded-2xl bg-white/12 px-4 py-2.5 text-[14px] font-medium backdrop-blur"
                    >
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-[1.75rem] p-6 text-center text-cocoa-900 md:p-8">
                {p.price != null && (
                  <p className="font-serif text-5xl font-bold">{formatPrice(p.price)}</p>
                )}
                <p className="mt-1 text-sm font-semibold text-cocoa-800/60">
                  pesos · Kit de 5 piezas
                </p>
                <p className="mt-2 text-xs text-cocoa-800/55">📦 El envío se paga por separado</p>
                <a
                  href={productLink(p, waNumber, waMessage)}
                  target="_blank"
                  rel="noopener"
                  className="btn-primary beat mt-5 w-full !py-4"
                >
                  {p.cta_label || "Quiero apartar mi kit"}
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
      </div>
    </section>
  );
}

/* ---------- Mayoreo ---------- */
export function Mayoreo({ waNumber }: { waNumber: string; waMessage: string }) {
  const clean = waNumber.replace(/\D/g, "");
  const href = `https://wa.me/${clean}?text=${encodeURIComponent(
    "Hola, me interesan los precios de MAYOREO 💗 (a partir de 10 piezas)"
  )}`;
  return (
    <section id="mayoreo" className="mx-auto max-w-6xl px-5 pb-12 md:pb-16 lg:px-8">
      <Reveal>
        <div className="card flex flex-col items-center gap-4 p-7 text-center md:flex-row md:justify-between md:p-9 md:text-left">
          <div>
            <p className="eyebrow">Ventas por mayoreo 💗</p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-cocoa-900 md:text-3xl">
              A partir de 10 piezas del mismo producto
            </h2>
            <p className="mt-2 text-[15px] text-cocoa-800/70">
              Precios de mayoreo por mensaje!!
            </p>
          </div>
          <a href={href} target="_blank" rel="noopener" className="btn-primary w-full shrink-0 md:w-auto">
            Pedir precios por WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Cómo usar (compacto) ---------- */
export function Ritual() {
  const steps = [
    { n: "1", title: "Limpia", desc: "Jabón de día y de noche." },
    { n: "2", title: "Exfolia", desc: "Arroz solo 2 veces por semana." },
    { n: "3", title: "Trata", desc: "Ultra Master solo por las noches." },
    { n: "4", title: "Nutre", desc: "Crema reparadora día y noche." },
    { n: "5", title: "Protege", desc: "Bloqueador FPS 75 cada mañana." },
  ];
  return (
    <section id="ritual" className="bg-gradient-to-b from-blush-50/60 to-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Cómo usar</p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-[36px]">
            Tu rutina en 5 pasos
          </h2>
        </Reveal>
        <ol className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <li className="card h-full p-5 text-center transition-transform duration-300 hover:-translate-y-1">
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brand-500 font-serif text-lg font-bold text-white shadow-card">
                  {s.n}
                </span>
                <p className="mt-2.5 font-serif text-[17px] font-bold text-cocoa-900">{s.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-cocoa-800/70">{s.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[13px] leading-relaxed text-cocoa-800/60">
            ⚠️ Evita el contacto con los ojos. Si hay irritación, suspende el uso.
          </p>
        </Reveal>
      </div>
    </section>
  );
}


