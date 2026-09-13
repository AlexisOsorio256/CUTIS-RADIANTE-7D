import Image from "next/image";
import { LOGO_IMAGE } from "@/lib/site";
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
    <footer className="border-t border-blush-200/60 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center lg:px-8">
        <span className="relative h-14 w-14 overflow-hidden rounded-full shadow-card ring-2 ring-white">
          <Image src={LOGO_IMAGE} alt={brand} fill sizes="56px" className="object-cover" />
        </span>
        <p className="font-serif text-xl font-bold text-cocoa-900">{brand}</p>
        <p className="max-w-md text-sm text-cocoa-800/60">{footerText}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildWaLink(waNumber, waMessage)}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-blush-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-cocoa-900 backdrop-blur transition hover:border-brand-300 hover:text-brand-600"
          >
            WhatsApp
          </a>
          {instagram && (
            <a
              href={instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-blush-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-cocoa-900 backdrop-blur transition hover:border-brand-300 hover:text-brand-600"
            >
              Instagram
            </a>
          )}
          <a href="/admin" className="rounded-full px-4 py-2.5 text-sm text-cocoa-800/45 transition hover:text-brand-600">
            🔒 Admin
          </a>
        </div>
        <p className="text-xs text-cocoa-800/45">© {new Date().getFullYear()} {brand} · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
