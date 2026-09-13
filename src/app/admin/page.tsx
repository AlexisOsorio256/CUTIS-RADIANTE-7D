"use client";

import { useEffect, useState } from "react";

const linesToList = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);
const listToLines = (a: string[] = []) => a.join("\n");

type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number | null;
  main_image: string;
  gallery: string[];
  ingredients: string[];
  details: { label: string; value: string }[];
  includes: string[];
  cta_label: string;
  wa_message: string;
  visible: boolean;
  sort_order: number;
  [k: string]: unknown;
};

type Settings = {
  brand_name: string;
  whatsapp_number: string;
  whatsapp_message: string;
  instagram: string;
  footer_text: string;
};

type Metrics = { visits: number; likes: Record<string, number>; totalLikes: number };

const EMPTY = {
  name: "",
  price: "",
  main_image: "",
  description: "",
  contenido: "",
  includes: "",
  cta_label: "",
};

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"resumen" | "products" | "settings">("resumen");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => setLogged(r.ok))
      .catch(() => setLogged(false))
      .finally(() => setChecking(false));
  }, []);

  async function loadAll() {
    const r = await fetch("/api/admin/data");
    if (!r.ok) {
      setLogged(false);
      return;
    }
    const d = await r.json();
    setProducts((d.products ?? []).sort((a: Product, b: Product) => a.sort_order - b.sort_order));
    setSettings(d.settings);
  }

  async function loadMetrics() {
    const r = await fetch("/api/admin/metrics");
    if (!r.ok) return;
    setMetrics(await r.json());
  }

  useEffect(() => {
    if (logged) {
      loadAll();
      loadMetrics();
    }
  }, [logged]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      setError(d.error ?? "No se pudo entrar");
      return;
    }
    setPassword("");
    setLogged(true);
  }

  async function logout() {
    await fetch("/api/admin/me", { method: "POST" });
    setLogged(false);
  }

  function firstDetail(p: Product): string {
    return p.details && p.details.length > 0 ? p.details[0].value : "";
  }

  function startNew() {
    setEditingId(null);
    setForm({ ...EMPTY, cta_label: "Mándame mensaje" });
    setShowForm(true);
    setError("");
    setOk("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price == null ? "" : String(p.price),
      main_image: p.main_image,
      description: p.description,
      contenido: firstDetail(p),
      includes: listToLines(p.includes),
      cta_label: p.cta_label || "Mándame mensaje",
    });
    setShowForm(true);
    setError("");
    setOk("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const r = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "No se pudo subir");
      setForm((f) => ({ ...f, main_image: d.path }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  }

  function buildProducts(): Product[] {
    const prev = editingId ? products.find((p) => p.id === editingId) : undefined;
    const base: Product = prev ?? {
      id: `p${Date.now()}`,
      slug: "",
      name: "",
      subtitle: "Cutis Radiante 7D 💗",
      description: "",
      price: null,
      main_image: "",
      gallery: [],
      ingredients: [],
      details: [],
      includes: [],
      cta_label: "Mándame mensaje",
      wa_message: "",
      visible: true,
      sort_order: products.length,
    };
    const updated: Product = {
      ...base,
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price === "" ? null : Number(form.price),
      main_image: form.main_image.trim(),
      details: form.contenido.trim()
        ? [{ label: base.details[0]?.label || "Contenido", value: form.contenido.trim() }]
        : base.details,
      includes: linesToList(form.includes),
      cta_label: form.cta_label.trim() || "Mándame mensaje",
    };
    if (editingId) return products.map((p) => (p.id === editingId ? updated : p));
    return [...products, updated];
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Escribe el nombre del producto 💗");
      return;
    }
    setSaving(true);
    setError("");
    setOk("");
    const r = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: buildProducts(), settings }),
    });
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) {
      setError(d.error ?? "No se pudo guardar");
      return;
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
    setOk("Guardado 💗 La página se actualiza sola en 1-2 minutos.");
    loadAll();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`¿Quitar "${name}" de la página?`)) return;
    setSaving(true);
    const r = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: products.filter((p) => p.id !== id), settings }),
    });
    setSaving(false);
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      setError(d.error ?? "No se pudo eliminar");
      return;
    }
    setOk("Eliminado 💗 La página se actualiza sola en 1-2 minutos.");
    loadAll();
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    setOk("");
    const r = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products, settings }),
    });
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) {
      setError(d.error ?? "No se pudo guardar");
      return;
    }
    setOk("Guardado 💗 La página se actualiza sola en 1-2 minutos.");
  }

  if (checking) return <Shell><p className="p-10 text-center">Cargando… 💗</p></Shell>;

  if (!logged) {
    return (
      <Shell>
        <form onSubmit={login} className="mx-auto mt-14 max-w-sm rounded-4xl border border-blush-200 bg-white p-8 shadow-card">
          <p className="text-center font-serif text-3xl">💗</p>
          <h1 className="mt-2 text-center font-serif text-2xl font-bold text-cocoa-900">
            Hola, entra aquí
          </h1>
          <p className="mt-1 text-center text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-800/45">
            🔒 Solo administradora
          </p>
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

  const top = [...products]
    .map((p) => ({ ...p, likes: metrics ? Number(metrics.likes[p.slug] ?? 0) : 0 }))
    .sort((a, b) => b.likes - a.likes);
  const maxLikes = Math.max(1, ...top.map((p) => p.likes));

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 py-8">
        {/* Encabezado: deja claro que está en administrador */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-cocoa-900 p-6 text-white shadow-float md:p-7">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
            <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
          </div>
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur">
                🔒 Modo administrador
              </p>
              <h1 className="mt-2.5 font-serif text-[24px] font-bold leading-tight md:text-[28px]">
                Bienvenida Sussy a tu panel de control 💗
              </h1>
            </div>
            <button
              className="shrink-0 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
              onClick={logout}
            >
              Salir
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          {(
            [
              ["resumen", "📊 Resumen"],
              ["products", "💄 Productos"],
              ["settings", "⚙️ Datos"],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => { setTab(t); setShowForm(false); setOk(""); setError(""); if (t === "resumen") loadMetrics(); }}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold sm:px-5 ${tab === t ? "bg-cocoa-900 text-white" : "border border-blush-200 bg-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
        {ok && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700">{ok}</p>}

        {tab === "resumen" && (
          <div className="mt-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="card p-4 text-center sm:p-5">
                <p className="text-2xl sm:text-3xl">👀</p>
                <p className="mt-1 font-serif text-2xl font-bold text-cocoa-900 sm:text-3xl">
                  {metrics ? metrics.visits.toLocaleString("es-MX") : "…"}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-cocoa-800/55 sm:text-xs">
                  Visitas
                </p>
              </div>
              <div className="card p-4 text-center sm:p-5">
                <p className="text-2xl sm:text-3xl">💗</p>
                <p className="mt-1 font-serif text-2xl font-bold text-cocoa-900 sm:text-3xl">
                  {metrics ? metrics.totalLikes.toLocaleString("es-MX") : "…"}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-cocoa-800/55 sm:text-xs">
                  Me gustas
                </p>
              </div>
              <div className="card p-4 text-center sm:p-5">
                <p className="text-2xl sm:text-3xl">🛍️</p>
                <p className="mt-1 font-serif text-2xl font-bold text-cocoa-900 sm:text-3xl">
                  {products.filter((p) => p.visible).length}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-cocoa-800/55 sm:text-xs">
                  A la venta
                </p>
              </div>
            </div>

            <div className="card mt-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-lg font-bold text-cocoa-900">Lo más querido 💗</h2>
                <button onClick={loadMetrics} className="rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold text-brand-600">
                  🔄 Actualizar
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {top.map((p) => (
                  <div key={p.id}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <p className="truncate font-semibold text-cocoa-900">{p.name}</p>
                      <p className="shrink-0 font-bold text-brand-600">💗 {p.likes}</p>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-brand-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700"
                        style={{ width: `${Math.round((p.likes / maxLikes) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-cocoa-800/55">
                👀 Visitas = veces que abrieron tu página. 💗 Me gustas = corazones que tocaron tus clientas en cada producto.
              </p>
            </div>
          </div>
        )}

        {tab === "products" && !showForm && (
          <div className="mt-5 space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-3xl border border-blush-200 bg-white p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.main_image ? (
                  <img src={p.main_image} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-500 font-serif text-sm font-bold text-white">KIT</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-cocoa-900">{p.name}</p>
                  <p className="text-xs text-cocoa-800/55">
                    {p.price != null ? `$${p.price} pesos` : "Sin precio"} · 💗 {metrics ? Number(metrics.likes[p.slug] ?? 0) : "…"} · {p.visible ? "Se ve 👀" : "Oculto 🙈"}
                  </p>
                </div>
                <button onClick={() => startEdit(p)} className="shrink-0 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                  Editar
                </button>
                <button onClick={() => remove(p.id, p.name)} className="shrink-0 px-2 py-2 text-sm" aria-label="Eliminar">
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
            <h2 className="font-serif text-xl font-bold">{editingId ? "Editar producto" : "Nuevo producto"}</h2>

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
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
              />
            </label>

            <label className="label mt-4">Descripción</label>
            <textarea className="field min-h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <label className="label mt-4">Si es kit: lo que incluye (uno por línea)</label>
            <textarea className="field min-h-20" value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} placeholder="🧴 Exfoliante…" />

            <label className="label mt-4">Texto del botón</label>
            <input className="field" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="Mándame mensaje" />

            <div className="mt-5 flex gap-3">
              <button disabled={saving} className="btn-primary flex-1 !py-3.5">
                {saving ? "Guardando…" : "Guardar 💗"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY); }} className="btn-ghost">
                Atrás
              </button>
            </div>
          </form>
        )}

        {tab === "settings" && settings && (
          <form onSubmit={saveSettings} className="mt-5 rounded-4xl border border-blush-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold">Datos de la tienda</h2>
            <label className="label mt-4">Número de WhatsApp</label>
            <input className="field" value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value.replace(/\D/g, "") })} />
            <p className="hint">Con código de país, sin + ni espacios. Ej: 523132151401</p>
            <label className="label mt-4">Mensaje automático</label>
            <input className="field" value={settings.whatsapp_message} onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })} />
            <p className="hint">{"{producto}"} se cambia solo por el nombre del producto.</p>
            <label className="label mt-4">Instagram (si tienes, si no déjalo vacío)</label>
            <input className="field" value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} />
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
