"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2, Upload } from "lucide-react";

export function UploadForm() {
  const router = useRouter();
  const [onizleme, setOnizleme] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function dosyaSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setOnizleme(f ? URL.createObjectURL(f) : null);
  }

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHata(null);
    setYukleniyor(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hata || "Bir hata oluştu.");
      router.push("/yarisma/tesekkurler");
    } catch (err) {
      setHata((err as Error).message);
      setYukleniyor(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={gonder} className="space-y-5">
      {/* Fotoğraf seçimi */}
      <label className="block">
        <span className="mb-2 block text-sm text-[var(--muted)]">Fotoğraf *</span>
        <div className="relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)]">
          {onizleme ? (
            <Image src={onizleme} alt="Önizleme" fill className="object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[var(--muted)]">
              <Camera size={32} />
              <span className="text-sm">Fotoğraf seç veya çek</span>
            </div>
          )}
          <input
            type="file"
            name="gorsel"
            accept="image/*"
            capture="environment"
            required
            onChange={dosyaSecildi}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-[var(--muted)]">Adın</span>
        <input
          name="yukleyen_ad"
          type="text"
          maxLength={60}
          placeholder="Örn. Ayşe K."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--accent)]"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-[var(--muted)]">Başlık</span>
        <input
          name="baslik"
          type="text"
          maxLength={80}
          placeholder="Fotoğrafına bir başlık ver"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--accent)]"
        />
      </label>

      {hata && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {hata}
        </p>
      )}

      <button
        type="submit"
        disabled={yukleniyor}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3.5 font-medium text-black transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
      >
        {yukleniyor ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Yükleniyor…
          </>
        ) : (
          <>
            <Upload size={18} /> Yarışmaya Gönder
          </>
        )}
      </button>

      <p className="text-center text-xs text-[var(--muted)]">
        Fotoğrafın admin onayından sonra galeride görünecek.
      </p>
    </form>
  );
}
