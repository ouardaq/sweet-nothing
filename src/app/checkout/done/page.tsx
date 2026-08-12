import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { PixelLink } from '@/components/PixelLink';
import { PixelSprite } from '@/components/PixelSprite';

export const dynamic = 'force-dynamic';

const STEPS = ['1 Basket', '2 Details', '3 Done'];

export default async function OrderDonePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const number = Array.isArray(sp.order) ? sp.order[0] : sp.order;
  if (!number) notFound();

  const order = await db.order.findUnique({ where: { number } });
  if (!order) notFound();

  return (
    <>
      <div className="border-b-4 border-ink bg-bg-2">
        <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 px-6 py-[26px]">
          <h1 className="pixel-text text-[22px]">Your Basket</h1>
          <ol className="flex list-none gap-2 p-0">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className="pixel-text rounded-[2px] border-[3px] px-2.5 py-2 text-[9px]"
                style={
                  i === 2
                    ? {
                        background: 'var(--primary)',
                        color: '#fff',
                        borderColor: 'var(--primary-d)',
                      }
                    : {
                        background: 'var(--cream)',
                        color: 'var(--ink-soft)',
                        borderColor: 'var(--line)',
                      }
                }
                aria-current={i === 2 ? 'step' : undefined}
              >
                {label}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="pop mx-auto w-full max-w-[560px] px-6 py-[50px]">
        <div className="frame text-center" style={{ padding: 36 }}>
          <span className="float inline-block">
            <PixelSprite name="dorayaki" size={120} />
          </span>

          <h2 className="pixel-text mt-[18px] mb-3 text-[20px] text-primary-d">
            Order placed!
          </h2>

          <p className="mb-2 text-[16px] leading-[1.7] font-semibold">
            Thanks {order.customerName}! Order <b>#{order.number}</b> is in the
            oven.
          </p>

          <p className="mb-6 text-[15px] text-ink-soft">
            {order.fulfilment === 'pickup'
              ? 'Ready for pickup at 12 Blossom Lane in ~20 min 🧺'
              : 'Warm delivery heading your way soon 🚲'}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <PixelLink href="/shop">Order more</PixelLink>
            <PixelLink href="/" variant="cream">
              Back home
            </PixelLink>
          </div>
        </div>
      </div>
    </>
  );
}
