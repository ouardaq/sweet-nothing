'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  pixelSurface,
  type PixelSize,
  type PixelVariant,
} from '@/lib/pixelStyles';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: PixelVariant;
  size?: PixelSize;
  full?: boolean;
};

export function PixelButton({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  disabled,
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className="pixel-text pixel-btn no-select"
      style={{
        ...pixelSurface(variant, size, Boolean(disabled)),
        width: full ? '100%' : 'auto',
      }}
    >
      {children}
    </button>
  );
}
