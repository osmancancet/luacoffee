import { describe, it, expect } from "vitest";
import { cn, fiyat, suankiDonem, donemAdi } from "./utils";

describe("cn (class birleştirme)", () => {
  it("sınıfları birleştirir, çakışan tailwind'i sonuncuyla çözer", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});

describe("fiyat", () => {
  it("sayıyı ₺ ile biçimlendirir", () => {
    expect(fiyat(120)).toBe("120₺");
  });
  it("null/undefined için tire döner", () => {
    expect(fiyat(null)).toBe("–");
    expect(fiyat(undefined)).toBe("–");
  });
});

describe("suankiDonem", () => {
  it("YYYY-MM biçiminde döner", () => {
    expect(suankiDonem()).toMatch(/^\d{4}-\d{2}$/);
  });
});

describe("donemAdi", () => {
  it("dönemi okunabilir ay adına çevirir", () => {
    expect(donemAdi("2026-05")).toBe("Mayıs 2026");
    expect(donemAdi("2026-01")).toBe("Ocak 2026");
    expect(donemAdi("2025-12")).toBe("Aralık 2025");
  });
});
