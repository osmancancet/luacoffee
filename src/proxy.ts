import { NextResponse, type NextRequest } from "next/server";
import { BAKIM_MODU } from "@/lib/bakim";

/**
 * Bakım modunda açık kalan yollar: yönetim paneli, kimlik doğrulama ve
 * panelin kullandığı API uçları. Geri kalan her istek /bakim sayfasına yazılır.
 */
const IZINLI = ["/bakim", "/admin", "/auth", "/api/admin", "/api/kampanya"];

export function proxy(request: NextRequest) {
  if (!BAKIM_MODU) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (IZINLI.some((yol) => pathname === yol || pathname.startsWith(`${yol}/`))) {
    return NextResponse.next();
  }

  // URL değişmeden içerik olarak bakım sayfası servis edilir.
  const url = request.nextUrl.clone();
  url.pathname = "/bakim";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Statik dosyalar ve Next iç kaynakları hariç tüm istekler.
    "/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:png|jpg|jpeg|webp|gif|svg|ico|txt|xml|json|webmanifest|js|css|woff2?)$).*)",
  ],
};
