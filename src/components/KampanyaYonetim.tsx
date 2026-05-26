"use client";

import { useEffect, useState } from "react";
import { Megaphone, Loader2 } from "lucide-react";

export function KampanyaYonetim() {
  const [aktif, setAktif] = useState(false);
  const [metin, setMetin] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydedildi, setKaydedildi] = useState(false);

  useEffect(() => {
    fetch("/api/kampanya", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setAktif(d.aktif);
        setMetin(d.metin ?? "");
      })
      .finally(() => setYukleniyor(false));
  }, []);

  async function kaydet() {
    setKaydedildi(false);
    await fetch("/api/kampanya", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aktif, metin }),
    });
    setKaydedildi(true);
    setTimeout(() => setKaydedildi(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center gap-2">
        <Megaphone size={18} className="text-[var(--accent)]" />
        <h2 className="font-serif text-xl">Günün Kahvesi / Kampanya</h2>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Açıkken ana sayfanın en üstinde şerit olarak görünür.
      </p>

      {yukleniyor ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-[var(--muted)]" />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <input
            value={metin}
            onChange={(e) => setMetin(e.target.value)}
            maxLength={200}
            placeholder="Örn. Günün kahvesi: Lotus Latte ✨"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={aktif}
              onChange={(e) => setAktif(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Şeridi göster
          </label>
          <button
            onClick={kaydet}
            className="rounded-full bg-[var(--accent-strong)] px-5 py-2 text-sm font-medium text-black"
          >
            {kaydedildi ? "Kaydedildi ✓" : "Kaydet"}
          </button>
        </div>
      )}
    </div>
  );
}
