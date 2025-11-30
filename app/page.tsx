'use client';

import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../components/DataTable';
import { KpiCard } from '../components/KpiCard';
import { StatusPill } from '../components/StatusPill';
import { AuthGuard } from '../components/AuthGuard';
import { useAsyncData } from '../lib/services/hooks';
import { useRealtime } from '../lib/hooks/use-realtime';
import { Bar, Doughnut } from 'react-chartjs-2';
import '../lib/chart';
import {
  financeService,
  inventoryService,
  productionService,
  purchasingService,
  reportsService,
} from '../lib/services/service-registry';
import {
  InventoryItem,
  Invoice,
  OperationalSnapshot,
  ProductionOrder,
  PurchaseOrder,
} from '../lib/services/types';

export default function DashboardPage() {
  const [refreshSeed, setRefreshSeed] = useState(0);
  const { snapshot: realtimeSnapshot, connected } = useRealtime();

  const snapshotState = useAsyncData<OperationalSnapshot>(
    () => reportsService.getOperationalSnapshot(),
    [refreshSeed],
  );

  const snapshot = realtimeSnapshot || snapshotState.data;
  const inventoryState = useAsyncData<InventoryItem[]>(
    () => inventoryService.listItems(),
    [refreshSeed],
  );
  const purchaseOrderState = useAsyncData<PurchaseOrder[]>(
    () => purchasingService.listOrders(),
    [refreshSeed],
  );
  const invoiceState = useAsyncData<Invoice[]>(
    () => financeService.listInvoices(),
    [refreshSeed],
  );
  const productionState = useAsyncData<ProductionOrder[]>(
    () => productionService.listOrders(),
    [refreshSeed],
  );

  useEffect(() => {
    if (realtimeSnapshot) {
      setRefreshSeed((s) => s + 1);
    }
  }, [realtimeSnapshot]);


  const inventoryChartData = useMemo(() => {
    if (!inventoryState.data || inventoryState.data.length === 0) {
      return null;
    }

    const sorted = [...inventoryState.data]
      .sort((a, b) => b.quantityOnHand - a.quantityOnHand)
      .slice(0, 5);

    if (sorted.length === 0) {
      return null;
    }

    return {
      labels: sorted.map((item) => item.sku || item.name),
      datasets: [
        {
          label: 'Qty on Hand',
          data: sorted.map((item) => item.quantityOnHand),
          backgroundColor: 'rgba(79, 70, 229, 0.6)',
          borderRadius: 8,
        },
      ],
    };
  }, [inventoryState.data]);

  const inventoryChartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) =>
              `${context.label ?? ''}: ${context.raw} unit`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }) as any,
    [],
  );

  const financeChartData = useMemo(() => {
    if (!snapshot) {
      return null;
    }

    const { totalPayables, totalPayments, cashOutflow } =
        snapshot.finance;

    return {
      labels: ['Payables', 'Payments', 'Cash Outflow'],
      datasets: [
        {
          label: 'Rp',
          data: [totalPayables, totalPayments, cashOutflow],
          backgroundColor: [
            'rgba(244, 114, 182, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(248, 113, 113, 0.8)',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [snapshot]);

  const procurementChartData = useMemo(() => {
    if (!purchaseOrderState.data || purchaseOrderState.data.length === 0) {
      return null;
    }

    const statusCounts = purchaseOrderState.data.reduce<Record<string, number>>(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
      },
      {},
    );

    const labels = Object.keys(statusCounts);
    if (labels.length === 0) {
      return null;
    }

    return {
      labels,
      datasets: [
        {
          label: 'Jumlah PO',
          data: labels.map((label) => statusCounts[label]),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(248, 113, 113, 0.8)',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [purchaseOrderState.data]);

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
      },
    }) as any,
    [],
  );

  return (
    <AuthGuard>
    <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>ERP Command Center</h1>
          <p className="kpi-label">
            Snapshot menyeluruh terhadap stok, pembelian, keuangan, dan produksi.
          </p>
        </div>
        <button
          onClick={() => setRefreshSeed((current) => current + 1)}
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '0.5rem 1rem',
            background: 'transparent',
            color: 'var(--text)',
            cursor: 'pointer',
          }}
        >
          Refresh data
        </button>
      </header>

      {snapshotState.loading ? (
        <p className="kpi-label">Memuat KPI...</p>
      ) : snapshotState.error ? (
        <span className="status-pill" data-variant="danger">
          {snapshotState.error}
        </span>
      ) : snapshot ? (
        <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <KpiCard
            label="Total Item"
            value={snapshot.inventory.totalItems}
            trend={`${snapshot.inventory.lowStockItems} low stock`}
            variant={snapshot.inventory.lowStockItems > 0 ? 'warning' : 'success'}
          />
          <KpiCard
            label="Nilai Stok"
            value={`Rp ${snapshot.inventory.totalStockValue.toLocaleString('id-ID')}`}
            trend="update real-time"
          />
          <KpiCard
            label="PO Terbuka"
            value={snapshot.procurement.openOrders}
            trend={`${snapshot.procurement.receivedOrders} diterima`}
          />
          <KpiCard
            label="Total Hutang"
            value={`Rp ${snapshot.finance.totalPayables.toLocaleString('id-ID')}`}
            trend={`${snapshot.finance.totalPayments} pembayaran`}
            variant="warning"
          />
        </section>
      ) : null}

      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <DataTable
          title="Stok Barang"
          data={inventoryState.data ?? []}
          emptyLabel={inventoryState.loading ? 'Memuat...' : 'Belum ada data barang'}
          columns={[
            { header: 'SKU', accessor: (item) => item.sku },
            { header: 'Nama', accessor: (item) => item.name },
            {
              header: 'Qty',
              accessor: (item) => (
                <StatusPill
                  label={item.quantityOnHand.toString()}
                  variant={
                    item.quantityOnHand <= item.reorderLevel
                      ? 'warning'
                      : 'success'
                  }
                />
              ),
            },
          ]}
        />
        <DataTable
          title="Purchase Orders"
          data={purchaseOrderState.data ?? []}
          emptyLabel={
            purchaseOrderState.loading ? 'Memuat...' : 'Belum ada PO'
          }
          columns={[
            { header: 'Referensi', accessor: (order) => order.reference },
            { header: 'Supplier', accessor: (order) => order.supplierName },
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
            },
            {
              header: 'Nilai',
              accessor: (order) =>
                `Rp ${order.totalCost.toLocaleString('id-ID')}`,
            },
          ]}
        />
      </section>

      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem' }}>Top 5 Item Berdasarkan Stok</h3>
          {inventoryChartData ? (
            <Bar data={inventoryChartData} options={inventoryChartOptions} />
          ) : (
            <p className="kpi-label">Data stok belum tersedia.</p>
          )}
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem' }}>Kesehatan Keuangan</h3>
          {financeChartData ? (
            <Doughnut data={financeChartData} options={doughnutOptions} />
          ) : (
            <p className="kpi-label">Menunggu data snapshot keuangan...</p>
          )}
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem' }}>Status Purchase Order</h3>
          {procurementChartData ? (
            <Doughnut data={procurementChartData} options={doughnutOptions} />
          ) : (
            <p className="kpi-label">Belum ada purchase order untuk divisualisasikan.</p>
          )}
        </div>
      </section>

      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <DataTable
          title="Invoices"
          data={invoiceState.data ?? []}
          emptyLabel={invoiceState.loading ? 'Memuat...' : 'Belum ada invoice'}
          columns={[
            { header: 'Invoice', accessor: (invoice) => invoice.id },
            {
              header: 'Amount',
              accessor: (invoice) =>
                `Rp ${invoice.amount.toLocaleString('id-ID')}`,
            },
            {
              header: 'Status',
              accessor: (invoice) => (
                <StatusPill
                  label={invoice.status}
                  variant={
                    invoice.status === 'PAID'
                      ? 'success'
                      : invoice.status === 'CANCELLED'
                      ? 'danger'
                      : 'warning'
                  }
                />
              ),
            },
          ]}
        />
        <DataTable
          title="Perintah Produksi"
          data={productionState.data ?? []}
          emptyLabel={
            productionState.loading ? 'Memuat...' : 'Belum ada WO produksi'
          }
          columns={[
            { header: 'Kode', accessor: (order) => order.code },
            {
              header: 'Target',
              accessor: (order) => order.quantityPlanned,
            },
            {
              header: 'Selesai',
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
            },
          ]}
        />
      </section>
      </main>
    </AuthGuard>
  );
}


