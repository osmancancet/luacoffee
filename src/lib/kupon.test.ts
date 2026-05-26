import { describe, it, expect } from "vitest";
import { ziyaretKuponu, dogumGunuBugunMu, ZIYARET_KILOMETRELERI } from "./kupon";

describe("ziyaretKuponu (kilometre taşı)", () => {
  it("tam eşikte kupon döner", () => {
    expect(ziyaretKuponu(10)?.anahtar).toBe("ziyaret-10");
    expect(ziyaretKuponu(25)?.anahtar).toBe("ziyaret-25");
  });
  it("eşik dışı null döner", () => {
    expect(ziyaretKuponu(9)).toBeNull();
    expect(ziyaretKuponu(11)).toBeNull();
    expect(ziyaretKuponu(0)).toBeNull();
  });
  it("her kilometre taşının benzersiz anahtarı var", () => {
    const anahtarlar = ZIYARET_KILOMETRELERI.map((k) => k.anahtar);
    expect(new Set(anahtarlar).size).toBe(anahtarlar.length);
  });
});

describe("dogumGunuBugunMu", () => {
  it("eşleşen MM-DD true", () => {
    expect(dogumGunuBugunMu("05-26", "05-26")).toBe(true);
  });
  it("eşleşmeyen false", () => {
    expect(dogumGunuBugunMu("01-01", "05-26")).toBe(false);
  });
  it("null doğum günü false", () => {
    expect(dogumGunuBugunMu(null, "05-26")).toBe(false);
  });
});
