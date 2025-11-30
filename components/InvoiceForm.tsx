'use client';

import { useState } from 'react';
import { PurchaseOrder } from '../lib/services/types';

interface InvoiceFormProps {
  purchaseOrders: PurchaseOrder[];
  onSubmit: (data: {
    purchaseOrderId: string;
    amount: number;
    currency: string;
    dueDate: string;
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function InvoiceForm({
  purchaseOrders,
  onSubmit,
  onCancel,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    purchaseOrderId: '',
    amount: 0,
    currency: 'IDR',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedPO = purchaseOrders.find((po) => po.id === formData.purchaseOrderId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        notes: formData.notes || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Purchase Order *
        </label>
        <select
          required
          value={formData.purchaseOrderId}
          onChange={(e) => {
            const po = purchaseOrders.find((p) => p.id === e.target.value);
            setFormData({
              ...formData,
              purchaseOrderId: e.target.value,
              amount: po ? po.totalCost : 0,
            });
          }}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text)',
          }}
        >
          <option value="">Pilih Purchase Order</option>
          {purchaseOrders
            .filter((po) => po.status !== 'CANCELLED')
            .map((po) => (
              <option key={po.id} value={po.id}>
                {po.reference} - {po.supplierName} (Rp{' '}
                {po.totalCost.toLocaleString('id-ID')})
              </option>
            ))}
        </select>
        {selectedPO && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Total Cost: Rp {selectedPO.totalCost.toLocaleString('id-ID')}
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Jumlah Invoice (Rp) *
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
          Tanggal Jatuh Tempo *
        </label>
        <input
          type="date"
          required
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
          Catatan
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
          {submitting ? 'Menyimpan...' : 'Buat Invoice'}
        </button>
      </div>
    </form>
  );
}

