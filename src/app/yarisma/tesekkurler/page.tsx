import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function TesekkurlerSayfasi() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-28 text-center">
      <CheckCircle2 className="text-[var(--accent)]" size={56} />
      <h1 className="mt-6 font-serif text-3xl">Teşekkürler!</h1>
      <p className="mt-3 text-[var(--muted)]">
        Fotoğrafın bize ulaştı. Kısa bir onay sürecinin ardından galeride
        görünecek ve oy toplamaya başlayacak.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/yarisma"
          className="rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-medium text-black"
        >
          Galeriyi Gör
        </Link>
        <Link
          href="/"
          className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium hover:border-[var(--accent)]"
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
