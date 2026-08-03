import { redirect } from 'next/navigation';
import { AdminForm } from '@/components/AdminForm';
import { requireAdmin } from '@/lib/currentUser';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/login');

  return (
    <main className="mx-auto w-full max-w-[700px] px-6 py-12">
      <div className="pixel-text text-[9px] text-primary-d">staff only</div>
      <h1 className="pixel-text mt-3 text-[22px]">AI Description Generator</h1>
      <p className="mt-3 text-[15px] font-semibold text-ink-soft">
        Draft a product description with Gemini, {admin.name}.
      </p>

      <AdminForm />
    </main>
  );
}
