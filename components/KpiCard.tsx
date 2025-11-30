'use client';

import clsx from 'clsx';

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function KpiCard({
  label,
  value,
  trend,
  variant = 'default',
}: KpiCardProps) {
  return (
    <div className="card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {trend && (
        <span
          className={clsx('status-pill', {
            'status-pill': variant !== 'default',
          })}
          data-variant={variant === 'default' ? undefined : variant}
        >
          {trend}
        </span>
      )}
    </div>
  );
}


