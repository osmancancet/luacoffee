import { createHmac } from "crypto";

/** 5 damga toplayınca 1 bedava kahve (6. kahve bedava). */
export const HEDEF_DAMGA = 5;

/** QR ile eklenebilecek geçerli damga adetleri (kasada 1'li–5'li QR'lar). */
export const GECERLI_ADETLER = [1, 2, 3, 4, 5] as const;

/**
 * Belirli bir damga adedi için QR token'ı üretir (HMAC).
 * Token sunucu sırrına bağlıdır; sırf URL'i tahmin edip damga eklemeyi engeller.
 */
export function damgaToken(adet: number): string {
  const sir = process.env.SADAKAT_SECRET || "lua-sadakat-degistirin";
  return createHmac("sha256", sir).update(`damga:${adet}`).digest("hex").slice(0, 20);
}

/** QR'dan gelen token'ı doğrular. */
export function tokenGecerli(adet: number, token: string): boolean {
  if (!GECERLI_ADETLER.includes(adet as (typeof GECERLI_ADETLER)[number])) return false;
  return damgaToken(adet) === token;
}

/** İki koordinat arası mesafe (metre) — Haversine. Konum doğrulaması için. */
export function mesafeMetre(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
