-- Lua Coffee — Web Push abonelikleri + aylık yarışma kazananları
-- Supabase SQL Editor'da çalıştırın.

-- ——— Push abonelikleri ———
create table if not exists public.push_aboneleri (
  endpoint     text primary key,
  kullanici_id uuid references auth.users(id) on delete cascade,
  p256dh       text not null,
  auth         text not null,
  created_at   timestamptz not null default now()
);
create index if not exists push_kullanici_idx on public.push_aboneleri (kullanici_id);
alter table public.push_aboneleri enable row level security;  -- sadece sunucu

-- ——— Aylık yarışma kazananları (admin "ayı kapat" ile) ———
create table if not exists public.kazananlar (
  donem       text primary key,          -- 'YYYY-MM'
  submission_id uuid references public.submissions(id) on delete set null,
  ad          text,
  baslik      text,
  gorsel_url  text,
  oy_sayisi   int not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.kazananlar enable row level security;
drop policy if exists "kazanan_select_public" on public.kazananlar;
create policy "kazanan_select_public" on public.kazananlar
  for select using (true);
