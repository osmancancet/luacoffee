type AuthUser = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

/**
 * Kullanıcının görünen adını çözer:
 * full_name → name → user_name → e-posta kullanıcı adı → null.
 */
export function adCoz(user: AuthUser): string | null {
  const m = user.user_metadata ?? {};
  const ad = (m.full_name || m.name || m.user_name) as string | undefined;
  if (ad && String(ad).trim()) return String(ad).trim();
  if (user.email) return user.email.split("@")[0];
  return null;
}
