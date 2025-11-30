'use client';

import { useState } from 'react';
import { InventoryItem, Warehouse } from '../lib/services/types';

interface POItem {
  itemId: string;
  warehouseId: string;
  quantity: number;
  unitCost: number;
}

interface PurchaseOrderFormProps {
  items: InventoryItem[];
  warehouses: Warehouse[];
  onSubmit: (data: {
    supplierName: string;
    reference: string;
    expectedDate: string;
    items: POItem[];
  }) => Promise<void>;
  onCancel: () => void;
}

export function PurchaseOrderForm({
  items,
  warehouses,
  onSubmit,
  onCancel,
}: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState({
    supplierName: '',
    reference: '',
    expectedDate: new Date().toISOString().split('T')[0],
  });
  const [poItems, setPoItems] = useState<POItem[]>([
    { itemId: '', warehouseId: '', quantity: 0, unitCost: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = poItems.filter(
      (item) => item.itemId && item.warehouseId && item.quantity > 0,
    );
    if (validItems.length === 0) {
      alert('Minimal harus ada 1 item');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        items: validItems,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => {
    setPoItems([...poItems, { itemId: '', warehouseId: '', quantity: 0, unitCost: 0 }]);
  };

  const removeItem = (index: number) => {
    setPoItems(poItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof POItem, value: string | number) => {
    const updated = [...poItems];
    updated[index] = { ...updated[index], [field]: value };
    setPoItems(updated);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Nama Supplier *
          </label>
          <input
            type="text"
            required
            value={formData.supplierName}
            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
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
            Referensi PO *
          </label>
          <input
            type="text"
            required
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
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Tanggal Estimasi *
        </label>
        <input
          type="date"
          required
          value={formData.expectedDate}
          onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Items</h3>
          <button
            type="button"
            onClick={addItem}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 8,
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            + Tambah Item
          </button>
        </div>

        {poItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <select
              required
              value={item.itemId}
              onChange={(e) => updateItem(index, 'itemId', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
              }}
            >
              <option value="">Pilih Item</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.sku} - {it.name}
                </option>
              ))}
            </select>

            <select
              required
              value={item.warehouseId}
              onChange={(e) => updateItem(index, 'warehouseId', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
              }}
            >
              <option value="">Pilih Gudang</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              required
              min={1}
              placeholder="Qty"
              value={item.quantity || ''}
              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
              style={{
                padding: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
              }}
            />

            <input
              type="number"
              required
              min={0}
              step="0.01"
              placeholder="Harga/Unit"
              value={item.unitCost || ''}
              onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
              style={{
                padding: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
              }}
            />

            {poItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  background: 'rgba(255,99,132,0.2)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                Hapus
              </button>
            )}
          </div>
        ))}
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
          {submitting ? 'Menyimpan...' : 'Buat PO'}
        </button>
      </div>
    </form>
  );
}

