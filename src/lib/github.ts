/**
 * Guarda cambios directamente en el repositorio GitHub (que Vercel
 * vuelve a publicar solo). Sin bases de datos externas.
 * Requiere GITHUB_TOKEN con permiso Contents (lectura y escritura)
 * solo en este repositorio.
 */

const REPO = process.env.GITHUB_REPO || "AlexisOsorio256/CUTIS-RADIANTE-7D";
const BRANCH = "main";

function token(): string {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error("Falta GITHUB_TOKEN: pide al administrador que lo configure en Vercel.");
  return t;
}

async function currentSha(path: string): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token()}`, Accept: "application/vnd.github+json" } }
  );
  if (!res.ok) return undefined;
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
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token()}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, content: body, branch: BRANCH, ...(sha ? { sha } : {}) }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub no aceptó el cambio (${res.status}): ${err.slice(0, 200)}`);
  }
}
