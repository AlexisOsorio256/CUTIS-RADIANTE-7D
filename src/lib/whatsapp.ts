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
