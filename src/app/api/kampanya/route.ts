import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";

export const revalidate = 0;

/** GET — aktif kampanya/günün kahvesi (public). */
export async function GET() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("kampanya")
    .select("aktif, metin")
    .eq("id", 1)
    .maybeSingle();
  return NextResponse.json({ aktif: data?.aktif ?? false, metin: data?.metin ?? "" });
}

/** PATCH { aktif, metin } — kampanyayı güncelle (admin). */
export async function PATCH(req: NextRequest) {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const { aktif, metin } = await req.json();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("kampanya")
    .upsert(
      { id: 1, aktif: !!aktif, metin: String(metin ?? "").slice(0, 200), updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });
  return NextResponse.json({ basarili: true });
}
