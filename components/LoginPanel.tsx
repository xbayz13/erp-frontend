'use client';

import { FormEvent, useState } from 'react';
import { authService } from '../lib/services/service-registry';

interface LoginPanelProps {
  onAuthenticated?: () => void;
}

export function LoginPanel({ onAuthenticated }: LoginPanelProps) {
  const [email, setEmail] = useState('admin@erp.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      onAuthenticated?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: 360,
      }}
    >
      <div>
        <label className="kpi-label">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label className="kpi-label">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          required
          style={inputStyle}
        />
      </div>
      {error && (
        <span className="status-pill" data-variant="danger">
          {error}
        </span>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer',
          backgroundColor: 'var(--accent)',
          color: 'white',
        }}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 4,
  padding: '0.5rem 0.75rem',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'var(--surface-muted)',
  color: 'var(--text)',
};


