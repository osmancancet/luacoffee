import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { etkinlikler } from "@/lib/etkinlikler";

export const metadata: Metadata = {
  title: "Etkinlikler & Duyurular — Lua Coffee",
  description: "Lua Coffee'deki etkinlikler, kampanyalar ve duyurular.",
};

export default function EtkinliklerSayfasi() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Etkinlikler"
        baslik="Olan Biten"
        aciklama="Canlı anlar, kampanyalar ve Lua'dan duyurular burada."
      />

      {etkinlikler.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-[var(--border)] py-20 text-center text-[var(--muted)]">
          Şu an planlanmış bir etkinlik yok. Yakında burada!
        </div>
      ) : (
        <div className="mt-16 space-y-5">
          {etkinlikler.map((e, i) => (
            <Reveal
              key={e.id}
              delay={i * 80}
              as="article"
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)] sm:flex-row"
            >
              {e.gorsel && (
                <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-56">
                  <Image
                    src={e.gorsel}
                    alt={e.baslik}
                    fill
                    sizes="(max-width: 640px) 100vw, 224px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                  {e.etiket && (
                    <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-1 text-[var(--accent)]">
                      {e.etiket}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} /> {e.tarih}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-2xl">{e.baslik}</h2>
                <p className="mt-2 leading-relaxed text-[var(--muted)]">{e.ozet}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
