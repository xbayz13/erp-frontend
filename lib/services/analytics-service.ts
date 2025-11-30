import { ApiClient } from './api-client';

export interface AnalyticsMetric {
  label: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface AnalyticsChart {
  type: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  config: Record<string, any>;
}

export interface AnalyticsDashboard {
  metrics: AnalyticsMetric[];
  charts: AnalyticsChart[];
}

export class AnalyticsService {
  constructor(private readonly apiClient: ApiClient) {}

  async getDashboardData(
    startDate?: Date,
    endDate?: Date,
  ): Promise<AnalyticsDashboard> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    const query = params.toString();
    return this.apiClient.get<AnalyticsDashboard>(
      `/system/analytics/dashboard${query ? `?${query}` : ''}`,
    );
  }
}

