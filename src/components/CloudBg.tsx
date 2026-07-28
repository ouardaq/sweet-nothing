import { PixelCloud } from './PixelCloud';

const LAYERS = [
  { key: 'back', top: '12%', duration: '40s', opacity: 1 },
  { key: 'mid', top: '34%', duration: '64s', opacity: 0.7 },
  { key: 'front', top: '60%', duration: '52s', opacity: 0.55 },
];

function CloudRow() {
  return (
    <div className="flex" style={{ gap: 180, paddingLeft: 60 }}>
      {Array.from({ length: 16 }, (_, i) => (
        <PixelCloud key={i} />
      ))}
    </div>
  );
}

export function CloudsBg({ tone = 'sky' }: { tone?: 'sky' | 'plain' }) {
  const background =
    tone === 'sky'
      ? 'linear-gradient(180deg, var(--accent) 0%, #c9ecff 45%, var(--bg) 100%)'
      : 'var(--bg)';

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ background }}
    >
      {LAYERS.map((l) => (
        <div
          key={l.key}
          className="cloud-strip"
          style={{
            top: l.top,
            animationDuration: l.duration,
            opacity: l.opacity,
          }}
        >
          <CloudRow />
        </div>
      ))}
    </div>
  );
}
