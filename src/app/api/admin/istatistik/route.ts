import { NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { suankiDonem } from "@/lib/utils";

/** GET — admin özet istatistikleri. */
export async function GET() {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const supabase = createServiceClient();
  const bugun = new Date().toISOString().slice(0, 10);
  const donem = suankiDonem();
  const head = { count: "exact" as const, head: true };

  const [
    aktifUye,
    bekleyen,
    buAyGonderi,
    onayliGonderi,
    bedavaKullanim,
    toplamCheckin,
    bugunCheckin,
  ] = await Promise.all([
    supabase.from("sadakat").select("*", head).gt("toplam_damga", 0),
    supabase.from("submissions").select("*", head).eq("durum", "beklemede"),
    supabase.from("submissions").select("*", head).eq("donem", donem),
    supabase.from("submissions").select("*", head).eq("durum", "onaylandi").eq("donem", donem),
    supabase.from("sadakat_islem").select("*", head).eq("tip", "kullanim"),
    supabase.from("sadakat_islem").select("*", head).eq("tip", "checkin"),
    supabase.from("sadakat_islem").select("*", head).eq("tip", "checkin").gte("created_at", `${bugun}T00:00:00`),
  ]);

  // Son 7 gün check-in
  const yediGunOnce = new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10);
  const { data: ciList } = await supabase
    .from("sadakat_islem")
    .select("created_at")
    .eq("tip", "checkin")
    .gte("created_at", `${yediGunOnce}T00:00:00`);

  const gunler: { gun: string; sayi: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    gunler.push({ gun: new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10), sayi: 0 });
  }
  (ciList ?? []).forEach((r) => {
    const g = (r.created_at as string).slice(0, 10);
    const h = gunler.find((x) => x.gun === g);
    if (h) h.sayi++;
  });

  return NextResponse.json({
    aktifUye: aktifUye.count ?? 0,
    bekleyen: bekleyen.count ?? 0,
    buAyGonderi: buAyGonderi.count ?? 0,
    onayliGonderi: onayliGonderi.count ?? 0,
    bedavaKullanim: bedavaKullanim.count ?? 0,
    toplamCheckin: toplamCheckin.count ?? 0,
    bugunCheckin: bugunCheckin.count ?? 0,
    gunler,
  });
}
