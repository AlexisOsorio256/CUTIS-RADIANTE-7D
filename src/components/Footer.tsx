type Props = {
  brand: string;
};

/** Solo derechos. El acceso Admin vive en el menú superior. */
export default function Footer({ brand }: Props) {
  return (
    <footer className="border-t border-blush-200/60 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 py-6 text-center lg:px-8">
        <p className="text-xs text-cocoa-800/55">
          © {new Date().getFullYear()} {brand} · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
