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
} from "lucide-react";
import { espressoCoffee } from "@/lib/menu";
import { fiyat } from "@/lib/utils";
import { site } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

const oneCikanlar = [
  { href: "/menu", ikon: Coffee, baslik: "Menü", metin: "Espresso, imza içecekler ve dahası" },
  { href: "/galeri", ikon: ImageIcon, baslik: "Galeri", metin: "Mekânımızdan kareler" },
  { href: "/yarisma", ikon: Camera, baslik: "Yarışma", metin: "Anını paylaş, oy topla" },
  { href: "/etkinlikler", ikon: CalendarDays, baslik: "Etkinlikler", metin: "Olan biten ve duyurular" },
];

export default function AnaSayfa() {
  const oneCikan = espressoCoffee.slice(0, 6);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/lua/1.png"
          alt=""
          fill
          priority
          className="anim-zoom -z-10 object-cover opacity-50"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/70 to-[var(--background)]" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-32 text-center sm:py-44">
          <span className="anim-fade-up delay-1 mb-6 inline-block text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Soma · Üçüncü Nesil Kahve
          </span>
          <h1 className="anim-fade-up delay-2 font-serif text-6xl leading-[0.95] sm:text-8xl">
            Lua Coffee
          </h1>
          <p className="anim-fade-up delay-3 mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            {site.aciklama}
          </p>
          <div className="anim-fade-up delay-4 mt-10 flex flex-wrap items-center justify-center gap-3">
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

      {/* ===== Yarışma CTA ===== */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] px-8 py-16 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">Fotoğraf Yarışması</h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[var(--muted)]">
            Lua&apos;daki anını fotoğrafla, yükle ve oyları topla. QR kodu okut,
            galeriye katıl, en çok oyu alan kazansın!
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
        </Reveal>
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
