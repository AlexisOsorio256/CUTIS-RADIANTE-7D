import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/adminAuth";

export async function GET() {
  const ok = verifySession(cookies().get(COOKIE_NAME)?.value);
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
