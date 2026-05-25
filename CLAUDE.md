@AGENTS.md

# CLAUDE.md — Lua Coffee

Bu dosya, bu depoda çalışan Claude Code (ve geliştiriciler) için rehberdir.
(Next.js sürüm notları için yukarıdaki @AGENTS.md'ye bakın.)

## Proje Özeti
**Lua Coffee** — bir kahve dükkanının tanıtım web sitesi + **QR tabanlı fotoğraf
yarışması**. Müşteriler kafedeki QR kodu okutup fotoğraf yükler; admin onayladıktan
sonra fotoğraf galeride görünür ve ziyaretçiler oy verir. Dil: **Türkçe**.

Marka kimliği koyu / ay temalı (siyah zemin, beyaz tipografi, hilal ay logosu).
"lua" = Portekizce "ay".

## Teknoloji Yığını
- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Supabase**: Postgres (veri), Storage (görseller), Auth (admin girişi)
- **qrcode** (yazdırılabilir QR), **lucide-react** (ikon), **clsx/tailwind-merge**
- Fontlar: Playfair Display (serif başlık) + Inter (gövde)
- Deploy: **Vercel**

## Komutlar
```bash
npm run dev     # geliştirme sunucusu (http://localhost:3000)
npm run build   # production derleme
npm run start   # derlenmiş uygulamayı çalıştır
npm run lint    # ESLint
```

## Dizin Yapısı
```
src/
  app/
    page.tsx                  Ana sayfa (hero, hakkımızda, menü önizleme, yarışma CTA)
    menu/page.tsx             Menü (lib/menu.ts'ten)
    yarisma/page.tsx          Galeri + oylama
    yarisma/katil/page.tsx    Katılım/yükleme formu (QR buraya yönlenir)
    yarisma/tesekkurler/      Yükleme sonrası onay ekranı
    admin/page.tsx            Admin: giriş + onay paneli + QR üretici
    api/
      submissions/route.ts    POST: fotoğraf yükleme → durum 'beklemede'
      votes/route.ts          POST: oy ver (cihaz hash dedup)
      admin/route.ts          GET bekleyenler / PATCH onayla-reddet (auth korumalı)
  components/                 Header, Footer, UploadForm, VoteButton, QrPanel
  lib/
    menu.ts                   Menü verisi (kafenin görsellerinden birebir)
    utils.ts                  cn(), fiyat()
    voteHash.ts               IP+UA → anonim oy hash
    supabase/client.ts        tarayıcı istemcisi (anon key)
    supabase/server.ts        sunucu istemcisi + service_role istemcisi
supabase/migrations/0001_init.sql   şema + RLS + storage bucket
public/logo.png, public/lua/*.png   marka görselleri
```

## Veri Modeli (Supabase)
- `contests` — yarışmalar (`aktif` bool; en yeni aktif olan kullanılır)
- `submissions` — gönderiler; `durum`: `beklemede | onaylandi | reddedildi`
- `votes` — oylar; `UNIQUE(contest_id, oy_hash)` → cihaz başına yarışmada 1 oy
- `onayli_gonderiler` view — onaylı gönderiler + oy sayısı

## İş Kuralları
- **Onay akışı:** Yüklenen her fotoğraf `beklemede`. Admin onaylamadan galeride görünmez.
- **Oy tekilliği:** Cihaz bazlı. `oy_hash = sha256(IP + UA + VOTE_SALT)`. DB unique index
  + 23505 hata kontrolü ile aynı cihaz yarışmada bir kez oy verir. İstemci tarafında
  localStorage ile de işaretlenir (UX).
- **Aktif yarışma:** `contests.aktif=true` olan en yeni kayıt.

## Güvenlik Konvansiyonu (ÖNEMLİ)
- Tüm **yazma** işlemleri (yükleme, oy, onay) sunucu route'larında `service_role`
  istemcisiyle yapılır (`createServiceClient`). **`SUPABASE_SERVICE_ROLE_KEY` asla
  client'a/`NEXT_PUBLIC_` değişkenine konmaz.**
- Admin route'ları (`/api/admin`) çağrı başında oturum doğrular (`auth.getUser`).
- RLS: public yalnız aktif yarışmaları ve onaylı gönderileri okuyabilir.

## Ortam Değişkenleri (`.env.local`)
`.env.example` dosyasını kopyalayın:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (gizli, sadece sunucu)
- `VOTE_SALT` (rastgele uzun değer)
- `NEXT_PUBLIC_SITE_URL` (QR hedefi; Vercel'de canlı URL)

## Kurulum (ilk kez)
1. Supabase projesi oluştur.
2. `supabase/migrations/0001_init.sql` içeriğini Supabase SQL Editor'da çalıştır
   (tablolar + RLS + `submissions` storage bucket + örnek yarışma).
3. Supabase → Authentication → Users'tan bir **admin** e-posta/şifre hesabı ekle.
4. `.env.local`'i doldur, `npm run dev`.

## Konvansiyonlar
- Arayüz metinleri ve kod alan adları **Türkçe** (`baslik`, `durum`, `oySayisi` …).
- Yeni menü ürünleri `src/lib/menu.ts` içinde düzenlenir.
- Tema renkleri `src/app/globals.css` içindeki CSS değişkenlerinde (`--background`,
  `--accent` …). Tailwind sınıflarında `bg-[var(--surface)]` gibi kullanılır.

## Vercel Deploy
1. Repo'yu Vercel'e bağla (Framework: Next.js — otomatik algılanır).
2. Yukarıdaki ortam değişkenlerini Vercel proje ayarlarına ekle
   (`NEXT_PUBLIC_SITE_URL`'i canlı domain yap).
3. Deploy. `next/image` Supabase Storage domaini `next.config.ts`'te tanımlı.
