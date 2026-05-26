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
  {
    src: "/galeri/dis-cephe-2.webp",
    baslik: "Lua Coffee — giriş",
    genis: true,
  },
  {
    src: "/galeri/dis-cephe-1.webp",
    baslik: "Dış oturma alanı",
    genis: true,
  },
  {
    src: "/lua/1.png",
    baslik: "Ayın altında",
  },
];
