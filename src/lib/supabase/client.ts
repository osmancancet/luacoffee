import { createBrowserClient } from "@supabase/ssr";

/**
 * Tarayıcı tarafı Supabase istemcisi (anon key).
 * Yalnızca okuma + admin auth oturumu için kullanılır.
 * Yazma işlemleri (yükleme, oy, onay) sunucu route'ları üzerinden yapılır.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
