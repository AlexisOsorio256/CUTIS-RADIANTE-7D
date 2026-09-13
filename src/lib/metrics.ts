/**
 * Métricas compartidas (visitas + likes) en Edge Config de Vercel.
 * Sin bases externas. Si falta configuración, devuelve ceros sin romper.
 */

const EC_ID = process.env.METRICS_EC_ID;
const TOK = process.env.METRICS_TOKEN;

export type Metrics = { visits: number; likes: Record<string, number> };

const EMPTY: Metrics = { visits: 0, likes: {} };

function ready(): boolean {
  return Boolean(EC_ID && TOK);
}

async function readItems(): Promise<Metrics> {
  if (!ready()) return EMPTY;
  const res = await fetch(`https://api.vercel.com/v1/edge-config/${EC_ID}/items`, {
    headers: { Authorization: `Bearer ${TOK}` },
    cache: "no-store",
  });
  if (!res.ok) return EMPTY;
  const items = (await res.json()) as { key: string; value: unknown }[];
  const visits = Number(items.find((i) => i.key === "visits")?.value ?? 0) || 0;
  const likes = (items.find((i) => i.key === "likes")?.value ?? {}) as Record<string, number>;
  return { visits, likes };
}

async function writeItems(patch: { visits?: number; likes?: Record<string, number> }): Promise<void> {
  const items = Object.entries(patch).map(([key, value]) => ({
    operation: "upsert",
    key,
    value,
  }));
  const res = await fetch(`https://api.vercel.com/v1/edge-config/${EC_ID}/items`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${TOK}`, "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error("No se pudo guardar la métrica");
}

export async function getMetrics(): Promise<Metrics> {
  try {
    return await readItems();
  } catch {
    return EMPTY;
  }
}

export async function registerVisit(): Promise<void> {
  if (!ready()) return;
  const m = await readItems();
  await writeItems({ visits: m.visits + 1 });
}

export async function addLike(slug: string): Promise<number> {
  if (!ready()) throw new Error("Métricas no configuradas");
  const clean = String(slug ?? "").trim().slice(0, 60);
  if (!clean) throw new Error("Producto inválido");
  const m = await readItems();
  const next = { ...m.likes, [clean]: (Number(m.likes[clean]) || 0) + 1 };
  await writeItems({ likes: next });
  return next[clean];
}
