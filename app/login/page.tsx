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
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p className="kpi-label">Loading...</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="card">
        <h2>Masuk ke ERP</h2>
        <p className="kpi-label">
          Gunakan akun demo yang sudah tersedia untuk mencoba dashboard.
        </p>
        <LoginPanel onAuthenticated={handleAuthenticated} />
      </div>
    </main>
  );
}

