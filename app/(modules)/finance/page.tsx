'use client';

import { useState } from 'react';
import { DataTable } from '../../../components/DataTable';
import { InvoiceForm } from '../../../components/InvoiceForm';
import { StatusPill } from '../../../components/StatusPill';
import { TransactionForm } from '../../../components/TransactionForm';
import { useAsyncData } from '../../../lib/services/hooks';
import { financeService, purchasingService } from '../../../lib/services/service-registry';
import { Invoice, PurchaseOrder } from '../../../lib/services/types';

export default function FinanceModulePage() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);

  const invoices = useAsyncData<Invoice[]>(
    () => financeService.listInvoices(),
    [refreshSeed],
  );
  const purchaseOrders = useAsyncData<PurchaseOrder[]>(
    () => purchasingService.listOrders(),
    [],
  );

  const handleRecordTransaction = async (data: {
    type: 'EXPENSE' | 'REVENUE' | 'PAYMENT';
    amount: number;
    currency: string;
    description: string;
    reference?: string;
    relatedEntityId?: string;
  }) => {
    await financeService.recordTransaction(data);
    setShowTransactionForm(false);
    setRefreshSeed((s) => s + 1);
  };

  const handleIssueInvoice = async (data: {
    purchaseOrderId: string;
    amount: number;
    currency: string;
    dueDate: string;
    notes?: string;
  }) => {
    await financeService.issueInvoice(data);
    setShowInvoiceForm(false);
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
          <h1 style={{ margin: 0 }}>Modul Keuangan</h1>
          <p className="kpi-label" style={{ marginTop: '0.5rem' }}>
            Pantau invoice dan transaksi pembayaran dalam satu layar.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!showTransactionForm && !showInvoiceForm && (
            <>
              <button
                onClick={() => setShowTransactionForm(true)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: 8,
                  background: 'var(--accent)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                + Record Transaction
              </button>
              <button
                onClick={() => setShowInvoiceForm(true)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: 8,
                  background: 'var(--accent)',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                + Issue Invoice
              </button>
            </>
          )}
        </div>
      </div>

      {showTransactionForm && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Record Transaction</h2>
          <TransactionForm
            onSubmit={handleRecordTransaction}
            onCancel={() => setShowTransactionForm(false)}
          />
        </div>
      )}

      {showInvoiceForm && purchaseOrders.data && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Issue Invoice</h2>
          <InvoiceForm
            purchaseOrders={purchaseOrders.data}
            onSubmit={handleIssueInvoice}
            onCancel={() => setShowInvoiceForm(false)}
          />
        </div>
      )}

      <DataTable
        title="Invoice"
        data={invoices.data ?? []}
        emptyLabel={invoices.loading ? 'Memuat...' : 'Tidak ada invoice'}
        searchable
        filterable
        columns={[
          { header: 'Invoice ID', accessor: (invoice) => invoice.id, searchable: true },
          {
            header: 'Amount',
            accessor: (invoice) =>
              `Rp ${invoice.amount.toLocaleString('id-ID')}`,
          },
          {
            header: 'Due Date',
            accessor: (invoice) =>
              new Date(invoice.dueDate).toLocaleDateString('id-ID'),
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
            filterable: true,
            filterOptions: ['PENDING', 'PAID', 'CANCELLED'],
          },
        ]}
      />
    </main>
  );
}


