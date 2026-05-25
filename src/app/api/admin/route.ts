import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";

/** Giriş yapan kullanıcının admin (oturum açmış) olduğunu doğrular. */
async function girisliMi() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** GET — bekleyen gönderileri listele (sadece admin). */
export async function GET() {
  if (!(await girisliMi())) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, baslik, aciklama, yukleyen_ad, gorsel_url, durum, created_at")
    .eq("durum", "beklemede")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });
  return NextResponse.json({ gonderiler: data });
}

/** PATCH { id, durum } — gönderiyi onayla/reddet (sadece admin). */
export async function PATCH(req: NextRequest) {
  if (!(await girisliMi())) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }
  const { id, durum } = await req.json();
  if (!id || !["onaylandi", "reddedildi"].includes(durum)) {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("submissions")
    .update({ durum })
    .eq("id", id);

  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });
  return NextResponse.json({ basarili: true });
}
