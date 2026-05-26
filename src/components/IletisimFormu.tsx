"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Basit iletişim formu — backend gerektirmez.
 * Girilen bilgileri bir `mailto:` bağlantısına dönüştürüp kullanıcının
 * e-posta istemcisini açar. (Gerçek sunucu tarafı gönderim istenirse
 * ileride bir API route + e-posta servisi eklenebilir.)
 */
export function IletisimFormu() {
  const [ad, setAd] = useState("");
  const [eposta, setEposta] = useState("");
  const [mesaj, setMesaj] = useState("");

  function gonder(e: React.FormEvent) {
    e.preventDefault();
    const konu = encodeURIComponent(`Lua Coffee — ${ad || "İletişim"}`);
    const govde = encodeURIComponent(
      `Ad: ${ad}\nE-posta: ${eposta}\n\n${mesaj}`,
    );
    window.location.href = `mailto:${site.iletisim.eposta}?subject=${konu}&body=${govde}`;
  }

  return (
    <form onSubmit={gonder} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Adınız"
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
        />
        <input
          type="email"
          required
          placeholder="E-posta"
          value={eposta}
          onChange={(e) => setEposta(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
        />
      </div>
      <textarea
        required
        rows={5}
        placeholder="Mesajınız"
        value={mesaj}
        onChange={(e) => setMesaj(e.target.value)}
        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition-colors focus:border-[var(--accent)]"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
      >
        <Send size={16} /> Gönder
      </button>
      <p className="text-xs text-[var(--muted)]">
        Gönder&apos;e bastığınızda e-posta uygulamanız hazır bir mesajla açılır.
      </p>
    </form>
  );
}
