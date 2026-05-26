"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const linkler = [
  { href: "/hakkimizda", etiket: "Hakkımızda" },
  { href: "/menu", etiket: "Menü" },
  { href: "/galeri", etiket: "Galeri" },
  { href: "/yarisma", etiket: "Yarışma" },
  { href: "/etkinlikler", etiket: "Etkinlikler" },
  { href: "/sadakat", etiket: "Sadakat" },
  { href: "/iletisim", etiket: "İletişim" },
];

export function Header() {
  const [acik, setAcik] = useState(false);
  const pathname = usePathname();

  const aktifMi = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative h-10 w-10 overflow-hidden rounded-full bg-white transition-transform duration-500 group-hover:rotate-[18deg]">
            <Image src="/logo.png" alt="Lua Coffee" fill className="object-contain p-1" />
          </span>
          <span className="font-serif text-xl tracking-wide">Lua Coffee</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {linkler.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative text-sm transition-colors hover:text-[var(--accent-strong)] ${
                aktifMi(l.href) ? "text-[var(--accent-strong)]" : "text-[var(--muted)]"
              }`}
            >
              {l.etiket}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-[var(--accent)] transition-all duration-300 ${
                  aktifMi(l.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
          <Link
            href="/yarisma/katil"
            className="rounded-full border border-[var(--border)] px-4 py-1.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
          >
            Yarışmaya Katıl
          </Link>
        </nav>

        <button
          className="lg:hidden"
          onClick={() => setAcik((v) => !v)}
          aria-label="Menüyü aç/kapat"
        >
          {acik ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {acik && (
        <nav className="flex flex-col gap-1 border-t border-[var(--border)] px-5 py-3 lg:hidden">
          {linkler.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAcik(false)}
              className={`rounded-lg px-2 py-2.5 hover:bg-[var(--surface)] hover:text-[var(--foreground)] ${
                aktifMi(l.href) ? "text-[var(--accent-strong)]" : "text-[var(--muted)]"
              }`}
            >
              {l.etiket}
            </Link>
          ))}
          <Link
            href="/yarisma/katil"
            onClick={() => setAcik(false)}
            className="mt-1 rounded-lg border border-[var(--border)] px-2 py-2.5 text-center text-[var(--foreground)] hover:border-[var(--accent)]"
          >
            Yarışmaya Katıl
          </Link>
        </nav>
      )}
    </header>
  );
}
