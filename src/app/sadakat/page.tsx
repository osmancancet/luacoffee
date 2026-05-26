import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SadakatKart } from "@/components/SadakatKart";

export const metadata: Metadata = {
  title: "Sadakat Kartım",
  description:
    "Lua Coffee sadakat kartı — 5 kahveye 1 bedava. Kasadaki QR'ı okut, damgalarını topla.",
  alternates: { canonical: "/sadakat" },
};

export default function SadakatSayfasi() {
  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Sadakat"
        baslik="Sadakat Kartım"
        aciklama="5 kahveye 1 bedava — 6. kahve bizden. Kasadaki QR'ı okut, damganı topla."
      />
      <div className="mt-12">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[var(--muted)]" />
            </div>
          }
        >
          <SadakatKart />
        </Suspense>
      </div>
    </div>
  );
}
