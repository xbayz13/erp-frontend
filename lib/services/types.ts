export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'STAFF'
  | 'WAREHOUSE_MANAGER'
  | 'PURCHASING_STAFF'
  | 'FINANCE_ADMIN'
  | 'FINANCE_MANAGER'
  | 'FINANCE_STAFF'
  | 'PRODUCTION_MANAGER'
  | 'PRODUCTION_SUPERVISOR'
  | 'PRODUCTION_STAFF'
  | 'AUDITOR';

export interface AuthPayload {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: UserRole[];
  };
}

export interface OperationalSnapshot {
  inventory: {
    totalItems: number;
    lowStockItems: number;
    totalStockValue: number;
  };
  procurement: {
    openOrders: number;
    receivedOrders: number;
    avgLeadTimeDays: number;
  };
  finance: {
    totalPayables: number;
    totalPayments: number;
    cashOutflow: number;
  };
  production: {
    activeOrders: number;
    completedOrders: number;
    throughputRate: number;
  };
  generatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  description?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  warehouseId: string;
  quantityOnHand: number;
  reorderLevel: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  reference: string;
  status: string;
  totalCost: number;
  expectedDate: string;
}

export interface Invoice {
  id: string;
  purchaseOrderId: string;
  amount: number;
  status: string;
  dueDate: string;
}

export interface ProductionOrder {
  id: string;
  code: string;
  status: string;
  quantityPlanned: number;
  quantityCompleted: number;
}


