"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NAV_LINKS, LOGO_IMAGE } from "@/lib/site";
import { buildWaLink } from "@/lib/whatsapp";

type Props = { brand: string; waNumber: string; waMessage: string };

export default function Navbar({ brand, waNumber, waMessage }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/40 bg-white/70 shadow-card backdrop-blur-xl"
          : "border-b border-transparent bg-white/40 backdrop-blur-lg"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[72px] lg:px-8">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label={brand}>
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-card ring-2 ring-white">
            <Image src={LOGO_IMAGE} alt="Cutis Radiante 7D" fill sizes="40px" className="object-cover" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-[17px] font-bold text-cocoa-900">{brand}</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-500">
              Cosmética artesanal
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link text-[14.5px] font-medium text-cocoa-800/80 transition hover:text-brand-600"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/admin"
            className="text-[14.5px] font-medium text-cocoa-800/50 transition hover:text-brand-600"
          >
            🔒 Admin
          </a>
          <a
            href={buildWaLink(waNumber, waMessage)}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-gradient-to-br from-cocoa-900 to-[#57263B] px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:from-brand-600 hover:to-brand-700 active:scale-95"
          >
            Pedir por WhatsApp
          </a>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-white/70 backdrop-blur-xl lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full rounded bg-cocoa-900 transition-all ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-cocoa-900 transition-all ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-full rounded bg-cocoa-900 transition-all ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/40 bg-white/85 px-5 pb-8 pt-3 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 font-serif text-xl text-cocoa-900 transition hover:bg-brand-50"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-[15px] font-medium text-cocoa-800/50"
            >
              🔒 Admin
            </a>
            <a
              href={buildWaLink(waNumber, waMessage)}
              target="_blank"
              rel="noopener"
              className="btn-primary mt-4 w-full"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
