import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  pixelSurface,
  type PixelSize,
  type PixelVariant,
} from '@/lib/pixelStyles';

export function PixelLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
}: {
  href: string;
  children: ReactNode;
  variant?: PixelVariant;
  size?: PixelSize;
}) {
  return (
    <Link
      href={href}
      className="pixel-text pixel-btn no-select inline-block"
      style={pixelSurface(variant, size)}
    >
      {children}
    </Link>
  );
}
