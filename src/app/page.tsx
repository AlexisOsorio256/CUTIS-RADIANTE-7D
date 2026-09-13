import { getSiteData } from "@/lib/getSiteData";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Catalogo, Mayoreo, Ritual, Faq, Contacto } from "@/components/HomeSections";

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
      <Catalogo
        products={products}
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
      />
      <Mayoreo waNumber={settings.whatsapp_number} waMessage={settings.whatsapp_message} />
      <Ritual />
      <Faq />
      <Contacto
        brand={settings.brand_name}
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
        footerText={settings.footer_text}
      />
      <Footer
        brand={settings.brand_name}
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
        instagram={settings.instagram}
        footerText={settings.footer_text}
      />
      <WhatsAppFloat waNumber={settings.whatsapp_number} waMessage={settings.whatsapp_message} />
    </main>
  );
}
