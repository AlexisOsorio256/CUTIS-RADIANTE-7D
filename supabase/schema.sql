-- Cutis Radiante 7D · Esquema mínimo Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- (Si ya lo ejecutaste antes, también funciona: solo agrega lo nuevo)

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
  includes text[] default '{}',
  cta_label text default 'Mándame mensaje',
  wa_message text default '',
  faqs jsonb default '[]'::jsonb,
  visible boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Por si la tabla ya existía: agregar columnas nuevas
alter table public.products add column if not exists includes text[] default '{}';
alter table public.products add column if not exists cta_label text default 'Mándame mensaje';
alter table public.products add column if not exists wa_message text default '';

-- Configuración general (una sola fila id=1)
create table if not exists public.site_settings (
  id int primary key,
  brand_name text default 'Cutis Radiante 7D',
  whatsapp_number text default '523132151401',
  whatsapp_message text default 'Hola, me interesa {producto} 💗 ¿Me das más información?',
  instagram text default '',
  footer_text text default 'Cosmética artesanal · Ingredientes naturales'
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- Catálogo con precios (borra los anteriores y deja estos)
delete from public.products;

insert into public.products (slug, name, subtitle, description, price, main_image, gallery, ingredients, details, includes, cta_label, wa_message, sort_order) values
('crema-reparadora','Crema Reparadora','Cutis Radiante 7D 💗','Auxilia en manchas, marcas, arrugas y líneas de expresión. Hidrata, suaviza, rejuvenece y unifica el tono. Ayuda a calmar resequedad, irritaciones y granitos.', 180, '/images/crema-reparadora-real.jpg', array['/images/crema-reparadora-etiqueta.jpg'], array['Sebo de res','Miel de manuka','Vitamina E','Aceite de rosa mosqueta'], '[{"label":"Contenido","value":"25 g"}]'::jsonb, '{}', 'Mándame mensaje', '', 1),
('crema-ultra-master','Crema Ultra Master Aclarante','Cutis Radiante 7D 💗','Para manchas profundas, oscuras, marcas y cicatrices ✨ Unifica el tono y deja la piel luminosa. Aplicar únicamente por las noches.', 220, '/images/crema-ultra-master.jpg', '{}', '{}', '[{"label":"Contenido","value":"50 g"}]'::jsonb, '{}', 'Mándame mensaje', '', 2),
('exfoliante-arroz','Exfoliante Aclarante de Arroz','Cutis Radiante 7D 💗','Exfolia suavemente y elimina células muertas. Aclara y unifica el tono, reduce manchas y deja la piel suave y luminosa ✨ Usar solo 2 veces por semana.', 180, '/images/exfoliante.jpg', '{}', '{}', '[{"label":"Contenido","value":"50 g"}]'::jsonb, '{}', 'Mándame mensaje', '', 3),
('jabon','Jabón','Cutis Radiante 7D 💗','Limpia suavemente sin resecar, elimina impurezas, unifica el tono y deja la piel suave, hidratada y luminosa ✨ Para todo tipo de piel.', 90, '/images/jabon.jpg', '{}', '{}', '[{"label":"Contenido","value":"100 g"}]'::jsonb, '{}', 'Mándame mensaje', '', 4),
('bloqueador-fps75','Bloqueador Solar FPS 75','Cutis Radiante 7D 💗','Protege del sol, previene manchas, unifica el tono y retrasa el envejecimiento ✨ Protección UVA/UVB. Usar 15 min antes de exponerse al sol.', 295, '/images/bloqueador.jpg', '{}', '{}', '[{"label":"Contenido","value":"125 g"}]'::jsonb, '{}', 'Mándame mensaje', '', 5),
('kit-completo','Kit Completo','Cutis Radiante 7D 💗','Todo lo que necesitas para tu rutina completa de cuidado facial ✨', 750, '/images/kit-facial.jpg', '{}', '{}', '[{"label":"Presentación","value":"Kit de 5 piezas"}]'::jsonb, array['🧴 Exfoliante Aclarante de Arroz · 50 g','🧼 Jabón · 100 g','✨ Crema Reparadora · 25 g','✨ Crema Ultra Master Aclarante · 50 g','☀️ Bloqueador Solar FPS 75 · 125 g'], 'Quiero apartar mi kit', 'Hola, quiero apartar mi KIT COMPLETO 💗 ¿Me ayudas con mi pedido?', 6);

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
