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

/** Usuario del panel /admin (la contraseña vive en ADMIN_PASSWORD, solo servidor). */
export const ADMIN_USER = "sussy85";

export const NAV_LINKS = [
  { href: "#productos", label: "Productos" },
  { href: "#mayoreo", label: "Mayoreo" },
  { href: "#ritual", label: "Cómo usar" },
];

export const LOGO_IMAGE = "/images/crema-reparadora-etiqueta.jpg";
