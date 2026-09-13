import { NextResponse } from "next/server";
import { registerVisit } from "@/lib/metrics";

/** Cuenta una visita (el navegador llama una vez por sesión). */
export async function POST() {
  try {
    await registerVisit();
  } catch {
    // no romper la página por un contador
  }
  return NextResponse.json({ ok: true });
}
