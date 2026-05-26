/**
 * Check-in (ziyaret serisi) saf mantığı — test edilebilir.
 * Günde 1 check-in; ardışık günlerde seri büyür, bir gün atlanınca sıfırlanır.
 */

/** "YYYY-MM-DD" iki gün arası fark (gün). */
export function gunFarki(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / 86_400_000);
}

/**
 * Yeni seriyi hesaplar.
 * - bugün zaten check-in varsa: bugunMu=true (tekrar eklenmez)
 * - dün check-in varsa: seri +1
 * - daha eski / hiç yoksa: seri 1 (sıfırdan)
 */
export function seriHesapla(
  sonTarih: string | null,
  bugun: string,
  mevcutSeri: number,
): { yeniSeri: number; bugunMu: boolean } {
  if (!sonTarih) return { yeniSeri: 1, bugunMu: false };
  const fark = gunFarki(sonTarih, bugun);
  if (fark <= 0) return { yeniSeri: mevcutSeri, bugunMu: true };
  if (fark === 1) return { yeniSeri: mevcutSeri + 1, bugunMu: false };
  return { yeniSeri: 1, bugunMu: false };
}

export type Rozet = {
  esik: number;
  tip: "seri" | "toplam";
  ad: string;
  ikon: string;
};

export const ZIYARET_ROZETLERI: Rozet[] = [
  { esik: 3, tip: "seri", ad: "Düzenli", ikon: "🔥" },
  { esik: 7, tip: "seri", ad: "Sadık", ikon: "🌙" },
  { esik: 14, tip: "seri", ad: "Tiryaki", ikon: "⭐" },
  { esik: 30, tip: "seri", ad: "Efsane", ikon: "👑" },
  { esik: 10, tip: "toplam", ad: "10 Ziyaret", ikon: "☕" },
  { esik: 25, tip: "toplam", ad: "25 Ziyaret", ikon: "🏅" },
  { esik: 50, tip: "toplam", ad: "50 Ziyaret", ikon: "🏆" },
];

/** Verilen seri/toplam ile kazanılmış rozetleri döndürür. */
export function kazanilanRozetler(seri: number, toplam: number): Rozet[] {
  return ZIYARET_ROZETLERI.filter((r) =>
    r.tip === "seri" ? seri >= r.esik : toplam >= r.esik,
  );
}
