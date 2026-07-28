export type PixelVariant = 'primary' | 'blue' | 'yellow' | 'cream' | 'ghost';
export type PixelSize = 'sm' | 'md' | 'lg';

const PALETTES: Record<PixelVariant, { bg: string; bd: string; fg: string }> = {
  primary: { bg: 'var(--primary)', bd: 'var(--primary-d)', fg: '#fff' },
  blue: { bg: 'var(--accent)', bd: 'var(--accent-d)', fg: '#fff' },
  yellow: { bg: 'var(--yellow)', bd: '#e6b94a', fg: 'var(--ink)' },
  cream: { bg: 'var(--cream)', bd: 'var(--ink)', fg: 'var(--ink)' },
  ghost: { bg: 'transparent', bd: 'var(--line)', fg: 'var(--ink)' },
};

const SIZES: Record<PixelSize, { padding: string; fontSize: number }> = {
  sm: { padding: '7px 12px', fontSize: 9 },
  md: { padding: '12px 18px', fontSize: 11 },
  lg: { padding: '16px 26px', fontSize: 13 },
};

export function pixelSurface(
  variant: PixelVariant = 'primary',
  size: PixelSize = 'md',
  disabled = false,
) {
  const p = PALETTES[variant];
  const s = SIZES[size];

  return {
    fontSize: s.fontSize,
    padding: s.padding,
    color: p.fg,
    background: p.bg,
    border: `3px solid ${p.bd}`,
    boxShadow: disabled ? 'none' : `4px 4px 0 0 ${p.bd}`,
    borderRadius: 2,
    opacity: disabled ? 0.5 : 1,
    transition: 'transform .05s, box-shadow .05s',
  };
}
