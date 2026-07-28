type TagStyle = { label: string; bg: string; fg: string };

const TAGS: Record<string, TagStyle> = {
  bestseller: { label: '★ TOP', bg: 'var(--yellow)', fg: '#7a5a10' },
  new: { label: 'NEW', bg: 'var(--mint)', fg: '#2f6b40' },
};

export function tagStyle(kind: string | null | undefined): TagStyle | null {
  if (!kind) return null;
  return TAGS[kind] ?? null;
}
