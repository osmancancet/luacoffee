"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

/**
 * Web Share API ile paylaşım. Önce görseli dosya olarak paylaşmayı dener
 * (mobilde Instagram vb. seçilebilir), olmazsa bağlantıyı paylaşır/kopyalar.
 */
export function PaylasButton({
  gorselUrl,
  baslik,
}: {
  gorselUrl?: string;
  baslik?: string;
}) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const metin = `${baslik ? baslik + " · " : ""}Lua Coffee fotoğraf yarışması 📸`;
  const link = "https://lua.coffee/yarisma";

  async function paylas() {
    // 1) Görseli dosya olarak paylaşmayı dene
    if (gorselUrl) {
      try {
        const resp = await fetch(gorselUrl);
        const blob = await resp.blob();
        const file = new File([blob], "lua-yarisma.jpg", {
          type: blob.type || "image/jpeg",
        });
        const nav = navigator as Navigator & {
          canShare?: (d: { files: File[] }) => boolean;
        };
        if (nav.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text: `${metin}\n${link}` });
          return;
        }
      } catch {
        /* CORS vb. → bağlantı paylaşımına düş */
      }
    }
    // 2) Bağlantı paylaş
    try {
      if (navigator.share) {
        await navigator.share({ title: "Lua Coffee", text: metin, url: link });
        return;
      }
    } catch {
      return;
    }
    // 3) Kopyala
    try {
      await navigator.clipboard.writeText(link);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      /* yok say */
    }
  }

  return (
    <button
      onClick={paylas}
      title="Paylaş"
      className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--accent)]"
    >
      {kopyalandi ? <Check size={15} className="text-[var(--accent)]" /> : <Share2 size={15} />}
    </button>
  );
}
