import { NextResponse } from "next/server";
import { addLike } from "@/lib/metrics";

/** Un me gusta a un producto. Devuelve el nuevo total. */
export async function POST(req: Request) {
  const { slug } = await req.json().catch(() => ({}));
  try {
    const count = await addLike(String(slug ?? ""));
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo registrar" },
      { status: 500 }
    );
  }
}
