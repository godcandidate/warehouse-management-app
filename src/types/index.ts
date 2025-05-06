// Authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Inventory types
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  location: string;
  threshold: number;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

// Purchase Order types
export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
}

export interface PurchaseOrderItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Shipment types
export interface Shipment {
  id: string;
  referenceNumber: string;
  origin: string;
  destination: string;
  shipmentDate: string;
  expectedArrivalDate: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  items: ShipmentItem[];
}

export interface ShipmentItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
}

// Shipment types
export interface ShipmentItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface Shipment {
  id: string;
  referenceNumber: string;
  origin: string;
  destination: string;
  shipmentDate: string;
  expectedArrivalDate: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  items: ShipmentItem[];
}

// Report types
export interface Report {
  id: string;
  name: string;
  type: 'inventory' | 'procurement' | 'shipment' | 'custom';
  createdAt: string;
  createdBy: string;
  parameters: Record<string, string | number | boolean | string[] | number[] | null>;
}

// Dashboard types
export interface DashboardStats {
  totalInventoryItems: number;
  lowStockItems: number;
  pendingOrders: number;
  activeShipments: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'inventory' | 'procurement' | 'shipment';
  action: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Theme types
export type ThemeMode = 'light' | 'dark';
