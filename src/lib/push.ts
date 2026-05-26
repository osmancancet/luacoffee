import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";

let yapilandirildi = false;

/** VAPID ayarlarını bir kez yükler. Anahtar yoksa false döner (no-op). */
function hazirla(): boolean {
  if (yapilandirildi) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:merhaba@luacoffee.com",
    pub,
    priv,
  );
  yapilandirildi = true;
  return true;
}

export type Bildirim = { baslik: string; govde: string; url?: string };

/**
 * Bir kullanıcının tüm cihazlarına push bildirimi gönderir.
 * Ölü abonelikleri (404/410) temizler. VAPID yoksa sessizce atlar.
 */
export async function bildirimGonder(
  supabase: SupabaseClient,
  kullaniciId: string,
  bildirim: Bildirim,
): Promise<void> {
  if (!hazirla()) return;

  const { data: aboneler } = await supabase
    .from("push_aboneleri")
    .select("endpoint, p256dh, auth")
    .eq("kullanici_id", kullaniciId);

  if (!aboneler?.length) return;

  const yuk = JSON.stringify(bildirim);
  await Promise.all(
    aboneler.map(async (a) => {
      try {
        await webpush.sendNotification(
          { endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } },
          yuk,
        );
      } catch (e) {
        const kod = (e as { statusCode?: number }).statusCode;
        if (kod === 404 || kod === 410) {
          await supabase.from("push_aboneleri").delete().eq("endpoint", a.endpoint);
        }
      }
    }),
  );
}
