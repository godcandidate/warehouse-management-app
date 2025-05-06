import type { DashboardStats, Activity, InventoryItem } from '../types/index';
import { dashboardApi } from '../mock/mockApi';
import { inventoryItems } from '../mock/mockData';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await dashboardApi.getStats();
  return response.data;
};

export const getRecentActivities = async (limit = 10): Promise<Activity[]> => {
  const response = await dashboardApi.getRecentActivities(limit);
  return response.data;
};

export const getInventoryStatusCounts = async (): Promise<Record<string, number>> => {
  // Using mock data for inventory status counts
  return {
    'in-stock': 3,
    'low-stock': 2,
    'out-of-stock': 1
  };
};

export const getProcurementStatusCounts = async (): Promise<Record<string, number>> => {
  // Using mock data for procurement status counts
  return {
    'pending': 1,
    'approved': 1,
    'delivered': 1
  };
};

export const getShipmentStatusCounts = async (): Promise<Record<string, number>> => {
  // Using mock data for shipment status counts
  return {
    'pending': 1,
    'in-transit': 1,
    'delivered': 1
  };
};

interface TopSellingItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  totalSales: number;
}

export const getTopSellingItems = async (limit = 5): Promise<TopSellingItem[]> => {
  // Mock top selling items
  return [
    { id: '1', name: 'Laptop', sku: 'ELEC-001', quantity: 15, totalSales: 18000 },
    { id: '3', name: 'Printer', sku: 'ELEC-002', quantity: 8, totalSales: 2800 },
    { id: '2', name: 'Office Chair', sku: 'FURN-001', quantity: 12, totalSales: 3000 },
    { id: '5', name: 'Packing Tape', sku: 'PACK-001', quantity: 30, totalSales: 135 },
    { id: '6', name: 'Screwdriver Set', sku: 'TOOL-001', quantity: 5, totalSales: 125 }
  ].slice(0, limit);
};

export const getLowStockItems = async (limit = 5): Promise<InventoryItem[]> => {
  // Get items with low stock from mock data
  return inventoryItems
    .filter(item => item.status === 'low-stock' || item.status === 'out-of-stock')
    .slice(0, limit);
};
