import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const revalidate = 0;

/**
 * GET /api/siralama
 * Aktif yarışmanın onaylı gönderilerini oy sayısına göre sıralı döndürür.
 * Sıralama ekranı bu uç noktayı periyodik olarak çağırıp canlı günceller.
 */
export async function GET() {
  const supabase = createServiceClient();

  const { data: contest } = await supabase
    .from("contests")
    .select("id, baslik")
    .eq("aktif", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!contest) {
    return NextResponse.json({ contest: null, gonderiler: [] });
  }

  const { data } = await supabase
    .from("onayli_gonderiler")
    .select("id, baslik, yukleyen_ad, gorsel_url, oy_sayisi")
    .eq("contest_id", contest.id)
    .order("oy_sayisi", { ascending: false })
    .order("created_at", { ascending: true });

  return NextResponse.json({ contest, gonderiler: data ?? [] });
}
