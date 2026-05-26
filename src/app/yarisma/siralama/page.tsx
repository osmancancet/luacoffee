import type { Metadata } from "next";
import Link from "next/link";
import { Camera } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { Leaderboard, type SiraGonderi } from "@/components/Leaderboard";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Sıralama — Lua Coffee Yarışması",
  description: "Lua Coffee fotoğraf yarışmasının canlı oy sıralaması.",
};

export const revalidate = 0;

export default async function SiralamaSayfasi() {
  const supabase = createServiceClient();

  const { data: contest } = await supabase
    .from("contests")
    .select("id, baslik")
    .eq("aktif", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let gonderiler: SiraGonderi[] = [];
  if (contest) {
    const { data } = await supabase
      .from("onayli_gonderiler")
      .select("id, baslik, yukleyen_ad, gorsel_url, oy_sayisi")
      .eq("contest_id", contest.id)
      .order("oy_sayisi", { ascending: false })
      .order("created_at", { ascending: true });
    gonderiler = (data as SiraGonderi[]) ?? [];
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Sıralama"
        baslik="Sıralama"
        aciklama={
          contest?.baslik
            ? `${contest.baslik} — en çok oyu toplayan kareler`
            : "Yarışmanın en çok oyu toplayan kareleri"
        }
      />

      <div className="anim-fade-in delay-3 mt-12">
        <Leaderboard initial={gonderiler} />
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link
          href="/yarisma/katil"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
        >
          <Camera size={16} /> Sen de Katıl
        </Link>
        <Link
          href="/yarisma"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium hover:border-[var(--accent)]"
        >
          Galeriye Dön
        </Link>
      </div>
    </div>
  );
}
