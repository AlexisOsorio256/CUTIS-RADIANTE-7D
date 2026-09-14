type Props = {
  brand: string;
  text?: string;
  instagram?: string;
};

/** Cierre sobrio con los datos de la tienda. El acceso Admin vive en el menú superior. */
export default function Footer({ brand, text, instagram }: Props) {
  const ig = (instagram ?? "").trim();
  return (
    <footer className="border-t border-blush-200/60 bg-white/60 backdrop-blur-xl">
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
      <div className="mx-auto max-w-6xl px-5 py-8 text-center lg:px-8">
        <p className="font-serif text-lg font-bold text-cocoa-900">{brand}</p>
        {text ? (
          <p className="mt-1 text-[13px] font-medium tracking-wide text-cocoa-800/60">{text}</p>
        ) : null}
        {ig ? (
          <a
            href={ig.startsWith("http") ? ig : `https://instagram.com/${ig.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener"
            className="nav-link mt-2 inline-block text-[13px] font-semibold text-brand-600"
          >
            Instagram
          </a>
        ) : null}
        <p className="mt-3 text-xs text-cocoa-800/45">
          © {new Date().getFullYear()} {brand} · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
