import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};

// Oturuma bağlı; build anında statik prerender edilmesin.
export const dynamic = "force-dynamic";

export default function AdminSayfasi() {
  return <AdminPanel />;
}
