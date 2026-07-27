import type { ReactElement } from 'react';
import { SPRITE_COLORS, SPRITES, type SpriteSwap } from '@/lib/sprites';

type Props = {
  name: string;
  size?: number;
  swap?: SpriteSwap | null;
  className?: string;
};

export function PixelSprite({
  name,
  size = 120,
  swap = null,
  className = '',
}: Props) {
  const grid = SPRITES[name];
  if (!grid) return null;

  const cols = grid[0].length;
  const rows = grid.length;
  const colors = swap ? { ...SPRITE_COLORS, ...swap } : SPRITE_COLORS;

  const rects: ReactElement[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ch = grid[y][x];
      if (ch === '.' || ch === ' ' || !colors[ch]) continue;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1.02"
          height="1.02"
          fill={colors[ch]}
        />,
      );
    }
  }

  return (
    <svg
      className={className}
      width={size}
      height={size * (rows / cols)}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
    >
      {rects}
    </svg>
  );
}
