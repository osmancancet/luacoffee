import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";

/** POST { subscription } — push aboneliğini kaydet (giriş gerekir). */
export async function POST(req: NextRequest) {
  const authSb = await createServerSupabase();
  const {
    data: { user },
  } = await authSb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Giriş yapın." }, { status: 401 });

  const { subscription } = await req.json();
  const endpoint = subscription?.endpoint;
  const p256dh = subscription?.keys?.p256dh;
  const auth = subscription?.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ hata: "Geçersiz abonelik." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("push_aboneleri")
    .upsert({ endpoint, kullanici_id: user.id, p256dh, auth }, { onConflict: "endpoint" });
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });

  return NextResponse.json({ basarili: true });
}
