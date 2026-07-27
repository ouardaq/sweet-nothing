import { PixelSprite } from './PixelSprite';

const SIZES = { sm: 14, md: 20, lg: 30 } as const;

export function Logo({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const fs = SIZES[size];
  return (
    <span className="no-select flex items-center gap-2.5">
      <span className="float inline-block">
        <PixelSprite
          name="mochi"
          swap={{ w: '#ffd9e6', p: '#ff6f6f' }}
          size={fs * 1.9}
        />
      </span>
      <span className="pixel-text leading-[1.1]" style={{ fontSize: fs }}>
        Sweet
        <br />
        <span className="text-primary-d">Nothing</span>
      </span>
    </span>
  );
}
