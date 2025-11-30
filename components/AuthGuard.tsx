'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../lib/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't guard login page
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (isClient && !isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
  }, [isClient, isAuthenticated, isLoading, isLoginPage, router]);

  // Allow login page without authentication
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading on server or while checking auth
  if (!isClient || isLoading) {
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

  if (!isAuthenticated) {
    return null; // Will redirect via middleware or useEffect
  }

  return <>{children}</>;
}

