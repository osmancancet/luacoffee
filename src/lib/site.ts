/**
 * Lua Coffee — merkezî site içeriği.
 * Gerçek bilgiler geldiğinde YALNIZ bu dosyayı düzenleyin; sayfa kodu değişmez.
 * (Placeholder değerler örnek amaçlıdır.)
 */

export const site = {
  ad: "Lua Coffee",
  slogan: "Ayın altında bir kahve molası",
  aciklama:
    "Soma'da özenle hazırlanan kahveler, imza lezzetler ve yaratıcı atölyeler.",

  // Canlı domain (SEO / canonical / OG için temel URL)
  url: "https://lua.coffee",

  // SEO anahtar kelimeleri (yerel + marka)
  anahtarKelimeler: [
    "Lua Coffee",
    "Soma kahve",
    "Soma cafe",
    "Manisa kahve",
    "Soma kafe",
    "üçüncü nesil kahve",
    "specialty coffee Soma",
    "Soma'da kahve",
    "Topçu Sokak kafe",
  ],

  // Yapılandırılmış adres (JSON-LD LocalBusiness için)
  konum: {
    sokakAdresi: "Nihat Danışman Mah. Topçu Sokak No: 9/A",
    ilce: "Soma",
    il: "Manisa",
    postaKodu: "45500",
    ulke: "TR",
    fiyatAraligi: "₺₺",
    // Gerçek koordinatlar (Google Maps "Lua Coffee" kaydı).
    enlem: 39.1842943,
    boylam: 27.6066453,
    // Sadakat QR'ı yalnız bu yarıçap içindeyken okutulabilir (metre).
    // GPS sapmasına karşı biraz geniş tutuldu; isterseniz daraltabilirsiniz.
    yaricapMetre: 250,
  },

  iletisim: {
    adres: "Nihat Danışman Mah. Topçu Sokak No: 9/A, 45500 Soma / Manisa",
    eposta: "merhaba@luacoffee.com",
    instagram: "https://www.instagram.com/lua_coffee.tr",
    instagramKullanici: "@lua_coffee.tr",
    saatler: [
      { gun: "Pazartesi – Cuma", saat: "10:00 – 24:00" },
      { gun: "Cumartesi – Pazar", saat: "10:00 – 01:00" },
    ] as { gun: string; saat: string }[],
    // Google Maps embed src'i (gerçek "Lua Coffee" kaydı).
    haritaEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3092.5788359631524!2d27.6066453!3d39.1842943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b761d432bbed79%3A0x435ac4a22fe08457!2sLua%20Coffee!5e0!3m2!1str!2str!4v1779762521608!5m2!1str!2str",
    haritaLink:
      "https://www.google.com/maps/search/?api=1&query=39.1842943,27.6066453",
    // Google'da yorum yazma bağlantısı (müşteriyi haritadaki kayda yönlendirir)
    yorumYazLink:
      "https://www.google.com/maps/search/?api=1&query=Lua+Coffee+Soma",
  },

  // Misafir yorumları (placeholder — gerçek yorumlarla değiştirin)
  yorumlar: [
    { ad: "Elif K.", yildiz: 5, metin: "Soma'nın en iyi kahvesi! Atmosfer çok huzurlu, baristalar işinin ehli." },
    { ad: "Mert A.", yildiz: 5, metin: "Lotus Latte favorim oldu. Atölyeler de çok keyifli, herkese tavsiye ederim." },
    { ad: "Zeynep T.", yildiz: 5, metin: "Sadakat kartı ve yarışma çok eğlenceli. Artık müdavimiyim ☕" },
  ] as { ad: string; yildiz: number; metin: string }[],

  // Aylık fotoğraf yarışması ödülleri (ilk 3, kademeli)
  yarismaOduller: [
    { madalya: "🥇", sira: "1.", odul: "Kahve + tatlı ikramı" },
    { madalya: "🥈", sira: "2.", odul: "Ücretsiz kahve" },
    { madalya: "🥉", sira: "3.", odul: "Kahvede %50 indirim" },
  ] as { madalya: string; sira: string; odul: string }[],

  hakkimizda: {
    paragraflar: [
      "Lua Coffee, Soma'da üçüncü nesil kahve deneyimini şehre taşımak için kuruldu. Özenle seçtiğimiz çekirdekleri, doğru ölçü ve sıcaklıkta, uzman ellerde hazırlıyoruz.",
      "Espresso bazlı klasiklerden imza içeceklerimize uzanan geniş bir menü sunuyoruz. Hedefimiz; her fincanda tutarlı, nitelikli ve keyifli bir lezzet.",
      "Aynı zamanda bir buluşma ve üretim noktasıyız: seramik, mozaik ve mum atölyelerimizle Soma'da yaratıcı ve sıcak bir topluluk oluşturuyoruz. Kapımız iyi kahve, iyi sohbet ve üretmek isteyen herkese açık.",
    ],
    degerler: [
      {
        baslik: "Specialty Kahve",
        metin: "Özenle seçilmiş çekirdekler; tutarlı, nitelikli ve titiz demleme.",
      },
      {
        baslik: "İmza Lezzetler",
        metin: "Lua Voltage, Nebula Shake ve yalnızca bize özgü tarifler.",
      },
      {
        baslik: "Atölye & Topluluk",
        metin: "Seramik, mozaik ve mum atölyeleriyle yaratıcı buluşmalar.",
      },
      {
        baslik: "Sıcak Mekân",
        metin: "Rahat, şık ve davetkâr bir ortam; kaliteli vakit için tasarlandı.",
      },
    ],
  },
} as const;
