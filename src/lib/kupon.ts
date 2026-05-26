/**
 * Sadakat kuponları — kilometre taşı (ziyaret sayısı) ödülleri.
 * Saf mantık; test edilebilir.
 */

export type KilometreOdulu = { esik: number; baslik: string; anahtar: string };

/** Toplam ziyaret kilometre taşları → kupon. */
export const ZIYARET_KILOMETRELERI: KilometreOdulu[] = [
  { esik: 10, baslik: "Tatlıda %50 indirim", anahtar: "ziyaret-10" },
  { esik: 25, baslik: "Ücretsiz kahve", anahtar: "ziyaret-25" },
  { esik: 50, baslik: "Kahve + tatlı ikramı", anahtar: "ziyaret-50" },
  { esik: 100, baslik: "Lua efsanesi: 1 hafta kahve", anahtar: "ziyaret-100" },
];

/** Verilen toplam ziyaret tam bir kilometre taşına denk geliyorsa kuponu döndürür. */
export function ziyaretKuponu(toplam: number): KilometreOdulu | null {
  return ZIYARET_KILOMETRELERI.find((k) => k.esik === toplam) ?? null;
}

/** "MM-DD" doğum günü bugünle eşleşiyor mu? */
export function dogumGunuBugunMu(dogumAyGun: string | null, bugunAyGun: string): boolean {
  return !!dogumAyGun && dogumAyGun === bugunAyGun;
}
