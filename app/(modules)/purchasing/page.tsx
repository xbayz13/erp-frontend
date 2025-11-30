'use client';

import { useState } from 'react';
import { DataTable } from '../../../components/DataTable';
import { PurchaseOrderForm } from '../../../components/PurchaseOrderForm';
import { StatusPill } from '../../../components/StatusPill';
import { useAsyncData } from '../../../lib/services/hooks';
import { inventoryService, purchasingService } from '../../../lib/services/service-registry';
import { InventoryItem, PurchaseOrder, Warehouse } from '../../../lib/services/types';

export default function PurchasingModulePage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);

  const orders = useAsyncData<PurchaseOrder[]>(
    () => purchasingService.listOrders(),
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
    supplierName: string;
    reference: string;
    expectedDate: string;
    items: Array<{
      itemId: string;
      warehouseId: string;
      quantity: number;
      unitCost: number;
    }>;
  }) => {
    await purchasingService.createOrder(data);
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
          <h1 style={{ margin: 0 }}>Modul Pembelian</h1>
          <p className="kpi-label" style={{ marginTop: '0.5rem' }}>
            Monitoring lifecycle pemesanan barang dari draft hingga penerimaan.
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
            + Buat Purchase Order
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
          <h2 style={{ marginTop: 0 }}>Buat Purchase Order Baru</h2>
          <PurchaseOrderForm
            items={items.data}
            warehouses={warehouses.data}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <DataTable
        title="Purchase Orders"
        data={orders.data ?? []}
        emptyLabel={orders.loading ? 'Memuat...' : 'Belum ada PO'}
        searchable
        filterable
        columns={[
          { header: 'Referensi', accessor: (order) => order.reference, searchable: true },
          { header: 'Supplier', accessor: (order) => order.supplierName, searchable: true },
          {
            header: 'Estimasi',
            accessor: (order) =>
              new Date(order.expectedDate).toLocaleDateString('id-ID'),
          },
          {
            header: 'Status',
            accessor: (order) => (
              <StatusPill
                label={order.status}
                variant={
                  order.status === 'RECEIVED'
                    ? 'success'
                    : order.status === 'CANCELLED'
                    ? 'danger'
                    : 'warning'
                }
              />
            ),
            filterable: true,
            filterOptions: ['DRAFT', 'PENDING', 'RECEIVED', 'CANCELLED'],
          },
        ]}
      />
    </main>
  );
}


