import { ApiClient } from './api-client';
import { PurchaseOrder } from './types';

export class PurchasingServiceApi {
  constructor(private readonly apiClient: ApiClient) {}

  listOrders(): Promise<PurchaseOrder[]> {
    return this.apiClient.get<PurchaseOrder[]>('/purchasing/orders');
  }

  createOrder(data: {
    supplierName: string;
    reference: string;
    expectedDate: string;
    items: Array<{
      itemId: string;
      warehouseId: string;
      quantity: number;
      unitCost: number;
    }>;
  }): Promise<PurchaseOrder> {
    return this.apiClient.post<PurchaseOrder>('/purchasing/orders', data);
  }
}


