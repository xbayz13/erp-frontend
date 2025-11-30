'use client';

type PillVariant = 'success' | 'warning' | 'danger' | 'neutral';

interface StatusPillProps {
  label: string;
  variant?: PillVariant;
}

export function StatusPill({ label, variant = 'neutral' }: StatusPillProps) {
  return (
    <span
      className="status-pill"
      data-variant={variant === 'neutral' ? undefined : variant}
    >
      {label}
    </span>
  );
}


