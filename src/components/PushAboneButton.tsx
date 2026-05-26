"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";

function base64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function PushAboneButton() {
  const [destek] = useState(
    () =>
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window,
  );
  const [abone, setAbone] = useState(false);
  const [islemde, setIslemde] = useState(false);

  useEffect(() => {
    if (!destek) return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setAbone(!!sub))
      .catch(() => {});
  }, [destek]);

  async function aboneOl() {
    setIslemde(true);
    try {
      const izin = await Notification.requestPermission();
      if (izin !== "granted") {
        setIslemde(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ) as BufferSource,
      });
      const res = await fetch("/api/push/abone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub }),
      });
      if (res.ok) setAbone(true);
    } catch {
      /* sessizce geç */
    } finally {
      setIslemde(false);
    }
  }

  if (!destek || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return null;

  if (abone) {
    return (
      <p className="flex items-center justify-center gap-2 text-center text-xs text-[var(--muted)]">
        <BellRing size={14} className="text-[var(--accent)]" /> Bildirimler açık — kahven hazır olunca haber vereceğiz.
      </p>
    );
  }

  return (
    <button
      onClick={aboneOl}
      disabled={islemde}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm transition-colors hover:border-[var(--accent)] disabled:opacity-60"
    >
      {islemde ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}
      Bildirimleri Aç
    </button>
  );
}
