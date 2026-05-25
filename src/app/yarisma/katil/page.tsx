import type { Metadata } from "next";
import { UploadForm } from "@/components/UploadForm";
import { Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Yarışmaya Katıl — Lua Coffee",
  description: "Lua'daki anını fotoğrafla, yükle ve oyları topla.",
};

export default function KatilSayfasi() {
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <header className="mb-8 text-center">
        <Camera className="anim-float mx-auto text-[var(--accent)]" size={28} />
        <h1 className="anim-fade-up delay-1 mt-3 font-serif text-3xl sm:text-4xl">
          Yarışmaya Katıl
        </h1>
        <p className="anim-fade-up delay-2 mt-3 text-[var(--muted)]">
          Lua&apos;daki anını paylaş, en çok oyu toplayan kazansın.
        </p>
      </header>
      <div className="anim-fade-up delay-3">
        <UploadForm />
      </div>
    </div>
  );
}
