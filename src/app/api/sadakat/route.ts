import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";
import { tokenGecerli, mesafeMetre, damgaHesapla, HEDEF_DAMGA } from "@/lib/sadakat";
import { bildirimGonder } from "@/lib/push";
import { site } from "@/lib/site";

const COOLDOWN_SN = 60; // aynı kullanıcıdan ardışık eklemeler arası bekleme

/** Giriş yapan kullanıcıyı döndürür (yoksa null). */
async function girisliKullanici() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function bugunAyGun(): string {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** GET — giriş durumu + sadakat kartı + kuponlar + doğum günü. */
export async function GET() {
  const user = await girisliKullanici();
  if (!user) return NextResponse.json({ girisli: false });

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("sadakat")
    .select("damga, bedava_hak, toplam_damga, dogum_ay_gun, son_dogum_yili")
    .eq("kullanici_id", user.id)
    .maybeSingle();

  // Doğum günü bugünse ve bu yıl ödül verilmediyse → kupon oluştur
  const ad = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;
  const yil = new Date().getFullYear();
  if (data?.dogum_ay_gun === bugunAyGun() && data?.son_dogum_yili !== yil) {
    await supabase.from("kuponlar").insert({
      kullanici_id: user.id,
      baslik: "🎂 Doğum günün kutlu olsun! Kahven bizden",
      tip: "dogumgunu",
      anahtar: `dogum-${yil}`,
    });
    await supabase
      .from("sadakat")
      .update({ son_dogum_yili: yil })
      .eq("kullanici_id", user.id);
    await supabase
      .from("sadakat_islem")
      .insert({ kullanici_id: user.id, ad, tip: "kupon", not_: "Doğum günü kuponu" });
    await bildirimGonder(supabase, user.id, {
      baslik: "🎂 Doğum günün kutlu olsun!",
      govde: "Bugün kahven Lua'dan. Kartındaki kuponu kasada göster.",
      url: "/sadakat",
    });
  }

  const { data: kuponlar } = await supabase
    .from("kuponlar")
    .select("id, baslik, tip, created_at")
    .eq("kullanici_id", user.id)
    .eq("durum", "aktif")
    .order("created_at", { ascending: false });

  return NextResponse.json({
    girisli: true,
    ad,
    damga: data?.damga ?? 0,
    bedava_hak: data?.bedava_hak ?? 0,
    toplam_damga: data?.toplam_damga ?? 0,
    hedef: HEDEF_DAMGA,
    dogum_ay_gun: data?.dogum_ay_gun ?? null,
    kuponlar: kuponlar ?? [],
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

  const { adet, token, lat, lng } = await req.json();
  const n = Number(adet);
  if (!tokenGecerli(n, token)) {
    return NextResponse.json({ hata: "Geçersiz veya süresi dolmuş QR." }, { status: 400 });
  }

  // Konum doğrulaması — QR yalnız kafede okutulabilir (fotoğrafı başka yerde işe yaramaz)
  const enlem = Number(lat);
  const boylam = Number(lng);
  if (!Number.isFinite(enlem) || !Number.isFinite(boylam)) {
    return NextResponse.json(
      { hata: "Konum gerekli. Damga eklemek için kafede olmalı ve konum iznini açmalısın." },
      { status: 400 },
    );
  }
  const uzaklik = mesafeMetre(enlem, boylam, site.konum.enlem, site.konum.boylam);
  if (uzaklik > site.konum.yaricapMetre) {
    return NextResponse.json(
      {
        hata: "Kafede görünmüyorsun. Damga yalnızca Lua Coffee'deyken eklenebilir.",
        uzakta: true,
      },
      { status: 403 },
    );
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

  const hesap = damgaHesapla(mevcut?.damga ?? 0, n, mevcut?.bedava_hak ?? 0);
  const yeniDamga = hesap.damga;
  const kazanilan = hesap.kazanilan;
  const yeniBedava = hesap.bedava_hak;
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

  await supabase.from("sadakat_islem").insert({
    kullanici_id: user.id,
    ad: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    tip: "damga",
    adet: n,
  });

  // Push bildirimi: bedava kazandı / son 1 kahve
  if (kazanilan > 0) {
    await bildirimGonder(supabase, user.id, {
      baslik: "🎉 Bedava kahve kazandın!",
      govde: "Bir sonraki kahven Lua'dan. Afiyet olsun!",
      url: "/sadakat",
    });
  } else if (yeniDamga === HEDEF_DAMGA - 1) {
    await bildirimGonder(supabase, user.id, {
      baslik: "Son 1 kahve! ☕",
      govde: "Bir kahve daha, bedava kahve senin!",
      url: "/sadakat",
    });
  }

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
