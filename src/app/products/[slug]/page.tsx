import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200" />
      <h1 className="mt-6 text-2xl font-bold">{product.name}</h1>
      <p className="mt-1 text-lg text-neutral-600">
        {formatPrice(product.priceCents)}
      </p>
      <p className="mt-4 text-neutral-700">{product.description}</p>
      <p className="mt-2 text-sm text-neutral-400">
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
    </main>
  );
}
