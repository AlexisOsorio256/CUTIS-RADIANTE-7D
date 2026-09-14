export type Faq = { q: string; a: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number | null;
  compare_price: number | null;
  main_image: string;
  gallery: string[];
  benefits: string[];
  ingredients: string[];
  how_to_use: string[];
  details: { label: string; value: string }[];
  /** Para el kit: lista de lo que incluye */
  includes: string[];
  /** Texto del botón. Si está vacío se usa "Mándame mensaje" */
  cta_label: string;
  /** Mensaje propio de WhatsApp. Si está vacío se usa el general */
  wa_message: string;
  faqs: Faq[];
  visible: boolean;
  sort_order: number;
};

export type SiteSettings = {
  brand_name: string;
  whatsapp_number: string;
  whatsapp_message: string;
  instagram: string;
  footer_text: string;
};

export type Review = {
  id: string;
  /** Título: de qué producto es la reseña (texto libre) */
  product: string;
  /** Descripción: lo que pensó la clienta / contexto */
  description: string;
  /** Fotos de evidencia (capturas subidas por la administradora) */
  photos: string[];
  visible: boolean;
  sort_order: number;
};
