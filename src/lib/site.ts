import type { SiteSettings } from "./types";

/**
 * ÚNICO lugar donde se configuran marca y WhatsApp.
 * El admin puede sobreescribir estos valores desde Supabase (tabla site_settings).
 * Número en formato internacional sin "+" ni espacios. Ej: Colombia 57 + número.
 */
export const SITE_DEFAULTS: SiteSettings = {
  brand_name: "Cutis Radiante 7D",
  whatsapp_number: "573132151401", // 313 215 1401 (visto en etiquetas del producto)
  whatsapp_message: "Hola, me interesa {producto}. Quisiera más información.",
  instagram: "",
  footer_text: "Cosmética artesanal · Ingredientes naturales",
};

export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#productos", label: "Productos" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#ritual", label: "Cómo usar" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];
