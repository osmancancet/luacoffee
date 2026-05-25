"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer } from "lucide-react";

/** Kafede masaya konacak yazdırılabilir QR — /yarisma/katil sayfasına yönlendirir. */
export function QrPanel() {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [hedef, setHedef] = useState<string>("");

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const url = `${base}/yarisma/katil`;
    QRCode.toDataURL(url, {
      width: 480,
      margin: 2,
      color: { dark: "#0b0b0d", light: "#ffffff" },
    }).then((d) => {
      // setState yalnız async callback içinde — senkron effect setState'inden kaçınır
      setHedef(url);
      setDataUrl(d);
    });
  }, []);

  function yazdir() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Lua Coffee — Yarışma QR</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;font-family:Georgia,serif;text-align:center">
        <h1 style="font-size:32px;margin:0 0 8px">Lua Coffee</h1>
        <p style="font-size:18px;color:#555;margin:0 0 24px">Fotoğraf Yarışmasına Katıl</p>
        <img src="${dataUrl}" width="320" height="320" />
        <p style="font-size:14px;color:#888;margin-top:16px">QR'ı okut, anını paylaş!</p>
      </body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
      <h2 className="font-serif text-xl">Yarışma QR Kodu</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Masalara koymak için yazdır. Okutan müşteri katılım sayfasına gider.
      </p>
      {dataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt="Yarışma QR kodu"
          className="mx-auto mt-4 h-44 w-44 rounded-xl bg-white p-2"
        />
      )}
      <p className="mt-2 break-all text-xs text-[var(--muted)]">{hedef}</p>
      <button
        onClick={yazdir}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm hover:border-[var(--accent)]"
      >
        <Printer size={15} /> Yazdır
      </button>
    </div>
  );
}
