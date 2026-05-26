"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Coffee, Gift, Loader2, Check, LogOut, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { QrTarayici } from "@/components/QrTarayici";

type Kart = {
  damga: number;
  bedava_hak: number;
  toplam_damga: number;
  hedef: number;
};

const VARSAYILAN: Kart = { damga: 0, bedava_hak: 0, toplam_damga: 0, hedef: 5 };

/** Cihazın konumunu alır (kafede olma doğrulaması için). */
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

export function SadakatKart() {
  const params = useSearchParams();
  const router = useRouter();

  const [durum, setDurum] = useState<"yukleniyor" | "giris" | "kart">("yukleniyor");
  const [ad, setAd] = useState<string | null>(null);
  const [kart, setKart] = useState<Kart>(VARSAYILAN);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [mesajTipi, setMesajTipi] = useState<"basari" | "hata">("basari");
  const [kullaniliyor, setKullaniliyor] = useState(false);
  const [girisYukleniyor, setGirisYukleniyor] = useState(false);
  const [ekleniyor, setEkleniyor] = useState(false);
  const [animasyon, setAnimasyon] = useState(false);
  const [tarayiciAcik, setTarayiciAcik] = useState(false);
  const [kuponlar, setKuponlar] = useState<{ id: string; baslik: string; tip: string }[]>([]);
  const [dogumAyGun, setDogumAyGun] = useState<string | null>(null);
  const [dogumInput, setDogumInput] = useState("");

  const ekle = params.get("ekle");
  const token = params.get("t");

  /** Konum alıp damga ekler (hem URL'den hem tarayıcıdan kullanılır). */
  const damgaEkle = useCallback(async (adet: string | number, tok: string) => {
    setMesaj(null);
    setEkleniyor(true);
    let konum: { lat: number; lng: number };
    try {
      konum = await konumAl();
    } catch {
      setMesaj(
        "Konum izni gerekli. Damga eklemek için Lua Coffee'de olmalı ve konumu açmalısın.",
      );
      setMesajTipi("hata");
      setEkleniyor(false);
      return;
    }
    try {
      const r = await fetch("/api/sadakat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adet: Number(adet), token: tok, lat: konum.lat, lng: konum.lng }),
      });
      const e = await r.json();
      if (r.ok) {
        setKart(e);
        setMesaj(
          e.yeni_bedava > 0
            ? `+${e.eklenen} damga! 🎉 ${e.yeni_bedava} bedava kahve kazandın!`
            : `+${e.eklenen} damga eklendi!`,
        );
        setMesajTipi("basari");
        setAnimasyon(true);
        setTimeout(() => setAnimasyon(false), 900);
      } else {
        if (typeof e.damga === "number") setKart(e);
        setMesaj(e.hata || "Bir hata oluştu.");
        setMesajTipi("hata");
      }
    } catch {
      setMesaj("Bağlantı hatası.");
      setMesajTipi("hata");
    } finally {
      setEkleniyor(false);
    }
  }, []);

  const yukle = useCallback(async () => {
    try {
      const res = await fetch("/api/sadakat", { cache: "no-store" });
      const d = await res.json();
      if (!d.girisli) {
        setDurum("giris");
        return;
      }
      setAd(d.ad);
      setKart(d);
      setKuponlar(d.kuponlar ?? []);
      setDogumAyGun(d.dogum_ay_gun ?? null);
      setDurum("kart");
      if (ekle && token) {
        await damgaEkle(ekle, token);
        router.replace("/sadakat");
      }
    } catch {
      setDurum("kart");
    }
  }, [ekle, token, router, damgaEkle]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    yukle();
  }, [yukle]);

  async function girisYap() {
    setGirisYukleniyor(true);
    const supabase = createClient();
    const next = `/sadakat${ekle && token ? `?ekle=${ekle}&t=${token}` : ""}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  async function cikis() {
    await createClient().auth.signOut();
    setDurum("giris");
    setKart(VARSAYILAN);
    setMesaj(null);
  }

  async function kullan() {
    setKullaniliyor(true);
    setMesaj(null);
    try {
      const res = await fetch("/api/sadakat/kullan", { method: "POST" });
      const d = await res.json();
      if (res.ok) {
        setKart(d);
        setMesaj("Bedava kahven kullanıldı, afiyet olsun! ☕");
        setMesajTipi("basari");
      } else {
        setMesaj(d.hata || "Bir hata oluştu.");
        setMesajTipi("hata");
      }
    } catch {
      setMesaj("Bağlantı hatası.");
      setMesajTipi("hata");
    } finally {
      setKullaniliyor(false);
    }
  }

  async function kuponKullan(id: string) {
    const res = await fetch("/api/kupon/kullan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setKuponlar((k) => k.filter((x) => x.id !== id));
      setMesaj("Kupon kullanıldı, afiyet olsun! ☕");
      setMesajTipi("basari");
    }
  }

  async function dogumKaydet() {
    if (!dogumInput) return;
    const ay_gun = dogumInput.slice(5); // YYYY-MM-DD → MM-DD
    const res = await fetch("/api/sadakat/dogumgunu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ay_gun }),
    });
    if (res.ok) {
      setDogumAyGun(ay_gun);
      setMesaj("Doğum günün kaydedildi 🎂 O gün kahven bizden!");
      setMesajTipi("basari");
    }
  }

  /** Tarayıcıdan gelen QR metnini çözüp damga ekler. */
  function tarandi(metin: string) {
    setTarayiciAcik(false);
    try {
      const u = new URL(metin);
      const a = u.searchParams.get("ekle");
      const t = u.searchParams.get("t");
      if (a && t) {
        damgaEkle(a, t);
      } else {
        setMesaj("Bu bir Lua sadakat QR'ı değil.");
        setMesajTipi("hata");
      }
    } catch {
      setMesaj("QR okunamadı, tekrar dene.");
      setMesajTipi("hata");
    }
  }

  if (durum === "yukleniyor") {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  // ——— Giriş yapılmamış ———
  if (durum === "giris") {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <Coffee className="mx-auto text-[var(--accent)]" size={32} />
        <h2 className="mt-4 font-serif text-2xl">5 kahveye 1 bedava</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
          Google ile giriş yap; kartın hesabına bağlansın, telefon değişse bile damgaların kaybolmasın.
        </p>
        {ekle && token && (
          <p className="mt-3 text-sm text-[var(--accent)]">
            Giriş yapınca {ekle} damgan eklenecek.
          </p>
        )}
        <button
          onClick={girisYap}
          disabled={girisYukleniyor}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105 disabled:opacity-60"
        >
          {girisYukleniyor ? <Loader2 size={16} className="animate-spin" /> : <GoogleIkon />}
          Google ile Giriş Yap
        </button>
      </div>
    );
  }

  // ——— Giriş yapılmış: kart ———
  return (
    <div className="space-y-6">
      {ad && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">
            Merhaba, <span className="text-[var(--foreground)]">{ad}</span>
          </span>
          <button
            onClick={cikis}
            className="inline-flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <LogOut size={14} /> Çıkış
          </button>
        </div>
      )}

      {mesaj && (
        <p
          className={`rounded-xl border px-4 py-3 text-center text-sm ${
            mesajTipi === "basari"
              ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {mesaj}
        </p>
      )}

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center">
        <p className="text-sm text-[var(--muted)]">İlerlemen</p>
        <p className="mt-1 font-serif text-3xl">
          {kart.damga} <span className="text-[var(--muted)]">/ {kart.hedef}</span>
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
          {Array.from({ length: kart.hedef }).map((_, i) => {
            const dolu = i < kart.damga;
            return dolu ? (
              <span
                key={i}
                style={animasyon ? { animationDelay: `${i * 70}ms` } : undefined}
                className={`flex h-12 w-12 items-center justify-center rounded-full bg-white ${
                  animasyon ? "anim-stamp" : ""
                }`}
              >
                <Image src="/logo.png" alt="Lua damga" width={34} height={34} className="object-contain" />
              </span>
            ) : (
              <span
                key={i}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[var(--border)] text-[var(--muted)]/40"
              >
                <Coffee size={18} />
              </span>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-[var(--muted)]">
          {kart.hedef - kart.damga} kahve daha →{" "}
          <strong className="text-[var(--foreground)]">1 bedava kahve</strong>
        </p>

        {/* QR Okut */}
        <button
          onClick={() => {
            setMesaj(null);
            setTarayiciAcik(true);
          }}
          disabled={ekleniyor}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105 disabled:opacity-60"
        >
          {ekleniyor ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
          Kasadaki QR&apos;ı Okut
        </button>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Damga yalnızca Lua Coffee&apos;deyken eklenir.
        </p>
      </div>

      {/* Son 1 kahve hatırlatması */}
      {kart.damga === kart.hedef - 1 && kart.bedava_hak === 0 && (
        <p className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-3 text-center text-sm text-[var(--accent)]">
          🎉 Son 1 kahve! Bir sonraki kahven bedavaya çok yakın.
        </p>
      )}

      {/* Kuponlar */}
      {kuponlar.length > 0 && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-serif text-lg">Kuponların</h3>
          <div className="mt-3 space-y-2">
            {kuponlar.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5"
              >
                <span className="min-w-0 flex-1 text-sm">{k.baslik}</span>
                <button
                  onClick={() => kuponKullan(k.id)}
                  className="shrink-0 rounded-full bg-[var(--accent-strong)] px-4 py-1.5 text-xs font-medium text-black"
                >
                  Kullan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doğum günü */}
      {!dogumAyGun && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="font-serif text-lg">🎂 Doğum gününde kahven bizden</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Doğum gününü ekle, o gün seni şımartalım.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <input
              type="date"
              value={dogumInput}
              onChange={(e) => setDogumInput(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
            <button
              onClick={dogumKaydet}
              className="rounded-full bg-[var(--accent-strong)] px-5 py-2 text-sm font-medium text-black"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      {kart.bedava_hak > 0 && (
        <div className="rounded-3xl border border-[var(--accent)]/40 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] p-7 text-center">
          <Gift className="mx-auto text-[var(--accent)]" size={32} />
          <p className="mt-3 font-serif text-2xl">
            {kart.bedava_hak} bedava kahve hakkın var!
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Kasada bu ekranı göster ve kullan.
          </p>
          <button
            onClick={kullan}
            disabled={kullaniliyor}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105 disabled:opacity-60"
          >
            {kullaniliyor ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Bedava Kahveyi Kullan
          </button>
        </div>
      )}

      <p className="text-center text-xs text-[var(--muted)]">
        Toplam topladığın damga: {kart.toplam_damga}
      </p>

      {tarayiciAcik && (
        <QrTarayici onSonuc={tarandi} onKapat={() => setTarayiciAcik(false)} />
      )}
    </div>
  );
}

/** Google logosu (basit). */
function GoogleIkon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39 16.2 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.2c-.4.4 6.6-4.8 6.6-14.6 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
