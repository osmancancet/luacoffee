import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { etkinlikler, type Etkinlik } from "@/lib/etkinlikler";

export const metadata: Metadata = {
  title: "Etkinlikler & Duyurular",
  description: "Lua Coffee (Soma, Manisa) etkinlikleri, atölyeleri ve duyuruları.",
  alternates: { canonical: "/etkinlikler" },
};

function EtkinlikKarti({ e, i, solgun }: { e: Etkinlik; i: number; solgun?: boolean }) {
  return (
    <Reveal
      delay={i * 70}
      as="article"
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)] sm:flex-row ${
        solgun ? "opacity-90" : ""
      }`}
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
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          {e.etiket && (
            <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-1 text-[var(--accent)]">
              {e.etiket}
            </span>
          )}
          {e.ucret && (
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-emerald-300">
              {e.ucret}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} /> {e.tarih}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-2xl">{e.baslik}</h3>
        <p className="mt-2 leading-relaxed text-[var(--muted)]">{e.ozet}</p>
      </div>
    </Reveal>
  );
}

export default function EtkinliklerSayfasi() {
  const guncel = etkinlikler.filter((e) => !e.gecmis);
  const gecmis = etkinlikler.filter((e) => e.gecmis);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Etkinlikler"
        baslik="Olan Biten"
        aciklama="Atölyeler, kampanyalar ve Lua'dan duyurular. Yeni etkinlikler için bizi takip et."
      />

      {guncel.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl">Güncel</h2>
          <div className="mt-6 space-y-5">
            {guncel.map((e, i) => (
              <EtkinlikKarti key={e.id} e={e} i={i} />
            ))}
          </div>
        </section>
      )}

      {gecmis.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="font-serif text-2xl">Geçmiş Etkinlikler</h2>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="space-y-5">
            {gecmis.map((e, i) => (
              <EtkinlikKarti key={e.id} e={e} i={i} solgun />
            ))}
          </div>
        </section>
      )}

      {etkinlikler.length === 0 && (
        <div className="mt-16 rounded-2xl border border-dashed border-[var(--border)] py-20 text-center text-[var(--muted)]">
          Şu an planlanmış bir etkinlik yok. Yakında burada!
        </div>
      )}
    </div>
  );
}
