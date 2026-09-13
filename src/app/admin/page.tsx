"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser, hasSupabaseEnv } from "@/lib/supabaseClient";
import { loginToEmail } from "@/lib/site";

const linesToList = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);
const listToLines = (a: string[] = []) => a.join("\n");
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Row = Record<string, unknown>;

const EMPTY = {
  name: "",
  price: "",
  main_image: "",
  description: "",
  contenido: "",
  includes: "",
  cta_label: "",
  wa_message: "",
  visible: true,
  sort_order: 0,
};

export default function AdminPage() {
  const envOk = useMemo(() => hasSupabaseEnv(), []);
  const [sb] = useState(() => (envOk ? supabaseBrowser() : null));
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Row[]>([]);
  const [settings, setSettings] = useState<Row | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"products" | "settings">("products");

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
    const { error } = await sb.auth.signInWithPassword({
      email: loginToEmail(user),
      password,
    });
    if (error) setError("Usuario o contraseña incorrectos. Intenta de nuevo 💗");
  }

  function firstDetail(p: Row): string {
    const d = p.details as { label: string; value: string }[] | undefined;
    return d && d.length > 0 ? d[0].value : "";
  }

  function startNew() {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: products.length + 1, cta_label: "Mándame mensaje" });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(p: Row) {
    setEditing(p);
    setForm({
      name: String(p.name ?? ""),
      price: p.price == null ? "" : String(p.price),
      main_image: String(p.main_image ?? ""),
      description: String(p.description ?? ""),
      contenido: firstDetail(p),
      includes: listToLines((p.includes as string[]) ?? []),
      cta_label: String((p.cta_label as string) ?? "") || "Mándame mensaje",
      wa_message: String((p.wa_message as string) ?? ""),
      visible: (p.visible as boolean) !== false,
      sort_order: Number(p.sort_order ?? 0),
    });
    setShowForm(true);
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
    } catch {
      setError("No se pudo subir la foto. Intenta de nuevo.");
      return form.main_image;
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    if (!form.name.trim()) {
      setError("Escribe el nombre del producto 💗");
      return;
    }
    setSaving(true);
    setError("");

    const prevDetails = ((editing?.details as { label: string; value: string }[]) ?? []);
    const details =
      form.contenido.trim()
        ? [{ label: prevDetails[0]?.label || "Contenido", value: form.contenido.trim() }]
        : prevDetails;

    const payload = {
      slug: editing ? String(editing.slug) : slugify(form.name),
      name: form.name.trim(),
      subtitle: String(editing?.subtitle ?? "Cutis Radiante 7D 💗"),
      description: form.description.trim(),
      price: form.price === "" ? null : Number(form.price),
      compare_price: (editing?.compare_price as number | null) ?? null,
      main_image: form.main_image.trim(),
      gallery: ((editing?.gallery as string[]) ?? []) as string[],
      benefits: ((editing?.benefits as string[]) ?? []) as string[],
      ingredients: ((editing?.ingredients as string[]) ?? []) as string[],
      how_to_use: ((editing?.how_to_use as string[]) ?? []) as string[],
      details,
      includes: linesToList(form.includes),
      cta_label: form.cta_label.trim() || "Mándame mensaje",
      wa_message: form.wa_message.trim(),
      faqs: ((editing?.faqs as { q: string; a: string }[]) ?? []) as { q: string; a: string }[],
      visible: form.visible,
      sort_order: Number(form.sort_order) || 0,
    };

    const { error } = editing
      ? await sb.from("products").update(payload).eq("id", editing.id as string)
      : await sb.from("products").insert(payload);
    setSaving(false);
    if (error) {
      setError("No se pudo guardar: " + error.message);
      return;
    }
    setEditing(null);
    setForm(EMPTY);
    setShowForm(false);
    loadAll();
  }

  async function remove(id: string, name: string) {
    if (!sb || !confirm(`¿Eliminar "${name}" de la página?`)) return;
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
    else alert("Guardado ✓ Ya se ve en la página 💗");
  }

  if (loading) return <Shell><p className="p-10 text-center">Cargando… 💗</p></Shell>;

  if (!envOk) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg p-8 text-center">
          <h1 className="font-serif text-2xl font-bold">Falta conectar la tienda</h1>
          <p className="mt-3 text-sm leading-relaxed opacity-70">
            Pide al administrador que configure Supabase en Vercel.
          </p>
        </div>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <form onSubmit={login} className="mx-auto mt-14 max-w-sm rounded-4xl border border-blush-200 bg-white p-8 shadow-card">
          <p className="text-center font-serif text-3xl">💗</p>
          <h1 className="mt-2 text-center font-serif text-2xl font-bold text-cocoa-900">
            Hola, entra aquí
          </h1>
          <label className="label mt-5">Usuario</label>
          <input
            className="field"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Tu usuario"
            autoComplete="username"
            required
          />
          <label className="label mt-4">Contraseña</label>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            required
          />
          {error && <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>}
          <button className="btn-primary mt-6 w-full">Entrar 💗</button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-[26px] font-bold text-cocoa-900">Mis productos 💗</h1>
            <p className="text-sm text-cocoa-800/60">Lo que cambies aquí se ve en la página.</p>
          </div>
          <button
            className="rounded-full border border-blush-200 bg-white px-4 py-2 text-sm font-semibold"
            onClick={() => sb?.auth.signOut().then(() => setSession(null))}
          >
            Salir
          </button>
        </div>

        <div className="mt-5 flex gap-2">
          {(["products", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setShowForm(false); }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold ${tab === t ? "bg-cocoa-900 text-white" : "border border-blush-200 bg-white"}`}
            >
              {t === "products" ? "💄 Productos" : "⚙️ Datos"}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}

        {tab === "products" && !showForm && (
          <div className="mt-5 space-y-3">
            {products.map((p) => (
              <div key={String(p.id)} className="flex items-center gap-3 rounded-3xl border border-blush-200 bg-white p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.main_image ? (
                  <img src={String(p.main_image)} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                ) : (
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 font-serif text-brand-500">CR</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-cocoa-900">{String(p.name)}</p>
                  <p className="text-xs text-cocoa-800/55">
                    {(p.price as number | null) != null ? `$${p.price} pesos` : "Sin precio"} · {(p.visible as boolean) ? "Se ve 👀" : "Oculto 🙈"}
                  </p>
                </div>
                <button onClick={() => startEdit(p)} className="shrink-0 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                  Editar
                </button>
                <button onClick={() => remove(String(p.id), String(p.name))} className="shrink-0 px-2 py-2 text-sm text-red-400" aria-label="Eliminar">
                  🗑️
                </button>
              </div>
            ))}
            <button onClick={startNew} className="w-full rounded-3xl border-2 border-dashed border-brand-200 p-5 font-semibold text-brand-600">
              + Agregar producto
            </button>
          </div>
        )}

        {tab === "products" && showForm && (
          <form onSubmit={save} className="mt-5 rounded-4xl border border-blush-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold">{editing ? "Editar producto" : "Nuevo producto"}</h2>

            <label className="label mt-4">Nombre</label>
            <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Crema Reparadora" />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="label">Precio (pesos)</label>
                <input className="field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="180" />
              </div>
              <div>
                <label className="label">Contenido</label>
                <input className="field" value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} placeholder="25 g" />
              </div>
            </div>

            <label className="label mt-4">Foto</label>
            {form.main_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.main_image} alt="Vista previa" className="mb-2 h-28 w-28 rounded-2xl border border-blush-200 object-cover" />
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white">
              {uploading ? "Subiendo…" : "📷 Cambiar foto"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setForm({ ...form, main_image: await uploadImage(f) });
                }}
              />
            </label>

            <label className="label mt-4">Descripción</label>
            <textarea className="field min-h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <label className="label mt-4">Si es kit: lo que incluye (uno por línea)</label>
            <textarea className="field min-h-20" value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} placeholder="🧴 Exfoliante…" />

            <label className="label mt-4">Texto del botón</label>
            <input className="field" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="Mándame mensaje" />

            <label className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-50/60 p-4 text-sm font-semibold">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="h-5 w-5 accent-pink-600" />
              Se ve en la página 👀
            </label>

            <div className="mt-5 flex gap-3">
              <button disabled={saving} className="btn-primary flex-1 !py-3.5">
                {saving ? "Guardando…" : "Guardar 💗"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY); }} className="btn-ghost">
                Atrás
              </button>
            </div>
          </form>
        )}

        {tab === "settings" && settings && (
          <form onSubmit={saveSettings} className="mt-5 rounded-4xl border border-blush-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold">Datos de la tienda</h2>
            <label className="label mt-4">Número de WhatsApp</label>
            <input className="field" value={String(settings.whatsapp_number ?? "")} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value.replace(/\D/g, "") })} />
            <p className="hint">Con código de país, sin + ni espacios. Ej: 523132151401</p>
            <label className="label mt-4">Mensaje automático</label>
            <input className="field" value={String(settings.whatsapp_message ?? "")} onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })} />
            <p className="hint">{"{producto}"} se cambia solo por el nombre del producto.</p>
            <label className="label mt-4">Instagram (si tienes, si no déjalo vacío)</label>
            <input className="field" value={String(settings.instagram ?? "")} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} />
            <button disabled={saving} className="btn-primary mt-5 w-full !py-3.5">
              {saving ? "Guardando…" : "Guardar 💗"}
            </button>
          </form>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-cream font-sans text-cocoa-900">{children}</div>;
}
