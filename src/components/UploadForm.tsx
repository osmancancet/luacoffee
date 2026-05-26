"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2, Upload, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function UploadForm() {
  const router = useRouter();
  const [durum, setDurum] = useState<"yukleniyor" | "giris" | "form">("yukleniyor");
  const [ad, setAd] = useState("");
  const [onizleme, setOnizleme] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [girisYukleniyor, setGirisYukleniyor] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAd(
          data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? "",
        );
        setDurum("form");
      } else {
        setDurum("giris");
      }
    });
  }, []);

  async function girisYap() {
    setGirisYukleniyor(true);
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/yarisma/katil")}`,
      },
    });
  }

  function dosyaSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setOnizleme(f ? URL.createObjectURL(f) : null);
  }

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const data = await res.json();
      if (res.status === 401 && data.girisGerekli) {
        setDurum("giris");
        return;
      }
      if (!res.ok) throw new Error(data.hata || "Bir hata oluştu.");
      router.push("/yarisma/tesekkurler");
    } catch (err) {
      setHata((err as Error).message);
      setGonderiliyor(false);
    }
  }

  if (durum === "yukleniyor") {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  if (durum === "giris") {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <Camera className="mx-auto text-[var(--accent)]" size={30} />
        <h2 className="mt-4 font-serif text-xl">Katılmak için giriş yap</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
          Her hesap aylık 1 fotoğraf yükleyip 1 beğeni verebilir. Google ile giriş yap.
        </p>
        <button
          onClick={girisYap}
          disabled={girisYukleniyor}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105 disabled:opacity-60"
        >
          {girisYukleniyor ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          Google ile Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={gonder} className="space-y-5">
      <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 px-4 py-3 text-center text-sm text-[var(--muted)]">
        Kafemizde <strong className="text-[var(--foreground)]">Lua bardağıyla</strong> çektiğin
        en güzel kareyi yükle. Ayda 1 fotoğraf.
      </p>

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
          value={ad}
          onChange={(e) => setAd(e.target.value)}
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
        disabled={gonderiliyor}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3.5 font-medium text-black transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
      >
        {gonderiliyor ? (
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
