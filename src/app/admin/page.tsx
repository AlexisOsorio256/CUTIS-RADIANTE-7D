"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser, hasSupabaseEnv } from "@/lib/supabaseClient";

/* ---------- helpers texto <-> lista (para no obligar a editar JSON) ---------- */
const linesToList = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);
const listToLines = (a: string[] = []) => a.join("\n");
const detailsToLines = (d: { label: string; value: string }[] = []) =>
  d.map((x) => `${x.label}: ${x.value}`).join("\n");
const linesToDetails = (t: string) =>
  linesToList(t)
    .map((line) => {
      const i = line.indexOf(":");
      if (i < 0) return null;
      return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
    })
    .filter(Boolean) as { label: string; value: string }[];
const faqsToLines = (f: { q: string; a: string }[] = []) =>
  f.map((x) => `${x.q} | ${x.a}`).join("\n");
const linesToFaqs = (t: string) =>
  linesToList(t)
    .map((line) => {
      const i = line.indexOf("|");
      if (i < 0) return null;
      return { q: line.slice(0, i).trim(), a: line.slice(i + 1).trim() };
    })
    .filter(Boolean) as { q: string; a: string }[];

type Row = Record<string, unknown>;

const EMPTY = {
  slug: "",
  name: "",
  subtitle: "",
  description: "",
  price: "",
  compare_price: "",
  main_image: "",
  gallery: "",
  benefits: "",
  ingredients: "",
  how_to_use: "",
  details: "",
  faqs: "",
  visible: true,
  sort_order: 0,
};

