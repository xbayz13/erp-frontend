import { ApiClient } from './api-client';
import { ProductionOrder } from './types';

export class ProductionServiceApi {
  constructor(private readonly apiClient: ApiClient) {}

  listOrders(): Promise<ProductionOrder[]> {
    return this.apiClient.get<ProductionOrder[]>('/production/orders');
  }

  createOrder(data: {
    code: string;
    productItemId: string;
    quantityPlanned: number;
    scheduledStart: string;
    scheduledEnd: string;
    supervisorId: string;
    outputWarehouseId: string;
    materials: Array<{
      itemId: string;
      warehouseId: string;
      quantity: number;
    }>;
    notes?: string;
  }): Promise<ProductionOrder> {
    return this.apiClient.post<ProductionOrder>('/production/orders', data);
  }
}


