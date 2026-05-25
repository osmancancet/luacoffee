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
