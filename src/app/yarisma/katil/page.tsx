import type { Metadata } from "next";
import { UploadForm } from "@/components/UploadForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Yarışmaya Katıl",
  description: "Lua'daki anını fotoğrafla, yükle ve oyları topla.",
  alternates: { canonical: "/yarisma/katil" },
};

export default function KatilSayfasi() {
  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
      <PageHeader
        eyebrow="Yarışma"
        baslik="Yarışmaya Katıl"
        aciklama="Lua'daki anını paylaş, en çok oyu toplayan kazansın."
      />
      <div className="anim-fade-up delay-3 mt-12">
        <UploadForm />
      </div>
    </div>
  );
}
