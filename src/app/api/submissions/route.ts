import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { suankiDonem } from "@/lib/utils";

const IZINLI_TIPLER = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAKS_BOYUT = 8 * 1024 * 1024; // 8 MB

/**
 * POST /api/submissions
 * Fotoğraf yükleme (Google girişi gerekir). Kayıt 'beklemede' oluşturulur,
 * admin onayından sonra galeride görünür. Her hesap aylık 1 fotoğraf yükleyebilir.
 */
export async function POST(req: NextRequest) {
  try {
    // Giriş kontrolü
    const authSb = await createServerSupabase();
    const {
      data: { user },
    } = await authSb.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { hata: "Fotoğraf yüklemek için giriş yapın.", girisGerekli: true },
        { status: 401 },
      );
    }

    const form = await req.formData();
    const dosya = form.get("gorsel") as File | null;
    const baslik = (form.get("baslik") as string | null)?.trim() || null;
    const yukleyenAd = (form.get("yukleyen_ad") as string | null)?.trim() || null;
    const aciklama = (form.get("aciklama") as string | null)?.trim() || null;

    if (!dosya) {
      return NextResponse.json({ hata: "Fotoğraf gerekli." }, { status: 400 });
    }
    if (!IZINLI_TIPLER.includes(dosya.type)) {
      return NextResponse.json(
        { hata: "Sadece JPEG, PNG, WEBP veya HEIC yükleyebilirsiniz." },
        { status: 400 },
      );
    }
    if (dosya.size > MAKS_BOYUT) {
      return NextResponse.json(
        { hata: "Dosya 8 MB'tan büyük olamaz." },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();

    // Aktif yarışmayı bul
    const { data: contest, error: contestErr } = await supabase
      .from("contests")
      .select("id")
      .eq("aktif", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (contestErr || !contest) {
      return NextResponse.json(
        { hata: "Şu anda aktif bir yarışma yok." },
        { status: 404 },
      );
    }

    const donem = suankiDonem();

    // Bu hesap bu ay zaten yükledi mi?
    const { data: oncekiler } = await supabase
      .from("submissions")
      .select("id")
      .eq("kullanici_id", user.id)
      .eq("donem", donem)
      .limit(1);
    if (oncekiler && oncekiler.length > 0) {
      return NextResponse.json(
        { hata: "Bu ay zaten bir fotoğraf yükledin. Gelecek ay tekrar katılabilirsin." },
        { status: 409 },
      );
    }

    // Storage'a yükle
    const uzanti = dosya.name.split(".").pop() || "jpg";
    const yol = `${contest.id}/${crypto.randomUUID()}.${uzanti}`;
    const buffer = Buffer.from(await dosya.arrayBuffer());

    const { error: uploadErr } = await supabase.storage
      .from("submissions")
      .upload(yol, buffer, { contentType: dosya.type, upsert: false });

    if (uploadErr) {
      return NextResponse.json(
        { hata: "Yükleme başarısız: " + uploadErr.message },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("submissions").getPublicUrl(yol);

    // Kaydı oluştur (beklemede)
    const { error: insertErr } = await supabase.from("submissions").insert({
      contest_id: contest.id,
      donem,
      kullanici_id: user.id,
      baslik,
      aciklama,
      yukleyen_ad:
        yukleyenAd ??
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        null,
      gorsel_url: publicUrl,
      durum: "beklemede",
    });

    if (insertErr) {
      // 23505 = aylık tekil ihlali (yarış koşulu)
      if (insertErr.code === "23505") {
        return NextResponse.json(
          { hata: "Bu ay zaten bir fotoğraf yükledin." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { hata: "Kayıt oluşturulamadı: " + insertErr.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ basarili: true });
  } catch (e) {
    return NextResponse.json(
      { hata: "Beklenmeyen hata: " + (e as Error).message },
      { status: 500 },
    );
  }
}
