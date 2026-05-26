import { describe, it, expect } from "vitest";
import { espressoCoffee, kategoriler } from "./menu";

describe("menü verisi", () => {
  it("espresso & coffee listesi dolu", () => {
    expect(espressoCoffee.length).toBeGreaterThan(10);
  });

  it("her kahvenin cold/hot değeri sayı veya null", () => {
    for (const u of espressoCoffee) {
      expect(u.ad.length).toBeGreaterThan(0);
      expect(u.cold === null || typeof u.cold === "number").toBe(true);
      expect(u.hot === null || typeof u.hot === "number").toBe(true);
      // en az bir fiyatı olmalı
      expect(u.cold !== null || u.hot !== null).toBe(true);
    }
  });

  it("bilinen bir ürün doğru fiyatta (Lotus Latte 190/190)", () => {
    const lotus = espressoCoffee.find((u) => u.ad === "Lotus Latte");
    expect(lotus).toBeDefined();
    expect(lotus?.cold).toBe(190);
    expect(lotus?.hot).toBe(190);
  });

  it("kategoriler ve ürünleri tutarlı (pozitif fiyat)", () => {
    expect(kategoriler.length).toBeGreaterThan(0);
    for (const kat of kategoriler) {
      expect(kat.baslik.length).toBeGreaterThan(0);
      expect(kat.urunler.length).toBeGreaterThan(0);
      for (const u of kat.urunler) {
        expect(u.ad.length).toBeGreaterThan(0);
        expect(u.fiyat).toBeGreaterThan(0);
      }
    }
  });
});
