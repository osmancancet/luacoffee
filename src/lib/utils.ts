import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ₺ fiyatını biçimlendirir; null/undefined ise "–" döner. */
export function fiyat(deger: number | null | undefined): string {
  if (deger == null) return "–";
  return `${deger}₺`;
}

/** Geçerli yarışma dönemi: "YYYY-MM" (aylık sıfırlama için). */
export function suankiDonem(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Bir önceki ayın dönemi: "YYYY-MM". */
export function oncekiDonem(): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** "YYYY-MM" → "Ocak 2026" gibi okunabilir ay adı. */
export function donemAdi(donem: string): string {
  const aylar = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];
  const [yil, ay] = donem.split("-").map(Number);
  return `${aylar[(ay ?? 1) - 1]} ${yil}`;
}
