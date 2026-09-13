-- Cutis Radiante 7D · Esquema mínimo Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor

create extension if not exists "pgcrypto";

-- Productos
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text default '',
  description text default '',
  price numeric null,
  compare_price numeric null,
  main_image text default '',
  gallery text[] default '{}',
  benefits text[] default '{}',
  ingredients text[] default '{}',
  how_to_use text[] default '{}',
  details jsonb default '[]'::jsonb,
  faqs jsonb default '[]'::jsonb,
  visible boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Configuración general (una sola fila id=1)
create table if not exists public.site_settings (
  id int primary key,
  brand_name text default 'Cutis Radiante 7D',
  whatsapp_number text default '573132151401',
  whatsapp_message text default 'Hola, me interesa {producto}. Quisiera más información.',
  instagram text default '',
  footer_text text default 'Cosmética artesanal · Ingredientes naturales'
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- Productos iniciales (transcritos de las imágenes reales)
insert into public.products (slug, name, subtitle, description, main_image, gallery, benefits, ingredients, how_to_use, details, sort_order) values
('crema-reparadora','Crema Cutis Radiante 7D Reparadora','100% Artesanal · Ingredientes Naturales','Nuestra crema estrella: hidrata, suaviza y rejuvenece mientras ayuda a unificar el tono.', '/images/crema-reparadora-etiqueta.jpg', array['/images/crema-reparadora-real.jpg','/images/kit-facial.jpg'], array['Auxilia en manchas, marcas, arrugas y líneas de expresión','Hidrata, suaviza, rejuvenece y unifica el tono','Ayuda a calmar resequedad, irritaciones y granitos'], array['Sebo de res','Miel de manuka','Vitamina E','Aceite de rosa mosqueta'], array['Aplica sobre rostro limpio','Masajea hasta absorber','Úsala de día y de noche'], '[{"label":"Contenido","value":"25 g"}]'::jsonb, 1),
('jabon','Jabón Cutis Radiante 7D','Limpieza suave diaria','Limpia suavemente sin resecar, elimina impurezas, unifica el tono y deja la piel suave, hidratada y luminosa.', '/images/jabon.jpg', array['/images/kit-facial.jpg'], array['Limpia suavemente sin resecar','Elimina impurezas','Unifica el tono','Piel suave, hidratada y luminosa'], '{}', array['Frotar sobre piel húmeda','Masajear y enjuagar','Uso de día y de noche'], '[{"label":"Contenido neto","value":"100 g"},{"label":"Tipo de piel","value":"Todo tipo de piel"}]'::jsonb, 2),
('exfoliante-arroz','Exfoliante Aclarante de Arroz','Cutis Radiante 7D · 50 g','Exfolia suavemente, elimina células muertas, aclara y unifica el tono.', '/images/exfoliante.jpg', array['/images/kit-facial.jpg'], array['Exfolia suavemente, elimina células muertas','Aclara y unifica el tono, reduce manchas','Deja la piel suave y luminosa'], '{}', array['Masajear por el rostro','Dejar reposar 3 minutos y enjuagar','Usar solo 2 veces por semana'], '[{"label":"Contenido","value":"50 g"}]'::jsonb, 3),
('crema-ultra-master','Crema Ultra Master Aclarante','Para manchas profundas','Para manchas profundas, oscuras, marcas y cicatrices. Unifica el tono.', '/images/crema-ultra-master.jpg', array['/images/kit-facial.jpg'], array['Para manchas profundas, oscuras, marcas y cicatrices','Unifica el tono y deja la piel luminosa'], '{}', array['Aplicar únicamente por las noches','Lavar el rostro por las mañanas'], '[{"label":"Contenido neto","value":"50 g"}]'::jsonb, 4),
('bloqueador-fps75','Bloqueador Solar FPS 75','Protección UVA/UVB','Protege del sol, previene manchas, unifica el tono y retrasa el envejecimiento.', '/images/bloqueador.jpg', array['/images/kit-facial.jpg'], array['Protege del sol y previene manchas','Aclara y unifica el tono','Retrasa el envejecimiento','Hidrata y suaviza'], '{}', array['Usar 15 minutos antes de exponerse al sol'], '[{"label":"Contenido","value":"125 g"}]'::jsonb, 5)
on conflict (slug) do nothing;

-- Storage para fotos (crear bucket 'product-images' público en Dashboard > Storage)
-- insert into storage.buckets (id, name, public) values ('product-images','product-images', true)
-- on conflict (id) do nothing;

-- Seguridad: lectura pública, escritura solo admin autenticado
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Lectura pública productos" on public.products;
create policy "Lectura pública productos"
  on public.products for select using (true);

drop policy if exists "Admin escribe productos" on public.products;
create policy "Admin escribe productos"
  on public.products for all using (auth.role() = 'authenticated');

drop policy if exists "Lectura pública settings" on public.site_settings;
create policy "Lectura pública settings"
  on public.site_settings for select using (true);

drop policy if exists "Admin escribe settings" on public.site_settings;
create policy "Admin escribe settings"
  on public.site_settings for all using (auth.role() = 'authenticated');
