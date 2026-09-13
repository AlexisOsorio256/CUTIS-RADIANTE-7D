import type { SiteSettings } from "./types";

/**
 * ÚNICO lugar donde se configuran marca y WhatsApp.
 * El admin puede sobreescribir estos valores desde Supabase (tabla site_settings).
 * Número en formato internacional sin "+" ni espacios. Ej: Colombia 57 + número.
 */
export const SITE_DEFAULTS: SiteSettings = {
  brand_name: "Cutis Radiante 7D",
  whatsapp_number: "573132151401", // 313 215 1401 (visto en etiquetas del producto)
  whatsapp_message: "Hola, me interesa {producto} 💗 ¿Me das más información?",
  instagram: "",
  footer_text: "Cosmética artesanal · Ingredientes naturales",
};

/**
 * Acceso del panel /admin.
 * Supabase Auth trabaja con correo + contraseña, así que el usuario
 * "sussy85" entra escribiendo solo su usuario y aquí se completa el correo.
 * En Supabase debe existir el usuario: sussy85@cutisradiante.app
 */
export const ADMIN_EMAIL_DOMAIN = "cutisradiante.app";

export function loginToEmail(input: string): string {
  const v = input.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@${ADMIN_EMAIL_DOMAIN}`;
}

export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#productos", label: "Productos" },
  { href: "#mayoreo", label: "Mayoreo" },
  { href: "#ritual", label: "Cómo usar" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];
