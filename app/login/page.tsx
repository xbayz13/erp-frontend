'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPanel } from '../../components/LoginPanel';
import { useAuth } from '../../lib/hooks/use-auth';

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleAuthenticated = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background p-4">
      <div className="card w-full max-w-md bg-white dark:bg-surface rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-text mb-2">Masuk ke ERP</h2>
          <p className="text-sm text-gray-600 dark:text-text-muted">
            Gunakan akun demo yang sudah tersedia untuk mencoba dashboard.
          </p>
        </div>
        <LoginPanel onAuthenticated={handleAuthenticated} />
      </div>
    </main>
  );
}

