import Link from 'next/link';
import type { ReactNode } from 'react';
import { CloudsBg } from './CloudBg';
import { PixelSprite } from './PixelSprite';

export function AuthCard({
  masthead,
  spriteKey,
  tone,
  children,
  footer,
}: {
  masthead: string;
  spriteKey: string;
  tone: 'pink' | 'blue';
  children: ReactNode;
  footer: ReactNode;
}) {
  const background = tone === 'pink' ? 'var(--primary)' : 'var(--accent)';

  return (
    <div className="relative overflow-hidden py-12">
      <CloudsBg tone="sky" />

      <div className="pop relative z-[2] mx-auto w-full max-w-[420px] px-6">
        <div className="frame overflow-hidden">
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background, borderBottom: '4px solid var(--ink)' }}
          >
            <span className="float">
              <PixelSprite name={spriteKey} size={44} />
            </span>
            <span className="pixel-text text-[13px] text-white">
              {masthead}
            </span>
          </div>

          <div className="p-6">{children}</div>
        </div>

        <div className="mt-4 text-center text-[13px] font-semibold">
          {footer}
        </div>

        <p className="mt-3 text-center">
          <Link href="/shop" className="text-[13px] font-bold text-ink-soft">
            browse as guest →
          </Link>
        </p>
      </div>
    </div>
  );
}
