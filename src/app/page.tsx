import { getSiteData } from "@/lib/getSiteData";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import StickyBuyBar from "@/components/StickyBuyBar";
import { Catalogo, Mayoreo, Ritual, Marquee } from "@/components/HomeSections";

export const revalidate = 60;

export default async function Home() {
  const { products, settings } = await getSiteData();

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
