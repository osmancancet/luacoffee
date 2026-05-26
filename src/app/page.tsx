import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Camera,
  Coffee,
  ImageIcon,
  CalendarDays,
  MapPin,
  Clock,
  LogIn,
  QrCode,
  Gift,
  Check,
  Heart,
  Trophy,
  Flame,
  Star,
} from "lucide-react";
import { espressoCoffee } from "@/lib/menu";
import { fiyat, donemAdi } from "@/lib/utils";
import { site } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/Reveal";

export const revalidate = 300; // kazanan vitrini için ISR

type Kazanan = {
  donem: string;
  ad: string | null;
  baslik: string | null;
  gorsel_url: string | null;
  oy_sayisi: number;
};

const oneCikanlar = [
  { href: "/menu", ikon: Coffee, baslik: "Menü", metin: "Espresso, imza içecekler ve dahası" },
  { href: "/galeri", ikon: ImageIcon, baslik: "Galeri", metin: "Mekânımızdan kareler" },
  { href: "/yarisma", ikon: Camera, baslik: "Yarışma", metin: "Anını paylaş, oy topla" },
  { href: "/etkinlikler", ikon: CalendarDays, baslik: "Etkinlikler", metin: "Olan biten ve duyurular" },
];

export default async function AnaSayfa() {
  const oneCikan = espressoCoffee.slice(0, 6);

  let kazanan: Kazanan | null = null;
  let kampanya: { aktif: boolean; metin: string } | null = null;
  try {
    const supabase = createServiceClient();
    const [kz, km] = await Promise.all([
      supabase
        .from("kazananlar")
        .select("donem, ad, baslik, gorsel_url, oy_sayisi")
        .order("donem", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("kampanya").select("aktif, metin").eq("id", 1).maybeSingle(),
    ]);
    kazanan = (kz.data as Kazanan) ?? null;
    kampanya = km.data ?? null;
  } catch {
    kazanan = null;
  }

  return (
    <>
      {/* ===== Kampanya / günün kahvesi şeridi ===== */}
      {kampanya?.aktif && kampanya.metin && (
        <div className="bg-[var(--accent-strong)] px-5 py-2.5 text-center text-sm font-medium text-black">
          {kampanya.metin}
        </div>
      )}

      {/* ===== Hero ===== */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/lua/1.png"
          alt=""
          fill
          priority
          className="anim-zoom -z-10 object-cover object-bottom opacity-[0.18] blur-[3px]"
        />
        {/* Koyu gradyan + hafif vinyet: arka plan dokusu kalır, yazı net okunur */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--background)]/80 via-[var(--background)]/85 to-[var(--background)]" />
        <div className="absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_center,transparent_0%,var(--background)_75%)]" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-32 text-center sm:py-44">
          <h1 className="anim-drop font-serif text-6xl leading-[0.95] sm:text-8xl">
            Lua Coffee
          </h1>
          <p className="anim-fade-up delay-3 mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            {site.aciklama}
          </p>

          {/* Özellik rozetleri: sadakat + yarışma */}
          <div className="anim-fade-up delay-4 mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/sadakat"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-4 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <Gift size={14} className="text-[var(--accent)]" /> 5 kahveye 1 bedava
            </Link>
            <Link
              href="/yarisma"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-4 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <Camera size={14} className="text-[var(--accent)]" /> Fotoğraf yarışması
            </Link>
            <Link
              href="/sadakat"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-4 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <Flame size={14} className="text-orange-400" /> Ziyaret serisi
            </Link>
          </div>

          <div className="anim-fade-up delay-5 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-7 py-3.5 text-sm font-medium text-black transition-transform hover:scale-105"
            >
              Menüyü Keşfet
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/yarisma"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-7 py-3.5 text-sm font-medium transition-colors hover:border-[var(--accent)]"
            >
              <Camera size={16} /> Fotoğraf Yarışması
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Marka tanıtımı ===== */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[var(--border)]">
            <Image
              src="/galeri/ic-mekan-genis.png"
              alt="Lua Coffee iç mekânı"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              Hakkımızda
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Soma&apos;da iyi kahvenin adresi
            </h2>
            <p className="mt-5 leading-relaxed text-[var(--muted)]">
              {site.hakkimizda.paragraflar[0]}
            </p>
            <Link
              href="/hakkimizda"
              className="group mt-7 inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              Hikâyemizi oku
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== Öne çıkanlar ===== */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {oneCikanlar.map((k, i) => (
              <Reveal key={k.href} delay={i * 80}>
                <Link
                  href={k.href}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
                >
                  <k.ikon size={24} className="text-[var(--accent)]" />
                  <h3 className="mt-4 font-serif text-xl">{k.baslik}</h3>
                  <p className="mt-1 flex-1 text-sm text-[var(--muted)]">{k.metin}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--accent)]">
                    Keşfet
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Menü önizleme ===== */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              Menü
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Öne çıkanlar</h2>
          </div>
          <Link
            href="/menu"
            className="group inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Tümünü gör
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {oneCikan.map((u, i) => (
            <Reveal
              key={u.ad}
              delay={i * 70}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition-colors hover:border-[var(--accent)]"
            >
              <span>{u.ad}</span>
              <span className="text-sm text-[var(--accent)]">{fiyat(u.hot ?? u.cold)}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Sadakat ===== */}
      <section id="sadakat" className="border-y border-[var(--border)] bg-[var(--surface)]/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                Sadakat
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                5 kahveye 1 bedava
              </h2>
              <p className="mt-5 leading-relaxed text-[var(--muted)]">
                Lua Sadakat ile her kahvende damga topla. 5 damga tamamlanınca
                6. kahve bizden! Google ile giriş yap; kartın hesabına bağlansın,
                telefon değişse bile damgaların kaybolmasın.
              </p>

              <ol className="mt-7 space-y-4">
                {[
                  { ikon: LogIn, b: "Google ile giriş yap", m: "Sadakat kartın saniyeler içinde hazır." },
                  { ikon: QrCode, b: "Kasadaki QR'ı okut", m: "Kafedeyken okut; kaç kahve aldıysan o kadar damga." },
                  { ikon: Gift, b: "6. kahve bedava", m: "5 damga dolunca bedava kahveni kasada kullan." },
                ].map((s, i) => (
                  <li key={s.b} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]">
                      <s.ikon size={17} />
                    </span>
                    <span>
                      <span className="font-medium">
                        {i + 1}. {s.b}
                      </span>
                      <span className="block text-sm text-[var(--muted)]">{s.m}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted)]">
                <span className="font-medium text-[var(--foreground)]">
                  <Flame size={14} className="mr-1 inline text-orange-400" />
                  Check-in & Seri:
                </span>{" "}
                Her ziyarette check-in yap, rozet topla ve{" "}
                <span className="text-[var(--foreground)]">En Çok Ziyaret Edenler</span>{" "}
                listesinde yerini al.
              </div>

              <Link
                href="/sadakat"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
              >
                <LogIn size={16} /> Giriş Yap & Kartını Aç
              </Link>
            </Reveal>

            {/* Damga kartı görseli */}
            <Reveal delay={120}>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                <p className="font-serif text-xl">Lua Sadakat Kartı</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Her kahve bir damga</p>
                <div className="mt-7 grid grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < 3 ? (
                      <span
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-full bg-white"
                      >
                        <Image src="/logo.png" alt="" width={30} height={30} className="object-contain" />
                      </span>
                    ) : (
                      <span
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-full border border-dashed border-[var(--border)] text-[var(--muted)]/40"
                      >
                        <Coffee size={16} />
                      </span>
                    ),
                  )}
                </div>
                <p className="mt-7 text-sm text-[var(--muted)]">
                  2 kahve daha → <strong className="text-[var(--foreground)]">bedava kahve</strong>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Geçen ayın kazananı ===== */}
      {kazanan?.gorsel_url && (
        <section className="mx-auto max-w-6xl px-5 pt-8">
          <Reveal className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] sm:flex">
            <div className="relative aspect-[4/3] sm:w-1/2">
              <Image
                src={kazanan.gorsel_url}
                alt={kazanan.baslik ?? "Kazanan kare"}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:w-1/2">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                <Trophy size={14} /> {donemAdi(kazanan.donem)} Kazananı
              </span>
              <h2 className="mt-3 font-serif text-3xl">{kazanan.baslik ?? "İsimsiz"}</h2>
              {kazanan.ad && <p className="mt-1 text-[var(--muted)]">{kazanan.ad}</p>}
              <p className="mt-2 text-sm text-[var(--accent)]">
                {kazanan.oy_sayisi} beğeni 🏆
              </p>
              <Link
                href="/yarisma/arsiv"
                className="group mt-6 inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
              >
                Geçmiş kazananlar
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* ===== Yarışma ===== */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal className="text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
            Fotoğraf Yarışması
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Lua bardağıyla en güzel kare
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[var(--muted)]">
            Kafemizde Lua bardağıyla çektiğin en güzel fotoğrafı paylaş. Her hesap
            ayda <strong className="text-[var(--foreground)]">1 fotoğraf</strong> yükler,{" "}
            <strong className="text-[var(--foreground)]">1 beğeni</strong> verir; ayın
            en çok beğenilen karesi kazanır. Her ay sıfırlanır.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { ikon: Camera, b: "Fotoğrafını yükle", m: "Lua'daki anını paylaş." },
            { ikon: Check, b: "Onaylanır", m: "Ekibimiz kısa sürede onaylar." },
            { ikon: Heart, b: "Oy toplar", m: "Galeride herkes oy verir." },
            { ikon: Trophy, b: "Kazanan belli olur", m: "En çok oyu alan kazanır." },
          ].map((s, i) => (
            <Reveal
              key={s.b}
              delay={i * 80}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]">
                <s.ikon size={18} />
              </span>
              <h3 className="mt-4 font-serif text-lg">{s.b}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{s.m}</p>
            </Reveal>
          ))}
        </div>

        {/* Ödüller */}
        <Reveal className="mt-12">
          <h3 className="text-center font-serif text-2xl">Ayın Ödülleri</h3>
          <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            {site.yarismaOduller.map((o) => (
              <div
                key={o.sira}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center"
              >
                <div className="text-3xl">{o.madalya}</div>
                <div className="mt-2 font-serif text-lg">{o.sira}</div>
                <p className="mt-1 text-sm text-[var(--muted)]">{o.odul}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/yarisma/katil"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            <Camera size={16} /> Yarışmaya Katıl
          </Link>
          <Link
            href="/yarisma"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium hover:border-[var(--accent)]"
          >
            Galeriyi Gör &amp; Oy Ver
          </Link>
        </div>
      </section>

      {/* ===== Misafir yorumları ===== */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal className="text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              Misafirlerimiz
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Ne diyorlar?</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {site.yorumlar.map((y, i) => (
              <Reveal
                key={y.ad}
                delay={i * 90}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6"
              >
                <div className="flex gap-0.5 text-[var(--accent)]">
                  {Array.from({ length: y.yildiz }).map((_, s) => (
                    <Star key={s} size={15} className="fill-[var(--accent)]" />
                  ))}
                </div>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">
                  &quot;{y.metin}&quot;
                </p>
                <p className="mt-4 text-sm font-medium">{y.ad}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href={site.iletisim.yorumYazLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium hover:border-[var(--accent)]"
            >
              <Star size={16} className="text-[var(--accent)]" /> Google&apos;da Değerlendir
            </a>
          </div>
        </div>
      </section>

      {/* ===== Konum teaser ===== */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
            Ziyaret Et
          </span>
          <div className="flex flex-col items-center gap-3 text-[var(--muted)] sm:flex-row sm:gap-8">
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-[var(--accent)]" /> {site.iletisim.adres}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-[var(--accent)]" /> {site.iletisim.saatler[0].saat}
            </span>
          </div>
          <Link
            href="/iletisim"
            className="group inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Konum & iletişim
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
