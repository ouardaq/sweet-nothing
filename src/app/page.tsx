import Link from 'next/link';
import { db } from '@/lib/db';
import { CATEGORIES } from '@/lib/categories';
import { CloudsBg } from '@/components/CloudBg';
import { HeroStat } from '@/components/HeroStat';
import { PixelLink } from '@/components/PixelLink';
import { PixelSprite } from '@/components/PixelSprite';
import { ProductCard } from '@/components/ProductCard';
import { SectionTitle } from '@/components/SectionTitle';

export const dynamic = 'force-dynamic';

const STAMPS_COLLECTED = 3;
const STAMPS_TOTAL = 8;

export default async function HomePage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const bestsellers = products.filter((p) => p.tag === 'bestseller');
  const fresh = products.filter((p) => p.tag === 'new');

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="relative overflow-hidden border-b-4 border-ink">
        <CloudsBg tone="sky" />

        <div className="relative z-[2] mx-auto flex w-full max-w-[1180px] flex-wrap items-center gap-8 px-6 pt-[60px] pb-[70px]">
          <div className="flex-[1_1_360px]">
            <span
              className="pixel-text mb-[18px] inline-block rounded-[2px] border-[3px] px-2.5 py-1.5 text-[9px]"
              style={{
                background: 'var(--yellow)',
                color: '#7a5a10',
                borderColor: '#e6b94a',
              }}
            >
              🌸 fresh batch every morning
            </span>

            <h1
              className="pixel-text mb-[18px] text-[38px] leading-[1.45]"
              style={{ textShadow: '3px 3px 0 #fff' }}
            >
              Tiny treats,
              <br />
              <span className="text-primary-d">big</span> happiness.
            </h1>

            <p className="mb-[26px] max-w-[440px] text-[17px] leading-[1.7] font-semibold">
              Hand-made mochi, dorayaki &amp; taiyaki baked fresh in our little
              pixel kitchen. Pick a basket of softness.
            </p>

            <div className="flex flex-wrap gap-3.5">
              <PixelLink href="/shop" size="lg">
                Shop treats →
              </PixelLink>
              <PixelLink href="/register" size="lg" variant="cream">
                Join &amp; save
              </PixelLink>
            </div>

            <div className="mt-[30px] flex flex-wrap gap-[22px]">
              <HeroStat value="12+" label="daily treats" />
              <HeroStat value="100%" label="hand-made" />
              <HeroStat value="4.9★" label="rated cute" />
            </div>
          </div>

          <div className="relative flex min-h-[300px] flex-[1_1_300px] justify-center">
            <div
              className="frame float"
              style={{ padding: 26, borderRadius: 4 }}
            >
              <PixelSprite name="taiyaki" size={210} />
            </div>
            <span
              className="float absolute top-0 right-1.5"
              style={{ animationDelay: '.6s' }}
            >
              <PixelSprite name="strawberry" size={56} />
            </span>
            <span
              className="float absolute bottom-1.5 left-0"
              style={{ animationDelay: '1.2s' }}
            >
              <PixelSprite name="dango" size={62} />
            </span>
          </div>
        </div>
      </section>

      {/* ---------- categories ---------- */}
      <section className="mx-auto w-full max-w-[1180px] px-6 pt-[54px] pb-2.5">
        <SectionTitle eyebrow="browse by" title="Pick a craving" />

        <div className="mt-[26px] grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {CATEGORIES.map((c) => {
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/shop?category=${c.id}`}
                className="frame treat-card flex items-center gap-4 p-[18px]"
                style={{ background: c.wash }}
              >
                <span className="bob shrink-0">
                  <PixelSprite
                    name={c.spriteKey}
                    swap={c.spriteSwap}
                    size={76}
                  />
                </span>
                <span>
                  <span className="pixel-text block text-[13px]">
                    {c.label}
                  </span>
                  <span className="mt-2 block text-[13px] text-ink-soft">
                    {count} treats →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- bestsellers ---------- */}
      <section className="mx-auto w-full max-w-[1180px] px-6 pt-[44px]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionTitle eyebrow="everyone loves" title="Bestselling treats" />
          <Link href="/shop" className="pixel-text text-[10px] text-primary-d">
            see all →
          </Link>
        </div>

        <div className="mt-[26px] grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- Treat Club ---------- */}
      <section className="mx-auto mt-[56px] w-full max-w-[1180px] px-6">
        <div
          className="frame flex flex-wrap items-center gap-6"
          style={{ background: 'var(--mint)', padding: '30px 32px' }}
        >
          <span className="float shrink-0">
            <PixelSprite name="donut" size={96} />
          </span>

          <div className="flex-[1_1_300px]">
            <div
              className="pixel-text mb-3 text-[16px]"
              style={{ color: '#2f6b40' }}
            >
              Treat Club ♡
            </div>
            <p className="mb-4 text-[15px] leading-[1.6] font-semibold">
              Earn a pixel-stamp on every order. Collect {STAMPS_TOTAL} and your
              next treat is on the house!
            </p>
            <PixelLink href="/register" variant="cream">
              Start collecting
            </PixelLink>
          </div>

          <div
            className="flex max-w-[200px] flex-wrap gap-1.5"
            role="img"
            aria-label={`${STAMPS_COLLECTED} of ${STAMPS_TOTAL} stamps collected`}
          >
            {Array.from({ length: STAMPS_TOTAL }, (_, i) => {
              const filled = i < STAMPS_COLLECTED;
              return (
                <span
                  key={i}
                  aria-hidden="true"
                  className="pixel-text flex h-[38px] w-[38px] items-center justify-center rounded-[2px] border-[3px] border-ink text-[14px]"
                  style={{
                    background: filled ? 'var(--primary)' : 'var(--cream)',
                    color: filled ? '#fff' : 'var(--line)',
                  }}
                >
                  {filled ? '★' : '·'}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- fresh ---------- */}
      <section className="mx-auto w-full max-w-[1180px] px-6 pt-[44px]">
        <SectionTitle eyebrow="just baked" title="Fresh from the oven" />

        <div className="mt-[26px] grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {fresh.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
