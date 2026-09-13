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
