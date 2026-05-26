/**
 * Basit e-posta gönderimi (Resend HTTP API).
 * RESEND_API_KEY tanımlı değilse sessizce atlar (false döner).
 * Bağımlılık gerektirmez; fetch ile çalışır.
 */
export async function epostaGonder(
  alici: string,
  konu: string,
  html: string,
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !alici) return false;
  const from = process.env.RESEND_FROM || "Lua Coffee <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [alici], subject: konu, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
