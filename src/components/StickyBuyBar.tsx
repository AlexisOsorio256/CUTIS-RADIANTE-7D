"use client";

import { useEffect, useState } from "react";
import { buildWaLink } from "@/lib/whatsapp";
import { formatPrice } from "./HomeSections";

export type BuyItem = { slug: string; name: string; price: number | null; href: string };

type Props = {
  waNumber: string;
  waMessage: string;
  brand: string;
  fromPrice: number | null;
  items: BuyItem[];
};

/**
 * Barra de compra en celular (glass estilo iOS).
 * Cambia según el producto visible en pantalla.
 * Solo móvil: en PC el botón flotante cumple esa función.
 */
export default function StickyBuyBar({ waNumber, waMessage, brand, fromPrice, items }: Props) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState<BuyItem | null>(null);
  const general = buildWaLink(waNumber, waMessage);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.55);
      // Producto visible: el más cercano al centro de la pantalla
      // (funciona con cuadrícula vertical o carrusel horizontal)
      const els = document.querySelectorAll<HTMLElement>("[data-buy]");
      const cx = window.innerWidth / 2;
      const cy = window.scrollY + window.innerHeight * 0.45;
      let best: BuyItem | null = null;
      let bestDist = Infinity;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        if (top > cy || top + r.height < window.scrollY + 80) return;
        const dist = Math.abs(r.left + r.width / 2 - cx);
        const found = items.find((i) => i.slug === el.dataset.buy);
        if (found && dist < bestDist) {
          bestDist = dist;
          best = found;
        }
      });
      setActive(best);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

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
          <p className="truncate text-[13px] font-bold text-cocoa-900">
            {active ? `💗 ${active.name}` : `${brand} 💗`}
          </p>
          <p className="text-xs text-cocoa-800/60">
            {active
              ? active.price != null
                ? `${formatPrice(active.price)} pesos`
                : "Pide el tuyo"
              : fromPrice != null
                ? `Desde ${formatPrice(fromPrice)} pesos`
                : "Pide el tuyo"}
          </p>
        </div>
        <a
          href={active ? active.href : general}
          target="_blank"
          rel="noopener"
          className="beat shrink-0 rounded-full bg-[#25D366] px-5 py-3 text-[14px] font-bold text-white shadow-card transition active:scale-95"
        >
          {active ? "Pedir" : "Pedir por WhatsApp"}
        </a>
      </div>
    </div>
  );
}
