'use client';

import { useState, useEffect } from 'react';
import { InventoryItem, Warehouse } from '../lib/services/types';

interface ItemFormData {
  sku: string;
  name: string;
  description?: string;
  warehouseId: string;
  quantityOnHand: number;
  reorderLevel: number;
  unitCost: number;
}

interface ItemFormProps {
  item?: InventoryItem;
  warehouses: Warehouse[];
  onSubmit: (data: ItemFormData) => Promise<void>;
  onCancel: () => void;
}

export function ItemForm({ item, warehouses, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    sku: item?.sku ?? '',
    name: item?.name ?? '',
    description: item?.description ?? '',
    warehouseId: item?.warehouseId ?? warehouses[0]?.id ?? '',
    quantityOnHand: item?.quantityOnHand ?? 0,
    reorderLevel: item?.reorderLevel ?? 0,
    unitCost: item?.unitCost ?? 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          SKU *
        </label>
        <input
          type="text"
          required
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          disabled={!!item}
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
          Nama Barang *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          Deskripsi
        </label>
        <textarea
          value={formData.description ?? ''}
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

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Gudang *
        </label>
        <select
          required
          value={formData.warehouseId}
          onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text)',
          }}
        >
          {warehouses.map((wh) => (
            <option key={wh.id} value={wh.id}>
              {wh.name} - {wh.location}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Qty On Hand *
          </label>
          <input
            type="number"
            required
            min={0}
            value={formData.quantityOnHand}
            onChange={(e) =>
              setFormData({ ...formData, quantityOnHand: parseFloat(e.target.value) || 0 })
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
            Reorder Level *
          </label>
          <input
            type="number"
            required
            min={0}
            value={formData.reorderLevel}
            onChange={(e) =>
              setFormData({ ...formData, reorderLevel: parseFloat(e.target.value) || 0 })
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
            Unit Cost (Rp) *
          </label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={formData.unitCost}
            onChange={(e) =>
              setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })
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
          {submitting ? 'Menyimpan...' : item ? 'Update' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}

