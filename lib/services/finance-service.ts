import { ApiClient } from './api-client';
import { Invoice } from './types';

export class FinanceServiceApi {
  constructor(private readonly apiClient: ApiClient) {}

  listInvoices(): Promise<Invoice[]> {
    return this.apiClient.get<Invoice[]>('/finance/invoices');
  }

  listTransactions() {
    return this.apiClient.get('/finance/transactions');
  }

  recordTransaction(data: {
    type: 'EXPENSE' | 'REVENUE' | 'PAYMENT';
    amount: number;
    currency: string;
    description: string;
    reference?: string;
    relatedEntityId?: string;
  }) {
    return this.apiClient.post('/finance/transactions', data);
  }

  issueInvoice(data: {
    purchaseOrderId: string;
    amount: number;
    currency: string;
    dueDate: string;
    notes?: string;
  }): Promise<Invoice> {
    return this.apiClient.post<Invoice>('/finance/invoices', data);
  }
}


