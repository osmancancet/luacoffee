import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { oncekiDonem, donemAdi } from "@/lib/utils";
import { bildirimGonder } from "@/lib/push";
import { epostaGonder } from "@/lib/email";

/**
 * POST { donem? } — verilen ayın (varsayılan: geçen ay) kazananını belirler,
 * kazananlar tablosuna yazar ve kazanana push + (varsa) e-posta gönderir.
 */
export async function POST(req: NextRequest) {
  const authSb = await createServerSupabase();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const govde = await req.json().catch(() => ({}));
  const donem: string = /^\d{4}-\d{2}$/.test(govde.donem) ? govde.donem : oncekiDonem();

  const supabase = createServiceClient();

  const { data: contest } = await supabase
    .from("contests")
    .select("id")
    .eq("aktif", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (!contest) return NextResponse.json({ hata: "Aktif yarışma yok." }, { status: 404 });

  // Dönemin kazananı (en çok oy)
  const { data: kazanan } = await supabase
    .from("onayli_gonderiler")
    .select("id, baslik, yukleyen_ad, gorsel_url, oy_sayisi")
    .eq("contest_id", contest.id)
    .eq("donem", donem)
    .order("oy_sayisi", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!kazanan) {
    return NextResponse.json(
      { hata: `${donemAdi(donem)} için onaylı gönderi yok.` },
      { status: 404 },
    );
  }

  // Kaydet
  const { error } = await supabase.from("kazananlar").upsert(
    {
      donem,
      submission_id: kazanan.id,
      ad: kazanan.yukleyen_ad,
      baslik: kazanan.baslik,
      gorsel_url: kazanan.gorsel_url,
      oy_sayisi: kazanan.oy_sayisi,
    },
    { onConflict: "donem" },
  );
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });

  // Kazananın kullanıcı kimliği → bildirim
  const { data: gonderi } = await supabase
    .from("submissions")
    .select("kullanici_id")
    .eq("id", kazanan.id)
    .maybeSingle();

  if (gonderi?.kullanici_id) {
    await bildirimGonder(supabase, gonderi.kullanici_id, {
      baslik: "🏆 Yarışmayı kazandın!",
      govde: `${donemAdi(donem)} fotoğraf yarışmasının kazananı sensin! Ödülün için kasaya uğra.`,
      url: "/yarisma/arsiv",
    });
    // E-posta (opsiyonel)
    const { data: u } = await supabase.auth.admin.getUserById(gonderi.kullanici_id);
    const eposta = u?.user?.email;
    if (eposta) {
      await epostaGonder(
        eposta,
        "🏆 Lua Coffee — Yarışmayı kazandın!",
        `<div style="font-family:Arial,sans-serif">
          <h2>Tebrikler! 🎉</h2>
          <p><strong>${donemAdi(donem)}</strong> Lua Coffee fotoğraf yarışmasının kazananı oldun.</p>
          <p>Fotoğrafın <strong>${kazanan.oy_sayisi} beğeni</strong> topladı. Ödülünü almak için kasaya uğramanız yeterli ☕</p>
          <p>— Lua Coffee, Soma</p>
        </div>`,
      );
    }
  }

  return NextResponse.json({
    basarili: true,
    donem,
    kazanan: { baslik: kazanan.baslik, ad: kazanan.yukleyen_ad, oy_sayisi: kazanan.oy_sayisi },
  });
}
