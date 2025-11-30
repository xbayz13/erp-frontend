'use client';

import { useState } from 'react';

interface TransactionFormProps {
  onSubmit: (data: {
    type: 'EXPENSE' | 'REVENUE' | 'PAYMENT';
    amount: number;
    currency: string;
    description: string;
    reference?: string;
    relatedEntityId?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'EXPENSE' as 'EXPENSE' | 'REVENUE' | 'PAYMENT',
    amount: 0,
    currency: 'IDR',
    description: '',
    reference: '',
    relatedEntityId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        type: formData.type,
        amount: formData.amount,
        currency: formData.currency,
        description: formData.description,
        reference: formData.reference || undefined,
        relatedEntityId: formData.relatedEntityId || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Tipe Transaksi *
        </label>
        <select
          required
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as any })
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text)',
          }}
        >
          <option value="EXPENSE">Pengeluaran (Expense)</option>
          <option value="REVENUE">Pendapatan (Revenue)</option>
          <option value="PAYMENT">Pembayaran (Payment)</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Jumlah (Rp) *
          </label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) =>
              setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Mata Uang *
          </label>
          <select
            required
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
            }}
          >
            <option value="IDR">IDR (Rupiah)</option>
            <option value="USD">USD (Dollar)</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Deskripsi *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text)',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Referensi
          </label>
          <input
            type="text"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Related Entity ID
          </label>
          <input
            type="text"
            value={formData.relatedEntityId}
            onChange={(e) =>
              setFormData({ ...formData, relatedEntityId: e.target.value })
            }
            placeholder="Optional: ID terkait (PO, Invoice, dll)"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            background: 'transparent',
            color: 'var(--text)',
            cursor: 'pointer',
          }}
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 8,
            background: 'var(--accent)',
            color: 'white',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </div>
    </form>
  );
}

