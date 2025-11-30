'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/service-registry';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const checkAuth = () => {
      if (typeof window === 'undefined') {
        return;
      }

      const token = window.localStorage.getItem('erp.token');
      if (token) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          token,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        token: result.accessToken,
      });
      return result;
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('erp.token');
    }
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
    });
    router.push('/login');
  };

  return {
    ...authState,
    login,
    logout,
  };
}

