import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { galeri } from "@/lib/galeri";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Lua Coffee'nin Soma, Manisa'daki mekânından ve atmosferinden kareler.",
  alternates: { canonical: "/galeri" },
};

export default function GaleriSayfasi() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Galeri"
        baslik="Mekândan Kareler"
        aciklama="Ayın altındaki köşemizden, dış cephemizden ve atmosferimizden anlar."
      />

      <div className="mt-16 grid auto-rows-[220px] grid-cols-2 gap-4 sm:auto-rows-[280px] lg:grid-cols-3">
        {galeri.map((g, i) => (
          <Reveal
            key={g.src}
            delay={(i % 3) * 80}
            className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] ${
              g.genis ? "col-span-2" : ""
            }`}
          >
            <Image
              src={g.src}
              alt={g.baslik}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 text-sm font-medium text-white/90">
              {g.baslik}
            </span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
