import { redirect } from 'next/navigation';
import { readCart } from '@/lib/cart';
import { itemCount, subtotalCents } from '@/lib/cartTotals';
import { currentUser } from '@/lib/currentUser';
import { CheckoutForm } from '@/components/CheckoutForm';

export const dynamic = 'force-dynamic';

const STEPS = ['1 Basket', '2 Details', '3 Done'];

export default async function CheckoutPage() {
  const cart = await readCart();
  if (!cart || cart.items.length === 0) redirect('/cart');

  const user = await currentUser();
  const lines = cart.items.map((i) => ({
    quantity: i.quantity,
    priceCents: i.product.priceCents,
  }));

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
                  i === 1
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
                aria-current={i === 1 ? 'step' : undefined}
              >
                {label}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1080px] px-6 pt-7">
        <CheckoutForm
          subtotalCents={subtotalCents(lines)}
          itemCount={itemCount(lines)}
          initialName={user?.name ?? ''}
          initialEmail={user?.email ?? ''}
        />
      </div>
    </>
  );
}
