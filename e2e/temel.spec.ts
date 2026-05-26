import { test, expect } from "@playwright/test";

const sayfalar = [
  "/",
  "/hakkimizda",
  "/menu",
  "/galeri",
  "/etkinlikler",
  "/iletisim",
  "/yarisma",
  "/yarisma/siralama",
  "/yarisma/arsiv",
  "/yarisma/katil",
  "/sadakat",
];

test.describe("Public sayfalar açılıyor", () => {
  for (const yol of sayfalar) {
    test(`${yol} yüklenir`, async ({ page }) => {
      const res = await page.goto(yol);
      expect(res?.status() ?? 200).toBeLessThan(400);
      await expect(page.locator("header").first()).toBeVisible();
    });
  }
});

test("Ana sayfada Lua Coffee başlığı görünür", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Lua Coffee", level: 1 })).toBeVisible();
});

test("Menüde bilinen ürün var", async ({ page }) => {
  await page.goto("/menu");
  await expect(page.getByText("Lotus Latte").first()).toBeVisible();
});

test("Yarışmaya katıl sayfası açılır", async ({ page }) => {
  await page.goto("/yarisma/katil");
  await expect(page.getByRole("heading", { name: "Yarışmaya Katıl" })).toBeVisible();
});

test.describe("API auth gating", () => {
  test("oy girişsiz 401", async ({ request }) => {
    const r = await request.post("/api/votes", { data: { submission_id: "x" } });
    expect(r.status()).toBe(401);
  });
  test("sadakat ekleme girişsiz 401", async ({ request }) => {
    const r = await request.post("/api/sadakat", { data: { adet: 1, token: "x" } });
    expect(r.status()).toBe(401);
  });
  test("admin istatistik girişsiz 401", async ({ request }) => {
    const r = await request.get("/api/admin/istatistik");
    expect(r.status()).toBe(401);
  });
});

test("sitemap ve robots yayında", async ({ request }) => {
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
});
