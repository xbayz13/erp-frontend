'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { systemService } from '../lib/services/service-registry';
import { useEffect, useState } from 'react';
import { useAsyncData } from '../lib/services/hooks';
import { useAuth } from '../lib/hooks/use-auth';

export function Navigation() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, logout } = useAuth();

  const unreadCountState = useAsyncData(
    () => systemService.getUnreadCount(),
    [isAuthenticated], // Re-fetch when auth state changes
    { skip: !isAuthenticated }, // Skip if not authenticated
  );

  useEffect(() => {
    if (unreadCountState.data) {
      setUnreadCount(unreadCountState.data.count);
    } else {
      setUnreadCount(0);
    }
  }, [unreadCountState.data]);

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/inventory', label: 'Inventory' },
    { href: '/purchasing', label: 'Purchasing' },
    { href: '/finance', label: 'Finance' },
    { href: '/production', label: 'Production' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/reports', label: 'Reports' },
    { href: '/system', label: 'System' },
  ];

  return (
    <nav className="px-4 md:px-8 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center gap-4 flex-wrap sticky top-0 z-50">
      <Link
        href="/"
        className="font-bold text-xl text-accent hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        ERP
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`relative px-4 py-2 rounded-lg transition-all ${
            pathname === item.href
              ? 'bg-accent/10 text-accent font-medium'
              : 'text-gray-700 dark:text-text hover:bg-gray-100 dark:hover:bg-surface-muted'
          }`}
        >
          {item.label}
          {item.href === '/system' && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      ))}
      {isAuthenticated && (
        <button
          onClick={logout}
          className="ml-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-text hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

