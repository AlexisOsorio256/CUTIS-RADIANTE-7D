import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/adminAuth";
import tienda from "@/data/tienda.json";

export async function GET() {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "No entraste" }, { status: 401 });
  }
  return NextResponse.json(tienda);
}
