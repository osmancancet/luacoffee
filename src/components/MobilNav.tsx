"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Coffee,
  Camera,
  Gift,
  Menu,
  X,
  ChevronRight,
  Info,
  ImageIcon,
  CalendarDays,
  MapPin,
  type LucideIcon,
} from "lucide-react";

const sekmeler: { href: string; etiket: string; ikon: LucideIcon }[] = [
  { href: "/", etiket: "Ana Sayfa", ikon: Home },
  { href: "/menu", etiket: "Menü", ikon: Coffee },
  { href: "/yarisma", etiket: "Yarışma", ikon: Camera },
  { href: "/sadakat", etiket: "Sadakat", ikon: Gift },
];

const tumLinkler: { href: string; etiket: string; ikon: LucideIcon }[] = [
  { href: "/", etiket: "Ana Sayfa", ikon: Home },
  { href: "/hakkimizda", etiket: "Hakkımızda", ikon: Info },
  { href: "/menu", etiket: "Menü", ikon: Coffee },
  { href: "/galeri", etiket: "Galeri", ikon: ImageIcon },
  { href: "/yarisma", etiket: "Yarışma", ikon: Camera },
  { href: "/etkinlikler", etiket: "Etkinlikler", ikon: CalendarDays },
  { href: "/sadakat", etiket: "Sadakat", ikon: Gift },
  { href: "/iletisim", etiket: "İletişim", ikon: MapPin },
];

export function MobilNav() {
  const pathname = usePathname();
  const [acik, setAcik] = useState(false);

  const aktifMi = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    document.body.style.overflow = acik ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [acik]);

  // Sayfa değişince "Diğer" menüsünü kapat
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAcik(false);
  }, [pathname]);

  return (
    <>
      {/* Alt sabit sekme çubuğu (yalnız mobil) */}
      <nav className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-lg lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {sekmeler.map((s) => {
            const aktif = aktifMi(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={aktif ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                  aktif ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                <s.ikon size={21} className={aktif ? "fill-[var(--accent)]/15" : ""} />
                {s.etiket}
              </Link>
            );
          })}
          <button
            onClick={() => setAcik(true)}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-[var(--muted)]"
            aria-label="Diğer"
          >
            <Menu size={21} />
            Diğer
          </button>
        </div>
        {/* iOS güvenli alan boşluğu */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* "Diğer" → tam ekran menü */}
      {acik && (
        <div className="anim-fade-in fixed inset-0 z-[80] flex flex-col bg-[var(--background)]/95 backdrop-blur-xl lg:hidden">
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

          <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-6">
            {tumLinkler.map((l, i) => {
              const aktif = aktifMi(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setAcik(false)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={`anim-fade-up flex items-center gap-4 rounded-2xl border px-5 py-4 text-lg transition-colors ${
                    aktif
                      ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent-strong)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                  }`}
                >
                  <l.ikon size={20} className={aktif ? "text-[var(--accent)]" : "text-[var(--muted)]"} />
                  <span className="font-serif">{l.etiket}</span>
                  <ChevronRight size={18} className="ml-auto text-[var(--muted)]" />
                </Link>
              );
            })}
          </div>

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
    </>
  );
}
