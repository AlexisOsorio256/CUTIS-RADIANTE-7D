import { NextResponse } from "next/server";
import { checkLogin, createSession, COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Panel aún no configurado. Avisa al administrador." },
      { status: 503 }
    );
  }
  const { user, password } = await req.json().catch(() => ({}));
  if (!checkLogin(String(user ?? ""), String(password ?? ""))) {
    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos. Intenta de nuevo 💗" },
      { status: 401 }
    );
  }
  const session = createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: session.expires,
  });
  return res;
}
