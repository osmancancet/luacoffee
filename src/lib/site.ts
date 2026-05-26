/**
 * Lua Coffee — merkezî site içeriği.
 * Gerçek bilgiler geldiğinde YALNIZ bu dosyayı düzenleyin; sayfa kodu değişmez.
 * (Placeholder değerler örnek amaçlıdır.)
 */

export const site = {
  ad: "Lua Coffee",
  slogan: "Ayın altında bir kahve molası",
  aciklama:
    "Gece esintili lezzetler, özenle hazırlanan kahveler ve paylaşmaya değer anlar.",

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
  },

  iletisim: {
    adres: "Nihat Danışman Mah. Topçu Sokak No: 9/A, 45500 Soma / Manisa",
    // Telefon placeholder — gerçek numarayı buraya yazın.
    telefon: "+90 (000) 000 00 00",
    telefonHref: "tel:+900000000000",
    eposta: "merhaba@luacoffee.com",
    instagram: "https://www.instagram.com/lua_coffee.tr",
    instagramKullanici: "@lua_coffee.tr",
    saatler: [
      { gun: "Pazartesi – Cuma", saat: "08:00 – 24:00" },
      { gun: "Cumartesi – Pazar", saat: "09:00 – 01:00" },
    ] as { gun: string; saat: string }[],
    // Google Maps embed src'i (gerçek "Lua Coffee" kaydı).
    haritaEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3092.5788359631524!2d27.6066453!3d39.1842943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b761d432bbed79%3A0x435ac4a22fe08457!2sLua%20Coffee!5e0!3m2!1str!2str!4v1779762521608!5m2!1str!2str",
    haritaLink:
      "https://www.google.com/maps/search/?api=1&query=39.1842943,27.6066453",
  },

  hakkimizda: {
    paragraflar: [
      '"Lua" Portekizcede ay demek. Biz de kahveyi günün en sakin, en samimi anlarının eşlikçisi olarak görüyoruz. Üçüncü nesil kahve anlayışıyla seçtiğimiz çekirdekleri, gece teması bir atmosferde servis ediyoruz.',
      "Espresso bazlı klasiklerden imza içeceklerimize kadar her şey özenle hazırlanıyor. Amacımız; her fincanda bir an, her ziyarette küçük bir kaçış sunmak.",
      "Lua Coffee bir buluşma noktası: arkadaşlarla, kitaplarla ya da kendinle. Ayın altında, sıcacık bir köşede seni bekliyoruz.",
    ],
    degerler: [
      {
        baslik: "Özenli Demleme",
        metin: "Taze kavrulmuş, seçilmiş çekirdekler; ölçülü ve titiz hazırlık.",
      },
      {
        baslik: "Gece Teması",
        metin: "Sakin ışık, ay esintili tasarım, huzur veren bir atmosfer.",
      },
      {
        baslik: "İmza Lezzetler",
        metin: "Lua Voltage, Nebula Shake ve daha fazlası — yalnızca bizde.",
      },
      {
        baslik: "Topluluk",
        metin: "Fotoğraf yarışması ve etkinliklerle canlı bir Lua topluluğu.",
      },
    ],
  },
} as const;