export default function AdminPage() {
  const envOk = useMemo(() => hasSupabaseEnv(), []);
  const [sb] = useState(() => (envOk ? supabaseBrowser() : null));
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Row[]>([]);
  const [settings, setSettings] = useState<Row | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"products" | "settings">("products");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (session && sb) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function loadAll() {
    if (!sb) return;
    const [p, s] = await Promise.all([
      sb.from("products").select("*").order("sort_order"),
      sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    if (p.data) setProducts(p.data);
    if (s.data) setSettings(s.data);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setError("No pudimos entrar. Revisa correo y contraseña.");
  }

  function startNew() {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: products.length + 1 });
  }

  function startEdit(p: Row) {
    setEditing(p);
    setForm({
      slug: String(p.slug ?? ""),
      name: String(p.name ?? ""),
      subtitle: String(p.subtitle ?? ""),
      description: String(p.description ?? ""),
      price: p.price == null ? "" : String(p.price),
      compare_price: p.compare_price == null ? "" : String(p.compare_price),
      main_image: String(p.main_image ?? ""),
      gallery: listToLines((p.gallery as string[]) ?? []),
      benefits: listToLines((p.benefits as string[]) ?? []),
      ingredients: listToLines((p.ingredients as string[]) ?? []),
      how_to_use: listToLines((p.how_to_use as string[]) ?? []),
      details: detailsToLines((p.details as { label: string; value: string }[]) ?? []),
      faqs: faqsToLines((p.faqs as { q: string; a: string }[]) ?? []),
      visible: (p.visible as boolean) !== false,
      sort_order: Number(p.sort_order ?? 0),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file: File): Promise<string> {
    if (!sb) return "";
    setUploading(true);
    try {
      const name = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await sb.storage.from("product-images").upload(name, file, { upsert: true });
      if (error) throw error;
      const { data } = sb.storage.from("product-images").getPublicUrl(name);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    if (!form.name.trim() || !form.slug.trim()) {
      setError("El nombre y el identificador (slug) son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      name: form.name.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      price: form.price === "" ? null : Number(form.price),
      compare_price: form.compare_price === "" ? null : Number(form.compare_price),
      main_image: form.main_image.trim(),
      gallery: linesToList(form.gallery),
      benefits: linesToList(form.benefits),
      ingredients: linesToList(form.ingredients),
      how_to_use: linesToList(form.how_to_use),
      details: linesToDetails(form.details),
      faqs: linesToFaqs(form.faqs),
      visible: form.visible,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } = editing
      ? await sb.from("products").update(payload).eq("id", (editing as Row).id as string)
      : await sb.from("products").insert(payload);
    setSaving(false);
    if (error) {
      setError("No se pudo guardar: " + error.message);
      return;
    }
    setEditing(null);
    setForm(EMPTY);
    loadAll();
  }

  async function remove(id: string) {
    if (!sb || !confirm("¿Eliminar este producto?")) return;
    await sb.from("products").delete().eq("id", id);
    loadAll();
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!sb || !settings) return;
    setSaving(true);
    const { error } = await sb.from("site_settings").update(settings).eq("id", 1);
    setSaving(false);
    if (error) setError(error.message);
    else alert("Configuración guardada ✓");
  }

  if (loading) return <Shell><p className="p-10 text-center">Cargando…</p></Shell>;

  if (!envOk) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg p-8 text-center">
          <h1 className="font-serif text-2xl font-bold">Falta conectar Supabase</h1>
          <p className="mt-3 text-sm leading-relaxed opacity-70">
            Para usar el panel, configura en Vercel (o en <code>.env.local</code>) las variables
            <code> NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            La página pública sigue funcionando con la información de las imágenes.
          </p>
        </div>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <form onSubmit={login} className="mx-auto mt-16 max-w-sm rounded-4xl border border-blush-200 bg-white p-8 shadow-card">
          <h1 className="font-serif text-2xl font-bold text-cocoa-900">Entrar al panel</h1>
          <p className="mt-1 text-sm text-cocoa-800/60">Solo la administradora. No hay registro público.</p>
          <label className="label mt-5">Correo</label>
          <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="label mt-4">Contraseña</label>
          <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
          <button className="btn-primary mt-6 w-full">Entrar</button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cocoa-900">Panel · Cutis Radiante 7D</h1>
            <p className="text-sm text-cocoa-800/60">Edita productos como un formulario sencillo. Los cambios se ven en la página al guardar.</p>
          </div>
          <button
            className="rounded-full border border-blush-200 bg-white px-5 py-2.5 text-sm font-semibold"
            onClick={() => sb?.auth.signOut().then(() => setSession(null))}
          >
            Salir
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          {(["products", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold ${tab === t ? "bg-cocoa-900 text-white" : "bg-white border border-blush-200"}`}
            >
              {t === "products" ? "Productos" : "Configuración"}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}

        {tab === "products" && (
          <>
            {/* Lista */}
            <div className="mt-6 grid gap-3">
              {products.map((p) => (
                <div key={String(p.id)} className="flex items-center gap-4 rounded-3xl border border-blush-200 bg-white p-4 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.main_image ? <img src={String(p.main_image)} alt="" className="h-14 w-14 rounded-2xl object-cover" /> : <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 font-serif text-brand-500">CR</span>}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-cocoa-900">{String(p.name)}</p>
                    <p className="text-xs text-cocoa-800/55">{(p.visible as boolean) ? "● Visible" : "○ Oculto"} · orden {String(p.sort_order)}</p>
                  </div>
                  <button onClick={() => startEdit(p)} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600">Editar</button>
                  <button onClick={() => remove(String(p.id))} className="rounded-full px-3 py-2 text-sm text-red-500">Eliminar</button>
                </div>
              ))}
              <button onClick={startNew} className="rounded-3xl border-2 border-dashed border-brand-200 p-5 font-semibold text-brand-600">+ Agregar producto</button>
            </div>

            {/* Formulario */}
            {(editing || form.name !== "" || form.slug !== "") && (
              <form onSubmit={save} className="mt-8 rounded-4xl border border-blush-200 bg-white p-6 shadow-card md:p-8">
                <h2 className="font-serif text-2xl font-bold">{editing ? "Editar producto" : "Nuevo producto"}</h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div><label className="label">Nombre *</label><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Crema Reparadora" /></div>
                  <div><label className="label">Identificador (slug) *</label><input className="field" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="ej: crema-reparadora" /><p className="hint">Minúsculas, sin espacios. Se genera una vez.</p></div>
                </div>
                <div className="mt-4"><label className="label">Subtítulo</label><input className="field" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Ej: 100% Artesanal · 25 g" /></div>
                <div className="mt-4"><label className="label">Descripción</label><textarea className="field min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div><label className="label">Precio (opcional)</label><input className="field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Vacío = no mostrar" /></div>
                  <div><label className="label">Precio anterior (opcional)</label><input className="field" type="number" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} /></div>
                  <div><label className="label">Orden</label><input className="field" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
                </div>

                <div className="mt-4">
                  <label className="label">Foto principal (URL)</label>
                  <input className="field" value={form.main_image} onChange={(e) => setForm({ ...form, main_image: e.target.value })} placeholder="/images/crema.jpg o https://…" />
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600">
                    {uploading ? "Subiendo…" : "📷 Subir foto"}
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) setForm({ ...form, main_image: await uploadImage(f) });
                    }} />
                  </label>
                  {form.main_image && <PreviewImage src={form.main_image} />}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div><label className="label">Más fotos (una URL por línea)</label><textarea className="field min-h-20" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} /></div>
                  <div><label className="label">Beneficios (uno por línea)</label><textarea className="field min-h-20" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} /></div>
                  <div><label className="label">Ingredientes (uno por línea)</label><textarea className="field min-h-20" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} /></div>
                  <div><label className="label">Modo de uso (un paso por línea)</label><textarea className="field min-h-20" value={form.how_to_use} onChange={(e) => setForm({ ...form, how_to_use: e.target.value })} /></div>
                  <div><label className="label">Detalles (Etiqueta: valor, uno por línea)</label><textarea className="field min-h-20" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder={"Contenido: 25 g\nTipo de piel: Todo tipo"} /></div>
                  <div><label className="label">Preguntas (Pregunta | Respuesta)</label><textarea className="field min-h-20" value={form.faqs} onChange={(e) => setForm({ ...form, faqs: e.target.value })} /></div>
                </div>

                <label className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-50/60 p-4 text-sm font-semibold">
                  <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="h-5 w-5 accent-pink-600" />
                  Visible en la página
                </label>

                <div className="mt-6 flex gap-3">
                  <button disabled={saving} className="btn-primary flex-1">{saving ? "Guardando…" : "Guardar"}</button>
                  <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-ghost">Cancelar</button>
                </div>
              </form>
            )}
          </>
        )}

        {tab === "settings" && settings && (
          <form onSubmit={saveSettings} className="mt-6 rounded-4xl border border-blush-200 bg-white p-6 shadow-card md:p-8">
            <h2 className="font-serif text-2xl font-bold">Configuración general</h2>
            <div className="mt-5 grid gap-4">
              <div><label className="label">Nombre de la marca</label><input className="field" value={String(settings.brand_name ?? "")} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} /></div>
              <div><label className="label">Número de WhatsApp (con código país, sin +)</label><input className="field" value={String(settings.whatsapp_number ?? "")} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value.replace(/\D/g, "") })} placeholder="573132151401" /><p className="hint">Actual: 573132151401 (313 215 1401 · Colombia).</p></div>
              <div><label className="label">Mensaje de WhatsApp</label><input className="field" value={String(settings.whatsapp_message ?? "")} onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })} /><p className="hint">Usa {"{producto}"} donde va el nombre del producto.</p></div>
              <div><label className="label">Instagram (opcional)</label><input className="field" value={String(settings.instagram ?? "")} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} placeholder="@cutisradiante7d o vacío" /></div>
              <div><label className="label">Texto corto del footer</label><input className="field" value={String(settings.footer_text ?? "")} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} /></div>
            </div>
            <button disabled={saving} className="btn-primary mt-6">{saving ? "Guardando…" : "Guardar configuración"}</button>
          </form>
        )}
      </div>
    </Shell>
  );
}

function PreviewImage({ src }: { src: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="Vista previa" className="mt-3 h-32 w-32 rounded-2xl border border-blush-200 object-cover" />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-cream font-sans text-cocoa-900">{children}</div>;
}
