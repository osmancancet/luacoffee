import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Camera, Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { createServiceClient } from "@/lib/supabase/server";
import { VoteButton } from "@/components/VoteButton";
import { Reveal } from "@/components/Reveal";
import { suankiDonem, donemAdi } from "@/lib/utils";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fotoğraf Yarışması",
  description:
    "Lua Coffee (Soma) fotoğraf yarışması galerisi. En sevdiğin kareye oy ver, sen de katıl.",
  alternates: { canonical: "/yarisma" },
};

// Oylar değiştikçe güncel kalsın
export const revalidate = 0;

type Gonderi = {
  id: string;
  baslik: string | null;
  yukleyen_ad: string | null;
  gorsel_url: string;
  oy_sayisi: number;
};

export default async function YarismaSayfasi() {
  const supabase = createServiceClient();

  const { data: contest } = await supabase
    .from("contests")
    .select("id, baslik, aciklama")
    .eq("aktif", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const donem = suankiDonem();
  let gonderiler: Gonderi[] = [];
  if (contest) {
    const { data } = await supabase
      .from("onayli_gonderiler")
      .select("id, baslik, yukleyen_ad, gorsel_url, oy_sayisi")
      .eq("contest_id", contest.id)
      .eq("donem", donem)
      .order("oy_sayisi", { ascending: false });
    gonderiler = (data as Gonderi[]) ?? [];
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow={`${donemAdi(donem)} Yarışması`}
        baslik="Lua Bardağıyla En Güzel Kare"
        aciklama="Kafemizde Lua bardağıyla çektiğin en güzel fotoğrafı paylaş. Her ay 1 fotoğraf, 1 beğeni; ayın en çok beğenilen karesi kazanır."
      />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/yarisma/katil"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
        >
          <Camera size={16} /> Sen de Katıl
        </Link>
        <Link
          href="/yarisma/siralama"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium hover:border-[var(--accent)]"
        >
          <Trophy size={16} /> Sıralama
        </Link>
      </div>

      {/* Ödüller */}
      <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-2.5">
        {site.yarismaOduller.map((o) => (
          <span
            key={o.sira}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm"
          >
            <span>{o.madalya}</span>
            <span className="text-[var(--muted)]">{o.odul}</span>
          </span>
        ))}
      </div>

      {gonderiler.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-[var(--border)] py-20 text-center text-[var(--muted)]">
          Bu ay henüz onaylanmış fotoğraf yok. İlk katılan sen ol!
        </div>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gonderiler.map((g, i) => (
            <Reveal
              as="article"
              key={g.id}
              delay={(i % 3) * 90}
              className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={g.gorsel_url}
                  alt={g.baslik ?? "Yarışma fotoğrafı"}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {i < 3 && (
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs backdrop-blur">
                    #{i + 1}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-lg">
                    {g.baslik ?? "İsimsiz"}
                  </h3>
                  {g.yukleyen_ad && (
                    <p className="truncate text-sm text-[var(--muted)]">
                      {g.yukleyen_ad}
                    </p>
                  )}
                </div>
                <VoteButton submissionId={g.id} baslangicOyu={g.oy_sayisi} />
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
