'use client';

import { useState, useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { DataTable } from '../../../components/DataTable';
import { ItemForm } from '../../../components/ItemForm';
import { StatusPill } from '../../../components/StatusPill';
import { useAsyncData } from '../../../lib/services/hooks';
import { inventoryService } from '../../../lib/services/service-registry';
import { InventoryItem, Warehouse } from '../../../lib/services/types';
import '../../../lib/chart';

export default function InventoryModulePage() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [refreshSeed, setRefreshSeed] = useState(0);

  const items = useAsyncData<InventoryItem[]>(
    () => inventoryService.listItems(),
    [refreshSeed],
  );
  const warehouses = useAsyncData<Warehouse[]>(
    () => inventoryService.listWarehouses(),
    [],
  );

  const handleCreate = async (data: {
    sku: string;
    name: string;
    description?: string;
    warehouseId: string;
    quantityOnHand: number;
    reorderLevel: number;
    unitCost: number;
  }) => {
    await inventoryService.createItem(data);
    setShowForm(false);
    setRefreshSeed((s) => s + 1);
  };

  const handleUpdate = async (data: {
    sku: string;
    name: string;
    description?: string;
    warehouseId: string;
    quantityOnHand: number;
    reorderLevel: number;
    unitCost: number;
  }) => {
    if (!editingItem) return;
    await inventoryService.updateItem(editingItem.id, {
      name: data.name,
      description: data.description,
      warehouseId: data.warehouseId,
      quantityOnHand: data.quantityOnHand,
      reorderLevel: data.reorderLevel,
      unitCost: data.unitCost,
    });
    setEditingItem(null);
    setRefreshSeed((s) => s + 1);
  };

  return (
    <main style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Modul Persediaan</h1>
          <p className="kpi-label" style={{ marginTop: '0.5rem' }}>
            Kelola master data barang, gudang, dan pergerakan stok.
          </p>
        </div>
        {!showForm && !editingItem && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: 8,
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            + Tambah Barang
          </button>
        )}
      </div>

      {(showForm || editingItem) && warehouses.data && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            {editingItem ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h2>
          <ItemForm
            item={editingItem ?? undefined}
            warehouses={warehouses.data}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      {items.data && items.data.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>
              Low Stock Alerts
            </h3>
            {(() => {
              const lowStockItems = items.data.filter(
                (item) => item.quantityOnHand <= item.reorderLevel,
              );
              const safeItems = items.data.filter(
                (item) => item.quantityOnHand > item.reorderLevel,
              );

              return (
                <Doughnut
                  data={{
                    labels: ['Perlu Reorder', 'Stok Aman'],
                    datasets: [
                      {
                        data: [lowStockItems.length, safeItems.length],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.8)',
                          'rgba(75, 192, 192, 0.8)',
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(75, 192, 192, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: 'var(--text)' },
                      },
                    },
                  }}
                />
              );
            })()}
          </div>

          <div
            style={{
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>
              Top 10 Items by Stock Value
            </h3>
            {(() => {
              const topItems = [...items.data]
                .sort(
                  (a, b) =>
                    b.quantityOnHand * b.unitCost -
                    a.quantityOnHand * a.unitCost,
                )
                .slice(0, 10);

              return (
                <Bar
                  data={{
                    labels: topItems.map((item) => item.name),
                    datasets: [
                      {
                        label: 'Stock Value (Rp)',
                        data: topItems.map(
                          (item) => item.quantityOnHand * item.unitCost,
                        ),
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: 'var(--text)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                      },
                      x: {
                        ticks: {
                          color: 'var(--text)',
                          maxRotation: 45,
                          minRotation: 45,
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                      },
                    },
                  }}
                />
              );
            })()}
          </div>
        </div>
      )}

      <DataTable
        title="Daftar Barang"
        data={items.data ?? []}
        emptyLabel={items.loading ? 'Memuat...' : 'Belum ada data'}
        searchable
        filterable
        columns={[
          { header: 'SKU', accessor: (item) => item.sku, searchable: true },
          { header: 'Nama', accessor: (item) => item.name, searchable: true },
          { header: 'Qty', accessor: (item) => item.quantityOnHand },
          {
            header: 'Status',
            accessor: (item) => {
              const status = item.quantityOnHand <= item.reorderLevel ? 'Perlu Reorder' : 'Aman';
              return (
                <StatusPill
                  label={status}
                  variant={
                    item.quantityOnHand <= item.reorderLevel
                      ? 'warning'
                      : 'success'
                  }
                />
              );
            },
            filterable: true,
            filterOptions: ['Perlu Reorder', 'Aman'],
          },
          {
            header: 'Aksi',
            accessor: (item) => (
              <button
                onClick={() => setEditingItem(item)}
                style={{
                  padding: '0.25rem 0.75rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  background: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Edit
              </button>
            ),
          },
        ]}
      />
    </main>
  );
}


