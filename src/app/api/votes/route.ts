import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getVoteHash } from "@/lib/voteHash";

/**
 * POST /api/votes  { submission_id }
 * Cihaz bazlı oylama. Her cihaz bir yarışmada yalnız 1 fotoğrafa oy verebilir
 * (votes tablosundaki unique index ile garanti edilir).
 */
export async function POST(req: NextRequest) {
  try {
    const { submission_id } = await req.json();
    if (!submission_id) {
      return NextResponse.json({ hata: "submission_id gerekli." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Gönderiyi ve yarışmasını doğrula (onaylı olmalı)
    const { data: gonderi, error: gErr } = await supabase
      .from("submissions")
      .select("id, contest_id, durum")
      .eq("id", submission_id)
      .single();

    if (gErr || !gonderi || gonderi.durum !== "onaylandi") {
      return NextResponse.json(
        { hata: "Geçersiz veya onaylanmamış gönderi." },
        { status: 404 },
      );
    }

    const oyHash = getVoteHash(req);

    const { error: insertErr } = await supabase.from("votes").insert({
      contest_id: gonderi.contest_id,
      submission_id,
      oy_hash: oyHash,
    });

    if (insertErr) {
      // 23505 = unique ihlali → bu cihaz bu yarışmada zaten oy kullandı
      if (insertErr.code === "23505") {
        return NextResponse.json(
          { hata: "Bu yarışmada zaten oy kullandınız.", zatenOy: true },
          { status: 409 },
        );
      }
      return NextResponse.json({ hata: insertErr.message }, { status: 500 });
    }

    // Güncel oy sayısını döndür
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
