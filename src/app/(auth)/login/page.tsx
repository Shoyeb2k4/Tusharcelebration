import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/common/spinner';
import { LoginForm } from '@/features/auth/login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-semibold">
            Tushar Celebrations
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your venue workspace
          </p>
        </div>
        <Card>
          <CardHeader className="sr-only">Sign in</CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<Spinner />}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Protected workspace. Contact your administrator for access.
        </p>
      </div>
    </main>
  );
}
