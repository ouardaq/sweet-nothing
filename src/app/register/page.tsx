import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AuthCard } from '@/components/AuthCard';
import { RegisterForm } from '@/components/RegisterForm';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect('/');

  return (
    <AuthCard
      masthead="Join the bakery"
      spriteKey="cupcake"
      tone="blue"
      footer={
        <>
          Already a member?{' '}
          <Link href="/login" className="text-primary-d">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
