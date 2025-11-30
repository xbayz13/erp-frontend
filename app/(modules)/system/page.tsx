'use client';

import { useState } from 'react';
import { useAsyncData } from '../../../lib/services/hooks';
import {
  systemService,
  dataImportExportService,
  i18nService,
  integrationHubService,
  workflowService,
} from '../../../lib/services/service-registry';
import { DataTable } from '../../../components/DataTable';
import { StatusPill } from '../../../components/StatusPill';
import { WorkflowManager } from '../../../components/WorkflowManager';
import { TwoFactorAuth } from '../../../components/TwoFactorAuth';

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState<
    'notifications' | 'documents' | 'sessions' | 'import-export' | 'i18n' | 'integrations' | 'workflows' | '2fa'
  >('notifications');
  const [refreshSeed, setRefreshSeed] = useState(0);

  const notificationsState = useAsyncData(
    () => systemService.listNotifications(),
    [activeTab === 'notifications'],
  );

  const documentsState = useAsyncData(
    () => systemService.listDocuments(),
    [activeTab === 'documents'],
  );

  const sessionsState = useAsyncData(
    () => systemService.listSessions(),
    [activeTab === 'sessions'],
  );

  const languagesState = useAsyncData(
    () => i18nService.getAvailableLanguages(),
    [activeTab === 'i18n'],
  );

  const integrationsState = useAsyncData(
    () => integrationHubService.listIntegrations(),
    [activeTab === 'integrations'],
  );

  const workflowsState = useAsyncData(
    () => workflowService.listWorkflows(),
    [activeTab === 'workflows', refreshSeed],
  );

  const handleExportItems = async () => {
    try {
      const blob = await dataImportExportService.exportItems();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'items.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(`Export failed: ${error.message}`);
    }
  };

  const handleExportCustomers = async () => {
    try {
      const blob = await dataImportExportService.exportCustomers();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'customers.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(`Export failed: ${error.message}`);
    }
  };

  const handleImportItems = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await dataImportExportService.importItems(file);
      alert(`Import completed: ${result.success} succeeded, ${result.failed} failed`);
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    }
  };

  const tabs = [
    { id: 'notifications' as const, label: 'Notifications' },
    { id: 'documents' as const, label: 'Documents' },
    { id: 'sessions' as const, label: 'Sessions' },
    { id: 'import-export' as const, label: 'Import/Export' },
    { id: 'i18n' as const, label: 'Languages' },
    { id: 'integrations' as const, label: 'Integrations' },
    { id: 'workflows' as const, label: 'Workflows' },
    { id: '2fa' as const, label: '2FA' },
  ];

  return (
    <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header>
        <h1>System Management</h1>
        <p className="kpi-label">Manage system settings, notifications, and integrations</p>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              background: 'transparent',
              color: 'var(--text)',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? '600' : '400',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'notifications' && (
        <DataTable
          title="Notifications"
          data={notificationsState.data ?? []}
          emptyLabel={notificationsState.loading ? 'Loading...' : 'No notifications'}
          columns={[
            { header: 'Title', accessor: (n) => n.title },
            { header: 'Message', accessor: (n) => n.message },
            {
              header: 'Status',
              accessor: (n) => (
                <StatusPill
                  label={n.status}
                  variant={n.status === 'UNREAD' ? 'warning' : undefined}
                />
              ),
            },
            { header: 'Date', accessor: (n) => new Date(n.createdAt).toLocaleDateString() },
          ]}
        />
      )}

      {activeTab === 'documents' && (
        <DataTable
          title="Documents"
          data={documentsState.data ?? []}
          emptyLabel={documentsState.loading ? 'Loading...' : 'No documents'}
          columns={[
            { header: 'Filename', accessor: (d) => d.originalFilename },
            { header: 'Type', accessor: (d) => d.type },
            { header: 'Size', accessor: (d) => `${(d.size / 1024).toFixed(2)} KB` },
            { header: 'Uploaded', accessor: (d) => new Date(d.createdAt).toLocaleDateString() },
          ]}
        />
      )}

      {activeTab === 'sessions' && (
        <DataTable
          title="Active Sessions"
          data={sessionsState.data ?? []}
          emptyLabel={sessionsState.loading ? 'Loading...' : 'No active sessions'}
          columns={[
            { header: 'Device', accessor: (s) => s.deviceInfo },
            { header: 'IP Address', accessor: (s) => s.ipAddress },
            {
              header: 'Status',
              accessor: (s) => (
                <StatusPill
                  label={s.isActive ? 'Active' : 'Inactive'}
                  variant={s.isActive ? 'success' : undefined}
                />
              ),
            },
            { header: 'Last Activity', accessor: (s) => new Date(s.lastActivityAt).toLocaleString() },
          ]}
        />
      )}

      {activeTab === 'import-export' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Data Import/Export</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportItems}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'var(--accent)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Export Items
            </button>
            <button
              onClick={handleExportCustomers}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'var(--accent)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Export Customers
            </button>
            <label
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'var(--accent)',
                color: 'white',
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
              Import Items
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportItems}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      )}

      {activeTab === 'i18n' && (
        <DataTable
          title="Available Languages"
          data={languagesState.data ?? []}
          emptyLabel={languagesState.loading ? 'Loading...' : 'No languages available'}
          columns={[
            { header: 'Code', accessor: (l) => l.code },
            { header: 'Name', accessor: (l) => l.name },
            { header: 'Native Name', accessor: (l) => l.nativeName },
            {
              header: 'Default',
              accessor: (l) => (l.isDefault ? 'Yes' : 'No'),
            },
          ]}
        />
      )}

      {activeTab === 'integrations' && (
        <DataTable
          title="Integrations"
          data={integrationsState.data ?? []}
          emptyLabel={integrationsState.loading ? 'Loading...' : 'No integrations'}
          columns={[
            { header: 'Name', accessor: (i) => i.name },
            { header: 'Type', accessor: (i) => i.type },
            {
              header: 'Status',
              accessor: (i) => (
                <StatusPill
                  label={i.status}
                  variant={i.status === 'ACTIVE' ? 'success' : undefined}
                />
              ),
            },
            { header: 'Endpoint', accessor: (i) => i.endpoint || 'N/A' },
          ]}
        />
      )}

      {activeTab === 'workflows' && (
        <WorkflowManager
          workflows={workflowsState.data ?? []}
          onRefresh={() => setRefreshSeed((s) => s + 1)}
        />
      )}

      {activeTab === '2fa' && <TwoFactorAuth />}
    </main>
  );
}

