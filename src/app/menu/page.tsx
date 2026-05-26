import type { Metadata } from "next";
import { espressoCoffee, kategoriler } from "@/lib/menu";
import { fiyat } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Menü",
  description:
    "Lua Coffee menüsü (Soma, Manisa): espresso bazlı kahveler, imza içecekler, sıcak & soğuk seçenekler ve fiyatları.",
  alternates: { canonical: "/menu" },
};

export default function MenuSayfasi() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Menü"
        baslik="Menü"
        aciklama="Espresso bazlı klasiklerden imza içeceklerimize. Fiyatlar ₺ cinsindendir."
      />

      {/* Espresso & Coffee — COLD / HOT */}
      <Reveal as="section" className="mt-14">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="font-serif text-2xl">Espresso &amp; Coffee</h2>
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 bg-[var(--surface-2)] px-5 py-3 text-xs uppercase tracking-wider text-[var(--muted)]">
            <span>Ürün</span>
            <span className="w-14 text-right">Cold</span>
            <span className="w-14 text-right">Hot</span>
          </div>
          {espressoCoffee.map((u, i) => (
            <div
              key={u.ad}
              className={`grid grid-cols-[1fr_auto_auto] gap-x-6 px-5 py-3 ${
                i % 2 ? "bg-[var(--surface)]/40" : ""
              }`}
            >
              <span>{u.ad}</span>
              <span className="w-14 text-right text-sm text-[var(--accent)]">
                {fiyat(u.cold)}
              </span>
              <span className="w-14 text-right text-sm text-[var(--accent)]">
                {fiyat(u.hot)}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Tek fiyatlı kategoriler */}
      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        {kategoriler.map((kat, ki) => (
          <Reveal as="section" key={kat.baslik} delay={ki * 80}>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-serif text-2xl">{kat.baslik}</h2>
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>
            {kat.aciklama && (
              <p className="-mt-3 mb-4 text-sm text-[var(--muted)]">{kat.aciklama}</p>
            )}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
              {kat.urunler.map((u, i) => (
                <div
                  key={u.ad}
                  className={`flex items-center justify-between px-5 py-3 ${
                    i % 2 ? "bg-[var(--surface)]/40" : ""
                  }`}
                >
                  <span>{u.ad}</span>
                  <span className="text-sm text-[var(--accent)]">{fiyat(u.fiyat)}</span>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
