import type { SiteSettings } from "./types";

/**
 * ÚNICO lugar donde se configuran marca y WhatsApp.
 * El admin puede sobreescribir estos valores desde Supabase (tabla site_settings).
 * Número en formato internacional sin "+" ni espacios. Ej: Colombia 57 + número.
 */
export const SITE_DEFAULTS: SiteSettings = {
  brand_name: "Cutis Radiante 7D",
  whatsapp_number: "523132151401", // 313 215 1401 · México (+52)
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
  { href: "#productos", label: "Productos" },
  { href: "#mayoreo", label: "Mayoreo" },
  { href: "#ritual", label: "Cómo usar" },
];

export const LOGO_IMAGE = "/images/crema-reparadora-etiqueta.jpg";
