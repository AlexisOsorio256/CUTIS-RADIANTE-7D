import { createClient } from "@supabase/supabase-js";
import type { Product, SiteSettings } from "./types";
import { FALLBACK_PRODUCTS, FALLBACK_SETTINGS } from "@/data/fallback";

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function normalizeProduct(row: Record<string, unknown>): Product {
  const details = Array.isArray(row.details)
    ? (row.details as { label: string; value: string }[])
    : [];
  return {
    id: String(row.id ?? row.slug),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    subtitle: String(row.subtitle ?? ""),
    description: String(row.description ?? ""),
    price: row.price == null ? null : Number(row.price),
    compare_price:
      row.compare_price == null ? null : Number(row.compare_price),
    main_image: String(row.main_image ?? ""),
    gallery: Array.isArray(row.gallery)
      ? (row.gallery as string[])
      : [],
    benefits: Array.isArray(row.benefits) ? (row.benefits as string[]) : [],
    ingredients: Array.isArray(row.ingredients)
      ? (row.ingredients as string[])
      : [],
    how_to_use: Array.isArray(row.how_to_use)
      ? (row.how_to_use as string[])
      : [],
    details,
    includes: Array.isArray(row.includes) ? (row.includes as string[]) : [],
    cta_label: String(row.cta_label ?? row.ctaLabel ?? "") || "Mándame mensaje",
    wa_message: String(row.wa_message ?? row.waMessage ?? ""),
    faqs: Array.isArray(row.faqs)
      ? (row.faqs as { q: string; a: string }[])
      : [],
    visible: row.visible !== false,
    sort_order: Number(row.sort_order ?? 0),
  };
}

export async function getSiteData(): Promise<{
  products: Product[];
  settings: SiteSettings;
}> {
  const sb = serverClient();
  if (!sb) return { products: FALLBACK_PRODUCTS, settings: FALLBACK_SETTINGS };

  try {
    const [pRes, sRes] = await Promise.all([
      sb
        .from("products")
        .select("*")
        .eq("visible", true)
        .order("sort_order", { ascending: true }),
      sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    ]);

    const products =
      pRes.data && pRes.data.length > 0
        ? pRes.data.map(normalizeProduct)
        : FALLBACK_PRODUCTS;

    const settings: SiteSettings = sRes.data
      ? {
          brand_name: sRes.data.brand_name ?? FALLBACK_SETTINGS.brand_name,
          whatsapp_number:
            sRes.data.whatsapp_number ?? FALLBACK_SETTINGS.whatsapp_number,
          whatsapp_message:
            sRes.data.whatsapp_message ?? FALLBACK_SETTINGS.whatsapp_message,
          instagram: sRes.data.instagram ?? "",
          footer_text:
            sRes.data.footer_text ?? FALLBACK_SETTINGS.footer_text,
        }
      : FALLBACK_SETTINGS;

    return { products, settings };
  } catch {
    return { products: FALLBACK_PRODUCTS, settings: FALLBACK_SETTINGS };
  }
}
