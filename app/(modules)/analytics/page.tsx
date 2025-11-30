'use client';

import { useEffect, useState } from 'react';
import { useAsyncData } from '../../../lib/services/hooks';
import { analyticsService } from '../../../lib/services/service-registry';
import { AnalyticsDashboard, AnalyticsMetric } from '../../../lib/services/analytics-service';
import { KpiCard } from '../../../components/KpiCard';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../../../lib/chart';

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const dashboardState = useAsyncData<AnalyticsDashboard>(
    () => {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return analyticsService.getDashboardData(start, end);
    },
    [startDate, endDate],
  );

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  const formatMetric = (metric: AnalyticsMetric) => {
    // Handle null/undefined values
    if (metric.value === null || metric.value === undefined) {
      return 'Rp 0';
    }
    
    const value = Number(metric.value);
    if (isNaN(value)) {
      return 'Rp 0';
    }
    
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(2)}K`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  return (
    <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header>
        <h1>Advanced Analytics Dashboard</h1>
        <p className="kpi-label">Comprehensive business intelligence and analytics</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'var(--text)',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {dashboardState.loading ? (
        <p className="kpi-label">Loading analytics...</p>
      ) : dashboardState.error ? (
        <span className="status-pill" data-variant="danger">
          {dashboardState.error}
        </span>
      ) : dashboardState.data ? (
        <>
          <section
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
          >
            {dashboardState.data.metrics.map((metric) => (
              <KpiCard
                key={metric.label}
                label={metric.label}
                value={formatMetric(metric)}
                trend={
                  metric.changePercentage !== undefined && 
                  metric.changePercentage !== null &&
                  !isNaN(metric.changePercentage)
                    ? `${metric.changePercentage > 0 ? '+' : ''}${metric.changePercentage.toFixed(1)}%`
                    : undefined
                }
                variant={
                  metric.trend === 'up'
                    ? 'success'
                    : metric.trend === 'down'
                    ? 'danger'
                    : undefined
                }
              />
            ))}
          </section>

          <section
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}
          >
            {dashboardState.data.charts.map((chart, index) => (
              <div key={index} className="card">
                <h3 style={{ marginBottom: '0.5rem' }}>{chart.type} Chart</h3>
                {chart.type === 'line' && (
                  <Line data={chart.data} options={chart.config} />
                )}
                {chart.type === 'bar' && (
                  <Bar data={chart.data} options={chart.config} />
                )}
                {chart.type === 'doughnut' && (
                  <Doughnut data={chart.data} options={chart.config} />
                )}
              </div>
            ))}
          </section>
        </>
      ) : null}
    </main>
  );
}

