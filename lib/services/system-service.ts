import { ApiClient } from './api-client';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
}

export interface Document {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  type: string;
  entityType?: string;
  entityId?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  isActive: boolean;
  lastActivityAt: string;
  createdAt: string;
}

export interface TwoFactorAuthStatus {
  isEnabled: boolean;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
}

export class SystemService {
  constructor(private readonly apiClient: ApiClient) {}

  // Notification methods
  async listNotifications(status?: 'UNREAD' | 'READ'): Promise<Notification[]> {
    const params = status ? `?status=${status}` : '';
    return this.apiClient.get<Notification[]>(`/system/notifications${params}`);
  }

  async getUnreadCount(): Promise<{ count: number }> {
    return this.apiClient.get<{ count: number }>('/system/notifications/unread-count');
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.apiClient.patch(`/system/notifications/${notificationId}/read`, {});
  }

  // Document methods
  async uploadDocument(
    file: File,
    type: string,
    entityType?: string,
    entityId?: string,
    description?: string,
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (entityType) formData.append('entityType', entityType);
    if (entityId) formData.append('entityId', entityId);
    if (description) formData.append('description', description);

    const token = (this.apiClient as any).token;
    const baseUrl = (this.apiClient as any).baseUrl;

    const response = await fetch(`${baseUrl}/system/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async listDocuments(
    type?: string,
    entityType?: string,
    entityId?: string,
  ): Promise<Document[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId);

    const query = params.toString();
    return this.apiClient.get<Document[]>(
      `/system/documents${query ? `?${query}` : ''}`,
    );
  }

  async deleteDocument(documentId: string): Promise<void> {
    return this.apiClient.delete(`/system/documents/${documentId}`);
  }

  // Session methods
  async listSessions(): Promise<UserSession[]> {
    return this.apiClient.get<UserSession[]>('/system/sessions');
  }

  async revokeSession(sessionId: string): Promise<void> {
    return this.apiClient.delete(`/system/sessions/${sessionId}`);
  }

  async revokeAllSessions(): Promise<void> {
    return this.apiClient.delete('/system/sessions/all');
  }

  // 2FA methods
  async generate2FA(): Promise<{ secret: string; qrCode: string }> {
    return this.apiClient.post<{ secret: string; qrCode: string }>(
      '/system/2fa/generate',
      {},
    );
  }

  async enable2FA(token: string): Promise<TwoFactorAuthStatus> {
    return this.apiClient.post<TwoFactorAuthStatus>('/system/2fa/enable', {
      token,
    });
  }

  async disable2FA(): Promise<void> {
    return this.apiClient.post('/system/2fa/disable', {});
  }

  async get2FAStatus(): Promise<TwoFactorAuthStatus> {
    return this.apiClient.get<TwoFactorAuthStatus>('/system/2fa/status');
  }

  // Activity log methods
  async getRecentActivity(limit: number = 50): Promise<any[]> {
    return this.apiClient.get<any[]>(`/system/activity?limit=${limit}`);
  }

  async getUserActivity(userId: string): Promise<any[]> {
    return this.apiClient.get<any[]>(`/system/activity/user/${userId}`);
  }
}

