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
import { useTheme } from '../../../lib/contexts/theme-context';

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState<
    'notifications' | 'documents' | 'sessions' | 'import-export' | 'i18n' | 'integrations' | 'workflows' | '2fa' | 'settings'
  >('notifications');
  const { theme, toggleTheme, setTheme } = useTheme();
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
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <main className="p-4 md:p-8 flex flex-col gap-6 bg-gray-50 dark:bg-background min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-text mb-2">System Management</h1>
        <p className="text-sm text-gray-600 dark:text-text-muted">Manage system settings, notifications, and integrations</p>
      </header>

      <div className="flex gap-2 flex-wrap border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text'
            }`}
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

      {activeTab === 'settings' && (
        <div className="card flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-text">Preferences</h2>
            <p className="text-sm text-text-muted">Manage your application preferences</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-muted">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-text">Theme</label>
                <p className="text-xs text-text-muted">Choose between light and dark mode</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 dark:bg-surface text-gray-700 dark:text-text hover:bg-gray-200 dark:hover:bg-surface-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Light
                  </div>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 dark:bg-surface text-gray-700 dark:text-text hover:bg-gray-200 dark:hover:bg-surface-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Dark
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-muted">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-text">Quick Toggle</label>
                <p className="text-xs text-text-muted">Toggle between light and dark mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                role="switch"
                aria-checked={theme === 'dark'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

