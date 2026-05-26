/**
 * Mekân/vitrin galerisi görselleri (yarışma galerisinden ayrı).
 * Yeni fotoğraf eklemek için: dosyayı `public/galeri/` altına koyun ve
 * aşağıdaki listeye bir satır ekleyin. `genis: true` olanlar ızgarada 2 sütun kaplar.
 */

export type GaleriGorsel = {
  src: string;
  baslik: string;
  genis?: boolean;
};

export const galeri: GaleriGorsel[] = [
  { src: "/galeri/ic-mekan-lua-duvar.png", baslik: "Lua duvarı & bar", genis: true },
  { src: "/galeri/ic-mekan-1.png", baslik: "Oturma alanı" },
  { src: "/galeri/ic-mekan-2.png", baslik: "Kahve & atıştırmalık" },
  { src: "/galeri/ic-mekan-genis.png", baslik: "İç mekân", genis: true },
  { src: "/galeri/ic-mekan-3.png", baslik: "Bir fincan, bir kitap" },
  { src: "/galeri/dis-cephe-2.webp", baslik: "Lua Coffee — giriş", genis: true },
  { src: "/galeri/dis-cephe-1.webp", baslik: "Dış oturma alanı" },
];
