'use client';

import { useState } from 'react';
import { DataTable } from '../../../components/DataTable';
import { ProductionOrderForm } from '../../../components/ProductionOrderForm';
import { StatusPill } from '../../../components/StatusPill';
import { useAsyncData } from '../../../lib/services/hooks';
import { inventoryService, productionService } from '../../../lib/services/service-registry';
import { InventoryItem, ProductionOrder, Warehouse } from '../../../lib/services/types';

export default function ProductionModulePage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);

  const orders = useAsyncData<ProductionOrder[]>(
    () => productionService.listOrders(),
    [refreshSeed],
  );
  const items = useAsyncData<InventoryItem[]>(
    () => inventoryService.listItems(),
    [],
  );
  const warehouses = useAsyncData<Warehouse[]>(
    () => inventoryService.listWarehouses(),
    [],
  );

  const handleCreate = async (data: {
    code: string;
    productItemId: string;
    quantityPlanned: number;
    scheduledStart: string;
    scheduledEnd: string;
    supervisorId: string;
    outputWarehouseId: string;
    materials: Array<{
      itemId: string;
      warehouseId: string;
      quantity: number;
    }>;
    notes?: string;
  }) => {
    await productionService.createOrder(data);
    setShowForm(false);
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
          <h1 style={{ margin: 0 }}>Modul Produksi</h1>
          <p className="kpi-label" style={{ marginTop: '0.5rem' }}>
            Lacak perintah kerja, konsumsi bahan baku, dan output produksi.
          </p>
        </div>
        {!showForm && (
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
            + Buat Production Order
          </button>
        )}
      </div>

      {showForm && items.data && warehouses.data && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Buat Production Order Baru</h2>
          <ProductionOrderForm
            items={items.data}
            warehouses={warehouses.data}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <DataTable
        title="Work Orders"
        data={orders.data ?? []}
        emptyLabel={orders.loading ? 'Memuat...' : 'Belum ada work order'}
        searchable
        filterable
        columns={[
          { header: 'Kode', accessor: (order) => order.code, searchable: true },
          { header: 'Target', accessor: (order) => order.quantityPlanned },
          {
            header: 'Progress',
            accessor: (order) =>
              `${order.quantityCompleted}/${order.quantityPlanned}`,
          },
          {
            header: 'Status',
            accessor: (order) => (
              <StatusPill
                label={order.status}
                variant={
                  order.status === 'COMPLETED'
                    ? 'success'
                    : order.status === 'HALTED'
                    ? 'danger'
                    : 'warning'
                }
              />
            ),
            filterable: true,
            filterOptions: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'HALTED'],
          },
        ]}
      />
    </main>
  );
}


