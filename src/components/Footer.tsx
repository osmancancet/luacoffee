import Link from "next/link";
import Image from "next/image";
import { AtSign, MapPin, Clock } from "lucide-react";
import { site } from "@/lib/site";

const kesfet = [
  { href: "/hakkimizda", etiket: "Hakkımızda" },
  { href: "/menu", etiket: "Menü" },
  { href: "/galeri", etiket: "Galeri" },
  { href: "/etkinlikler", etiket: "Etkinlikler" },
  { href: "/sadakat", etiket: "Sadakat Kartım" },
];

const yarismaLinkleri = [
  { href: "/yarisma", etiket: "Yarışma" },
  { href: "/yarisma/siralama", etiket: "Sıralama" },
  { href: "/yarisma/katil", etiket: "Yarışmaya Katıl" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] pb-20 lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marka */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="relative h-9 w-9 overflow-hidden rounded-full bg-white">
              <Image src="/logo.png" alt="Lua Coffee" fill className="object-contain p-1" />
            </span>
            <span className="font-serif text-lg">Lua Coffee</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            {site.aciklama}
          </p>
        </div>

        {/* Keşfet */}
        <nav className="space-y-2 text-sm text-[var(--muted)]">
          <h3 className="font-serif text-base text-[var(--foreground)]">Keşfet</h3>
          {kesfet.map((l) => (
            <Link key={l.href} href={l.href} className="block hover:text-[var(--foreground)]">
              {l.etiket}
            </Link>
          ))}
        </nav>

        {/* Yarışma */}
        <nav className="space-y-2 text-sm text-[var(--muted)]">
          <h3 className="font-serif text-base text-[var(--foreground)]">Yarışma</h3>
          {yarismaLinkleri.map((l) => (
            <Link key={l.href} href={l.href} className="block hover:text-[var(--foreground)]">
              {l.etiket}
            </Link>
          ))}
        </nav>

        {/* İletişim */}
        <div className="space-y-3 text-sm text-[var(--muted)]">
          <h3 className="font-serif text-base text-[var(--foreground)]">İletişim</h3>
          <p className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
            {site.iletisim.adres}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={16} className="shrink-0 text-[var(--accent)]" />
            {site.iletisim.saatler[0].saat}
          </p>
          <a
            href={site.iletisim.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[var(--foreground)]"
          >
            <AtSign size={16} className="shrink-0 text-[var(--accent)]" />
            {site.iletisim.instagramKullanici}
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 border-t border-[var(--border)] px-5 py-5 text-center text-xs text-[var(--muted)]">
        <span>© {new Date().getFullYear()} Lua Coffee. Tüm hakları saklıdır.</span>
        <span className="flex items-center gap-1.5">
          Hazırlayan{" "}
          <a
            href="https://instagram.com/osmancancetlenbik"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
          >
            <AtSign size={12} className="shrink-0" />
            Osman Can ÇETLENBİK
          </a>
        </span>
      </div>
    </footer>
  );
}
