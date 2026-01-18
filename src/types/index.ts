export type Role = 'admin' | 'shipper' | 'user';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CREATED' | 'DELIVERED_STAGE1' | 'DELIVERED_STAGE2';
export type OrderStage = 'PICKUP' | 'WAREHOUSE' | 'SHIPPING' | 'DELIVERED' | number;

export interface User {
  uid: string;
  name: string;
  role: Role;
  status?: 'free' | 'busy';
  bonus?: number;
  currentOrder?: string | null;
  email?: string;
  locked?: boolean;
  type?: 1 | 2 | 3;
  phone?: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  productName: string;
  quantity: number;
  fromWarehouse: string;
  toWarehouse: string;
  currentStage: OrderStage;
  status: OrderStatus;
  assignedShipperId?: string | null;
  shipperId?: string | null; 
  shipperName?: string | null;
  note?: string;
  
  stage1Shipper?: string | null;
  shipper1?: string | null; 
  stage1ShipperId?: string | null; 
  shipperStage1?: string | null;
  shipperStage1Confirmed?: boolean;

  stage2Shipper?: string | null;
  shipper2?: string | null; 
  stage2ShipperId?: string | null; 
  shipperStage2?: string | null;
  shipperStage2Confirmed?: boolean;

  stage3Shipper?: string | null;
  shipper3?: string | null; 
  stage3ShipperId?: string | null;
  shipperStage3?: string | null;
  shipperStage3Confirmed?: boolean;

  qrCode?: string;
  timestamp: any;
  userId: string;
}

export interface QRScanner {
  id: string;
  status: 'active' | 'inactive';
  zone: string;
  lastScanned?: any;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  warehouse: string;
  zone: string;
  unit: string;
  lastUpdated?: any;
}
