-- Lua Coffee — Check-in (ziyaret serisi) + "En çok ziyaret edenler" sıralaması
-- Kafedeyken günde 1 check-in; seri + rozet (ödülsüz teşvik).
-- Supabase SQL Editor'da çalıştırın.

create table if not exists public.ziyaretler (
  kullanici_id uuid primary key references auth.users(id) on delete cascade,
  ad           text,
  seri         int not null default 0,        -- güncel ardışık gün serisi
  en_uzun_seri int not null default 0,         -- rekor seri
  toplam       int not null default 0,         -- toplam check-in
  son_tarih    date,                            -- son check-in günü
  updated_at   timestamptz not null default now()
);

-- Yazma sunucu (service_role) ile. Liderlik tablosu için ad + sayılar herkese açık okunur.
alter table public.ziyaretler enable row level security;

drop policy if exists "ziyaret_select_public" on public.ziyaretler;
create policy "ziyaret_select_public" on public.ziyaretler
  for select using (true);

create index if not exists ziyaretler_toplam_idx on public.ziyaretler (toplam desc);
