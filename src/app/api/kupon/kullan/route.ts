import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { adCoz } from "@/lib/kullanici";

/** POST { id } — kuponu kullan (kasada gösterilerek). */
export async function POST(req: NextRequest) {
  const authSb = await createServerSupabase();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  if (!user) {
    return NextResponse.json({ hata: "Giriş yapın." }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ hata: "Kupon id gerekli." }, { status: 400 });

  const supabase = createServiceClient();
  // Sadece kendi aktif kuponunu kullanabilir
  const { data: kupon } = await supabase
    .from("kuponlar")
    .select("id, baslik, durum")
    .eq("id", id)
    .eq("kullanici_id", user.id)
    .maybeSingle();

  if (!kupon || kupon.durum !== "aktif") {
    return NextResponse.json({ hata: "Kupon bulunamadı veya kullanılmış." }, { status: 400 });
  }

  const { error } = await supabase
    .from("kuponlar")
    .update({ durum: "kullanildi", used_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });

  await supabase.from("sadakat_islem").insert({
    kullanici_id: user.id,
    ad: adCoz(user),
    tip: "kupon",
    not_: `Kullanıldı: ${kupon.baslik}`,
  });

  return NextResponse.json({ basarili: true });
}
