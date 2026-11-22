-- Ejecutá todo este archivo en Supabase > SQL Editor > New query.
create extension if not exists pgcrypto;

create table if not exists public.puestos_artesania (
  id uuid primary key default gen_random_uuid(),
  nombre_punto text not null,
  latitud numeric not null check (latitud between -90 and 90),
  longitud numeric not null check (longitud between -180 and 180),
  numero_puesto text not null,
  sector text not null,
  rubro text not null check (rubro in ('cerámica', 'tejido')),
  created_at timestamptz not null default now()
);

alter table public.puestos_artesania enable row level security;

-- Política para la aplicación de examen (permite leer, crear, editar y eliminar).
-- Usar únicamente la clave anon/public en el sitio. No publicar la service_role.
drop policy if exists "Acceso público de práctica" on public.puestos_artesania;
create policy "Acceso público de práctica"
on public.puestos_artesania
for all
to anon, authenticated
using (true)
with check (true);

insert into public.puestos_artesania
(nombre_punto, latitud, longitud, numero_puesto, sector, rubro)
values
('Artesanías Ñandutí', -25.2637, -57.5759, '1', 'Sector A', 'tejido'),
('Cerámica Guaraní', -25.2651, -57.5780, '2', 'Sector B', 'cerámica'),
('Tejidos del Paraguay', -25.2619, -57.5728, '3', 'Sector A', 'tejido');
