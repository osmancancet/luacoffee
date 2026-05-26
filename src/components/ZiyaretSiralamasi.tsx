"use client";

import { useEffect, useState } from "react";
import { Flame, Users } from "lucide-react";

type Satir = { ad: string | null; seri: number; toplam: number };

const MADALYA = ["🥇", "🥈", "🥉"];

/** "En çok ziyaret edenler" — public liderlik tablosu (ödülsüz). */
export function ZiyaretSiralamasi() {
  const [siralama, setSiralama] = useState<Satir[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch("/api/ziyaret-siralama", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSiralama(d.siralama ?? []))
      .finally(() => setYukleniyor(false));
  }, []);

  if (yukleniyor || siralama.length === 0) return null;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center gap-2">
        <Users size={18} className="text-[var(--accent)]" />
        <h2 className="font-serif text-xl">En Çok Ziyaret Edenler</h2>
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        En sadık Lua misafirleri. Sen de check-in yaparak listeye gir!
      </p>

      <ol className="mt-5 space-y-2">
        {siralama.map((s, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5"
          >
            <span className="w-6 text-center text-sm">
              {i < 3 ? MADALYA[i] : i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate">{s.ad ?? "Lua Misafiri"}</span>
            {s.seri > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                <Flame size={12} className="text-orange-400" /> {s.seri}
              </span>
            )}
            <span className="text-sm text-[var(--accent)]">{s.toplam} ziyaret</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
