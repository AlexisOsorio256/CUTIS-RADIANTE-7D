import { buildWaLink } from "@/lib/whatsapp";

type Props = {
  brand: string;
  waNumber: string;
  waMessage: string;
};

/**
 * Hero tipográfico de marca: título grande en degradado rosa,
 * destellos suaves y botones claros. Sin foto para no duplicar
 * la imagen del kit (esa vive en Productos).
 */
export default function Hero({ brand, waNumber, waMessage }: Props) {
  const [name, tail] = splitBrand(brand);

  return (
    <section id="inicio" className="relative overflow-hidden pb-12 pt-24 md:pb-16 md:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="blob absolute -top-28 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blush-200/80 via-brand-100/50 to-transparent blur-2xl" />
        <span className="float-soft absolute left-[8%] top-32 text-2xl opacity-70">✨</span>
        <span className="float-soft absolute right-[10%] top-44 text-xl opacity-60" style={{ animationDelay: "-2s" }}>
          💗
        </span>
        <span className="float-soft absolute left-[16%] top-[380px] hidden text-lg opacity-50 sm:block" style={{ animationDelay: "-4s" }}>
          ✦
        </span>
        <span className="float-soft absolute right-[15%] top-[360px] hidden text-lg opacity-50 sm:block" style={{ animationDelay: "-1s" }}>
          ✦
        </span>
      </div>

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <p className="hero-enter eyebrow mx-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Cosmética artesanal · Ingredientes naturales
        </p>

        <h1 className="hero-enter hero-enter-1 mt-6">
          <span className="block bg-gradient-to-b from-brand-700 via-brand-500 to-brand-300 bg-clip-text font-serif text-[56px] font-black leading-[0.98] tracking-tight text-transparent sm:text-8xl lg:text-[96px]">
            {name}
          </span>
          {tail && (
            <span className="mt-3 flex items-center justify-center gap-4">
              <span aria-hidden className="h-px w-14 bg-gradient-to-r from-transparent to-brand-400 sm:w-24" />
              <span className="font-serif text-4xl font-bold italic text-brand-600 sm:text-6xl">
                {tail} <span className="not-italic">✨</span>
              </span>
              <span aria-hidden className="h-px w-14 bg-gradient-to-l from-transparent to-brand-400 sm:w-24" />
            </span>
          )}
        </h1>

        <p className="hero-enter hero-enter-2 mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-cocoa-800/75 md:text-lg">
          Piel suave, hidratada y luminosa: tu rutina facial completa
          en fórmulas artesanales 💗
        </p>

        <div className="hero-enter hero-enter-3 mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={buildWaLink(waNumber, waMessage)}
            target="_blank"
            rel="noopener"
            className="btn-primary beat w-full sm:w-auto"
          >
            <WaIcon />
            Pedir por WhatsApp
          </a>
          <a href="#productos" className="btn-ghost w-full sm:w-auto">
            Ver productos
          </a>
        </div>

        <p className="hero-enter hero-enter-3 mt-5 text-sm text-cocoa-800/60">
          100% artesanal · Precios en pesos · El envío se paga por separado
        </p>
      </div>
    </section>
  );
}

/** "Cutis Radiante 7D" -> ["Cutis Radiante", "7D"] */
function splitBrand(brand: string): [string, string] {
  const m = brand.match(/^(.*)(7D.*)$/i);
  if (m) return [m[1].trim(), m[2].trim()];
  return [brand, ""];
}

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.6 1.1 1.4 1.8 2.5 2.4.3.1.5 0 .7-.2l.8-.9c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3 0 .2 0 .7-.6 1.8Z" />
    </svg>
  );
}
