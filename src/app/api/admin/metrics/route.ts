import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/adminAuth";
import { getMetrics } from "@/lib/metrics";

/** Métricas para el panel: visitas + likes por producto. */
export async function GET() {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "No entraste" }, { status: 401 });
  }
  const m = await getMetrics();
  const totalLikes = Object.values(m.likes).reduce((a, b) => a + (Number(b) || 0), 0);
  return NextResponse.json({ ...m, totalLikes });
}
