import { ApiClient } from './api-client';
import { AuthPayload } from './types';

export class AuthService {
  constructor(private readonly apiClient: ApiClient) {}

  async login(email: string, password: string): Promise<AuthPayload> {
    const result = await this.apiClient.post<AuthPayload>('/auth/login', {
      email,
      password,
    });
    this.apiClient.setToken(result.accessToken);
    return result;
  }
}


