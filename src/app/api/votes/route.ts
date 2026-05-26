import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { suankiDonem } from "@/lib/utils";

/**
 * POST /api/votes  { submission_id }
 * Google girişli oylama. Her hesap bir ayda (dönem) yalnız 1 fotoğrafa oy verebilir.
 */
export async function POST(req: NextRequest) {
  try {
    const authSb = await createServerSupabase();
    const {
      data: { user },
    } = await authSb.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { hata: "Oy vermek için giriş yapın.", girisGerekli: true },
        { status: 401 },
      );
    }

    const { submission_id } = await req.json();
    if (!submission_id) {
      return NextResponse.json({ hata: "submission_id gerekli." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Gönderiyi doğrula (onaylı + bu dönem)
    const donem = suankiDonem();
    const { data: gonderi, error: gErr } = await supabase
      .from("submissions")
      .select("id, contest_id, durum, donem")
      .eq("id", submission_id)
      .single();

    if (gErr || !gonderi || gonderi.durum !== "onaylandi") {
      return NextResponse.json(
        { hata: "Geçersiz veya onaylanmamış gönderi." },
        { status: 404 },
      );
    }
    if (gonderi.donem !== donem) {
      return NextResponse.json(
        { hata: "Bu fotoğraf bu ayın yarışmasında değil." },
        { status: 400 },
      );
    }

    const { error: insertErr } = await supabase.from("votes").insert({
      contest_id: gonderi.contest_id,
      submission_id,
      kullanici_id: user.id,
      donem,
    });

    if (insertErr) {
      // 23505 = bu hesap bu ay zaten oy kullandı
      if (insertErr.code === "23505") {
        return NextResponse.json(
          { hata: "Bu ay zaten oy kullandın.", zatenOy: true },
          { status: 409 },
        );
      }
      return NextResponse.json({ hata: insertErr.message }, { status: 500 });
    }

    const { count } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("submission_id", submission_id);

    return NextResponse.json({ basarili: true, oySayisi: count ?? 0 });
  } catch (e) {
    return NextResponse.json(
      { hata: "Beklenmeyen hata: " + (e as Error).message },
      { status: 500 },
    );
  }
}
