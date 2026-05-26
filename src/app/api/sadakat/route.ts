import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { tokenGecerli, HEDEF_DAMGA } from "@/lib/sadakat";

const COOLDOWN_SN = 60; // aynı kullanıcıdan ardışık eklemeler arası bekleme

/** Giriş yapan kullanıcıyı döndürür (yoksa null). */
async function girisliKullanici() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** GET — giriş durumunu + mevcut sadakat kartını döndürür. */
export async function GET() {
  const user = await girisliKullanici();
  if (!user) return NextResponse.json({ girisli: false });

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("sadakat")
    .select("damga, bedava_hak, toplam_damga")
    .eq("kullanici_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    girisli: true,
    ad: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    damga: data?.damga ?? 0,
    bedava_hak: data?.bedava_hak ?? 0,
    toplam_damga: data?.toplam_damga ?? 0,
    hedef: HEDEF_DAMGA,
  });
}

/** POST { adet, token } — QR ile damga ekle (giriş gerekir). */
export async function POST(req: NextRequest) {
  const user = await girisliKullanici();
  if (!user) {
    return NextResponse.json(
      { hata: "Damga eklemek için giriş yapın.", girisGerekli: true },
      { status: 401 },
    );
  }

  const { adet, token } = await req.json();
  const n = Number(adet);
  if (!tokenGecerli(n, token)) {
    return NextResponse.json({ hata: "Geçersiz veya süresi dolmuş QR." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: mevcut } = await supabase
    .from("sadakat")
    .select("damga, bedava_hak, toplam_damga, son_ekleme")
    .eq("kullanici_id", user.id)
    .maybeSingle();

  const simdi = Date.now();
  if (
    mevcut?.son_ekleme &&
    simdi - new Date(mevcut.son_ekleme).getTime() < COOLDOWN_SN * 1000
  ) {
    return NextResponse.json(
      {
        hata: "Az önce damga eklendi, lütfen biraz bekleyin.",
        damga: mevcut.damga,
        bedava_hak: mevcut.bedava_hak,
        toplam_damga: mevcut.toplam_damga,
        hedef: HEDEF_DAMGA,
      },
      { status: 429 },
    );
  }

  const toplam = (mevcut?.damga ?? 0) + n;
  const kazanilan = Math.floor(toplam / HEDEF_DAMGA);
  const yeniDamga = toplam % HEDEF_DAMGA;
  const yeniBedava = (mevcut?.bedava_hak ?? 0) + kazanilan;
  const yeniToplam = (mevcut?.toplam_damga ?? 0) + n;

  const { error } = await supabase.from("sadakat").upsert(
    {
      kullanici_id: user.id,
      ad: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      eposta: user.email ?? null,
      damga: yeniDamga,
      bedava_hak: yeniBedava,
      toplam_damga: yeniToplam,
      son_ekleme: new Date(simdi).toISOString(),
      updated_at: new Date(simdi).toISOString(),
    },
    { onConflict: "kullanici_id" },
  );

  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });

  return NextResponse.json({
    basarili: true,
    eklenen: n,
    yeni_bedava: kazanilan,
    damga: yeniDamga,
    bedava_hak: yeniBedava,
    toplam_damga: yeniToplam,
    hedef: HEDEF_DAMGA,
  });
}
