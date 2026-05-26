-- Lua Coffee — Yarışma: Google girişi + aylık dönem
-- Kafede Lua bardağıyla çekilen en güzel fotoğraf. Her hesap aylık 1 foto + 1 beğeni.
-- Ayın kazananı; her ay (dönem) sıfırlanır. Supabase SQL Editor'da çalıştırın.

-- ——— submissions: kullanıcı + dönem (YYYY-MM) ———
alter table public.submissions
  add column if not exists kullanici_id uuid references auth.users(id) on delete set null;
alter table public.submissions
  add column if not exists donem text;

update public.submissions set donem = to_char(created_at, 'YYYY-MM') where donem is null;

-- Kişi başına aylık 1 gönderi
create unique index if not exists submissions_user_donem_uniq
  on public.submissions (kullanici_id, donem);

-- ——— votes: kullanıcı + dönem; kişi başına aylık 1 oy ———
alter table public.votes alter column oy_hash drop not null;
alter table public.votes
  add column if not exists kullanici_id uuid references auth.users(id) on delete cascade;
alter table public.votes
  add column if not exists donem text;

update public.votes set donem = to_char(created_at, 'YYYY-MM') where donem is null;

-- Eski cihaz bazlı tekillik yerine kişi+dönem bazlı (ayda 1 oy)
drop index if exists public.votes_contest_oyhash_uniq;
create unique index if not exists votes_user_donem_uniq
  on public.votes (donem, kullanici_id);

-- ——— view: dönem alanını dahil et ———
-- (create or replace kolon sırası değiştiremediği için önce düşürülür)
drop view if exists public.onayli_gonderiler;
create view public.onayli_gonderiler as
  select
    s.id,
    s.contest_id,
    s.donem,
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
