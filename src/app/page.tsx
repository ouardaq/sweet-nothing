import Link from 'next/link';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Sweet Nothing</h1>
      <p className="mt-2 text-neutral-500">Little things worth everything.</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group rounded-2xl border border-neutral-200 p-4 transition hover:shadow-md"
          >
            <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-100 to-rose-200" />
            <h2 className="mt-4 font-medium">{product.name}</h2>
            <p className="text-sm text-neutral-500">
              {formatPrice(product.priceCents)}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
