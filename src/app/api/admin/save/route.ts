import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/adminAuth";
import { commitFile } from "@/lib/github";

const slugify = (s: string) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Guarda productos + configuración en el repo. Vercel lo publica solo en 1-2 min. */
export async function POST(req: Request) {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "No entraste" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const products = Array.isArray(body?.products) ? body.products : null;
  const settings = body?.settings;
  if (!products || !settings || typeof settings.whatsapp_number !== "string") {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const clean = products
    .filter((p: Record<string, unknown>) => String(p.name ?? "").trim())
    .map((p: Record<string, unknown>, i: number) => ({
      id: String(p.id ?? p.slug ?? slugify(String(p.name)) ?? `p${i}`),
      slug: String(p.slug ?? slugify(String(p.name)) ?? `p${i}`),
      name: String(p.name ?? ""),
      subtitle: String(p.subtitle ?? ""),
      description: String(p.description ?? ""),
      price: p.price == null || p.price === "" ? null : Number(p.price),
      compare_price: null,
      main_image: String(p.main_image ?? ""),
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      benefits: [],
      ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
      how_to_use: [],
      details: Array.isArray(p.details) ? p.details : [],
      includes: Array.isArray(p.includes) ? p.includes : [],
      cta_label: String(p.cta_label ?? "") || "Mándame mensaje",
      wa_message: String(p.wa_message ?? ""),
      faqs: [],
      visible: p.visible !== false,
      sort_order: Number(p.sort_order ?? i),
    }));

  const file = JSON.stringify(
    {
      settings: {
        brand_name: String(settings.brand_name ?? "Cutis Radiante 7D"),
        whatsapp_number: String(settings.whatsapp_number ?? "").replace(/\D/g, ""),
        whatsapp_message: String(settings.whatsapp_message ?? ""),
        instagram: String(settings.instagram ?? ""),
        footer_text: String(settings.footer_text ?? ""),
      },
      products: clean,
    },
    null,
    2
  );

  try {
    await commitFile("src/data/tienda.json", file, "Actualizar tienda desde /admin 💗");
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo guardar" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
