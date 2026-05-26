import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { GECERLI_ADETLER, damgaToken } from "@/lib/sadakat";
import { site } from "@/lib/site";

/**
 * GET — kasada basılacak 1'li–5'li sadakat QR URL'lerini döndürür (sadece admin).
 * Her URL imzalı token içerir; müşteri okutunca o kadar damga eklenir.
 */
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const taban = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const kodlar = GECERLI_ADETLER.map((adet) => ({
    adet,
    url: `${taban}/sadakat?ekle=${adet}&t=${damgaToken(adet)}`,
  }));

  return NextResponse.json({ kodlar });
}
