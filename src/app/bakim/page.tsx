import type { Metadata } from "next";
import Image from "next/image";
import { BakimTemizle } from "./BakimTemizle";

export const metadata: Metadata = {
  title: "Bakımdayız",
  description: "Lua Coffee şu anda bakımda.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function BakimSayfasi() {
  return (
    <div className="starfield flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <BakimTemizle />

      <span className="relative h-20 w-20 overflow-hidden rounded-full bg-white sm:h-24 sm:w-24">
        <Image src="/logo.png" alt="Lua Coffee" fill className="object-contain p-2" priority />
      </span>

      <h1 className="mt-8 font-serif text-3xl tracking-wide sm:text-4xl">Bakımdayız</h1>

      <p className="mt-4 max-w-sm text-sm text-[var(--muted)]">
        Kısa bir süreliğine kapalıyız. En kısa sürede geri döneceğiz.
      </p>
    </div>
  );
}
