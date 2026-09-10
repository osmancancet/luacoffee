/**
 * Bakım modu bayrakları.
 *
 * BAKIM_MODU: Açıkken (varsayılan) ziyaretçiye yalnızca /bakim sayfası gösterilir;
 *   diğer tüm sayfalar oraya yeniden yazılır. Siteyi tekrar açmak için ortam
 *   değişkenine `BAKIM_MODU=0` ekleyin (Vercel → Settings → Environment Variables).
 *
 * FIYAT_GOSTER: Menüde fiyatlar görünsün mü? Varsayılan kapalı.
 *   Fiyatları geri açmak için `FIYAT_GOSTER=1`.
 */
export const BAKIM_MODU = process.env.BAKIM_MODU !== "0";

export const FIYAT_GOSTER = process.env.FIYAT_GOSTER === "1";
