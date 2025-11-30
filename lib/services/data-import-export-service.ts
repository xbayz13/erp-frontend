import { ApiClient } from './api-client';

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

export class DataImportExportService {
  constructor(private readonly apiClient: ApiClient) {}

  async exportItems(): Promise<Blob> {
    const token = (this.apiClient as any).token;
    const baseUrl = (this.apiClient as any).baseUrl;

    const response = await fetch(`${baseUrl}/system/export/items`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async exportCustomers(): Promise<Blob> {
    const token = (this.apiClient as any).token;
    const baseUrl = (this.apiClient as any).baseUrl;

    const response = await fetch(`${baseUrl}/system/export/customers`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async exportTemplate(entityType: string): Promise<Blob> {
    const token = (this.apiClient as any).token;
    const baseUrl = (this.apiClient as any).baseUrl;

    const response = await fetch(`${baseUrl}/system/export/template/${entityType}`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Template export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async importItems(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const token = (this.apiClient as any).token;
    const baseUrl = (this.apiClient as any).baseUrl;

    const response = await fetch(`${baseUrl}/system/import/items`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.statusText}`);
    }

    return response.json();
  }

  async importCustomers(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const token = (this.apiClient as any).token;
    const baseUrl = (this.apiClient as any).baseUrl;

    const response = await fetch(`${baseUrl}/system/import/customers`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.statusText}`);
    }

    return response.json();
  }
}

