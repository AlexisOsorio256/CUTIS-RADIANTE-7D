/** Construye el enlace de WhatsApp centralizado. No hardcodear números en componentes. */
export function buildWaLink(
  number: string,
  template: string,
  productName?: string
): string {
  const clean = (number || "").replace(/\D/g, "");
  const text = (template || "Hola, me interesa {producto}. Quisiera más información.").replace(
    "{producto}",
    productName || "sus productos"
  );
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export function formatPrice(v: number | null): string {
  if (v == null) return "";
  return "$" + v.toLocaleString("es-MX");
}

/** Etiqueta del producto para el mensaje, con precio cuando existe. */
export function productLabel(name: string, price: number | null): string {
  return price != null ? `${name} (${formatPrice(price)})` : name;
}

type LinkProduct = { name: string; price: number | null; wa_message: string };

/** Enlace de WhatsApp de un producto: mensaje propio o plantilla general. */
export function productLink(
  p: LinkProduct,
  waNumber: string,
  waMessage: string
): string {
  if (p.wa_message.trim()) {
    const clean = waNumber.replace(/\D/g, "");
    return `https://wa.me/${clean}?text=${encodeURIComponent(p.wa_message.trim())}`;
  }
  return buildWaLink(waNumber, waMessage, productLabel(p.name, p.price));
}
