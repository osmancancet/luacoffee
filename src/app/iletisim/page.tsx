import type { Metadata } from "next";
import { MapPin, Clock, AtSign, Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { IletisimFormu } from "@/components/IletisimFormu";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim & Konum",
  description:
    "Lua Coffee — Soma, Manisa adres, çalışma saatleri, telefon ve harita. Nihat Danışman Mah. Topçu Sokak No: 9/A.",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimSayfasi() {
  const { iletisim } = site;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="İletişim"
        baslik="Bize Ulaş"
        aciklama="Sorularınız, rezervasyon ve iş birlikleri için buradayız. Ayın altında görüşmek dileğiyle."
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        {/* Bilgiler */}
        <div className="space-y-4">
          <Reveal className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <MapPin className="mt-0.5 shrink-0 text-[var(--accent)]" size={20} />
            <div>
              <h3 className="font-serif text-lg">Adres</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{iletisim.adres}</p>
              <a
                href={iletisim.haritaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-[var(--accent)] hover:underline"
              >
                Haritada aç →
              </a>
            </div>
          </Reveal>

          <Reveal delay={70} className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <Clock className="mt-0.5 shrink-0 text-[var(--accent)]" size={20} />
            <div className="flex-1">
              <h3 className="font-serif text-lg">Çalışma Saatleri</h3>
              <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                {iletisim.saatler.map((s) => (
                  <li key={s.gun} className="flex justify-between gap-4">
                    <span>{s.gun}</span>
                    <span className="text-[var(--foreground)]">{s.saat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={140} className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <AtSign className="mt-0.5 shrink-0 text-[var(--accent)]" size={20} />
            <div>
              <h3 className="font-serif text-lg">Instagram</h3>
              <a
                href={iletisim.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {iletisim.instagramKullanici}
              </a>
            </div>
          </Reveal>

          {/* Harita */}
          <Reveal delay={140} className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <iframe
              src={iletisim.haritaEmbed}
              title="Lua Coffee konum"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full grayscale"
            />
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={100}>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/40 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <Mail size={18} className="text-[var(--accent)]" />
              <h2 className="font-serif text-2xl">Mesaj Gönder</h2>
            </div>
            <IletisimFormu />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
