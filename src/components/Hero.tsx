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

        <div className="hero-enter hero-enter-2 mx-auto mt-7 max-w-xl rounded-[1.9rem] bg-gradient-to-br from-brand-300 via-blush-200 to-brand-200 p-[1.5px] shadow-float">
          <div className="rounded-[calc(1.9rem-1.5px)] bg-white/92 p-6 text-left shadow-inner backdrop-blur md:p-7">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-brand-500">
              Nuestra favorita
            </p>
            <h2 className="mt-1.5 text-center font-serif text-[22px] font-bold leading-snug text-cocoa-900 md:text-2xl">
              ✨ Crema Cutis Radiante 7D — Reparadora 💗
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-cocoa-800/85 md:text-base">
              Es una crema nutritiva e hidratante 💛
            </p>
            <p className="mt-2.5 border-l-2 border-brand-200 pl-3.5 text-[15px] leading-relaxed text-cocoa-800/85 md:text-base">
              Esa hidratación es la forma en que empieza a trabajar y reparar desde abajo,
              nutriendo la piel por dentro para sanar, fortalecer y renovar ✨
            </p>
            <p className="mt-2.5 text-[15px] leading-relaxed text-cocoa-800/85 md:text-base">
              🌸 Poco a poco va aclarando las manchitas y dejando tu piel más bonita,
              pareja y radiante 💛
            </p>
            <div className="mt-5 rounded-2xl bg-gradient-to-b from-brand-50/80 to-blush-50/60 p-4">
              <p className="text-[14px] font-bold uppercase tracking-[0.12em] text-cocoa-900">
                💡 Cómo usarla
              </p>
              <ul className="mt-2.5 space-y-2 text-[14.5px] leading-relaxed text-cocoa-800/85">
                {[
                  "Empieza con poquita nomás ✨",
                  "Tu piel te dice cuánto necesita: si con poquito te sientes bien, así se queda",
                  "Si sientes que ocupas un poquito más, te pones un poquito más",
                  "Cada piel es diferente, escucha la tuya 💗",
                  "Rinde muchísimo y deja tu piel nutrida e hidratada ✨",
                ].map((tip) => (
                  <li key={tip} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-brand-400 to-brand-600"
                    />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

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
