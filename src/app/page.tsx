import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="mx-auto w-full max-w-[1180px] px-6 py-12">
      <h1 className="pixel-text text-[22px]">Sweet Nothing</h1>
      <p className="mt-3 text-[15px] font-semibold text-ink-soft">
        Hand-made treats baked fresh in our little pixel kitchen.
      </p>

      <div className="mt-11 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
