import { createHash } from "crypto";
import { NextRequest } from "next/server";

/**
 * Cihaz bazlı oy tekilliği için anonim hash üretir.
 * IP + User-Agent + günlük gizli tuzdan SHA-256 türetilir.
 * Kimlik depolamaz; yalnızca aynı cihazın tekrar oy vermesini engeller.
 */
export function getVoteHash(req: NextRequest): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";
  const ua = req.headers.get("user-agent") || "unknown";
  const salt = process.env.VOTE_SALT || "lua-coffee-salt";
  return createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex");
}
