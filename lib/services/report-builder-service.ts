import { ApiClient } from './api-client';

export interface ReportColumn {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
}

export interface ReportDefinition {
  name: string;
  entity: string;
  columns: ReportColumn[];
  filters?: ReportFilter[];
  groupBy?: string[];
  orderBy?: Array<{ field: string; direction: 'ASC' | 'DESC' }>;
  limit?: number;
}

export class ReportBuilderService {
  constructor(private readonly apiClient: ApiClient) {}

  async buildReport(definition: ReportDefinition): Promise<any[]> {
    return this.apiClient.post<any[]>('/system/reports/build', definition);
  }

  async getAvailableEntities(): Promise<string[]> {
    return this.apiClient.get<string[]>('/system/reports/entities');
  }

  async getAvailableFields(entity: string): Promise<Array<{ field: string; type: string }>> {
    return this.apiClient.get<Array<{ field: string; type: string }>>(
      `/system/reports/fields/${entity}`,
    );
  }
}

