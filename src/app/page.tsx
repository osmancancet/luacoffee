import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, Coffee, Moon } from "lucide-react";
import { espressoCoffee } from "@/lib/menu";
import { fiyat } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

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

        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-28 text-center sm:py-40">
          <span className="anim-fade-up delay-1 mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-4 py-1.5 text-xs text-[var(--muted)]">
            <Moon size={14} className="anim-float" /> Ayın altında bir kahve molası
          </span>
          <h1 className="anim-fade-up delay-2 font-serif text-5xl leading-tight sm:text-7xl">
            Lua Coffee
          </h1>
          <p className="anim-fade-up delay-3 mt-5 max-w-xl text-lg text-[var(--muted)]">
            Gece esintili lezzetler, özenle hazırlanan kahveler ve paylaşmaya
            değer anlar. Lua&apos;da her fincan bir hikâye.
          </p>
          <div className="anim-fade-up delay-4 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
            >
              Menüyü Keşfet{" "}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/yarisma"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--accent)]"
            >
              <Camera size={16} /> Fotoğraf Yarışması
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Hakkımızda ===== */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-4xl">Hikâyemiz</h2>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              &quot;Lua&quot; Portekizcede ay demek. Biz de kahveyi günün en sakin,
              en samimi anlarının eşlikçisi olarak görüyoruz. Üçüncü nesil kahve
              anlayışıyla seçtiğimiz çekirdekleri, gece teması bir atmosferde
              servis ediyoruz.
            </p>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              Espresso bazlı klasiklerden imza içeceklerimize kadar her şey
              özenle hazırlanıyor. Gel, kendi Lua anını yakala.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[
              { ikon: Coffee, baslik: "Özel Çekirdek", metin: "Seçilmiş, taze kavrulmuş" },
              { ikon: Moon, baslik: "Gece Teması", metin: "Sakin, samimi atmosfer" },
              { ikon: Camera, baslik: "Yarışma", metin: "Anını paylaş, oy topla" },
              { ikon: ArrowRight, baslik: "İmza İçecekler", metin: "Lua Voltage & dahası" },
            ].map((k, i) => (
              <Reveal
                key={k.baslik}
                delay={i * 90}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--surface-2)]"
              >
                <k.ikon size={22} className="text-[var(--accent)]" />
                <h3 className="mt-3 font-serif text-lg">{k.baslik}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{k.metin}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Menü önizleme ===== */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl sm:text-4xl">Menüden</h2>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Tümünü gör <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {oneCikan.map((u, i) => (
              <Reveal
                key={u.ad}
                delay={i * 70}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 transition-colors hover:border-[var(--accent)]"
              >
                <span>{u.ad}</span>
                <span className="text-sm text-[var(--accent)]">
                  {fiyat(u.hot ?? u.cold)}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Yarışma CTA ===== */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] px-8 py-16 text-center">
          <Moon
            size={180}
            className="anim-spin-slow pointer-events-none absolute -right-10 -top-10 text-white/5"
          />
          <h2 className="font-serif text-3xl sm:text-4xl">Fotoğraf Yarışması</h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">
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
    </>
  );
}
