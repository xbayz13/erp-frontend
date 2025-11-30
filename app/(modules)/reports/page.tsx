'use client';

import { useState } from 'react';
import { useAsyncData } from '../../../lib/services/hooks';
import { reportBuilderService } from '../../../lib/services/service-registry';
import { ReportDefinition } from '../../../lib/services/report-builder-service';
import { DataTable } from '../../../components/DataTable';

export default function ReportsPage() {
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [reportName, setReportName] = useState<string>('');

  const entitiesState = useAsyncData(
    () => reportBuilderService.getAvailableEntities(),
    [],
  );

  const fieldsState = useAsyncData(
    () => {
      if (!selectedEntity) return Promise.resolve([]);
      return reportBuilderService.getAvailableFields(selectedEntity);
    },
    [selectedEntity],
  );

  const handleBuildReport = async () => {
    if (!selectedEntity || selectedFields.length === 0) {
      alert('Please select entity and fields');
      return;
    }

    try {
      const definition: ReportDefinition = {
        name: reportName || `Report for ${selectedEntity}`,
        entity: selectedEntity,
        columns: selectedFields.map((field) => {
          const fieldInfo = fieldsState.data?.find((f) => f.field === field);
          return {
            field,
            label: field,
            type: (fieldInfo?.type || 'string') as 'string' | 'number' | 'date' | 'boolean',
          };
        }),
      };

      const data = await reportBuilderService.buildReport(definition);
      setReportData(data);
    } catch (error: any) {
      alert(`Report build failed: ${error.message}`);
    }
  };

  return (
    <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header>
        <h1>Custom Report Builder</h1>
        <p className="kpi-label">Build custom reports from any entity</p>
      </header>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Report Configuration</h3>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Report Name</label>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Enter report name"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'var(--text)',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Entity</label>
          <select
            value={selectedEntity}
            onChange={(e) => {
              setSelectedEntity(e.target.value);
              setSelectedFields([]);
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'var(--text)',
            }}
          >
            <option value="">-- Select Entity --</option>
            {entitiesState.data?.map((entity) => (
              <option key={entity} value={entity}>
                {entity}
              </option>
            ))}
          </select>
        </div>

        {selectedEntity && fieldsState.data && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Fields</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {fieldsState.data.map((field) => (
                <label key={field.field} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.field)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFields([...selectedFields, field.field]);
                      } else {
                        setSelectedFields(selectedFields.filter((f) => f !== field.field));
                      }
                    }}
                  />
                  <span>
                    {field.field} ({field.type})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleBuildReport}
          disabled={!selectedEntity || selectedFields.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--accent)',
            color: 'white',
            cursor: selectedEntity && selectedFields.length > 0 ? 'pointer' : 'not-allowed',
            opacity: selectedEntity && selectedFields.length > 0 ? 1 : 0.5,
          }}
        >
          Build Report
        </button>
      </div>

      {reportData.length > 0 && (
        <div className="card">
          <h3>Report Results ({reportData.length} rows)</h3>
          <DataTable
            title="Report Results"
            data={reportData}
            emptyLabel="No data"
            columns={Object.keys(reportData[0] || {}).map((key) => ({
              header: key,
              accessor: (row: any) => String(row[key] || ''),
            }))}
          />
        </div>
      )}
    </main>
  );
}
