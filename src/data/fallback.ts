import type { Product, SiteSettings } from "@/lib/types";
import { SITE_DEFAULTS } from "@/lib/site";

/**
 * Datos reales transcritos de las imágenes del producto.
 * Se usan cuando Supabase aún no está configurado, para que la página
 * funcione inmediatamente en Vercel. El admin los puede editar en /admin
 * (guardado en Supabase) sin tocar código.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "crema-reparadora",
    slug: "crema-reparadora",
    name: "Crema Cutis Radiante 7D Reparadora",
    subtitle: "100% Artesanal · Ingredientes Naturales",
    description:
      "Nuestra crema estrella: hidrata, suaviza y rejuvenece mientras ayuda a unificar el tono. Ideal para el cuidado diario, calma la resequedad y deja la piel luminosa y suave.",
    price: null,
    compare_price: null,
    main_image: "/images/crema-reparadora-etiqueta.jpg",
    gallery: ["/images/crema-reparadora-real.jpg", "/images/kit-facial.jpg"],
    benefits: [
      "Auxilia en manchas, marcas, arrugas y líneas de expresión",
      "Hidrata, suaviza, rejuvenece y unifica el tono",
      "Ayuda a calmar resequedad, irritaciones y granitos",
    ],
    ingredients: [
      "Sebo de res",
      "Miel de manuka",
      "Vitamina E",
      "Aceite de rosa mosqueta",
    ],
    how_to_use: [
      "Aplica una pequeña cantidad sobre rostro limpio",
      "Masajea suavemente hasta absorber",
      "Úsala de día y de noche",
    ],
    details: [
      { label: "Contenido", value: "25 g" },
      { label: "Tipo de piel", value: "Todo tipo de piel" },
      { label: "Presentación", value: "Tarro rosado 25 g" },
      { label: "Precaución", value: "Evitar contacto con los ojos" },
    ],
    faqs: [
      {
        q: "¿Para qué sirve la crema reparadora?",
        a: "Auxilia en manchas, marcas, arrugas y líneas de expresión. Hidrata, suaviza, rejuvenece y unifica el tono.",
      },
      {
        q: "¿Cómo la pido?",
        a: "Escríbenos por WhatsApp y te confirmamos disponibilidad, precio y envío.",
      },
    ],
    visible: true,
    sort_order: 1,
  },
  {
    id: "jabon",
    slug: "jabon",
    name: "Jabón Cutis Radiante 7D",
    subtitle: "Limpieza suave diaria",
    description:
      "Limpia suavemente sin resecar, elimina impurezas, unifica el tono y deja la piel suave, hidratada y luminosa. Para todo tipo de piel.",
    price: null,
    compare_price: null,
    main_image: "/images/jabon.jpg",
    gallery: ["/images/kit-facial.jpg"],
    benefits: [
      "Limpia suavemente sin resecar",
      "Elimina impurezas",
      "Unifica el tono",
      "Deja la piel suave, hidratada y luminosa",
    ],
    ingredients: [],
    how_to_use: [
      "Frotar sobre piel húmeda",
      "Masajear suavemente",
      "Enjuagar. Uso de día y de noche",
    ],
    details: [
      { label: "Contenido neto", value: "100 g" },
      { label: "Tipo de piel", value: "Todo tipo de piel" },
      { label: "Precaución", value: "Evitar contacto con los ojos. Si hay irritación, suspender el uso" },
    ],
    faqs: [],
    visible: true,
    sort_order: 2,
  },
  {
    id: "exfoliante-arroz",
    slug: "exfoliante-arroz",
    name: "Exfoliante Aclarante de Arroz",
    subtitle: "Cutis Radiante 7D · 50 g",
    description:
      "Exfolia suavemente, elimina células muertas, aclara y unifica el tono. Reduce manchas y deja la piel suave y luminosa.",
    price: null,
    compare_price: null,
    main_image: "/images/exfoliante.jpg",
    gallery: ["/images/kit-facial.jpg"],
    benefits: [
      "Exfolia suavemente, elimina células muertas",
      "Aclara y unifica el tono, reduce manchas",
      "Deja la piel suave y luminosa",
    ],
    ingredients: ["Arroz aclarante"],
    how_to_use: [
      "Tomar una cantidad y masajear suavemente por todo el rostro",
      "Dejar reposar 3 minutos y enjuagar",
      "Usar solo 2 veces por semana",
    ],
    details: [
      { label: "Contenido", value: "50 g" },
      { label: "Frecuencia", value: "2 veces por semana" },
      { label: "Precaución", value: "Evitar contacto con los ojos. No usar en piel irritada" },
    ],
    faqs: [],
    visible: true,
    sort_order: 3,
  },
  {
    id: "crema-ultra-master",
    slug: "crema-ultra-master",
    name: "Crema Ultra Master Aclarante",
    subtitle: "Para manchas profundas",
    description:
      "Para manchas profundas, oscuras, marcas y cicatrices. Unifica el tono y deja la piel luminosa. Tratamiento de noche.",
    price: null,
    compare_price: null,
    main_image: "/images/crema-ultra-master.jpg",
    gallery: ["/images/kit-facial.jpg"],
    benefits: [
      "Para manchas profundas, oscuras, marcas y cicatrices",
      "Unifica el tono y deja la piel luminosa",
    ],
    ingredients: [],
    how_to_use: [
      "Aplicar únicamente por las noches",
      "Lavar el rostro por las mañanas",
    ],
    details: [
      { label: "Contenido neto", value: "50 g" },
      { label: "Uso", value: "Solo de noche" },
      { label: "Precaución", value: "Evitar contacto con los ojos" },
    ],
    faqs: [],
    visible: true,
    sort_order: 4,
  },
  {
    id: "bloqueador-fps75",
    slug: "bloqueador-fps75",
    name: "Bloqueador Solar FPS 75",
    subtitle: "Protección UVA/UVB",
    description:
      "Protege del sol, previene manchas, unifica el tono y retrasa el envejecimiento. Hidrata y suaviza con protección UVA/UVB.",
    price: null,
    compare_price: null,
    main_image: "/images/bloqueador.jpg",
    gallery: ["/images/kit-facial.jpg"],
    benefits: [
      "Protege del sol y previene manchas",
      "Aclara y unifica el tono",
      "Retrasa el envejecimiento",
      "Hidrata y suaviza",
      "Protección UVA/UVB",
    ],
    ingredients: [],
    how_to_use: ["Usar 15 minutos antes de exponerse al sol"],
    details: [
      { label: "Contenido", value: "125 g" },
      { label: "Protección", value: "FPS 75 · UVA/UVB" },
      { label: "Precaución", value: "Evitar contacto con los ojos" },
    ],
    faqs: [],
    visible: true,
    sort_order: 5,
  },
];

export const FALLBACK_SETTINGS: SiteSettings = SITE_DEFAULTS;
