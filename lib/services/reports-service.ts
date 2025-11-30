import { ApiClient } from './api-client';
import { OperationalSnapshot } from './types';

export class ReportsService {
  constructor(private readonly apiClient: ApiClient) {}

  getOperationalSnapshot(): Promise<OperationalSnapshot> {
    return this.apiClient.get<OperationalSnapshot>('/reports/snapshot');
  }

  listAuditLogs() {
    return this.apiClient.get('/reports/audit');
  }
}


