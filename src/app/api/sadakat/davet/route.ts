import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";

/**
 * POST { kod } — davet kodunu kaydet.
 * Yalnız: kullanıcı yeniyse (hiç damgası yoksa), daha önce davet edilmemişse
 * ve kod kendi kodu değilse. Bonus, ilk damgada verilir (bkz. /api/sadakat POST).
 */
export async function POST(req: NextRequest) {
  const authSb = await createServerSupabase();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Giriş yapın." }, { status: 401 });

  const { kod } = await req.json();
  if (!kod) return NextResponse.json({ hata: "Kod yok." }, { status: 400 });

  const supabase = createServiceClient();

  // Davet eden
  const { data: davetEden } = await supabase
    .from("sadakat")
    .select("kullanici_id")
    .eq("referans_kodu", kod)
    .maybeSingle();
  if (!davetEden || davetEden.kullanici_id === user.id) {
    return NextResponse.json({ basarili: false });
  }

  // Davet edilen uygun mu?
  const { data: ben } = await supabase
    .from("sadakat")
    .select("toplam_damga, davet_eden")
    .eq("kullanici_id", user.id)
    .maybeSingle();
  if (ben && (ben.toplam_damga > 0 || ben.davet_eden)) {
    return NextResponse.json({ basarili: false }); // zaten aktif/kayıtlı
  }

  await supabase.from("sadakat").upsert(
    {
      kullanici_id: user.id,
      ad: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      eposta: user.email ?? null,
      davet_eden: davetEden.kullanici_id,
    },
    { onConflict: "kullanici_id" },
  );

  return NextResponse.json({ basarili: true });
}
