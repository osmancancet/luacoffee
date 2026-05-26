"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer, Loader2, Stamp, Download, AlertCircle } from "lucide-react";

type Kod = { adet: number; url: string; dataUrl: string };

/** Kasada basılacak 1'li–5'li sadakat QR'larını üretir (sadece admin). */
export function SadakatQrPanel() {
  const [kodlar, setKodlar] = useState<Kod[]>([]);
  const [durum, setDurum] = useState<"yukleniyor" | "hazir" | "hata">("yukleniyor");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/sadakat-qr");
        if (!res.ok) {
          setDurum("hata");
          return;
        }
        const { kodlar } = await res.json();
        const ureti = await Promise.all(
          (kodlar as { adet: number; url: string }[]).map(async (k) => ({
            ...k,
            dataUrl: await QRCode.toDataURL(k.url, {
              width: 600,
              margin: 2,
              color: { dark: "#0b0b0d", light: "#ffffff" },
            }),
          })),
        );
        setKodlar(ureti);
        setDurum("hazir");
      } catch {
        setDurum("hata");
      }
    })();
  }, []);

  /** Tek bir QR'ı PNG olarak indir. */
  function indir(k: Kod) {
    const a = document.createElement("a");
    a.href = k.dataUrl;
    a.download = `lua-sadakat-${k.adet}-kahve.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function yazdir() {
    const w = window.open("", "_blank");
    if (!w) return;
    const kartlar = kodlar
      .map(
        (k) => `
        <div style="display:inline-flex;flex-direction:column;align-items:center;margin:18px;page-break-inside:avoid;font-family:Georgia,serif">
          <img src="${k.dataUrl}" width="220" height="220" />
          <div style="font-size:26px;font-weight:bold;margin-top:8px">${k.adet} Kahve</div>
          <div style="font-size:13px;color:#777">${k.adet} damga ekler</div>
        </div>`,
      )
      .join("");
    w.document.write(`
      <html><head><title>Lua Coffee — Sadakat QR</title></head>
      <body style="text-align:center;font-family:Georgia,serif;padding:24px">
        <h1 style="font-size:30px;margin:0 0 4px">Lua Coffee — Sadakat</h1>
        <p style="font-size:16px;color:#555;margin:0 0 16px">5 kahveye 1 bedava · Okutmak isteyen müşteriye gösterin</p>
        ${kartlar}
      </body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center gap-2">
        <Stamp size={18} className="text-[var(--accent)]" />
        <h2 className="font-serif text-xl">Sadakat QR Kodları</h2>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Müşteri kaç kahve aldıysa o adetin QR&apos;ını gösterin; okutunca o kadar
        damga eklenir. Tek tek indirip çıktı alabilir veya tümünü yazdırabilirsiniz.
      </p>

      {durum === "yukleniyor" && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-[var(--muted)]" />
        </div>
      )}

      {durum === "hata" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>
            QR&apos;lar yüklenemedi. Oturumun açık olduğundan ve sunucuda
            <code className="mx-1">SADAKAT_SECRET</code> tanımlı olduğundan emin olun.
          </span>
        </div>
      )}

      {durum === "hazir" && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {kodlar.map((k) => (
              <div
                key={k.adet}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={k.dataUrl}
                  alt={`${k.adet} kahve QR`}
                  className="mx-auto w-full rounded-lg bg-white p-1.5"
                />
                <p className="mt-2 font-serif text-base leading-none">{k.adet} Kahve</p>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">{k.adet} damga</p>
                <button
                  onClick={() => indir(k)}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full border border-[var(--border)] py-1.5 text-xs hover:border-[var(--accent)]"
                >
                  <Download size={13} /> İndir
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={yazdir}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm hover:border-[var(--accent)]"
          >
            <Printer size={15} /> Tümünü Yazdır
          </button>
        </>
      )}
    </div>
  );
}
