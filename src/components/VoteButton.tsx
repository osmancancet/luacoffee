"use client";

import { useState, useSyncExternalStore } from "react";
import { Heart, Loader2 } from "lucide-react";

/** Bu yarışmada oy verilip verilmediğini lokal olarak da işaretler (UX için). */
const OY_ANAHTARI = "lua_oy_verildi";

// localStorage'ı yalnız kendimiz değiştiriyoruz; abonelik no-op.
const subscribe = () => () => {};

export function VoteButton({
  submissionId,
  baslangicOyu,
}: {
  submissionId: string;
  baslangicOyu: number;
}) {
  // SSR'da false, client'ta localStorage'tan okunur — hydration güvenli.
  const kayitliOy = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(OY_ANAHTARI) === "1",
    () => false,
  );

  const [oy, setOy] = useState(baslangicOyu);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [yeniOy, setYeniOy] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);

  const oyVerildi = kayitliOy || yeniOy;

  async function oyVer() {
    if (oyVerildi || yukleniyor) return;
    setYukleniyor(true);
    setMesaj(null);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: submissionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setOy(data.oySayisi);
        localStorage.setItem(OY_ANAHTARI, "1");
        setYeniOy(true);
      } else {
        if (data.zatenOy) {
          localStorage.setItem(OY_ANAHTARI, "1");
          setYeniOy(true);
        }
        setMesaj(data.hata);
      }
    } catch {
      setMesaj("Bağlantı hatası.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={oyVer}
        disabled={yukleniyor || oyVerildi}
        className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors ${
          oyVerildi
            ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
            : "border-[var(--border)] hover:border-[var(--accent)]"
        }`}
        title={oyVerildi ? "Oyunuzu kullandınız" : "Oy ver"}
      >
        {yukleniyor ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Heart size={15} className={oyVerildi ? "fill-[var(--accent)]" : ""} />
        )}
        {oy}
      </button>
      {mesaj && <span className="text-[11px] text-[var(--muted)]">{mesaj}</span>}
    </div>
  );
}
