import { NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { HEDEF_DAMGA } from "@/lib/sadakat";

/** POST — bir bedava kahve hakkını kullan (giriş gerekir). */
export async function POST() {
  const serverSb = await createServerSupabase();
  const {
    data: { user },
  } = await serverSb.auth.getUser();
  if (!user) {
    return NextResponse.json({ hata: "Giriş yapın." }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("sadakat")
    .select("damga, bedava_hak, toplam_damga")
    .eq("kullanici_id", user.id)
    .maybeSingle();

  if (!data || data.bedava_hak < 1) {
    return NextResponse.json(
      { hata: "Kullanılabilir bedava kahve hakkın yok." },
      { status: 400 },
    );
  }

  const yeni = data.bedava_hak - 1;
  const { error } = await supabase
    .from("sadakat")
    .update({ bedava_hak: yeni, updated_at: new Date().toISOString() })
    .eq("kullanici_id", user.id);

  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });

  return NextResponse.json({
    basarili: true,
    damga: data.damga,
    bedava_hak: yeni,
    toplam_damga: data.toplam_damga,
    hedef: HEDEF_DAMGA,
  });
}
