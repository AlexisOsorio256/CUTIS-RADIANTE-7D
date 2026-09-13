import { getSiteData } from "@/lib/getSiteData";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import {
  Presentacion,
  Productos,
  Beneficios,
  Galeria,
  Ingredientes,
  Ritual,
  InfoAdicional,
  Faq,
  Contacto,
} from "@/components/HomeSections";

export const revalidate = 60;

export default async function Home() {
  const { products, settings } = await getSiteData();
  const hero = products[0];
  const heroIngredients = products.find((p) => p.ingredients.length > 0)?.ingredients ?? [];
  const gallery = products.flatMap((p) =>
    [p.main_image, ...p.gallery].map((src) => ({ src, alt: p.name }))
  );
  const faqs = products.flatMap((p) => p.faqs);

  if (!hero) {
    return (
      <main className="grid min-h-screen place-items-center p-8 text-center">
        <p>Estamos preparando la tienda…</p>
      </main>
    );
  }

  return (
    <main>
      <Navbar brand={settings.brand_name} waNumber={settings.whatsapp_number} waMessage={settings.whatsapp_message} />
      <Hero hero={hero} waNumber={settings.whatsapp_number} waMessage={settings.whatsapp_message} />
      <Presentacion product={hero} />
      <Productos products={products} waNumber={settings.whatsapp_number} waMessage={settings.whatsapp_message} />
      <Beneficios products={products} />
      <Galeria images={gallery} />
      <Ingredientes ingredients={heroIngredients} />
      <Ritual products={products} />
      <InfoAdicional products={products} />
      <Faq faqs={faqs} />
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
