import { describe, it, expect } from "vitest";
import { gunFarki, seriHesapla, kazanilanRozetler } from "./ziyaret";

describe("gunFarki", () => {
  it("ardışık günler 1", () => {
    expect(gunFarki("2026-05-01", "2026-05-02")).toBe(1);
  });
  it("aynı gün 0", () => {
    expect(gunFarki("2026-05-10", "2026-05-10")).toBe(0);
  });
  it("ay sınırını geçer", () => {
    expect(gunFarki("2026-05-31", "2026-06-01")).toBe(1);
  });
});

describe("seriHesapla", () => {
  it("ilk check-in serisi 1", () => {
    expect(seriHesapla(null, "2026-05-10", 0)).toEqual({ yeniSeri: 1, bugunMu: false });
  });
  it("dün check-in varsa seri +1", () => {
    expect(seriHesapla("2026-05-09", "2026-05-10", 3)).toEqual({
      yeniSeri: 4,
      bugunMu: false,
    });
  });
  it("bugün zaten check-in → bugunMu true, seri değişmez", () => {
    expect(seriHesapla("2026-05-10", "2026-05-10", 5)).toEqual({
      yeniSeri: 5,
      bugunMu: true,
    });
  });
  it("gün atlanınca seri sıfırlanır (1)", () => {
    expect(seriHesapla("2026-05-07", "2026-05-10", 9)).toEqual({
      yeniSeri: 1,
      bugunMu: false,
    });
  });
});

describe("kazanilanRozetler", () => {
  it("düşük değerlerde rozet yok", () => {
    expect(kazanilanRozetler(2, 2)).toHaveLength(0);
  });
  it("3 günlük seri 'Düzenli' rozeti verir", () => {
    const r = kazanilanRozetler(3, 3);
    expect(r.some((x) => x.ad === "Düzenli")).toBe(true);
  });
  it("yüksek seri + toplam birden çok rozet", () => {
    const r = kazanilanRozetler(30, 50);
    // seri: Düzenli, Sadık, Tiryaki, Efsane (4) + toplam: 10,25,50 (3) = 7
    expect(r.length).toBe(7);
  });
});
