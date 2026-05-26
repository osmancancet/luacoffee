"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { QrPanel } from "@/components/QrPanel";
import { SadakatQrPanel } from "@/components/SadakatQrPanel";
import { SadakatYonetim } from "@/components/SadakatYonetim";
import { AyiKapat } from "@/components/AyiKapat";
import { AdminIstatistik } from "@/components/AdminIstatistik";
import { KampanyaYonetim } from "@/components/KampanyaYonetim";
import { Check, X, LogOut, Loader2, ShieldCheck } from "lucide-react";

type Gonderi = {
  id: string;
  baslik: string | null;
  aciklama: string | null;
  yukleyen_ad: string | null;
  gorsel_url: string;
  created_at: string;
};

export function AdminPanel() {
  const supabase = createClient();
  const [oturum, setOturum] = useState<boolean | null>(null);
  const [gonderiler, setGonderiler] = useState<Gonderi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  // Giriş formu
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState<string | null>(null);

  const bekleyenleriYukle = useCallback(async () => {
    setYukleniyor(true);
    const res = await fetch("/api/admin");
    if (res.ok) {
      const data = await res.json();
      setGonderiler(data.gonderiler);
    }
    setYukleniyor(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const var_ = !!data.session;
      setOturum(var_);
      if (var_) bekleyenleriYukle();
    });
  }, [supabase, bekleyenleriYukle]);

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    setHata(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: sifre,
    });
    if (error) {
      setHata("Giriş başarısız. E-posta veya şifre hatalı.");
    } else {
      setOturum(true);
      bekleyenleriYukle();
    }
  }

  async function cikisYap() {
    await supabase.auth.signOut();
    setOturum(false);
  }

  async function moderasyon(id: string, durum: "onaylandi" | "reddedildi") {
    setGonderiler((g) => g.filter((x) => x.id !== id)); // iyimser güncelleme
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, durum }),
    });
  }

  if (oturum === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  if (!oturum) {
    return (
      <div className="mx-auto max-w-sm px-5 py-24">
        <div className="text-center">
          <ShieldCheck className="mx-auto text-[var(--accent)]" size={28} />
          <h1 className="mt-3 font-serif text-3xl">Admin Girişi</h1>
        </div>
        <form onSubmit={girisYap} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
          {hata && <p className="text-sm text-red-300">{hata}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent-strong)] px-6 py-3 font-medium text-black"
          >
            Giriş Yap
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          Admin hesabı Supabase Authentication panelinden oluşturulur.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl sm:text-4xl">Yönetim Paneli</h1>
        <button
          onClick={cikisYap}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:border-[var(--accent)]"
        >
          <LogOut size={15} /> Çıkış
        </button>
      </div>

      <div className="mt-8">
        <AdminIstatistik />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Bekleyen onaylar */}
        <section>
          <h2 className="font-serif text-2xl">
            Onay Bekleyenler{" "}
            <span className="text-[var(--muted)]">({gonderiler.length})</span>
          </h2>

          {yukleniyor ? (
            <div className="mt-8 flex justify-center">
              <Loader2 className="animate-spin text-[var(--muted)]" />
            </div>
          ) : gonderiler.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[var(--muted)]">
              Bekleyen gönderi yok.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {gonderiler.map((g) => (
                <article
                  key={g.id}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={g.gorsel_url}
                      alt={g.baslik ?? ""}
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg">{g.baslik ?? "İsimsiz"}</h3>
                    {g.yukleyen_ad && (
                      <p className="text-sm text-[var(--muted)]">{g.yukleyen_ad}</p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => moderasyon(g.id, "onaylandi")}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400"
                      >
                        <Check size={15} /> Onayla
                      </button>
                      <button
                        onClick={() => moderasyon(g.id, "reddedildi")}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:border-red-400 hover:text-red-300"
                      >
                        <X size={15} /> Reddet
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* QR panelleri */}
        <aside className="space-y-6">
          <QrPanel />
          <KampanyaYonetim />
          <SadakatQrPanel />
          <AyiKapat />
        </aside>
      </div>

      <SadakatYonetim />
    </div>
  );
}
