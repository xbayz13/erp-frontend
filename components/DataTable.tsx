'use client';

import clsx from 'clsx';
import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: (item: T) => ReactNode;
  width?: string;
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: string[];
}

interface DataTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  emptyLabel?: string;
  searchable?: boolean;
  filterable?: boolean;
}

export function DataTable<T>({
  title,
  columns,
  data,
  emptyLabel = 'No data',
  searchable = true,
  filterable = true,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm && searchable) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return columns.some((col) => {
          if (!col.searchable) return false;
          const value = col.accessor(item);
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    if (filterable) {
      columns.forEach((col) => {
        if (col.filterable && col.filterOptions && filters[col.header]) {
          const filterValue = filters[col.header];
          result = result.filter((item) => {
            const value = String(col.accessor(item));
            return value === filterValue;
          });
        }
      });
    }

    return result;
  }, [data, searchTerm, filters, columns, searchable, filterable]);

  const filterableColumns = columns.filter((col) => col.filterable && col.filterOptions);

  return (
    <div className="card card-muted">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span className="kpi-label">
          {filteredData.length} / {data.length} records
        </span>
      </div>

      {(searchable || filterableColumns.length > 0) && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          {searchable && (
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                }}
              >
                Search
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          )}

          {filterableColumns.map((col) => (
            <div key={col.header} style={{ minWidth: '150px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                }}
              >
                Filter {col.header}
              </label>
              <select
                value={filters[col.header] || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    [col.header]: e.target.value || '',
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
              >
                <option value="">All</option>
                {col.filterOptions?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {(searchTerm || Object.values(filters).some((f) => f)) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({});
              }}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                background: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        {filteredData.length === 0 ? (
          <p className="kpi-label">{emptyLabel}</p>
        ) : (
          <table
            style={{ width: '100%', borderSpacing: 0, borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.header}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 0.5rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      width: column.width,
                    }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className={clsx({ 'card-muted': idx % 2 === 0 })}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.header}
                      style={{ padding: '0.75rem 0.5rem', fontSize: '0.9rem' }}
                    >
                      {column.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


