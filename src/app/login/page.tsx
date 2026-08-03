import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AuthCard } from '@/components/AuthCard';
import { LoginForm } from '@/components/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/');

  return (
    <AuthCard
      masthead="Welcome back!"
      spriteKey="dorayaki"
      tone="pink"
      footer={
        <>
          New here?{' '}
          <Link href="/register" className="text-primary-d">
            Join the bakery
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
