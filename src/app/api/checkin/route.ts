import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { seriHesapla, kazanilanRozetler } from "@/lib/ziyaret";
import { mesafeMetre } from "@/lib/sadakat";
import { site } from "@/lib/site";

async function girisliKullanici() {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

function bugunStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

/** GET — giriş durumu + ziyaret durumu. */
export async function GET() {
  const user = await girisliKullanici();
  if (!user) return NextResponse.json({ girisli: false });

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("ziyaretler")
    .select("seri, en_uzun_seri, toplam, son_tarih")
    .eq("kullanici_id", user.id)
    .maybeSingle();

  const seri = data?.seri ?? 0;
  const toplam = data?.toplam ?? 0;
  return NextResponse.json({
    girisli: true,
    seri,
    en_uzun_seri: data?.en_uzun_seri ?? 0,
    toplam,
    bugun_yapildi: data?.son_tarih === bugunStr(),
    rozetler: kazanilanRozetler(seri, toplam),
  });
}

/** POST { lat, lng } — kafedeyken günde 1 check-in. */
export async function POST(req: NextRequest) {
  const user = await girisliKullanici();
  if (!user) {
    return NextResponse.json(
      { hata: "Check-in için giriş yapın.", girisGerekli: true },
      { status: 401 },
    );
  }

  const { lat, lng } = await req.json();
  const enlem = Number(lat);
  const boylam = Number(lng);
  if (!Number.isFinite(enlem) || !Number.isFinite(boylam)) {
    return NextResponse.json(
      { hata: "Konum gerekli. Check-in için kafede olmalısın." },
      { status: 400 },
    );
  }
  if (mesafeMetre(enlem, boylam, site.konum.enlem, site.konum.boylam) > site.konum.yaricapMetre) {
    return NextResponse.json(
      { hata: "Kafede görünmüyorsun. Check-in yalnızca Lua Coffee'deyken yapılır." },
      { status: 403 },
    );
  }

  const supabase = createServiceClient();
  const { data: mevcut } = await supabase
    .from("ziyaretler")
    .select("seri, en_uzun_seri, toplam, son_tarih")
    .eq("kullanici_id", user.id)
    .maybeSingle();

  const bugun = bugunStr();
  const { yeniSeri, bugunMu } = seriHesapla(
    mevcut?.son_tarih ?? null,
    bugun,
    mevcut?.seri ?? 0,
  );

  if (bugunMu) {
    return NextResponse.json(
      { hata: "Bugün zaten check-in yaptın. Yarın görüşürüz! 🌙", bugun_yapildi: true },
      { status: 409 },
    );
  }

  const toplam = (mevcut?.toplam ?? 0) + 1;
  const enUzun = Math.max(mevcut?.en_uzun_seri ?? 0, yeniSeri);

  const { error } = await supabase.from("ziyaretler").upsert(
    {
      kullanici_id: user.id,
      ad: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      seri: yeniSeri,
      en_uzun_seri: enUzun,
      toplam,
      son_tarih: bugun,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "kullanici_id" },
  );
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });

  return NextResponse.json({
    basarili: true,
    seri: yeniSeri,
    en_uzun_seri: enUzun,
    toplam,
    bugun_yapildi: true,
    rozetler: kazanilanRozetler(yeniSeri, toplam),
  });
}
