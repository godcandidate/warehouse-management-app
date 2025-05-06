import type { Supplier, PurchaseOrder, PaginatedResponse } from '../types/index';
import { procurementApi } from '../mock/mockApi';

// Suppliers
export const getSuppliers = async (
  page = 1,
  limit = 10,
  search = '',
  status = ''
): Promise<PaginatedResponse<Supplier>> => {
  // Note: search and status parameters would be used for filtering in a real API
  // Using mock API instead of real API call
  const response = await procurementApi.getSuppliers();
  
  // Convert to paginated response format
  return {
    data: response.data,
    total: response.data.length,
    page,
    limit,
    totalPages: Math.ceil(response.data.length / limit)
  };
};

export const getSupplierById = async (id: string): Promise<Supplier> => {
  // Using mock API instead of real API call
  const response = await procurementApi.getSupplierById(id);
  if (!response.data) {
    throw new Error(`Supplier with ID ${id} not found`);
  }
  return response.data;
};

export const createSupplier = async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
  // Using mock API instead of real API call
  const response = await procurementApi.createSupplier(supplier);
  return response.data;
};

export const updateSupplier = async (
  id: string,
  supplier: Partial<Supplier>
): Promise<Supplier> => {
  // Using mock API instead of real API call
  const response = await procurementApi.updateSupplier(id, supplier);
  return response.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  // Using mock data - in a real app this would delete from the database
  // Note: id parameter would be used to delete the supplier in a real API
  return Promise.resolve();
};

// Purchase Orders
export const getPurchaseOrders = async (
  page = 1,
  limit = 10,
  search = '',
  status = '',
  supplierId = ''
): Promise<PaginatedResponse<PurchaseOrder>> => {
  // Using mock API instead of real API call
  const response = await procurementApi.getPurchaseOrders({
    search: search || null,
    status: status || null,
    supplierId: supplierId || null
  });
  
  // Convert to paginated response format
  return {
    data: response.data.orders,
    total: response.data.total,
    page,
    limit,
    totalPages: Math.ceil(response.data.total / limit)
  };
};

export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrder> => {
  // Using mock API instead of real API call
  const response = await procurementApi.getPurchaseOrderById(id);
  if (!response.data) {
    throw new Error(`Purchase order with ID ${id} not found`);
  }
  return response.data;
};

export const createPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
  // Using mock API instead of real API call
  const response = await procurementApi.createPurchaseOrder(order);
  return response.data;
};

export const updatePurchaseOrder = async (
  id: string,
  order: Partial<PurchaseOrder>
): Promise<PurchaseOrder> => {
  // Using mock API instead of real API call
  const response = await procurementApi.updatePurchaseOrder(id, order);
  return response.data;
};

export const deletePurchaseOrder = async (id: string): Promise<void> => {
  // Using mock data - in a real app this would delete from the database
  // Note: id parameter would be used to delete the purchase order in a real API
  return Promise.resolve();
};

// Purchase Order Status Management
export const approvePurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  // Using mock data - find the purchase order and update its status
  const purchaseOrder = await getPurchaseOrderById(id);
  const updatedOrder = { ...purchaseOrder, status: 'approved' as const };
  return updatedOrder;
};

export const cancelPurchaseOrder = async (id: string, reason: string): Promise<PurchaseOrder> => {
  // Using mock data - find the purchase order and update its status
  // Note: reason parameter would be used in a real API
  const purchaseOrder = await getPurchaseOrderById(id);
  const updatedOrder = { ...purchaseOrder, status: 'cancelled' as const };
  return updatedOrder;
};

export const markPurchaseOrderAsDelivered = async (
  id: string,
  deliveryNotes: string
): Promise<PurchaseOrder> => {
  // Using mock data - find the purchase order and update its status
  // Note: deliveryNotes parameter would be used in a real API
  const purchaseOrder = await getPurchaseOrderById(id);
  const updatedOrder = { ...purchaseOrder, status: 'delivered' as const };
  return updatedOrder;
};
