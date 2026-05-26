"use client";

import { useEffect, useState, useCallback } from "react";
import { Flame, MapPin, Loader2 } from "lucide-react";
import type { Rozet } from "@/lib/ziyaret";

type Durum = {
  girisli: boolean;
  seri: number;
  en_uzun_seri: number;
  toplam: number;
  bugun_yapildi: boolean;
  rozetler: Rozet[];
};

function konumAl(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("yok"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => reject(e),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  });
}

export function CheckIn() {
  const [durum, setDurum] = useState<Durum | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [islemde, setIslemde] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [mesajTipi, setMesajTipi] = useState<"basari" | "hata">("basari");

  const yukle = useCallback(async () => {
    try {
      const res = await fetch("/api/checkin", { cache: "no-store" });
      const d = await res.json();
      setDurum(d);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    yukle();
  }, [yukle]);

  async function checkIn() {
    setIslemde(true);
    setMesaj(null);
    let konum: { lat: number; lng: number };
    try {
      konum = await konumAl();
    } catch {
      setMesaj("Konum izni gerekli. Check-in için kafede olmalı ve konumu açmalısın.");
      setMesajTipi("hata");
      setIslemde(false);
      return;
    }
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: konum.lat, lng: konum.lng }),
      });
      const d = await res.json();
      if (res.ok) {
        setDurum((o) => ({ ...(o as Durum), ...d, girisli: true }));
        setMesaj(`Check-in başarılı! Serin: ${d.seri} gün 🔥`);
        setMesajTipi("basari");
      } else {
        if (d.bugun_yapildi) setDurum((o) => (o ? { ...o, bugun_yapildi: true } : o));
        setMesaj(d.hata || "Bir hata oluştu.");
        setMesajTipi("hata");
      }
    } catch {
      setMesaj("Bağlantı hatası.");
      setMesajTipi("hata");
    } finally {
      setIslemde(false);
    }
  }

  if (yukleniyor || !durum || !durum.girisli) return null;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
        <Flame size={16} className="text-orange-400" /> Ziyaret Serin
      </div>
      <p className="mt-1 font-serif text-4xl">
        {durum.seri} <span className="text-lg text-[var(--muted)]">gün</span>
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        En uzun seri: {durum.en_uzun_seri} · Toplam ziyaret: {durum.toplam}
      </p>

      {durum.rozetler.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {durum.rozetler.map((r) => (
            <span
              key={r.ad}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs"
            >
              <span>{r.ikon}</span> {r.ad}
            </span>
          ))}
        </div>
      )}

      {mesaj && (
        <p
          className={`mt-4 rounded-xl border px-4 py-2.5 text-sm ${
            mesajTipi === "basari"
              ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {mesaj}
        </p>
      )}

      <button
        onClick={checkIn}
        disabled={islemde || durum.bugun_yapildi}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
      >
        {islemde ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <MapPin size={16} />
        )}
        {durum.bugun_yapildi ? "Bugün check-in yapıldı ✓" : "Check-in Yap"}
      </button>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Günde 1 kez, yalnızca kafedeyken.
      </p>
    </div>
  );
}
