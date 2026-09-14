"use client";

import { buildWaLink } from "@/lib/whatsapp";

export default function WhatsAppFloat({
  waNumber,
  waMessage,
}: {
  waNumber: string;
  waMessage: string;
}) {
  return (
    <a
      href={buildWaLink(waNumber, waMessage)}
      target="_blank"
      rel="noopener"
      aria-label="Hablar por WhatsApp"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
      className="group fixed right-5 z-50 hidden items-center gap-2 rounded-full bg-[#25D366] py-2.5 pl-3.5 pr-5 text-sm font-semibold text-white shadow-float transition-all duration-300 hover:-translate-y-1 hover:shadow-soft md:flex md:right-7"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/30 [animation-duration:2.6s] motion-reduce:animate-none" aria-hidden />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.6 1.1 1.4 1.8 2.5 2.4.3.1.5 0 .7-.2l.8-.9c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3 0 .2 0 .7-.6 1.8Z" />
      </svg>
      <span className="font-semibold">WhatsApp</span>
    </a>
  );
}
