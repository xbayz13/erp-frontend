'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { systemService } from '../lib/services/service-registry';
import { useEffect, useState } from 'react';
import { useAsyncData } from '../lib/services/hooks';

export function Navigation() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const unreadCountState = useAsyncData(
    () => systemService.getUnreadCount(),
    [],
  );

  useEffect(() => {
    if (unreadCountState.data) {
      setUnreadCount(unreadCountState.data.count);
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
    <nav
      style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        background: 'rgba(0,0,0,0.2)',
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: 'bold',
          fontSize: '1.25rem',
          color: 'var(--accent)',
          textDecoration: 'none',
        }}
      >
        ERP
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            color: pathname === item.href ? 'var(--accent)' : 'var(--text)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background:
              pathname === item.href ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
            transition: 'all 0.2s',
            position: 'relative',
          }}
        >
          {item.label}
          {item.href === '/system' && unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

