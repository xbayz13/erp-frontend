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
    <main className="p-4 md:p-8 flex flex-col gap-6 bg-gray-50 dark:bg-background min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-text mb-2">Advanced Analytics Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-text-muted">Comprehensive business intelligence and analytics</p>
      </header>

      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-text-muted">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-muted text-gray-900 dark:text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-text-muted">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-muted text-gray-900 dark:text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {dashboardState.loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text-muted">Loading analytics...</p>
          </div>
        </div>
      ) : dashboardState.error ? (
        <div className="px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          {dashboardState.error}
        </div>
      ) : dashboardState.data ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboardState.data.charts.map((chart, index) => (
              <div key={index} className="card bg-white dark:bg-surface rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text mb-4 capitalize">
                  {chart.type} Chart
                </h3>
                <div className="h-64">
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
              </div>
            ))}
          </section>
        </>
      ) : null}
    </main>
  );
}

