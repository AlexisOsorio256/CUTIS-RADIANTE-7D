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

type Review = {
  id: string;
  product: string;
  description: string;
  photos: string[];
  visible: boolean;
  sort_order: number;
};

const EMPTY = {
  name: "",
  price: "",
  main_image: "",
  description: "",
  contenido: "",
  includes: "",
};

const EMPTY_REVIEW = {
  product: "",
  description: "",
  photos: [] as string[],
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW);
  const [uploadingReview, setUploadingReview] = useState(false);
  /* Vista previa inmediata: el archivo subido a GitHub tarda 1-2 min en
     publicarse, así que mientras tanto mostramos el dataUrl local. */
  const [productPreview, setProductPreview] = useState("");
  const [reviewPreviewMap, setReviewPreviewMap] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"resumen" | "products" | "reviews" | "settings">("resumen");

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
    setReviews(
      (Array.isArray(d.reviews) ? d.reviews : []).sort(
        (a: Review, b: Review) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      )
    );
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
    setForm({ ...EMPTY });
    setProductPreview("");
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
    });
    setProductPreview("");
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
      // Vista previa inmediata con la imagen local
      setProductPreview(dataUrl);
      const r = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "No se pudo subir");
      // Se guarda la ruta del servidor; la vista previa sigue siendo local
      // hasta que Vercel la publique (1-2 min)
      setForm((f) => ({ ...f, main_image: d.path }));
    } catch (e) {
      setProductPreview("");
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
    const isKit = (prev?.includes?.length ?? 0) > 0 || linesToList(form.includes).length > 0;
    const updated: Product = {
      ...base,
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price === "" ? null : Number(form.price),
      main_image: form.main_image.trim(),
      details: form.contenido.trim()
        ? [{ label: base.details[0]?.label || "Contenido", value: form.contenido.trim() }]
        : base.details,
      includes: isKit ? linesToList(form.includes) : base.includes,
    };
    if (editingId) return products.map((p) => (p.id === editingId ? updated : p));
    return [...products, updated];
  }

  async function persist(nextProducts: Product[], nextReviews: Review[], nextSettings: Settings | null) {
    const r = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: nextProducts, settings: nextSettings, reviews: nextReviews }),
    });
    return r;
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
    const r = await persist(buildProducts(), reviews, settings);
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) {
      setError(d.error ?? "No se pudo guardar");
      return;
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
    setProductPreview("");
    setOk("Guardado 💗 La página se actualiza sola en 1-2 minutos.");
    loadAll();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`¿Quitar "${name}" de la página?`)) return;
    setSaving(true);
    const r = await persist(
      products.filter((p) => p.id !== id),
      reviews,
      settings
    );
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
    const r = await persist(products, reviews, settings);
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) {
      setError(d.error ?? "No se pudo guardar");
      return;
    }
    setOk("Guardado 💗 La página se actualiza sola en 1-2 minutos.");
  }

  /* ---------- Reseñas ---------- */
  function startNewReview() {
    setEditingReviewId(null);
    setReviewForm({ ...EMPTY_REVIEW });
    setShowReviewForm(true);
    setError("");
    setOk("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEditReview(rv: Review) {
    setEditingReviewId(rv.id);
    setReviewForm({
      product: rv.product,
      description: rv.description,
      photos: [...(rv.photos ?? [])],
    });
    setShowReviewForm(true);
    setError("");
    setOk("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadReviewImage(file: File) {
    setUploadingReview(true);
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
      // Vista previa inmediata: se guarda la ruta pero se muestra la imagen local
      setReviewPreviewMap((m) => ({ ...m, [d.path]: dataUrl }));
      setReviewForm((f) => ({ ...f, photos: [...f.photos, d.path].slice(0, 6) }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la foto");
    } finally {
      setUploadingReview(false);
    }
  }

  function buildReviews(): Review[] {
    const base: Review = editingReviewId
      ? (reviews.find((r) => r.id === editingReviewId) ?? {
          id: editingReviewId,
          product: "",
          description: "",
          photos: [],
          visible: true,
          sort_order: reviews.length,
        })
      : {
          id: `r${Date.now()}`,
          product: "",
          description: "",
          photos: [],
          visible: true,
          sort_order: reviews.length,
        };
    const updated: Review = {
      ...base,
      product: reviewForm.product.trim(),
      description: reviewForm.description.trim(),
      photos: reviewForm.photos,
    };
    if (editingReviewId) return reviews.map((r) => (r.id === editingReviewId ? updated : r));
    return [...reviews, updated];
  }

  async function saveReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewForm.product.trim()) {
      setError("Escribe de qué producto es la reseña.");
      return;
    }
    if (reviewForm.photos.length === 0) {
      setError("Sube al menos 1 foto de evidencia.");
      return;
    }
    setSaving(true);
    setError("");
    setOk("");
    const r = await persist(products, buildReviews(), settings);
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) {
      setError(d.error ?? "No se pudo guardar");
      return;
    }
    setShowReviewForm(false);
    setEditingReviewId(null);
    setReviewForm({ ...EMPTY_REVIEW });
    setOk("Reseña guardada. Aparece en la página principal en 1-2 minutos.");
    loadAll();
  }

  async function removeReview(id: string) {
    if (!confirm("¿Quitar esta reseña de la página?")) return;
    setSaving(true);
    const r = await persist(
      products,
      reviews.filter((x) => x.id !== id),
      settings
    );
    setSaving(false);
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      setError(d.error ?? "No se pudo eliminar");
      return;
    }
    setOk("Reseña eliminada 💗");
    loadAll();
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
        <a href="/" className="btn-ghost mx-auto mt-3 flex max-w-sm !py-3">
          ← Volver a la página
        </a>
      </Shell>
    );
  }

  const top = [...products]
    .map((p) => ({ ...p, likes: metrics ? Number(metrics.likes[p.slug] ?? 0) : 0 }))
    .sort((a, b) => b.likes - a.likes);
  const maxLikes = Math.max(1, ...top.map((p) => p.likes));
  const editingHasIncludes =
    (editingId ? (products.find((p) => p.id === editingId)?.includes.length ?? 0) : 0) > 0;

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

        <div className="mt-5 flex flex-wrap gap-2">
          {(
            [
              ["resumen", "📊 Resumen"],
              ["products", "💄 Productos"],
              ["reviews", "Reseñas"],
              ["settings", "⚙️ Datos"],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => { setTab(t); setShowForm(false); setShowReviewForm(false); setOk(""); setError(""); if (t === "resumen") loadMetrics(); }}
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
            {(productPreview || form.main_image) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={productPreview || form.main_image} alt="Vista previa" className="mb-2 h-28 w-28 rounded-2xl border border-blush-200 object-cover" />
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
            <textarea className="field min-h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="¿Para qué sirve? Escríbelo con tus palabras 💗" />

            {(editingHasIncludes || form.includes.trim()) && (
              <>
                <label className="label mt-4">El kit incluye (uno por línea)</label>
                <textarea className="field min-h-20" value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} />
              </>
            )}

            <div className="mt-5 flex gap-3">
              <button disabled={saving} className="btn-primary flex-1 !py-3.5">
                {saving ? "Guardando…" : "Guardar 💗"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY); setProductPreview(""); }} className="btn-ghost">
                Atrás
              </button>
            </div>
          </form>
        )}

        {tab === "reviews" && !showReviewForm && (
          <div className="mt-5 space-y-3">
            <div className="rounded-3xl border border-blush-200 bg-white p-4 text-sm leading-relaxed text-cocoa-800/70">
              Sube las capturas de tus clientas. Se publican solas en la página principal,
              debajo de productos, en <b>Reseñas de Cutis Radiante 7D</b>.
            </div>
            {reviews.length === 0 && (
              <p className="rounded-3xl border border-blush-200 bg-white p-5 text-center text-sm text-cocoa-800/60">
                Aún no hay reseñas. Toca “+ Agregar reseña” para subir la primera.
              </p>
            )}
            {reviews.map((rv) => (
              <div key={rv.id} className="flex items-center gap-3 rounded-3xl border border-blush-200 bg-white p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {rv.photos[0] ? (
                  <img src={reviewPreviewMap[rv.photos[0]] || rv.photos[0]} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blush-100 text-sm font-bold text-cocoa-800/50">
                    {rv.photos.length}/6
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-cocoa-900">{rv.product || "Sin título"}</p>
                  <p className="truncate text-xs text-cocoa-800/55">
                    {rv.photos.length} de 6 fotos · {rv.description ? rv.description.slice(0, 60) : "Sin descripción"}
                  </p>
                </div>
                <button onClick={() => startEditReview(rv)} className="shrink-0 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                  Editar
                </button>
                <button onClick={() => removeReview(rv.id)} className="shrink-0 px-2 py-2 text-sm" aria-label="Eliminar reseña">
                  🗑️
                </button>
              </div>
            ))}
            <button onClick={startNewReview} className="w-full rounded-3xl border-2 border-dashed border-brand-200 p-5 font-semibold text-brand-600">
              + Agregar reseña
            </button>
          </div>
        )}

        {tab === "reviews" && showReviewForm && (
          <form onSubmit={saveReview} className="mt-5 rounded-4xl border border-blush-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold">{editingReviewId ? "Editar reseña" : "Nueva reseña"}</h2>

            <label className="label mt-4">Producto</label>
            <input
              className="field"
              list="productos-sugeridos"
              value={reviewForm.product}
              onChange={(e) => setReviewForm({ ...reviewForm, product: e.target.value })}
              placeholder="Ej: Crema Reparadora"
            />
            <datalist id="productos-sugeridos">
              {products.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
            <p className="hint">Elige de la lista o escribe el nombre.</p>

            <label className="label mt-4">Descripción</label>
            <textarea
              className="field min-h-20"
              value={reviewForm.description}
              onChange={(e) => setReviewForm({ ...reviewForm, description: e.target.value })}
              placeholder="Ej: En dos semanas notó su piel más luminosa."
            />

            <label className="label mt-4">Fotos ({reviewForm.photos.length}/6)</label>
            {reviewForm.photos.length > 0 && (
              <div className="mb-3 grid grid-cols-2 gap-2">
                {reviewForm.photos.map((src, i) => (
                  <div key={`${src}-${i}`} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={reviewPreviewMap[src] || src} alt={`Evidencia ${i + 1}`} className="h-36 w-full rounded-2xl border border-blush-200 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setReviewForm((f) => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }));
                        setReviewPreviewMap((m) => {
                          const next = { ...m };
                          delete next[src];
                          return next;
                        });
                      }}
                      className="absolute right-2 top-2 rounded-full bg-cocoa-900/80 px-2.5 py-1 text-xs font-bold text-white"
                      aria-label="Quitar foto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {reviewForm.photos.length < 6 && (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-cocoa-900 px-5 py-2.5 text-sm font-semibold text-white">
                {uploadingReview ? "Subiendo…" : "Subir foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadReviewImage(f);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
            <p className="hint">Sube una por una. La primera será la portada.</p>

            <div className="mt-5 flex gap-3">
              <button disabled={saving || uploadingReview} className="btn-primary flex-1 !py-3.5">
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" onClick={() => { setShowReviewForm(false); setEditingReviewId(null); setReviewForm({ ...EMPTY_REVIEW }); }} className="btn-ghost">
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
