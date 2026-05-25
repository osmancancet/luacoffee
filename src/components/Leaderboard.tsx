"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Crown, Radio } from "lucide-react";

export type SiraGonderi = {
  id: string;
  baslik: string | null;
  yukleyen_ad: string | null;
  gorsel_url: string;
  oy_sayisi: number;
};

/** Bir sayıyı eski değerinden yenisine yumuşakça sayar. */
function Sayac({ deger }: { deger: number }) {
  const [goster, setGoster] = useState(deger);
  const oncekiRef = useRef(deger);

  useEffect(() => {
    const baslangic = oncekiRef.current;
    const hedef = deger;
    if (baslangic === hedef) return;
    const t0 = performance.now();
    const sure = 700;
    let raf = 0;
    const adim = (now: number) => {
      const p = Math.min((now - t0) / sure, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setGoster(Math.round(baslangic + (hedef - baslangic) * eased));
      if (p < 1) raf = requestAnimationFrame(adim);
      else oncekiRef.current = hedef;
    };
    raf = requestAnimationFrame(adim);
    return () => cancelAnimationFrame(raf);
  }, [deger]);

  return <>{goster}</>;
}

const MADALYA = [
  "text-yellow-400 border-yellow-400/50 bg-yellow-400/10",
  "text-zinc-300 border-zinc-300/50 bg-zinc-300/10",
  "text-amber-600 border-amber-600/50 bg-amber-600/10",
];

export function Leaderboard({ initial }: { initial: SiraGonderi[] }) {
  const [gonderiler, setGonderiler] = useState<SiraGonderi[]>(initial);
  const [sonGuncelleme, setSonGuncelleme] = useState<Date>(new Date());

  // Canlı yenileme
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const res = await fetch("/api/siralama", { cache: "no-store" });
        if (!res.ok) return;
        const d = await res.json();
        setGonderiler(d.gonderiler);
        setSonGuncelleme(new Date());
      } catch {
        /* sessizce geç */
      }
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // FLIP: sıralama değişince satırları eski konumlarından yenisine kaydır
  const satirRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const oncekiRects = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    const yeni = new Map<string, DOMRect>();
    satirRefs.current.forEach((el, id) => yeni.set(id, el.getBoundingClientRect()));
    yeni.forEach((rect, id) => {
      const onceki = oncekiRects.current.get(id);
      const el = satirRefs.current.get(id);
      if (onceki && el) {
        const dy = onceki.top - rect.top;
        if (dy) {
          el.style.transition = "none";
          el.style.transform = `translateY(${dy}px)`;
          requestAnimationFrame(() => {
            el.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
            el.style.transform = "";
          });
        }
      }
    });
    oncekiRects.current = yeni;
  }, [gonderiler]);

  const enYuksek = Math.max(1, ...gonderiler.map((g) => g.oy_sayisi));

  if (gonderiler.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] py-24 text-center text-[var(--muted)]">
        Henüz oylanan fotoğraf yok. Sıralama oylar geldikçe burada canlanacak.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
        <Radio size={14} className="animate-pulse text-emerald-400" />
        Canlı sıralama · son güncelleme{" "}
        {sonGuncelleme.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>

      <ol className="space-y-3">
        {gonderiler.map((g, i) => {
          const oran = (g.oy_sayisi / enYuksek) * 100;
          const podyum = i < 3;
          return (
            <li
              key={g.id}
              ref={(el) => {
                if (el) satirRefs.current.set(g.id, el);
                else satirRefs.current.delete(g.id);
              }}
              className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border bg-[var(--surface)] p-3 pr-5 ${
                podyum ? "border-[var(--border)]" : "border-[var(--border)]/60"
              }`}
            >
              {/* Oran çubuğu (arka plan) */}
              <span
                className="pointer-events-none absolute inset-y-0 left-0 -z-0 bg-gradient-to-r from-[var(--accent)]/12 to-transparent transition-[width] duration-700 ease-out"
                style={{ width: `${oran}%` }}
              />

              {/* Sıra rozeti */}
              <span
                className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-serif text-lg ${
                  podyum ? MADALYA[i] : "border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {i === 0 ? <Crown size={18} /> : i + 1}
              </span>

              {/* Küçük görsel */}
              <span className="relative z-10 h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={g.gorsel_url}
                  alt={g.baslik ?? ""}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>

              {/* Başlık / kişi */}
              <span className="z-10 min-w-0 flex-1">
                <span className="block truncate font-serif text-lg leading-tight">
                  {g.baslik ?? "İsimsiz"}
                </span>
                {g.yukleyen_ad && (
                  <span className="block truncate text-sm text-[var(--muted)]">
                    {g.yukleyen_ad}
                  </span>
                )}
              </span>

              {/* Oy sayısı */}
              <span className="z-10 shrink-0 text-right">
                <span className="font-serif text-2xl tabular-nums text-[var(--accent-strong)]">
                  <Sayac deger={g.oy_sayisi} />
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-[var(--muted)]">
                  oy
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
