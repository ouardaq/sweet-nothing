import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/currentUser';
import { ProductForm } from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect('/login');

  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-[1080px] px-6 py-12">
      <Link href="/admin" className="pixel-text text-[9px] text-ink-soft">
        ← back to the case
      </Link>
      <h1 className="pixel-text mt-4 mb-8 text-[22px]">
        Edit · {product.name}
      </h1>
      <ProductForm initial={product} />
    </main>
  );
}
