// Instagram için 5 mobil mockup üretir → ~/Desktop/lua-mockup/
// Çalıştır: dev sunucu açıkken `node scripts/mockup.mjs`
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import os from "os";

const base = process.env.MOCKUP_BASE || "http://localhost:3000";
const sayfalar = [
  { yol: "/", ad: "1-anasayfa", baslik: "Lua Coffee", alt: "Soma · lua.coffee" },
  { yol: "/menu", ad: "2-menu", baslik: "Menü", alt: "Espresso & imza lezzetler" },
  { yol: "/galeri", ad: "3-galeri", baslik: "Galeri", alt: "Mekânımızdan kareler" },
  { yol: "/yarisma", ad: "4-yarisma", baslik: "Fotoğraf Yarışması", alt: "Lua bardağıyla en güzel kare" },
  { yol: "/sadakat", ad: "5-sadakat", baslik: "Sadakat & Check-in", alt: "5 kahveye 1 bedava" },
];

const cikti = path.join(os.homedir(), "Desktop", "lua-mockup");
fs.mkdirSync(cikti, { recursive: true });

function cerceve(dataUrl, baslik, alt) {
  return `<!doctype html><html><head><meta charset="utf8"><style>
    * { margin: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px; overflow: hidden;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: radial-gradient(ellipse at 50% -10%, #20202a 0%, #0b0b0d 65%);
      font-family: Georgia, "Times New Roman", serif; color: #f4f4f5;
    }
    .baslik { font-size: 46px; letter-spacing: 1px; margin-bottom: 8px; }
    .alt { font-size: 22px; color: #a1a1aa; margin-bottom: 40px; font-family: Arial, sans-serif; }
    .phone {
      position: relative; width: 392px; height: 846px; border-radius: 56px;
      background: #050506; padding: 13px;
      box-shadow: 0 50px 110px rgba(0,0,0,.65), 0 0 0 2px #2a2a30, inset 0 0 0 1px #000;
    }
    .screen { width: 100%; height: 100%; border-radius: 44px; overflow: hidden; background: #0b0b0d; }
    .screen img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
    .notch {
      position: absolute; top: 13px; left: 50%; transform: translateX(-50%);
      width: 150px; height: 28px; background: #050506; border-radius: 0 0 20px 20px; z-index: 2;
    }
    .footer { margin-top: 40px; font-size: 24px; color: #d4d4d8; font-family: Arial, sans-serif; letter-spacing: 2px; }
  </style></head><body>
    <div class="baslik">${baslik}</div>
    <div class="alt">${alt}</div>
    <div class="phone"><div class="notch"></div><div class="screen"><img src="${dataUrl}"/></div></div>
    <div class="footer">lua.coffee</div>
  </body></html>`;
}

const browser = await chromium.launch();

const mobil = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const cerceveCtx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });

const sayfa = await mobil.newPage();

for (const s of sayfalar) {
  await sayfa.goto(base + s.yol, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  // Next.js dev göstergesini ("N" rozeti) gizle
  await sayfa
    .addStyleTag({ content: "nextjs-portal,[data-nextjs-dev-tools-button]{display:none!important}" })
    .catch(() => {});
  await sayfa.waitForTimeout(1500); // animasyonlar + görseller otursun
  const buf = await sayfa.screenshot();
  const dataUrl = "data:image/png;base64," + buf.toString("base64");

  const fr = await cerceveCtx.newPage();
  await fr.setContent(cerceve(dataUrl, s.baslik, s.alt), { waitUntil: "load" });
  await fr.waitForTimeout(400);
  await fr.screenshot({ path: path.join(cikti, s.ad + ".png") });
  await fr.close();
  console.log("✓", s.ad + ".png");
}

await browser.close();
console.log("\nBitti →", cikti);
