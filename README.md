# Cutis Radiante 7D · Página + Panel

Página premium rosa para vender cosmética artesanal por WhatsApp, con panel `/admin` para editar productos sin programar.

## 1. Instalar y correr

```bash
npm install
npm run dev     # http://localhost:3000
```

## 2. Fotos reales (obligatorio)

Guarda las 7 imágenes del chat en `public/images/` con estos nombres exactos:

- `jabon.jpg`
- `exfoliante.jpg`
- `crema-ultra-master.jpg`
- `bloqueador.jpg`
- `crema-reparadora-etiqueta.jpg`
- `crema-reparadora-real.jpg`
- `kit-facial.jpg`

WhatsApp central: `573132151401` (313 215 1401). Se cambia en un solo lugar: tabla `site_settings` o `src/lib/site.ts`.

## 3. Supabase (solo para el panel admin)

1. Crea proyecto en https://supabase.com → copia **Project URL** y **anon public key**.
2. En Supabase → **SQL Editor** → pega y ejecuta todo `supabase/schema.sql`.
3. En **Storage** crea el bucket público `product-images`.
4. En **Authentication → Users** crea tu usuario admin (ej: tu correo + contraseña).
5. Variables de entorno (Vercel → Settings → Environment Variables, y local en `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Sin estas variables la página pública sigue funcionando con los datos de las imágenes; solo `/admin` pide conectarlas.

## 4. Usar el panel

1. Abre `tu-url.vercel.app/admin` → entra con tu correo y contraseña.
2. **Productos**: Editar / Agregar / ocultar / eliminar. Todo es un formulario simple (sin JSON).
3. **Fotos**: pega URL o usa “📷 Subir foto” (va a Storage y se guarda sola la URL).
4. **Configuración**: marca, número de WhatsApp, mensaje (`{producto}` se reemplaza solo), Instagram, texto del footer.
5. Guarda y recarga la página pública: se ve al instante.

## 5. Subir a GitHub + Vercel

```bash
git init -b main
git add .
git commit -m "Cutis Radiante 7D: página + panel admin"
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

En https://vercel.com → **Add New Project** → importa el repo → agrega las 2 variables de entorno → **Deploy**. Cada `git push` a `main` redespliega solo.
