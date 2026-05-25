import Link from "next/link";
import { AtSign, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <h3 className="font-serif text-xl">Lua Coffee</h3>
          <p className="mt-2 max-w-xs text-sm text-[var(--muted)]">
            Ayın altında bir kahve molası. Gece esintili lezzetler, sıcak bir atmosfer.
          </p>
        </div>

        <div className="space-y-3 text-sm text-[var(--muted)]">
          <p className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0" />
            Adres bilgisi yakında eklenecek
          </p>
          <p className="flex items-center gap-2">
            <Clock size={16} className="shrink-0" />
            Her gün 08:00 – 24:00
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[var(--foreground)]"
          >
            <AtSign size={16} className="shrink-0" />
            @luacoffee
          </a>
        </div>

        <div className="space-y-2 text-sm text-[var(--muted)]">
          <Link href="/menu" className="block hover:text-[var(--foreground)]">
            Menü
          </Link>
          <Link href="/yarisma" className="block hover:text-[var(--foreground)]">
            Fotoğraf Yarışması
          </Link>
          <Link href="/yarisma/katil" className="block hover:text-[var(--foreground)]">
            Yarışmaya Katıl
          </Link>
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
