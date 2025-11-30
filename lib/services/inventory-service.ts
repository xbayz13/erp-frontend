import { ApiClient } from './api-client';
import { InventoryItem, Warehouse } from './types';

export class InventoryServiceApi {
  constructor(private readonly apiClient: ApiClient) {}

  listItems(): Promise<InventoryItem[]> {
    return this.apiClient.get<InventoryItem[]>('/inventory/items');
  }

  createItem(data: {
    sku: string;
    name: string;
    description?: string;
    warehouseId: string;
    quantityOnHand: number;
    reorderLevel: number;
    unitCost: number;
  }): Promise<InventoryItem> {
    return this.apiClient.post<InventoryItem>('/inventory/items', data);
  }

  updateItem(id: string, data: {
    name?: string;
    description?: string;
    warehouseId?: string;
    quantityOnHand?: number;
    reorderLevel?: number;
    unitCost?: number;
  }): Promise<InventoryItem> {
    return this.apiClient.patch<InventoryItem>(`/inventory/items/${id}`, data);
  }

  listWarehouses(): Promise<Warehouse[]> {
    return this.apiClient.get<Warehouse[]>('/inventory/warehouses');
  }

  listMovements() {
    return this.apiClient.get('/inventory/movements');
  }
}


