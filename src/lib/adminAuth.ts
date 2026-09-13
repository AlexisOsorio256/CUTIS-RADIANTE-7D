import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "cr7d_admin";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const ADMIN_USER = "sussy85";
export const COOKIE_NAME = COOKIE;

function secret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD no configurado");
  return s;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("hex");
}

/** Crea el valor de la cookie de sesión (válida 7 días). */
export function createSession(): { value: string; expires: Date } {
  const exp = Date.now() + SEVEN_DAYS;
  const data = `${ADMIN_USER}.${exp}`;
  return { value: `${data}.${sign(data)}`, expires: new Date(exp) };
}

/** Verifica usuario + contraseña del login. */
export function checkLogin(user: string, password: string): boolean {
  try {
    return (
      user.trim().toLowerCase() === ADMIN_USER &&
      password === secret()
    );
  } catch {
    return false;
  }
}

/** Verifica la cookie de sesión. */
export function verifySession(raw: string | undefined): boolean {
  try {
    if (!raw) return false;
    const [user, exp, sig] = raw.split(".");
    if (user !== ADMIN_USER || !exp || !sig) return false;
    if (Number(exp) < Date.now()) return false;
    const expected = sign(`${user}.${exp}`);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
