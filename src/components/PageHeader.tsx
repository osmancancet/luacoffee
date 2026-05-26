/**
 * Tüm sayfalarda tutarlı, minimal & lüks sayfa başlığı.
 * eyebrow (küçük üst etiket) + serif başlık + muted alt başlık.
 */
export function PageHeader({
  eyebrow,
  baslik,
  aciklama,
}: {
  eyebrow?: string;
  baslik: string;
  aciklama?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="anim-fade-up inline-block text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
        {eyebrow ?? "Lua Coffee"}
      </span>
      <h1 className="anim-fade-up delay-1 mt-4 font-serif text-4xl leading-tight sm:text-5xl">
        {baslik}
      </h1>
      {aciklama && (
        <p className="anim-fade-up delay-2 mx-auto mt-4 max-w-xl leading-relaxed text-[var(--muted)]">
          {aciklama}
        </p>
      )}
      <span className="anim-fade-up delay-3 mx-auto mt-7 block h-px w-16 bg-[var(--accent)]/40" />
    </div>
  );
}
