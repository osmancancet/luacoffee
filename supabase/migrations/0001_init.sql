-- Lua Coffee — yarışma şeması
-- Supabase SQL Editor'a yapıştırıp çalıştırın (veya supabase CLI ile migrate edin).

-- ============ Tablolar ============

create table if not exists public.contests (
  id          uuid primary key default gen_random_uuid(),
  baslik      text not null,
  aciklama    text,
  baslangic   timestamptz,
  bitis       timestamptz,
  aktif       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.submissions (
  id           uuid primary key default gen_random_uuid(),
  contest_id   uuid not null references public.contests(id) on delete cascade,
  baslik       text,
  aciklama     text,
  gorsel_url   text not null,
  yukleyen_ad  text,
  durum        text not null default 'beklemede'
                 check (durum in ('beklemede', 'onaylandi', 'reddedildi')),
  created_at   timestamptz not null default now()
);

create table if not exists public.votes (
  id            uuid primary key default gen_random_uuid(),
  contest_id    uuid not null references public.contests(id) on delete cascade,
  submission_id uuid not null references public.submissions(id) on delete cascade,
  oy_hash       text not null,
  created_at    timestamptz not null default now()
);

-- Cihaz başına bir yarışmada yalnızca 1 oy
create unique index if not exists votes_contest_oyhash_uniq
  on public.votes (contest_id, oy_hash);

create index if not exists submissions_contest_durum_idx
  on public.submissions (contest_id, durum);

-- ============ Görünüm: onaylı gönderiler + oy sayısı ============

create or replace view public.onayli_gonderiler as
  select
    s.id,
    s.contest_id,
    s.baslik,
    s.aciklama,
    s.gorsel_url,
    s.yukleyen_ad,
    s.created_at,
    count(v.id) as oy_sayisi
  from public.submissions s
  left join public.votes v on v.submission_id = s.id
  where s.durum = 'onaylandi'
  group by s.id;

-- ============ RLS ============
-- Yazma işlemleri service_role (sunucu) üzerinden yapılır; RLS public'i kısıtlar.

alter table public.contests    enable row level security;
alter table public.submissions enable row level security;
alter table public.votes       enable row level security;

-- Public sadece aktif yarışmaları ve onaylı gönderileri okuyabilir.
drop policy if exists "contests_select_public" on public.contests;
create policy "contests_select_public" on public.contests
  for select using (true);

drop policy if exists "submissions_select_approved" on public.submissions;
create policy "submissions_select_approved" on public.submissions
  for select using (durum = 'onaylandi');

-- votes: public okuma/yazma kapalı (sunucu service_role ile yazar).

-- ============ Storage bucket ============
-- 'submissions' adlı public-read bucket'ı oluşturur.
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', true)
on conflict (id) do nothing;

-- ============ Örnek yarışma (isteğe bağlı) ============
insert into public.contests (baslik, aciklama, aktif)
values ('Lua Anı Yarışması', 'En güzel Lua anını paylaş, oyları topla!', true)
on conflict do nothing;
