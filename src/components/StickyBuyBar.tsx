"use client";

import { useEffect, useState } from "react";
import { buildWaLink } from "@/lib/whatsapp";
import { formatPrice } from "./HomeSections";

type Props = {
  waNumber: string;
  waMessage: string;
  fromPrice: number | null;
};

/**
 * Barra de compra siempre visible en celular (glass estilo iOS).
 * Solo móvil: en PC el botón flotante cumple esa función.
 */
export default function StickyBuyBar({ waNumber, waMessage, fromPrice }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 px-4 transition-all duration-500 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="glass flex items-center gap-3 rounded-full py-2.5 pl-5 pr-2.5 shadow-float">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-bold text-cocoa-900">Cutis Radiante 7D 💗</p>
          <p className="text-xs text-cocoa-800/60">
            {fromPrice != null ? `Desde ${formatPrice(fromPrice)} pesos` : "Pide el tuyo"}
          </p>
        </div>
        <a
          href={buildWaLink(waNumber, waMessage)}
          target="_blank"
          rel="noopener"
          className="beat shrink-0 rounded-full bg-[#25D366] px-5 py-3 text-[14px] font-bold text-white shadow-card transition active:scale-95"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}
