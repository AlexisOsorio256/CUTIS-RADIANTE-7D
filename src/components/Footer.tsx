import { buildWaLink } from "@/lib/whatsapp";

type Props = {
  brand: string;
  waNumber: string;
  waMessage: string;
  instagram: string;
  footerText: string;
};

export default function Footer({ brand, waNumber, waMessage, instagram, footerText }: Props) {
  return (
    <footer className="border-t border-blush-200/70 bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center lg:px-8">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-serif text-xl text-white">
          C
        </span>
        <p className="font-serif text-xl font-bold text-cocoa-900">{brand}</p>
        <p className="max-w-md text-sm text-cocoa-800/60">{footerText}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildWaLink(waNumber, waMessage)}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-blush-200 bg-white px-5 py-2.5 text-sm font-semibold text-cocoa-900 transition hover:border-brand-300 hover:text-brand-600"
          >
            WhatsApp
          </a>
          {instagram && (
            <a
              href={instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-blush-200 bg-white px-5 py-2.5 text-sm font-semibold text-cocoa-900 transition hover:border-brand-300 hover:text-brand-600"
            >
              Instagram
            </a>
          )}
          <a href="#inicio" className="rounded-full px-4 py-2.5 text-sm text-cocoa-800/60 transition hover:text-brand-600">
            Volver arriba ↑
          </a>
        </div>
        <p className="text-xs text-cocoa-800/45">© {new Date().getFullYear()} {brand} · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
