import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/adminAuth";
import { commitFile } from "@/lib/github";

/** Sube una foto a public/images del repo (máx ~3 MB). */
export async function POST(req: Request) {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "No entraste" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const dataUrl = String(body?.dataUrl ?? "");
  const m = dataUrl.match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/);
  if (!m) {
    return NextResponse.json({ error: "Mándame una foto JPG o PNG 💗" }, { status: 400 });
  }
  const base64 = m[3];
  if (base64.length > 4_200_000) {
    return NextResponse.json({ error: "La foto pesa mucho. Usa una más pequeña 💗" }, { status: 400 });
  }
  const ext = m[2] === "png" ? "png" : m[2] === "webp" ? "webp" : "jpg";
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  try {
    await commitFile(`public/images/${safe}`, base64, `Subir foto ${safe} 💗`, true);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo subir" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, path: `/images/${safe}` });
}
