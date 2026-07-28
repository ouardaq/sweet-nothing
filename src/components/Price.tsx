import { formatPrice } from '@/lib/format';

export function Price({ cents, size = 16 }: { cents: number; size?: number }) {
  return (
    <span
      className="pixel-text"
      style={{ fontSize: size, color: 'var(--primary-d)' }}
    >
      {formatPrice(cents)}
    </span>
  );
}
