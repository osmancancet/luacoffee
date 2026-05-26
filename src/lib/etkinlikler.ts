/**
 * Etkinlikler / Duyurular.
 * `gecmis: true` olanlar "Geçmiş Etkinlikler" bölümünde listelenir.
 * Yeni etkinlik geldiğinde en üste ekleyin.
 */

export type Etkinlik = {
  id: string;
  baslik: string;
  tarih: string;
  ozet: string;
  etiket?: string;
  ucret?: string;
  gorsel?: string;
  gecmis?: boolean;
};

export const etkinlikler: Etkinlik[] = [
  // ——— Güncel / süregelen ———
  {
    id: "fotograf-yarismasi",
    baslik: "Fotoğraf Yarışması",
    tarih: "Devam ediyor",
    ozet: "Lua'daki anını fotoğrafla, yükle ve oyları topla. En çok oyu alan kareyi ödüllendiriyoruz.",
    etiket: "Yarışma",
  },

  // ——— Geçmiş etkinlikler ———
  {
    id: "mum-workshop-deniz",
    baslik: "Mum Workshop — Deniz Teması",
    tarih: "29 Ocak 2026 · Perşembe 20:00–22:00",
    ozet: "Deniz kabukları içine özel tasarım mumlar hazırladık. Tüm malzemeler bizden; keyifli, yaratıcı ve deniz esintili bir buluşma oldu.",
    etiket: "Workshop",
    gecmis: true,
  },
  {
    id: "seramik-workshop-ocak",
    baslik: "Seramik Workshop",
    tarih: "27 Ocak 2026 · Salı 20:00–22:00",
    ozet: "Kendi seramik objemizi şekillendirdiğimiz keyifli bir atölye çalışması.",
    etiket: "Workshop",
    gecmis: true,
  },
  {
    id: "anne-cocuk-tuval-26",
    baslik: "Anne & Çocuk Tuval Boyama",
    tarih: "26 Ocak 2026 · Pazartesi 15:00–17:00",
    ozet: "Anne ve çocukların birlikte tuval boyadığı, eğlenceli ve renkli bir etkinlik.",
    etiket: "Atölye",
    gecmis: true,
  },
  {
    id: "seramik-kupa-boyama",
    baslik: "Seramik Kupa Boyama",
    tarih: "22 Ocak 2026 · Perşembe 20:00–22:00",
    ozet: "Kendi kupanı boyayıp kişiselleştirdiğin sıcak bir atölye.",
    etiket: "Atölye",
    gecmis: true,
  },
  {
    id: "anne-cocuk-tuval-21",
    baslik: "Anne & Çocuk Tuval Boyama",
    tarih: "21 Ocak 2026 · Çarşamba 15:00–17:00",
    ozet: "Anne ve çocukların birlikte tuval boyadığı keyifli bir buluşma.",
    etiket: "Atölye",
    gecmis: true,
  },
  {
    id: "mozaik-workshop",
    baslik: "Mozaik Workshop",
    tarih: "16 Ocak 2026 · Cuma 20:00",
    ozet: "Mozaik sanatının temel tekniklerini öğrenip renkli taşları bir araya getirdiğimiz, kahve eşliğinde keyifli bir çalışma.",
    etiket: "Workshop",
    ucret: "Ücretsiz",
    gecmis: true,
  },
  {
    id: "seramik-workshop-aralik",
    baslik: "Seramik Workshop — Yılbaşı",
    tarih: "12 Aralık 2025 · Cuma 20:00",
    ozet: "Yeni yıl için kendi seramik objeni ürettiğin atölye. Fırınlama gerektirmeyen, obje amaçlı tasarım.",
    etiket: "Workshop",
    gecmis: true,
  },
];
