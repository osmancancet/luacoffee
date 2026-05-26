import { describe, it, expect, beforeAll } from "vitest";
import {
  HEDEF_DAMGA,
  GECERLI_ADETLER,
  damgaToken,
  tokenGecerli,
  damgaHesapla,
  mesafeMetre,
} from "./sadakat";
import { site } from "./site";

beforeAll(() => {
  process.env.SADAKAT_SECRET = "test-sirri-123";
});

describe("damga token (QR imzası)", () => {
  it("aynı adet için kararlı (deterministik) token üretir", () => {
    expect(damgaToken(3)).toBe(damgaToken(3));
  });

  it("farklı adetler farklı token üretir", () => {
    expect(damgaToken(1)).not.toBe(damgaToken(2));
  });

  it("geçerli token doğrulanır, yanlış token reddedilir", () => {
    const t = damgaToken(4);
    expect(tokenGecerli(4, t)).toBe(true);
    expect(tokenGecerli(4, "yanlis")).toBe(false);
    expect(tokenGecerli(5, t)).toBe(false); // başka adetin token'ı
  });

  it("geçersiz adetleri reddeder (0, 6, negatif)", () => {
    expect(tokenGecerli(0, damgaToken(0))).toBe(false);
    expect(tokenGecerli(6, damgaToken(6))).toBe(false);
    expect(tokenGecerli(-1, damgaToken(-1))).toBe(false);
  });

  it("geçerli adetler 1..5", () => {
    expect([...GECERLI_ADETLER]).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("damgaHesapla (5 kahveye 1 bedava)", () => {
  it("hedefin altında bedava vermez", () => {
    expect(damgaHesapla(0, 3)).toEqual({ damga: 3, kazanilan: 0, bedava_hak: 0 });
  });

  it("tam 5 damgada 1 bedava verir, ilerleme sıfırlanır", () => {
    expect(damgaHesapla(3, 2)).toEqual({ damga: 0, kazanilan: 1, bedava_hak: 1 });
  });

  it("taşan damgayı bir sonraki tura aktarır", () => {
    // 4 + 3 = 7 → 1 bedava kazanılır, 2 ilerleme kalır
    expect(damgaHesapla(4, 3)).toEqual({ damga: 2, kazanilan: 1, bedava_hak: 1 });
    // önceki bedava 1 varsa toplam 2 olur
    expect(damgaHesapla(4, 3, 1)).toEqual({ damga: 2, kazanilan: 1, bedava_hak: 2 });
  });

  it("tek seferde birden fazla bedava (10 damga = 2 bedava)", () => {
    expect(damgaHesapla(0, 10, 1)).toEqual({ damga: 0, kazanilan: 2, bedava_hak: 3 });
  });

  it("HEDEF_DAMGA 5", () => {
    expect(HEDEF_DAMGA).toBe(5);
  });
});

describe("mesafeMetre (konum doğrulaması)", () => {
  const { enlem, boylam } = site.konum;

  it("aynı nokta ~0 metre", () => {
    expect(mesafeMetre(enlem, boylam, enlem, boylam)).toBeLessThan(1);
  });

  it("kafeye çok yakın nokta yarıçap içinde", () => {
    // ~50m kuzey (enlemde ~0.00045°)
    const d = mesafeMetre(enlem, boylam, enlem + 0.00045, boylam);
    expect(d).toBeGreaterThan(30);
    expect(d).toBeLessThan(site.konum.yaricapMetre);
  });

  it("uzak nokta yarıçap dışında (İstanbul)", () => {
    const d = mesafeMetre(enlem, boylam, 41.0082, 28.9784);
    expect(d).toBeGreaterThan(site.konum.yaricapMetre);
    expect(d).toBeGreaterThan(100000); // 100+ km
  });
});
