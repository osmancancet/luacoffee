"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X } from "lucide-react";

/**
 * Kamera ile QR okuyan modal. Başarılı okumada onSonuc(metin) çağrılır.
 * Kasadaki sadakat QR'ını uygulama içinden okutmak için kullanılır.
 */
export function QrTarayici({
  onSonuc,
  onKapat,
}: {
  onSonuc: (metin: string) => void;
  onKapat: () => void;
}) {
  const baslatildi = useRef(false);

  useEffect(() => {
    if (baslatildi.current) return;
    baslatildi.current = true;

    const tarayici = new Html5Qrcode("lua-qr-okuyucu");
    let durduruldu = false;

    const durdur = async () => {
      if (durduruldu) return;
      durduruldu = true;
      try {
        await tarayici.stop();
        tarayici.clear();
      } catch {
        /* yok say */
      }
    };

    tarayici
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (metin) => {
          durdur().then(() => onSonuc(metin));
        },
        () => {},
      )
      .catch(() => {
        // Kamera açılamadı (izin yok vb.)
      });

    return () => {
      durdur();
    };
  }, [onSonuc]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/85 p-5 backdrop-blur">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <span className="font-serif text-lg">Kasadaki QR&apos;ı okut</span>
          <button onClick={onKapat} aria-label="Kapat" className="text-[var(--muted)] hover:text-[var(--foreground)]">
            <X size={22} />
          </button>
        </div>
        <div id="lua-qr-okuyucu" className="aspect-square w-full bg-black" />
        <p className="px-5 py-3 text-center text-xs text-[var(--muted)]">
          Kamerayı kasadaki sadakat QR&apos;ına doğrult.
        </p>
      </div>
    </div>
  );
}
