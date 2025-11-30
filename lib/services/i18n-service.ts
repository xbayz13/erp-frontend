import { ApiClient } from './api-client';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
}

export class I18nService {
  constructor(private readonly apiClient: ApiClient) {}

  async getAvailableLanguages(): Promise<Language[]> {
    return this.apiClient.get<Language[]>('/system/i18n/languages');
  }

  async translate(key: string, languageCode: string = 'en'): Promise<string> {
    const result = await this.apiClient.get<{ key: string; translation: string }>(
      `/system/i18n/translate/${key}?lang=${languageCode}`,
    );
    return result.translation;
  }

  async getAllTranslations(languageCode: string): Promise<Record<string, string>> {
    return this.apiClient.get<Record<string, string>>(
      `/system/i18n/translations/${languageCode}`,
    );
  }

  async addTranslation(
    languageCode: string,
    key: string,
    value: string,
  ): Promise<void> {
    return this.apiClient.post(`/system/i18n/translations/${languageCode}`, {
      key,
      value,
    });
  }
}

