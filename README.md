# Lua Coffee ☕🌙

Kahve dükkanı tanıtım sitesi + **QR tabanlı fotoğraf yarışması**. Müşteriler QR
okutup fotoğraf yükler, admin onaylar, ziyaretçiler oy verir. Next.js + Supabase,
Vercel'de yayınlanır.

## Hızlı Başlangıç

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev                  # http://localhost:3000
```

## Supabase Kurulumu
1. [supabase.com](https://supabase.com) üzerinde yeni proje oluşturun.
2. **SQL Editor**'da `supabase/migrations/0001_init.sql` dosyasını çalıştırın
   (tablolar, RLS politikaları, `submissions` storage bucket ve örnek bir yarışma).
3. **Project Settings → API**'den `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` ve `service_role` anahtarını alın → `.env.local`.
4. **Authentication → Users → Add user** ile bir admin e-posta/şifre hesabı ekleyin
   (admin paneline `/admin`'den giriş için).

## Ortam Değişkenleri
| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon anahtar |
| `SUPABASE_SERVICE_ROLE_KEY` | **Gizli** — sadece sunucu, client'a koymayın |
| `VOTE_SALT` | Oy hash'i için rastgele uzun değer |
| `NEXT_PUBLIC_SITE_URL` | QR hedefi (lokalde `http://localhost:3000`) |

## Sayfalar
- `/` — Ana sayfa  ·  `/menu` — Menü
- `/yarisma` — Galeri + oylama  ·  `/yarisma/katil` — Katılım (QR hedefi)
- `/admin` — Yönetim (onay + QR üretici)

## Vercel Deploy
Repo'yu Vercel'e bağlayın, ortam değişkenlerini ekleyin (`NEXT_PUBLIC_SITE_URL`'i
canlı domain yapın) ve deploy edin. Framework otomatik algılanır.

Ayrıntılı geliştirici notları için [CLAUDE.md](CLAUDE.md).
