-- Lua Coffee — Sadakat CRM: doğum günü + kuponlar + işlem geçmişi
-- Supabase SQL Editor'da çalıştırın.

-- ——— sadakat: doğum günü ———
alter table public.sadakat add column if not exists dogum_ay_gun text;   -- 'MM-DD'
alter table public.sadakat add column if not exists son_dogum_yili int;  -- ödül verilen son yıl

-- ——— kuponlar (doğum günü / kilometre taşı / manuel) ———
create table if not exists public.kuponlar (
  id           uuid primary key default gen_random_uuid(),
  kullanici_id uuid not null references auth.users(id) on delete cascade,
  baslik       text not null,
  tip          text not null,            -- 'dogumgunu' | 'kilometre' | 'manuel'
  anahtar      text,                      -- tekrar vermeyi önlemek için (ör. 'ziyaret-10')
  durum        text not null default 'aktif' check (durum in ('aktif', 'kullanildi')),
  created_at   timestamptz not null default now(),
  used_at      timestamptz
);
create index if not exists kuponlar_kullanici_idx on public.kuponlar (kullanici_id, durum);
create unique index if not exists kuponlar_anahtar_uniq
  on public.kuponlar (kullanici_id, anahtar) where anahtar is not null;

alter table public.kuponlar enable row level security;
drop policy if exists "kupon_select_self" on public.kuponlar;
create policy "kupon_select_self" on public.kuponlar
  for select using (auth.uid() = kullanici_id);

-- ——— sadakat işlem geçmişi (admin görünürlüğü) ———
create table if not exists public.sadakat_islem (
  id           uuid primary key default gen_random_uuid(),
  kullanici_id uuid references auth.users(id) on delete set null,
  ad           text,
  tip          text not null,            -- 'damga' | 'kullanim' | 'manuel' | 'kupon' | 'checkin'
  adet         int not null default 0,
  not_         text,
  created_at   timestamptz not null default now()
);
create index if not exists sadakat_islem_tarih_idx on public.sadakat_islem (created_at desc);

alter table public.sadakat_islem enable row level security;  -- public erişim yok; sunucu okur
