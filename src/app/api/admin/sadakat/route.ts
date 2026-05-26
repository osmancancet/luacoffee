import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { damgaHesapla } from "@/lib/sadakat";

async function adminMi() {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

/** GET — sadakat üyeleri + son işlemler (admin). */
export async function GET() {
  if (!(await adminMi())) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  const supabase = createServiceClient();

  const { data: uyeler } = await supabase
    .from("sadakat")
    .select("kullanici_id, ad, eposta, damga, bedava_hak, toplam_damga, son_ekleme")
    .order("toplam_damga", { ascending: false })
    .limit(200);

  const { data: gecmis } = await supabase
    .from("sadakat_islem")
    .select("ad, tip, adet, not_, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  return NextResponse.json({ uyeler: uyeler ?? [], gecmis: gecmis ?? [] });
}

/**
 * PATCH { kullanici_id, ekle } — manuel damga ekle/çıkar (admin).
 * ekle negatif olabilir (düzeltme). 5 damga dolunca bedava hak verilir.
 */
export async function PATCH(req: NextRequest) {
  if (!(await adminMi())) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const { kullanici_id, ekle } = await req.json();
  const n = Number(ekle);
  if (!kullanici_id || !Number.isInteger(n) || n === 0) {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: mevcut } = await supabase
    .from("sadakat")
    .select("damga, bedava_hak, toplam_damga, ad")
    .eq("kullanici_id", kullanici_id)
    .maybeSingle();

  if (!mevcut) return NextResponse.json({ hata: "Üye bulunamadı." }, { status: 404 });

  let yeniDamga: number;
  let yeniBedava: number;
  if (n > 0) {
    const h = damgaHesapla(mevcut.damga ?? 0, n, mevcut.bedava_hak ?? 0);
    yeniDamga = h.damga;
    yeniBedava = h.bedava_hak;
  } else {
    // negatif: sadece ilerlemeden düş (0'ın altına inme)
    yeniDamga = Math.max(0, (mevcut.damga ?? 0) + n);
    yeniBedava = mevcut.bedava_hak ?? 0;
  }
  const yeniToplam = Math.max(0, (mevcut.toplam_damga ?? 0) + n);

  const { error } = await supabase
    .from("sadakat")
    .update({ damga: yeniDamga, bedava_hak: yeniBedava, toplam_damga: yeniToplam, updated_at: new Date().toISOString() })
    .eq("kullanici_id", kullanici_id);
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });

  await supabase.from("sadakat_islem").insert({
    kullanici_id,
    ad: mevcut.ad,
    tip: "manuel",
    adet: n,
    not_: "Admin düzeltmesi",
  });

  return NextResponse.json({ basarili: true, damga: yeniDamga, bedava_hak: yeniBedava, toplam_damga: yeniToplam });
}
