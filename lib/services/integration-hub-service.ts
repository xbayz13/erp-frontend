import { ApiClient } from './api-client';

export interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'WEBHOOK' | 'REST_API' | 'SOAP' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  endpoint?: string;
  isActive: boolean;
  lastSyncAt?: string;
  createdAt: string;
}

export interface Webhook {
  id: string;
  url: string;
  eventType: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  retryCount: number;
  createdAt: string;
}

export class IntegrationHubService {
  constructor(private readonly apiClient: ApiClient) {}

  async createIntegration(
    name: string,
    description: string,
    type: string,
    configuration: Record<string, any>,
    endpoint?: string,
    apiKey?: string,
  ): Promise<Integration> {
    return this.apiClient.post<Integration>('/system/integrations', {
      name,
      description,
      type,
      configuration,
      endpoint,
      apiKey,
    });
  }

  async listIntegrations(): Promise<Integration[]> {
    return this.apiClient.get<Integration[]>('/system/integrations');
  }

  async getIntegration(id: string): Promise<Integration> {
    return this.apiClient.get<Integration>(`/system/integrations/${id}`);
  }

  async updateIntegration(
    id: string,
    updates: Partial<Integration>,
  ): Promise<Integration> {
    return this.apiClient.patch<Integration>(`/system/integrations/${id}`, updates);
  }

  async activateIntegration(id: string): Promise<Integration> {
    return this.apiClient.post<Integration>(`/system/integrations/${id}/activate`, {});
  }

  async deactivateIntegration(id: string): Promise<Integration> {
    return this.apiClient.post<Integration>(`/system/integrations/${id}/deactivate`, {});
  }

  async testIntegration(
    id: string,
    testPayload: Record<string, any>,
  ): Promise<{ success: boolean; statusCode?: number; response?: any; error?: string }> {
    return this.apiClient.post(`/system/integrations/${id}/test`, testPayload);
  }

  async createWebhook(
    url: string,
    eventType: string,
    secret?: string,
  ): Promise<Webhook> {
    return this.apiClient.post<Webhook>('/system/webhooks', {
      url,
      eventType,
      secret,
    });
  }

  async listWebhooks(eventType?: string): Promise<Webhook[]> {
    const params = eventType ? `?eventType=${eventType}` : '';
    return this.apiClient.get<Webhook[]>(`/system/webhooks${params}`);
  }

  async deleteWebhook(id: string): Promise<void> {
    return this.apiClient.delete(`/system/webhooks/${id}`);
  }
}

