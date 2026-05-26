import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { createServiceClient } from "@/lib/supabase/server";
import { donemAdi } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Yarışma Arşivi",
  description: "Lua Coffee fotoğraf yarışmasının geçmiş ay kazananları.",
  alternates: { canonical: "/yarisma/arsiv" },
};

export const revalidate = 0;

type Kazanan = {
  donem: string;
  ad: string | null;
  baslik: string | null;
  gorsel_url: string | null;
  oy_sayisi: number;
};

export default async function ArsivSayfasi() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("kazananlar")
    .select("donem, ad, baslik, gorsel_url, oy_sayisi")
    .order("donem", { ascending: false });
  const kazananlar = (data as Kazanan[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Arşiv"
        baslik="Geçmiş Kazananlar"
        aciklama="Her ayın en çok beğenilen kareleri. Sıradaki sen olabilirsin."
      />

      {kazananlar.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-[var(--border)] py-20 text-center text-[var(--muted)]">
          Henüz ilan edilmiş kazanan yok. İlk ayın kazananı olmak için katıl!
        </div>
      ) : (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kazananlar.map((k, i) => (
            <Reveal
              key={k.donem}
              delay={(i % 3) * 80}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="relative aspect-[4/3]">
                {k.gorsel_url && (
                  <Image
                    src={k.gorsel_url}
                    alt={k.baslik ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs backdrop-blur">
                  <Trophy size={12} className="text-yellow-400" /> {donemAdi(k.donem)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-lg">{k.baslik ?? "İsimsiz"}</h3>
                  {k.ad && <p className="truncate text-sm text-[var(--muted)]">{k.ad}</p>}
                </div>
                <span className="shrink-0 text-sm text-[var(--accent)]">{k.oy_sayisi} oy</span>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/yarisma"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium hover:border-[var(--accent)]"
        >
          Bu Ayın Yarışması
        </Link>
      </div>
    </div>
  );
}
