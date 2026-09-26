/**
 * Guarda cambios directamente en el repositorio GitHub (que Vercel
 * vuelve a publicar solo). Sin bases de datos externas.
 * Requiere GITHUB_TOKEN con permiso Contents (lectura y escritura)
 * solo en este repositorio.
 */

const REPO = process.env.GITHUB_REPO || "AlexisOsorio256/CUTIS-RADIANTE-7D";
const BRANCH = "main";

/**
 * Al copiar el token desde un archivo de texto se arrastra lo que lo
 * rodeaba (por ejemplo "crema cutis repo: github_pat_..."). GitHub contesta
 * 401 Bad credentials igual que si el token estuviera vencido, así que aquí se
 * limpia el valor y se rescata el token si venía con texto pegado alrededor.
 */
function token(): string {
  const raw = (process.env.GITHUB_TOKEN ?? "").trim();
  if (!raw) {
    throw new Error(
      "Falta GITHUB_TOKEN: agrégalo en Vercel (Settings > Environment Variables) y vuelve a desplegar."
    );
  }
  const found = raw.match(/github_pat_[A-Za-z0-9_]+/) ?? raw.match(/gh[pousr]_[A-Za-z0-9_]+/);
  if (found) return found[0];
  throw new Error(
    "GITHUB_TOKEN no parece un token de GitHub: copia solo el valor que empieza con github_pat_."
  );
}

const contents = (path: string) =>
  `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

function auth(): Record<string, string> {
  return { Authorization: `Bearer ${token()}`, Accept: "application/vnd.github+json" };
}

/** Convierte la respuesta de GitHub en un mensaje que dice qué corregir. */
async function fail(res: Response): Promise<never> {
  const raw = await res.text().catch(() => "");
  let detail = raw.slice(0, 160);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.message) detail = String(parsed.message);
  } catch {
    /* no era JSON: se deja el texto recortado */
  }
  if (res.status === 401) {
    throw new Error(
      `GitHub rechazó el token (401: ${detail}). El GITHUB_TOKEN de Vercel está mal pegado o revocado: ` +
        `vuelve a copiarlo y a desplegar.`
    );
  }
  if (res.status === 403) {
    throw new Error(
      `El token no tiene permiso de escritura (403: ${detail}). Revisa que tenga ` +
        `"Contents: Read and write" sobre ${REPO}.`
    );
  }
  if (res.status === 404) {
    throw new Error(`No se encontró ${REPO} en la rama ${BRANCH} (404: ${detail}). Revisa GITHUB_REPO.`);
  }
  throw new Error(`GitHub no aceptó el cambio (${res.status}): ${detail}`);
}

/** SHA actual del archivo, o undefined si todavía no existe (se creará). */
async function currentSha(path: string): Promise<string | undefined> {
  const res = await fetch(`${contents(path)}?ref=${BRANCH}`, { headers: auth() });
  // Solo el 404 significa "archivo nuevo". Antes cualquier fallo (incluido un
  // token roto) se tomaba como "no existe" y terminaba en un error inútil.
  if (res.status === 404) return undefined;
  if (!res.ok) await fail(res);
  const data = await res.json();
  return data.sha as string | undefined;
}

/** Crea o actualiza un archivo del repo. `content` en texto o base64. */
export async function commitFile(
  path: string,
  content: string,
  message: string,
  base64 = false
): Promise<void> {
  const body = base64 ? content : Buffer.from(content, "utf8").toString("base64");
  const sha = await currentSha(path);
  const res = await fetch(contents(path), {
    method: "PUT",
    headers: { ...auth(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: body, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) await fail(res);
}
