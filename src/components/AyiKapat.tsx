"use client";

import { useState } from "react";
import { Trophy, Loader2 } from "lucide-react";

function oncekiDonemStr(): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function AyiKapat() {
  const [donem, setDonem] = useState(oncekiDonemStr());
  const [islemde, setIslemde] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [tip, setTip] = useState<"basari" | "hata">("basari");

  async function kapat() {
    setIslemde(true);
    setMesaj(null);
    try {
      const res = await fetch("/api/admin/yarisma-kapat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donem }),
      });
      const d = await res.json();
      if (res.ok) {
        setMesaj(`Kazanan: ${d.kazanan.ad ?? "İsimsiz"} — "${d.kazanan.baslik ?? "—"}" (${d.kazanan.oy_sayisi} oy). Bildirim gönderildi.`);
        setTip("basari");
      } else {
        setMesaj(d.hata || "Bir hata oluştu.");
        setTip("hata");
      }
    } catch {
      setMesaj("Bağlantı hatası.");
      setTip("hata");
    } finally {
      setIslemde(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-[var(--accent)]" />
        <h2 className="font-serif text-xl">Ayı Kapat & Kazananı İlan Et</h2>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Seçilen ayın en çok beğenilen karesini kazanan ilan eder; kazanana bildirim
        (ve e-posta) gönderir. Ana sayfada vitrine çıkar.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          type="month"
          value={donem}
          onChange={(e) => setDonem(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <button
          onClick={kapat}
          disabled={islemde}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-medium text-black disabled:opacity-60"
        >
          {islemde ? <Loader2 size={15} className="animate-spin" /> : <Trophy size={15} />}
          İlan Et
        </button>
      </div>
      {mesaj && (
        <p
          className={`mt-3 rounded-xl border px-4 py-2.5 text-sm ${
            tip === "basari"
              ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {mesaj}
        </p>
      )}
    </div>
  );
}
