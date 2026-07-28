import { tagStyle } from '@/lib/tags';

export function Tag({ kind }: { kind: string | null | undefined }) {
  const t = tagStyle(kind);
  if (!t) return null;

  return (
    <span
      className="pixel-text"
      style={{
        fontSize: 8,
        background: t.bg,
        color: t.fg,
        padding: '4px 6px',
        border: '2px solid rgba(0,0,0,.12)',
        borderRadius: 2,
      }}
    >
      {t.label}
    </span>
  );
}
