import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const revalidate = 0;

/**
 * GET /api/ziyaret-siralama
 * "En çok ziyaret edenler" — public liderlik tablosu (ödülsüz, tanınma amaçlı).
 */
export async function GET() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("ziyaretler")
    .select("ad, seri, toplam")
    .gt("toplam", 0)
    .order("toplam", { ascending: false })
    .order("seri", { ascending: false })
    .limit(10);

  return NextResponse.json({ siralama: data ?? [] });
}
