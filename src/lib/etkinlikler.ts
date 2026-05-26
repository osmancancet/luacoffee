/**
 * Etkinlikler / Duyurular — placeholder veri.
 * Gerçek etkinlikler geldiğinde bu listeyi düzenleyin.
 */

export type Etkinlik = {
  id: string;
  baslik: string;
  tarih: string; // okunabilir tarih metni, örn. "12 Haziran 2026, Cmt"
  ozet: string;
  etiket?: string; // örn. "Canlı Müzik", "Kampanya"
  gorsel?: string;
};

export const etkinlikler: Etkinlik[] = [
  {
    id: "acilis",
    baslik: "Lua Coffee Açıldı!",
    tarih: "Yeni",
    ozet: "Soma'daki yeni mekânımızda sizi ağırlamaktan mutluyuz. Ayın altında ilk kahveniz bizden ilhamla.",
    etiket: "Duyuru",
    gorsel: "/galeri/dis-cephe-2.webp",
  },
  {
    id: "fotograf-yarismasi",
    baslik: "Fotoğraf Yarışması Başladı",
    tarih: "Devam ediyor",
    ozet: "Lua'daki anını fotoğrafla, yükle ve oyları topla. En çok oyu alan kareyi ödüllendiriyoruz.",
    etiket: "Yarışma",
  },
  {
    id: "imza-icecek",
    baslik: "Haftanın İmza İçeceği: Lua Voltage",
    tarih: "Her hafta",
    ozet: "İmza serimizden Lua Voltage'ı henüz denemediysen, bu haftaki ziyaretinde kaçırma.",
    etiket: "Menü",
  },
];
