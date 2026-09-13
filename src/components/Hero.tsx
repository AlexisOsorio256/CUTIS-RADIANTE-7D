import Image from "next/image";
import type { Product } from "@/lib/types";
import { buildWaLink } from "@/lib/whatsapp";
import Reveal from "./Reveal";

type Props = {
  hero: Product;
  waNumber: string;
  waMessage: string;
};

export default function Hero({ hero, waNumber, waMessage }: Props) {
  return (
    <section id="inicio" className="relative overflow-hidden pb-10 pt-24 md:pt-32">
      {/* fondo editorial: formas suaves rosas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="blob absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blush-200/80 via-brand-100/60 to-transparent blur-2xl" />
        <div className="blob absolute -left-24 top-40 h-72 w-72 rounded-full bg-nude/70 blur-2xl" style={{ animationDelay: "-4s" }} />
        <div className="blob absolute -right-20 top-64 h-80 w-80 rounded-full bg-blush-100/90 blur-2xl" style={{ animationDelay: "-7s" }} />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8">
        {/* Texto */}
        <div className="text-center lg:text-left">
          <p className="hero-enter eyebrow mx-auto lg:mx-0">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Cosmética artesanal · Ingredientes naturales
          </p>
          <h1 className="hero-enter hero-enter-1 mt-5 font-serif text-[42px] font-bold leading-[1.04] text-cocoa-900 sm:text-6xl lg:text-[68px]">
            {hero.name.replace("Cutis Radiante 7D", "").trim() || "Cutis Radiante"}
            <span className="mt-1 block text-[0.52em] font-medium italic leading-snug text-brand-600">
              Cutis Radiante 7D · {hero.subtitle}
            </span>
          </h1>
          <p className="hero-enter hero-enter-2 mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-cocoa-800/75 lg:mx-0">
            {hero.description}
          </p>

          <div className="hero-enter hero-enter-3 mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={buildWaLink(waNumber, waMessage, hero.name)}
              target="_blank"
              rel="noopener"
              className="btn-primary w-full sm:w-auto"
            >
              <WaIcon />
              Pedir por WhatsApp
            </a>
            <a href="#productos" className="btn-ghost w-full sm:w-auto">
              Ver productos
            </a>
          </div>

          {/* mini prueba social derivada de la etiqueta real */}
          <div className="hero-enter hero-enter-3 mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {hero.benefits.slice(0, 3).map((b) => (
              <span
                key={b}
                className="rounded-full border border-blush-200 bg-white/80 px-3.5 py-1.5 text-[13px] font-medium text-cocoa-800/80"
              >
                ✓ {b.length > 42 ? b.slice(0, 42) + "…" : b}
              </span>
            ))}
          </div>
        </div>

        {/* Foto protagonista con capas */}
        <div className="hero-enter hero-enter-2 relative mx-auto w-full max-w-[440px] lg:max-w-none">
          <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-white via-blush-100 to-nude blur-[1px]" />
          <div className="photo-frame float-soft relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
            {hero.main_image ? (
              <Image
                src={hero.main_image}
                alt={hero.name}
                fill
                priority
                sizes="(max-width: 768px) 92vw, 480px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center font-serif text-5xl text-brand-500/60">CR</div>
            )}
            {/* sello */}
            <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-600 shadow-card backdrop-blur">
              100% artesanal
            </div>
          </div>

          {/* tarjeta flotante contenido real */}
          <Reveal delay={250} className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-auto">
            <div className="card flex items-center gap-3 px-4 py-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-xl">🌿</span>
              <div className="text-left">
                <p className="text-[13px] font-bold text-cocoa-900">Contenido neto: 25 g</p>
                <p className="text-xs text-cocoa-800/60">Miel de manuka · Rosa mosqueta · Vitamina E</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.6 1.1 1.4 1.8 2.5 2.4.3.1.5 0 .7-.2l.8-.9c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3 0 .2 0 .7-.6 1.8Z" />
    </svg>
  );
}
