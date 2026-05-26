import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { adCoz } from "@/lib/kullanici";

/** POST { ay_gun: "MM-DD" } — doğum gününü kaydet (doğum günü ikramı için). */
export async function POST(req: NextRequest) {
  const authSb = await createServerSupabase();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  if (!user) {
    return NextResponse.json({ hata: "Giriş yapın." }, { status: 401 });
  }

  const { ay_gun } = await req.json();
  if (!/^\d{2}-\d{2}$/.test(ay_gun ?? "")) {
    return NextResponse.json({ hata: "Geçersiz tarih (GG/AA)." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("sadakat").upsert(
    {
      kullanici_id: user.id,
      ad: adCoz(user),
      eposta: user.email ?? null,
      dogum_ay_gun: ay_gun,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "kullanici_id" },
  );
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });
  return NextResponse.json({ basarili: true, dogum_ay_gun: ay_gun });
}
