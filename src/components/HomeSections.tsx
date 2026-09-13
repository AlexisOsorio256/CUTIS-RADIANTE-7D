"use client";

import { useState } from "react";
import Image from "next/image";
import type { Faq, Product } from "@/lib/types";
import { buildWaLink } from "@/lib/whatsapp";
import Reveal from "./Reveal";

export function formatPrice(v: number | null): string {
  if (v == null) return "";
  return "$ " + v.toLocaleString("es-CO");
}

/* ---------- Presentación editorial ---------- */
export function Presentacion({ product }: { product: Product }) {
  return (
    <section id="producto" className="mx-auto max-w-6xl px-5 py-14 md:py-20 lg:px-8">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="photo-frame aspect-[4/3]">
            {product.gallery[0] ? (
              <Image src={product.gallery[0]} alt={product.name} fill sizes="(max-width:768px) 92vw, 560px" className="object-cover" loading="lazy" />
            ) : product.main_image ? (
              <Image src={product.main_image} alt={product.name} fill sizes="(max-width:768px) 92vw, 560px" className="object-cover" loading="lazy" />
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow">El producto</p>
          <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-cocoa-900 md:text-[40px]">
            Cuidado real, <span className="italic text-brand-600">piel luminosa</span> en 7 días
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-cocoa-800/75">{product.description}</p>
          <ul className="mt-6 space-y-3">
            {product.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500 text-sm text-white">✓</span>
                <span className="text-[15.5px] leading-relaxed text-cocoa-900/90">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Productos ---------- */
export function Productos({
  products,
  waNumber,
  waMessage,
}: {
  products: Product[];
  waNumber: string;
  waMessage: string;
}) {
  return (
    <section id="productos" className="bg-gradient-to-b from-white to-blush-50/70 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Kit de cuidado facial</p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-[40px]">Tu ritual completo</h2>
          <p className="mt-3 text-cocoa-800/70">Cinco pasos artesanales que se complementan. Toca “Pedir” y te atendemos por WhatsApp.</p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90}>
              <article className="card group flex h-full flex-col overflow-hidden">
                <div className="photo-frame m-3 mb-0 aspect-[4/3] !rounded-3xl">
                  {p.main_image && (
                    <Image src={p.main_image} alt={p.name} fill sizes="(max-width:768px) 92vw, 360px" className="object-cover" loading="lazy" />
                  )}
                  {p.details.find((d) => d.label.toLowerCase().includes("contenido")) && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-cocoa-900/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {p.details.find((d) => d.label.toLowerCase().includes("contenido"))?.value}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-brand-500">{p.subtitle}</p>
                  <h3 className="mt-1.5 font-serif text-[22px] font-bold leading-snug text-cocoa-900">{p.name}</h3>
                  <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-cocoa-800/70">{p.description}</p>
                  {(p.price != null || p.compare_price != null) && (
                    <p className="mt-3 flex items-baseline gap-2">
                      {p.price != null && <span className="font-serif text-2xl font-bold text-cocoa-900">{formatPrice(p.price)}</span>}
                      {p.compare_price != null && <span className="text-sm text-cocoa-800/50 line-through">{formatPrice(p.compare_price)}</span>}
                    </p>
                  )}
                  <ul className="mt-3 space-y-1.5">
                    {p.benefits.slice(0, 2).map((b) => (
                      <li key={b} className="flex gap-2 text-[13.5px] text-cocoa-800/75">
                        <span className="text-brand-500">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={buildWaLink(waNumber, waMessage, p.name)}
                    target="_blank"
                    rel="noopener"
                    className="btn-primary mt-5 w-full !px-5 !py-3.5 !text-[15px]"
                  >
                    Pedir este producto
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Beneficios (integrado, sin iconos genéricos gigantes) ---------- */
export function Beneficios({ products }: { products: Product[] }) {
  const items = products.flatMap((p) => p.benefits.map((b) => ({ product: p.name, text: b }))).slice(0, 6);
  return (
    <section id="beneficios" className="mx-auto max-w-6xl px-5 py-14 md:py-20 lg:px-8">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">Beneficios</p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-[40px]">Lo que tu piel va a sentir</h2>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.text + i} delay={(i % 3) * 90}>
            <div className="card h-full p-6 transition-transform duration-300 hover:-translate-y-1">
              <span className="font-serif text-3xl text-blush-300">0{i + 1}</span>
              <p className="mt-2 font-medium leading-relaxed text-cocoa-900">{it.text}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-500/90">{it.product}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Galería editorial ---------- */
export function Galeria({ images }: { images: { src: string; alt: string }[] }) {
  const list = images.filter((i) => i.src);
  if (list.length === 0) return null;
  return (
    <section className="bg-cocoa-900 py-14 text-white md:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow !border-white/20 !bg-white/10 !text-blush-200">Fotografías reales</p>
            <h2 className="mt-4 font-serif text-3xl font-bold md:text-[40px]">Belleza que se ve y se siente</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/65">Imágenes reales del producto y su presentación artesanal.</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {list.slice(0, 7).map((img, i) => (
            <Reveal key={img.src + i} delay={(i % 4) * 80} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              <div className={`photo-frame ${i === 0 ? "aspect-square" : "aspect-[4/5]"} !shadow-none`}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width:768px) 46vw, 280px" className="object-cover" loading="lazy" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Ingredientes ---------- */
export function Ingredientes({ ingredients }: { ingredients: string[] }) {
  if (ingredients.length === 0) return null;
  return (
    <section id="ingredientes" className="mx-auto max-w-6xl px-5 py-14 md:py-20 lg:px-8">
      <div className="card grid gap-8 p-7 md:p-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow">Ingredientes</p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-4xl">Naturales y con propósito</h2>
          <p className="mt-3 text-cocoa-800/70">Fórmula artesanal de la crema reparadora, pensada para nutrir y calmar.</p>
          <div className="mt-5 rounded-3xl bg-brand-50 p-5 text-sm leading-relaxed text-cocoa-800/80">
            💧 Sebo de res + miel de manuka + vitamina E + rosa mosqueta: nutrición profunda y suavidad visible.
          </div>
        </Reveal>
        <div className="grid content-center gap-3 sm:grid-cols-2">
          {ingredients.map((ing, i) => (
            <Reveal key={ing} delay={i * 70}>
              <div className="rounded-3xl border border-blush-200/80 bg-cream px-5 py-4">
                <span className="text-xl">🌸</span>
                <p className="mt-1.5 font-semibold text-cocoa-900">{ing}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Cómo usar (ritual) ---------- */
export function Ritual({ products }: { products: Product[] }) {
  const steps = [
    { title: "Limpia", desc: "Jabón día y noche sobre piel húmeda.", icon: "🧼" },
    { title: "Exfolia", desc: "Exfoliante de arroz 2 veces por semana, 3 minutos.", icon: "✨" },
    { title: "Trata", desc: "Ultra Master solo de noche en manchas profundas.", icon: "🌙" },
    { title: "Nutre", desc: "Crema reparadora día y noche.", icon: "🌿" },
    { title: "Protege", desc: "Bloqueador FPS 75 cada mañana, 15 min antes del sol.", icon: "☀️" },
  ];
  void products;
  return (
    <section id="ritual" className="bg-gradient-to-b from-blush-50/70 to-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Cómo usar</p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-[40px]">Tu ritual en 5 pasos</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <li className="card relative h-full p-6 text-center">
                <span className="absolute right-4 top-4 font-serif text-lg text-blush-300">{i + 1}</span>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blush-100 to-nude text-2xl">{s.icon}</span>
                <p className="mt-3 font-serif text-lg font-bold text-cocoa-900">{s.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-cocoa-800/70">{s.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="card mx-auto mt-6 max-w-3xl border-amber-200/60 bg-amber-50/70 p-5 text-center text-sm leading-relaxed text-cocoa-800/80">
          ⚠️ Evita el contacto con los ojos. Si hay irritación, suspende el uso. No uses el exfoliante en piel irritada.
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Info adicional ---------- */
export function InfoAdicional({ products }: { products: Product[] }) {
  const rows = products.flatMap((p) =>
    p.details.map((d) => ({ ...d, product: p.name }))
  );
  if (rows.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:py-20 lg:px-8">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">Información</p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-[40px]">Detalles de cada producto</h2>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <Reveal key={p.slug}>
            <div className="card overflow-hidden">
              <div className="border-b border-blush-100 bg-brand-50/60 px-6 py-4">
                <p className="font-serif text-lg font-bold text-cocoa-900">{p.name}</p>
              </div>
              <dl className="divide-y divide-blush-100/80">
                {p.details.map((d) => (
                  <div key={d.label} className="flex items-center justify-between gap-4 px-6 py-3">
                    <dt className="text-sm font-medium text-cocoa-800/60">{d.label}</dt>
                    <dd className="text-right text-sm font-semibold text-cocoa-900">{d.value}</dd>
                  </div>
                ))}
                {p.how_to_use.length > 0 && (
                  <div className="px-6 py-4">
                    <dt className="text-sm font-medium text-cocoa-800/60">Modo de uso</dt>
                    <dd className="mt-1.5 space-y-1">
                      {p.how_to_use.map((h) => (
                        <p key={h} className="text-sm text-cocoa-900/90">· {h}</p>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function Faq({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState(0);
  const defaults: Faq[] = [
    { q: "¿Cómo pido por WhatsApp?", a: "Toca cualquier botón de WhatsApp, te lleva directo a nuestro chat con el mensaje listo. Solo envíalo y te confirmamos precio, disponibilidad y envío." },
    { q: "¿Los productos son para todo tipo de piel?", a: "El jabón es para todo tipo de piel. Si tienes piel sensible o irritada, evita el exfoliante y escríbenos para asesorarte." },
    { q: "¿Cada cuánto uso el exfoliante?", a: "Solo 2 veces por semana: masajea, deja reposar 3 minutos y enjuaga." },
    { q: "¿La crema Ultra Master cuándo se aplica?", a: "Únicamente por las noches. Lava tu rostro por las mañanas y usa bloqueador FPS 75 durante el día." },
  ];
  const list = faqs.length > 0 ? faqs : defaults;
  return (
    <section id="preguntas" className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <Reveal className="text-center">
        <p className="eyebrow">Preguntas frecuentes</p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-cocoa-900 md:text-[40px]">¿Tienes dudas?</h2>
      </Reveal>
      <div className="mt-8 space-y-3">
        {list.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 60}>
              <div className={`card overflow-hidden !rounded-3xl transition ${isOpen ? "faq-open" : ""}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-cocoa-900">{f.q}</span>
                  <span className="faq-chevron grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">⌄</span>
                </button>
                <div className="faq-answer">
                  <div>
                    <p className="px-6 pb-6 text-[15px] leading-relaxed text-cocoa-800/75">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- CTA contacto final ---------- */
export function Contacto({
  brand,
  waNumber,
  waMessage,
  footerText,
}: {
  brand: string;
  waNumber: string;
  waMessage: string;
  footerText: string;
}) {
  return (
    <section id="contacto" className="px-5 pb-16 md:pb-24">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-[#e78fa2] px-6 py-14 text-center text-white shadow-float md:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
          </div>
          <p className="relative text-xs font-bold uppercase tracking-[0.28em] text-white/85">🤍 {brand}</p>
          <h2 className="relative mx-auto mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight md:text-5xl">
            Tu piel radiante empieza con un mensaje
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/85">{footerText} · Atención personalizada por WhatsApp.</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={buildWaLink(waNumber, waMessage)}
              target="_blank"
              rel="noopener"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-brand-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              <WaSmall /> Escríbenos ahora
            </a>
            <span className="text-sm text-white/80">Respuesta rápida · Sin compromiso</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function WaSmall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.6 1.1 1.4 1.8 2.5 2.4.3.1.5 0 .7-.2l.8-.9c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3 0 .2 0 .7-.6 1.8Z" />
    </svg>
  );
}
