'use client';

import { useState } from 'react';
import { InventoryItem, Warehouse } from '../lib/services/types';

interface MaterialRequirement {
  itemId: string;
  warehouseId: string;
  quantity: number;
}

interface ProductionOrderFormProps {
  items: InventoryItem[];
  warehouses: Warehouse[];
  onSubmit: (data: {
    code: string;
    productItemId: string;
    quantityPlanned: number;
    scheduledStart: string;
    scheduledEnd: string;
    supervisorId: string;
    outputWarehouseId: string;
    materials: MaterialRequirement[];
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function ProductionOrderForm({
  items,
  warehouses,
  onSubmit,
  onCancel,
}: ProductionOrderFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    productItemId: '',
    quantityPlanned: 0,
    scheduledStart: new Date().toISOString().split('T')[0],
    scheduledEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    supervisorId: '',
    outputWarehouseId: '',
    notes: '',
  });
  const [materials, setMaterials] = useState<MaterialRequirement[]>([
    { itemId: '', warehouseId: '', quantity: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validMaterials = materials.filter(
      (mat) => mat.itemId && mat.warehouseId && mat.quantity > 0,
    );
    if (validMaterials.length === 0) {
      alert('Minimal harus ada 1 material requirement');
      return;
    }
    if (!formData.supervisorId) {
      alert('Supervisor ID harus diisi');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        materials: validMaterials,
        notes: formData.notes || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addMaterial = () => {
    setMaterials([...materials, { itemId: '', warehouseId: '', quantity: 0 }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (
    index: number,
    field: keyof MaterialRequirement,
    value: string | number,
  ) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Kode Production Order *
          </label>
          <input
            type="text"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="PO-001"
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
            Product Item (Output) *
          </label>
          <select
            required
            value={formData.productItemId}
            onChange={(e) => setFormData({ ...formData, productItemId: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
            }}
          >
            <option value="">Pilih Product Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.sku} - {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Quantity Planned *
          </label>
          <input
            type="number"
            required
            min={1}
            value={formData.quantityPlanned || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantityPlanned: parseFloat(e.target.value) || 0,
              })
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
            Scheduled Start *
          </label>
          <input
            type="date"
            required
            value={formData.scheduledStart}
            onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
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
            Scheduled End *
          </label>
          <input
            type="date"
            required
            value={formData.scheduledEnd}
            onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Supervisor ID *
          </label>
          <input
            type="text"
            required
            value={formData.supervisorId}
            onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
            placeholder="User ID supervisor"
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
            Output Warehouse *
          </label>
          <select
            required
            value={formData.outputWarehouseId}
            onChange={(e) => setFormData({ ...formData, outputWarehouseId: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text)',
            }}
          >
            <option value="">Pilih Output Warehouse</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name} - {wh.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ margin: 0 }}>Material Requirements</h3>
          <button
            type="button"
            onClick={addMaterial}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 8,
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            + Tambah Material
          </button>
        </div>

        {materials.map((material, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr auto',
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
              value={material.itemId}
              onChange={(e) => updateMaterial(index, 'itemId', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
              }}
            >
              <option value="">Pilih Material</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.sku} - {item.name}
                </option>
              ))}
            </select>

            <select
              required
              value={material.warehouseId}
              onChange={(e) => updateMaterial(index, 'warehouseId', e.target.value)}
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
              value={material.quantity || ''}
              onChange={(e) =>
                updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)
              }
              style={{
                padding: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
              }}
            />

            {materials.length > 1 && (
              <button
                type="button"
                onClick={() => removeMaterial(index)}
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
          {submitting ? 'Menyimpan...' : 'Buat Production Order'}
        </button>
      </div>
    </form>
  );
}

