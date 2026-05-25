"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const linkler = [
  { href: "/", etiket: "Ana Sayfa" },
  { href: "/menu", etiket: "Menü" },
  { href: "/yarisma", etiket: "Yarışma" },
  { href: "/yarisma/siralama", etiket: "Sıralama" },
  { href: "/yarisma/katil", etiket: "Katıl" },
];

export function Header() {
  const [acik, setAcik] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative h-10 w-10 overflow-hidden rounded-full bg-white transition-transform duration-500 group-hover:rotate-[18deg]">
            <Image src="/logo.png" alt="Lua Coffee" fill className="object-contain p-1" />
          </span>
          <span className="font-serif text-xl tracking-wide">Lua Coffee</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {linkler.map((l) =>
            l.href === "/yarisma/katil" ? (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-[var(--border)] px-4 py-1.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
              >
                {l.etiket}
              </Link>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="group relative text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]"
              >
                {l.etiket}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ),
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setAcik((v) => !v)}
          aria-label="Menüyü aç/kapat"
        >
          {acik ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {acik && (
        <nav className="flex flex-col gap-1 border-t border-[var(--border)] px-5 py-3 md:hidden">
          {linkler.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAcik(false)}
              className="rounded-lg px-2 py-2.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            >
              {l.etiket}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
