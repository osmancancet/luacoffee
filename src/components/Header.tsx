"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
  Info,
  Coffee,
  ImageIcon,
  Camera,
  CalendarDays,
  Gift,
  MapPin,
  type LucideIcon,
} from "lucide-react";

const linkler: { href: string; etiket: string; ikon: LucideIcon }[] = [
  { href: "/hakkimizda", etiket: "Hakkımızda", ikon: Info },
  { href: "/menu", etiket: "Menü", ikon: Coffee },
  { href: "/galeri", etiket: "Galeri", ikon: ImageIcon },
  { href: "/yarisma", etiket: "Yarışma", ikon: Camera },
  { href: "/etkinlikler", etiket: "Etkinlikler", ikon: CalendarDays },
  { href: "/sadakat", etiket: "Sadakat", ikon: Gift },
  { href: "/iletisim", etiket: "İletişim", ikon: MapPin },
];

export function Header() {
  const [acik, setAcik] = useState(false);
  const pathname = usePathname();

  const aktifMi = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Menü açıkken arka plan kaymasın
  useEffect(() => {
    document.body.style.overflow = acik ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [acik]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="group anim-drop flex items-center gap-2" onClick={() => setAcik(false)}>
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
          aria-label="Menüyü aç"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* App tarzı tam ekran mobil menü */}
      {acik && (
        <div className="anim-fade-in fixed inset-0 z-[70] flex flex-col bg-[var(--background)]/95 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
            <Link href="/" onClick={() => setAcik(false)} className="flex items-center gap-2">
              <span className="relative h-9 w-9 overflow-hidden rounded-full bg-white">
                <Image src="/logo.png" alt="Lua Coffee" fill className="object-contain p-1" />
              </span>
              <span className="font-serif text-lg">Lua Coffee</span>
            </Link>
            <button onClick={() => setAcik(false)} aria-label="Kapat" className="rounded-full p-1">
              <X size={26} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-6">
            {linkler.map((l, i) => {
              const aktif = aktifMi(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setAcik(false)}
                  style={{ animationDelay: `${i * 45}ms` }}
                  className={`anim-fade-up flex items-center gap-4 rounded-2xl border px-5 py-4 text-lg transition-colors ${
                    aktif
                      ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent-strong)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                  }`}
                >
                  <l.ikon
                    size={20}
                    className={aktif ? "text-[var(--accent)]" : "text-[var(--muted)]"}
                  />
                  <span className="font-serif">{l.etiket}</span>
                  <ChevronRight size={18} className="ml-auto text-[var(--muted)]" />
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--border)] px-4 py-4">
            <Link
              href="/yarisma/katil"
              onClick={() => setAcik(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3.5 font-medium text-black"
            >
              <Camera size={18} /> Yarışmaya Katıl
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
