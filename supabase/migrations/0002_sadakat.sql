-- Lua Coffee — Sadakat (damga) sistemi · Google girişine bağlı
-- QR ile damga toplama: 5 damga → 6. kahve bedava.
-- Supabase SQL Editor'da çalıştırın.

create table if not exists public.sadakat (
  kullanici_id uuid primary key references auth.users(id) on delete cascade,
  ad           text,
  eposta       text,
  damga        int not null default 0,        -- mevcut ilerleme (0–4)
  bedava_hak   int not null default 0,        -- kazanılmış, kullanılmamış bedava kahve
  toplam_damga int not null default 0,        -- ömür boyu toplam damga
  son_ekleme   timestamptz,                   -- cooldown
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Yazma sunucu (service_role) ile yapılır. Kullanıcı yalnız kendi kaydını okuyabilir.
alter table public.sadakat enable row level security;

drop policy if exists "sadakat_select_self" on public.sadakat;
create policy "sadakat_select_self" on public.sadakat
  for select using (auth.uid() = kullanici_id);
