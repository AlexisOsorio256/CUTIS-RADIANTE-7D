import Image from "next/image";
import { buildWaLink } from "@/lib/whatsapp";

type Props = {
  brand: string;
  waNumber: string;
  waMessage: string;
};

/**
 * Hero minimalista de marca: mensaje claro, dos botones y la foto
 * del kit como protagonista. Nada flota fuera de su caja en móvil.
 */
export default function Hero({ brand, waNumber, waMessage }: Props) {
  return (
    <section id="inicio" className="relative overflow-hidden pb-12 pt-24 md:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="blob absolute -top-28 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blush-200/80 via-brand-100/50 to-transparent blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <p className="hero-enter eyebrow mx-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Cosmética artesanal · Ingredientes naturales
        </p>
        <h1 className="hero-enter hero-enter-1 mt-5 font-serif text-[44px] font-bold leading-[1.05] text-cocoa-900 sm:text-6xl">
          {brand} <span className="text-brand-500">💗</span>
        </h1>
        <p className="hero-enter hero-enter-2 mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-cocoa-800/75">
          Tu rutina facial completa: limpia, trata, nutre y protege tu piel
          con fórmulas artesanales.
        </p>
        <div className="hero-enter hero-enter-3 mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href="#productos" className="btn-ghost w-full sm:w-auto">
            Ver productos
          </a>
          <a
            href={buildWaLink(waNumber, waMessage)}
            target="_blank"
            rel="noopener"
            className="btn-primary w-full sm:w-auto"
          >
            <WaIcon />
            Pedir por WhatsApp
          </a>
        </div>
      </div>

      {/* Foto del kit: protagonista, con sello DENTRO de la imagen */}
      <div className="hero-enter hero-enter-3 relative mx-auto mt-10 w-full max-w-4xl px-5">
        <div className="photo-frame float-soft aspect-[4/3] sm:aspect-[16/10]">
          <Image
            src="/images/kit-facial.jpg"
            alt="Kit de Cuidado Facial Cutis Radiante 7D"
            fill
            priority
            sizes="(max-width: 768px) 92vw, 900px"
            className="object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-600 shadow-card">
            Kit de cuidado facial
          </span>
        </div>
        <p className="mt-4 text-center text-sm text-cocoa-800/60">
          100% artesanal · Precios en pesos · El envío se paga por separado
        </p>
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
