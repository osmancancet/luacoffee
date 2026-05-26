import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, Sparkles, Palette, Heart } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `Lua Coffee'nin hikâyesi — Soma, Manisa'da üçüncü nesil kahve anlayışı. ${site.aciklama}`,
  alternates: { canonical: "/hakkimizda" },
};

const IKONLAR = [Coffee, Sparkles, Palette, Heart];

export default function HakkimizdaSayfasi() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Hakkımızda"
        baslik="Hikâyemiz"
        aciklama="Soma'da üçüncü nesil kahve, imza lezzetler ve yaratıcı atölyeler."
      />

      {/* Hikâye + görsel */}
      <section className="mt-16 grid items-center gap-12 md:grid-cols-2">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--border)]">
          <Image
            src="/galeri/ic-mekan-lua-duvar.png"
            alt="Lua Coffee iç mekânı — lua duvarı ve bar"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>
        <div className="space-y-5">
          {site.hakkimizda.paragraflar.map((p, i) => (
            <Reveal key={i} delay={i * 80} as="p" className="leading-relaxed text-[var(--muted)]">
              {p}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Değerler */}
      <section className="mt-24">
        <Reveal className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">Değerlerimiz</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.hakkimizda.degerler.map((d, i) => {
            const Ikon = IKONLAR[i % IKONLAR.length];
            return (
              <Reveal
                key={d.baslik}
                delay={i * 90}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
              >
                <Ikon size={22} className="text-[var(--accent)]" />
                <h3 className="mt-4 font-serif text-lg">{d.baslik}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {d.metin}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/menu"
          className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
        >
          Menüyü Keşfet
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/iletisim"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium hover:border-[var(--accent)]"
        >
          Bize Ulaş
        </Link>
      </section>
    </div>
  );
}
