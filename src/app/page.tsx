import tienda from "@/data/tienda.json";
import type { Product, SiteSettings } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import StickyBuyBar from "@/components/StickyBuyBar";
import { Catalogo, Mayoreo, Ritual, Marquee } from "@/components/HomeSections";

export const revalidate = 60;

function normalize(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? row.slug),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    subtitle: String(row.subtitle ?? ""),
    description: String(row.description ?? ""),
    price: row.price == null || row.price === "" ? null : Number(row.price),
    compare_price: null,
    main_image: String(row.main_image ?? ""),
    gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : [],
    benefits: [],
    ingredients: Array.isArray(row.ingredients) ? (row.ingredients as string[]) : [],
    how_to_use: [],
    details: Array.isArray(row.details)
      ? (row.details as { label: string; value: string }[])
      : [],
    includes: Array.isArray(row.includes) ? (row.includes as string[]) : [],
    cta_label: String(row.cta_label ?? "") || "Mándame mensaje",
    wa_message: String(row.wa_message ?? ""),
    faqs: [],
    visible: row.visible !== false,
    sort_order: Number(row.sort_order ?? 0),
  };
}

export default function Home() {
  const settings = tienda.settings as SiteSettings;
  const products = (tienda.products as Record<string, unknown>[])
    .map(normalize)
    .filter((p) => p.visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (products.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center p-8 text-center">
        <p>Estamos preparando la tienda…</p>
      </main>
    );
  }

  const prices = products.map((p) => p.price).filter((v): v is number => v != null);
  const fromPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <main>
      <Navbar
        brand={settings.brand_name}
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
      />
      <Hero
        brand={settings.brand_name}
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
      />
      <Marquee />
      <Catalogo
        products={products}
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
      />
      <Mayoreo waNumber={settings.whatsapp_number} waMessage={settings.whatsapp_message} />
      <Ritual />
      <Footer
        brand={settings.brand_name}
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
        instagram={settings.instagram}
        footerText={settings.footer_text}
      />
      {/* espacio para que la barra fija móvil no tape el final */}
      <div aria-hidden className="h-[76px] bg-white/60 md:hidden" />
      <StickyBuyBar
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
        fromPrice={fromPrice}
      />
      <WhatsAppFloat waNumber={settings.whatsapp_number} waMessage={settings.whatsapp_message} />
    </main>
  );
}
