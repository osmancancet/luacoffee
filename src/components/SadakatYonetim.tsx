"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, Minus, Search, History } from "lucide-react";

type Uye = {
  kullanici_id: string;
  ad: string | null;
  eposta: string | null;
  damga: number;
  bedava_hak: number;
  toplam_damga: number;
};
type Islem = { ad: string | null; tip: string; adet: number; not_: string | null; created_at: string };

export function SadakatYonetim() {
  const [uyeler, setUyeler] = useState<Uye[]>([]);
  const [gecmis, setGecmis] = useState<Islem[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [ara, setAra] = useState("");

  const yukle = useCallback(async () => {
    const res = await fetch("/api/admin/sadakat", { cache: "no-store" });
    if (res.ok) {
      const d = await res.json();
      setUyeler(d.uyeler);
      setGecmis(d.gecmis);
    }
    setYukleniyor(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    yukle();
  }, [yukle]);

  async function damgaDegistir(kullanici_id: string, ekle: number) {
    setUyeler((list) =>
      list.map((u) =>
        u.kullanici_id === kullanici_id
          ? { ...u, toplam_damga: Math.max(0, u.toplam_damga + ekle) }
          : u,
      ),
    );
    await fetch("/api/admin/sadakat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kullanici_id, ekle }),
    });
    yukle();
  }

  const filtreli = uyeler.filter(
    (u) =>
      !ara ||
      (u.ad ?? "").toLowerCase().includes(ara.toLowerCase()) ||
      (u.eposta ?? "").toLowerCase().includes(ara.toLowerCase()),
  );

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl">
        Sadakat Üyeleri{" "}
        <span className="text-[var(--muted)]">({uyeler.length})</span>
      </h2>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3">
        <Search size={16} className="text-[var(--muted)]" />
        <input
          value={ara}
          onChange={(e) => setAra(e.target.value)}
          placeholder="İsim veya e-posta ara…"
          className="w-full bg-transparent py-2.5 text-sm outline-none"
        />
      </div>

      {yukleniyor ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="animate-spin text-[var(--muted)]" />
        </div>
      ) : filtreli.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-[var(--border)] py-12 text-center text-[var(--muted)]">
          Üye yok.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {filtreli.map((u) => (
            <div
              key={u.kullanici_id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{u.ad ?? "İsimsiz"}</p>
                <p className="truncate text-xs text-[var(--muted)]">{u.eposta}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span title="İlerleme">{u.damga}/5</span>
                <span className="text-[var(--accent)]" title="Bedava hak">
                  🎁 {u.bedava_hak}
                </span>
                <span className="text-[var(--muted)]" title="Toplam damga">
                  Σ {u.toplam_damga}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => damgaDegistir(u.kullanici_id, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] hover:border-red-400 hover:text-red-300"
                  title="1 damga çıkar"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => damgaDegistir(u.kullanici_id, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)]"
                  title="1 damga ekle"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => damgaDegistir(u.kullanici_id, 5)}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs hover:border-[var(--accent)]"
                  title="5 damga ekle"
                >
                  +5
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Son işlemler */}
      {gecmis.length > 0 && (
        <div className="mt-8">
          <h3 className="flex items-center gap-2 font-serif text-lg">
            <History size={16} className="text-[var(--accent)]" /> Son İşlemler
          </h3>
          <div className="mt-3 space-y-1 text-sm">
            {gecmis.map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 border-b border-[var(--border)]/50 py-1.5 text-[var(--muted)]"
              >
                <span className="truncate">
                  <span className="text-[var(--foreground)]">{g.ad ?? "—"}</span> ·{" "}
                  {etiket(g)}
                </span>
                <span className="shrink-0 text-xs">
                  {new Date(g.created_at).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function etiket(g: Islem): string {
  switch (g.tip) {
    case "damga":
      return `+${g.adet} damga`;
    case "kullanim":
      return "bedava kahve kullandı";
    case "manuel":
      return `manuel ${g.adet > 0 ? "+" : ""}${g.adet}`;
    case "kupon":
      return g.not_ ?? "kupon";
    case "checkin":
      return "check-in";
    default:
      return g.tip;
  }
}
