"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function VoteButton({
  submissionId,
  baslangicOyu,
}: {
  submissionId: string;
  baslangicOyu: number;
}) {
  const [oy, setOy] = useState(baslangicOyu);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [oyVerildi, setOyVerildi] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);

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

      if (res.status === 401 && data.girisGerekli) {
        // Giriş yap, sonra yarışmaya dön
        await createClient().auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/yarisma")}`,
          },
        });
        return;
      }

      if (res.ok) {
        setOy(data.oySayisi);
        setOyVerildi(true);
      } else {
        if (data.zatenOy) setOyVerildi(true);
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
        title={oyVerildi ? "Oyunu kullandın" : "Beğen"}
        aria-label={oyVerildi ? "Oyunu kullandın" : "Beğen"}
      >
        {yukleniyor ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Heart size={15} className={oyVerildi ? "fill-[var(--accent)]" : ""} />
        )}
        {oy}
      </button>
      {mesaj && <span className="max-w-[160px] text-right text-[11px] text-[var(--muted)]">{mesaj}</span>}
    </div>
  );
}
