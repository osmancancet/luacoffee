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
    // Google Maps embed src'i (Soma/Manisa, Topçu Sokak).
    haritaEmbed:
      "https://www.google.com/maps?q=Top%C3%A7u%20Sokak%209%2FA%2C%2045500%20Soma%2FManisa&output=embed",
    haritaLink:
      "https://maps.google.com/?q=Topçu Sokak No:9/A, 45500 Soma/Manisa",
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
