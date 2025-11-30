'use client';

import { useState } from 'react';
import { systemService } from '../lib/services/service-registry';
import { useAsyncData } from '../lib/services/hooks';

export function TwoFactorAuth() {
  const [token, setToken] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const statusState = useAsyncData(() => systemService.get2FAStatus(), []);

  const handleGenerate = async () => {
    try {
      const result = await systemService.generate2FA();
      setQrCode(result.qrCode);
    } catch (error: any) {
      alert(`Failed to generate 2FA: ${error.message}`);
    }
  };

  const handleEnable = async () => {
    if (!token) {
      alert('Please enter the verification token');
      return;
    }

    try {
      await systemService.enable2FA(token);
      alert('2FA enabled successfully!');
      setToken('');
      setQrCode(null);
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to enable 2FA: ${error.message}`);
    }
  };

  const handleDisable = async () => {
    if (!confirm('Are you sure you want to disable 2FA?')) return;

    try {
      await systemService.disable2FA();
      alert('2FA disabled successfully!');
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to disable 2FA: ${error.message}`);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Two-Factor Authentication</h3>

      {statusState.loading ? (
        <p className="kpi-label">Loading...</p>
      ) : statusState.data?.isEnabled ? (
        <div>
          <p className="kpi-label" style={{ marginBottom: '1rem' }}>
            2FA is currently enabled for your account.
          </p>
          <button
            onClick={handleDisable}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(248, 113, 113, 0.8)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Disable 2FA
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!qrCode ? (
            <button
              onClick={handleGenerate}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Generate QR Code
            </button>
          ) : (
            <>
              <div>
                <p className="kpi-label" style={{ marginBottom: '0.5rem' }}>
                  Scan this QR code with your authenticator app:
                </p>
                {qrCode && (
                  <img
                    src={qrCode}
                    alt="2FA QR Code"
                    style={{ maxWidth: '200px', marginBottom: '1rem' }}
                  />
                )}
              </div>
              <input
                type="text"
                placeholder="Enter verification token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: 'var(--text)',
                }}
              />
              <button
                onClick={handleEnable}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Enable 2FA
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

