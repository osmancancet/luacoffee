/**
 * Lua Coffee menüsü — kafenin gönderdiği menü görsellerinden (public/lua/2.png,
 * public/lua/3.png) birebir aktarıldı. Fiyatlar ₺ cinsindendir.
 */

export type KahveUrun = {
  ad: string;
  cold: number | null; // soğuk fiyatı; yoksa null
  hot: number | null; // sıcak fiyatı; yoksa null
};

export type Urun = {
  ad: string;
  fiyat: number;
};

export type Kategori = {
  baslik: string;
  aciklama?: string;
  urunler: Urun[];
};

/** Espresso & Coffee — COLD / HOT fiyatlı bölüm */
export const espressoCoffee: KahveUrun[] = [
  { ad: "Espresso", cold: 120, hot: 120 },
  { ad: "Americano", cold: 140, hot: 140 },
  { ad: "Latte", cold: 160, hot: 160 },
  { ad: "Filter Coffee", cold: 140, hot: 140 },
  { ad: "Mocha", cold: 170, hot: 170 },
  { ad: "Flat White", cold: 165, hot: 165 },
  { ad: "Frappe", cold: 180, hot: null },
  { ad: "Affogato", cold: 185, hot: null },
  { ad: "Cortado", cold: null, hot: 170 },
  { ad: "Cappucino", cold: null, hot: 165 },
  { ad: "Caramel Macchiato", cold: 180, hot: 180 },
  { ad: "Türk Kahvesi", cold: null, hot: 100 },
  { ad: "Caramel Latte", cold: 170, hot: 170 },
  { ad: "Vanilla Latte", cold: 170, hot: 170 },
  { ad: "Cookie Latte", cold: 170, hot: 170 },
  { ad: "Lotus Latte", cold: 190, hot: 190 },
  { ad: "Salted Caramel Latte", cold: 180, hot: 180 },
  { ad: "Hazelnut Latte", cold: 180, hot: 180 },
  { ad: "Pumpkin Spice Latte", cold: 180, hot: 180 },
  { ad: "Irish Latte", cold: 180, hot: 180 },
  { ad: "White Chocolate Mocha", cold: 180, hot: 180 },
  { ad: "Mocha Frappe", cold: 180, hot: null },
  { ad: "Chai Tea Latte", cold: 170, hot: 170 },
];

/** Tek fiyatlı kategoriler */
export const kategoriler: Kategori[] = [
  {
    baslik: "Special Drinks",
    aciklama: "Lua imza içecekleri",
    urunler: [
      { ad: "Lua Voltage", fiyat: 190 },
      { ad: "Matcha", fiyat: 190 },
      { ad: "Electric Breeze", fiyat: 190 },
      { ad: "Nebula Shake", fiyat: 185 },
      { ad: "Aurora Chill", fiyat: 185 },
      { ad: "Cosmic Crunch", fiyat: 185 },
    ],
  },
  {
    baslik: "Fresh Drinks",
    urunler: [
      { ad: "Cool Lime", fiyat: 170 },
      { ad: "Cool Berry", fiyat: 170 },
      { ad: "Orange Mango", fiyat: 170 },
      { ad: "Berry Hibiscus", fiyat: 170 },
    ],
  },
  {
    baslik: "Hot Drinks",
    urunler: [
      { ad: "Hot Chocolate", fiyat: 140 },
      { ad: "White Chocolate", fiyat: 140 },
      { ad: "Salep", fiyat: 140 },
      { ad: "Tea", fiyat: 50 },
      { ad: "Lua Green Tea", fiyat: 100 },
      { ad: "Lua Winter Tea", fiyat: 100 },
    ],
  },
  {
    baslik: "Cold Drinks",
    urunler: [
      { ad: "Su", fiyat: 30 },
      { ad: "Soda", fiyat: 50 },
      { ad: "Churchill", fiyat: 80 },
    ],
  },
];
