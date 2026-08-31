import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { flavorWash } from '@/lib/flavors';
import { requireAdmin } from '@/lib/currentUser';
import type { SpriteSwap } from '@/lib/sprites';
import { AvailabilityToggle } from '@/components/AvailabilityToggle';
import { PixelLink } from '@/components/PixelLink';
import { PixelSprite } from '@/components/PixelSprite';
import { Price } from '@/components/Price';
import { Tag } from '@/components/Tag';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/login');

  const products = await db.product.findMany({
    orderBy: [{ discontinuedAt: 'asc' }, { name: 'asc' }],
  });

  return (
    <main className="mx-auto w-full max-w-[1080px] px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="pixel-text text-[9px] text-primary-d">staff only</div>
          <h1 className="pixel-text mt-3 text-[22px]">The Case</h1>
          <p className="mt-3 text-[15px] font-semibold text-ink-soft">
            {products.length} treats · hi, {admin.name}
          </p>
        </div>
        <PixelLink href="/admin/products/new" size="md">
          + New treat
        </PixelLink>
      </div>

      <ul className="mt-8 flex list-none flex-col gap-3 p-0">
        {products.map((p) => {
          const discontinued = p.discontinuedAt !== null;
          return (
            <li
              key={p.id}
              className="frame flex flex-wrap items-center gap-4"
              style={{ padding: 12, opacity: discontinued ? 0.55 : 1 }}
            >
              <span
                className="shrink-0 rounded-[2px] border-[3px] border-ink"
                style={{ background: flavorWash(p.flavor) }}
              >
                <PixelSprite
                  name={p.spriteKey}
                  size={56}
                  swap={p.spriteSwap as SpriteSwap | null}
                />
              </span>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="pixel-text text-[11px]"
                >
                  {p.name}
                </Link>
                <p className="mt-1.5 text-[13px] font-semibold text-ink-soft">
                  {p.flavor ?? 'treat'} · {p.category ?? '—'} ·{' '}
                  {discontinued ? 'discontinued' : `${p.stock} in stock`}
                </p>
              </div>

              <Tag kind={p.tag} />
              <Price cents={p.priceCents} size={13} />

              <div className="flex items-center gap-2">
                <PixelLink
                  href={`/admin/products/${p.id}`}
                  size="sm"
                  variant="cream"
                >
                  Edit
                </PixelLink>
                <AvailabilityToggle id={p.id} discontinued={discontinued} />
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
