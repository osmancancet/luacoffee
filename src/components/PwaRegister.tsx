"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

/** beforeinstallprompt olayının minimal tipi. */
type YuklePromptu = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Service worker'ı kaydeder ve (destekleyen tarayıcılarda) "Uygulamayı Yükle"
 * butonu gösterir. Site geneli; layout'ta bir kez render edilir.
 */
export function PwaRegister() {
  const [promptu, setPromptu] = useState<YuklePromptu | null>(null);
  const [gizli, setGizli] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptu(e as YuklePromptu);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setPromptu(null));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!promptu || gizli) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/95 p-3 shadow-xl backdrop-blur sm:left-auto sm:right-4">
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Lua" className="h-full w-full object-contain p-1" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Lua Coffee&apos;yi yükle</p>
        <p className="truncate text-xs text-[var(--muted)]">
          Uygulama gibi ana ekranına ekle
        </p>
      </div>
      <button
        onClick={async () => {
          await promptu.prompt();
          await promptu.userChoice;
          setPromptu(null);
        }}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--accent-strong)] px-4 py-2 text-sm font-medium text-black"
      >
        <Download size={15} /> Yükle
      </button>
      <button
        onClick={() => setGizli(true)}
        aria-label="Kapat"
        className="shrink-0 text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        <X size={18} />
      </button>
    </div>
  );
}
