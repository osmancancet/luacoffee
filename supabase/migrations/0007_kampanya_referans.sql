-- Lua Coffee — Günün kahvesi/kampanya şeridi + referans sistemi
-- Supabase SQL Editor'da çalıştırın.

-- ——— Kampanya / günün kahvesi (tek satır) ———
create table if not exists public.kampanya (
  id         int primary key default 1,
  aktif      boolean not null default false,
  metin      text,
  updated_at timestamptz not null default now(),
  constraint kampanya_tek_satir check (id = 1)
);
insert into public.kampanya (id, aktif, metin) values (1, false, 'Günün kahvesi: Lotus Latte ✨')
  on conflict (id) do nothing;

alter table public.kampanya enable row level security;
drop policy if exists "kampanya_select_public" on public.kampanya;
create policy "kampanya_select_public" on public.kampanya for select using (true);

-- ——— Referans (arkadaşını getir) ———
alter table public.sadakat add column if not exists referans_kodu text;
alter table public.sadakat add column if not exists davet_eden uuid references auth.users(id) on delete set null;
alter table public.sadakat add column if not exists referans_odullendi boolean not null default false;

create unique index if not exists sadakat_referans_kodu_uniq
  on public.sadakat (referans_kodu) where referans_kodu is not null;
