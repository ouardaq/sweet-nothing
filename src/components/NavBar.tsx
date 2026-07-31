import Link from 'next/link';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import { cartCount } from '@/lib/cart';

export async function NavBar() {
  const count = await cartCount();

  return (
    <header
      className="sticky top-0 z-50 border-b-4 border-ink bg-cream"
      style={{ boxShadow: '0 6px 0 0 var(--shadow)' }}
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-4 px-6 py-3">
        <Link href="/" aria-label="Sweet Nothing home">
          <Logo size="sm" />
        </Link>

        <nav className="ml-4 flex gap-1.5">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/shop">Shop</NavLink>
        </nav>

        <div className="flex-1" />

        <Link
          href="/cart"
          className="pixel-btn pixel-text relative flex items-center gap-2 rounded-[2px] border-[3px] px-3.5 py-2.5 text-[10px]"
          style={{
            background: 'var(--yellow)',
            borderColor: '#e6b94a',
            boxShadow: '3px 3px 0 0 #e6b94a',
          }}
          aria-label={count > 0 ? `Basket, ${count} items` : 'Basket, empty'}
        >
          <span aria-hidden="true" className="text-[15px]">
            🧺
          </span>{' '}
          Basket
          {count > 0 && (
            <span
              aria-hidden="true"
              className="pixel-text absolute -top-2.5 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-[2px] border-2 px-1 text-[8px] text-white"
              style={{
                background: 'var(--primary)',
                borderColor: 'var(--primary-d)',
              }}
            >
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
