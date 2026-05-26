"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Camera, Coffee, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { donemAdi } from "@/lib/utils";

type Stat = {
  aktifUye: number;
  bekleyen: number;
  buAyGonderi: number;
  onayliGonderi: number;
  bedavaKullanim: number;
  toplamCheckin: number;
  bugunCheckin: number;
  gunler: { gun: string; sayi: number }[];
};

export function AdminIstatistik() {
  const [stat, setStat] = useState<Stat | null>(null);

  useEffect(() => {
    fetch("/api/admin/istatistik", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setStat)
      .catch(() => {});
  }, []);

  if (!stat) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  const kartlar = [
    { ikon: MapPin, etiket: "Bugün check-in", deger: stat.bugunCheckin },
    { ikon: Clock, etiket: "Toplam check-in", deger: stat.toplamCheckin },
    { ikon: Users, etiket: "Aktif sadakat üyesi", deger: stat.aktifUye },
    { ikon: Coffee, etiket: "Kullanılan bedava kahve", deger: stat.bedavaKullanim },
    { ikon: Camera, etiket: `${donemAdi(yeniDonem())} gönderi`, deger: stat.buAyGonderi },
    { ikon: CheckCircle2, etiket: "Bekleyen onay", deger: stat.bekleyen },
  ];

  const enYuksek = Math.max(1, ...stat.gunler.map((g) => g.sayi));

  return (
    <section className="mt-2">
      <h2 className="font-serif text-2xl">Özet</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {kartlar.map((k) => (
          <div
            key={k.etiket}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <k.ikon size={18} className="text-[var(--accent)]" />
            <p className="mt-2 font-serif text-2xl tabular-nums">{k.deger}</p>
            <p className="text-xs text-[var(--muted)]">{k.etiket}</p>
          </div>
        ))}
      </div>

      {/* 7 günlük check-in grafiği */}
      <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-sm text-[var(--muted)]">Son 7 gün check-in</p>
        <div className="mt-4 flex items-end justify-between gap-2" style={{ height: 96 }}>
          {stat.gunler.map((g) => (
            <div key={g.gun} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[10px] text-[var(--muted)]">{g.sayi}</span>
              <div
                className="w-full rounded-t bg-[var(--accent)]/60"
                style={{ height: `${(g.sayi / enYuksek) * 72}px`, minHeight: 2 }}
              />
              <span className="text-[10px] text-[var(--muted)]">
                {new Date(g.gun).toLocaleDateString("tr-TR", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function yeniDonem(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
