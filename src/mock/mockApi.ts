import { 
  users, 
  categories, 
  inventoryItems, 
  suppliers, 
  purchaseOrders, 
  shipments, 
  reports, 
  activities, 
  dashboardStats,
  mockReportData
} from './mockData';
import type { InventoryItem, Supplier, PurchaseOrder, Shipment, Report } from '../types/index';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic response wrapper
const apiResponse = <T>(data: T, success = true, message = 'Operation successful') => {
  return { data, success, message };
};

// Authentication API
export const authApi = {
  login: async (email: string, _password: string) => {
    await delay(500); // Simulate network delay
    
    // In a mock environment, accept any credentials
    // In a real app, we would validate credentials against the backend
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users[0];
    
    // Generate a mock JWT token (in a real app, this would come from the server)
    const token = `mock-jwt-token-${Date.now()}`;
    
    return apiResponse({
      user,
      token
    });
  },
  
  logout: async () => {
    await delay(300);
    return apiResponse({ success: true });
  },
  
  refreshToken: async () => {
    await delay(300);
    // Generate a new mock token
    const token = `mock-jwt-token-${Date.now()}`;
    return apiResponse(token);
  },
  
  getCurrentUser: async () => {
    await delay(300);
    // Just return the admin user for simplicity
    return apiResponse(users[0]);
  }
};

// Inventory API
export const inventoryApi = {
  getItems: async (filters?: Record<string, string | number | boolean | null>) => {
    await delay(500);
    
    let filteredItems = [...inventoryItems];
    
    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        filteredItems = filteredItems.filter(item => 
          item.category.toLowerCase() === String(filters.category).toLowerCase()
        );
      }
      
      if (filters.status) {
        filteredItems = filteredItems.filter(item => 
          item.status === filters.status
        );
      }
      
      if (filters.search) {
        const searchTerm = String(filters.search).toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.name.toLowerCase().includes(searchTerm) || 
          item.sku.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return apiResponse({
      items: filteredItems,
      total: filteredItems.length
    });
  },
  
  getItemById: async (id: string) => {
    await delay(300);
    const item = inventoryItems.find(item => item.id === id);
    
    if (!item) {
      return apiResponse(null, false, 'Item not found');
    }
    
    return apiResponse(item);
  },
  
  createItem: async (itemData: Partial<InventoryItem>) => {
    await delay(700);
    
    const newItem: InventoryItem = {
      id: `${inventoryItems.length + 1}`,
      name: itemData.name || 'New Item',
      sku: itemData.sku || `ITEM-${Date.now()}`,
      category: itemData.category || 'Uncategorized',
      description: itemData.description || '',
      quantity: itemData.quantity || 0,
      unitPrice: itemData.unitPrice || 0,
      location: itemData.location || '',
      threshold: itemData.threshold || 10,
      lastUpdated: new Date().toISOString(),
      status: itemData.quantity && itemData.quantity > 0 ? 
        (itemData.quantity <= (itemData.threshold || 10) ? 'low-stock' : 'in-stock') : 
        'out-of-stock'
    };
    
    // In a real app, this would be saved to the database
    // For our mock, we'll just return the new item
    return apiResponse(newItem);
  },
  
  updateItem: async (id: string, itemData: Partial<InventoryItem>) => {
    await delay(500);
    
    const itemIndex = inventoryItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return apiResponse(null, false, 'Item not found');
    }
    
    // In a real app, this would update the database
    // For our mock, we'll just return the updated item
    const updatedItem = {
      ...inventoryItems[itemIndex],
      ...itemData,
      lastUpdated: new Date().toISOString()
    };
    
    return apiResponse(updatedItem);
  },
  
  deleteItem: async (id: string) => {
    await delay(400);
    
    const itemIndex = inventoryItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return apiResponse(null, false, 'Item not found');
    }
    
    // In a real app, this would delete from the database
    return apiResponse({ success: true });
  },
  
  getCategories: async () => {
    await delay(300);
    return apiResponse(categories);
  }
};

// Procurement API
export const procurementApi = {
  getSuppliers: async () => {
    await delay(400);
    return apiResponse(suppliers);
  },
  
  getSupplierById: async (id: string) => {
    await delay(300);
    const supplier = suppliers.find(supplier => supplier.id === id);
    
    if (!supplier) {
      return apiResponse(null, false, 'Supplier not found');
    }
    
    return apiResponse(supplier);
  },
  
  createSupplier: async (supplierData: Partial<Supplier>) => {
    await delay(600);
    
    const newSupplier: Supplier = {
      id: `${suppliers.length + 1}`,
      name: supplierData.name || 'New Supplier',
      contactPerson: supplierData.contactPerson || '',
      email: supplierData.email || '',
      phone: supplierData.phone || '',
      address: supplierData.address || '',
      status: supplierData.status || 'active'
    };
    
    return apiResponse(newSupplier);
  },
  
  updateSupplier: async (id: string, supplierData: Partial<Supplier>) => {
    await delay(500);
    
    const supplierIndex = suppliers.findIndex(supplier => supplier.id === id);
    
    if (supplierIndex === -1) {
      return apiResponse(null, false, 'Supplier not found');
    }
    
    const updatedSupplier = {
      ...suppliers[supplierIndex],
      ...supplierData
    };
    
    return apiResponse(updatedSupplier);
  },
  
  getPurchaseOrders: async (filters?: Record<string, string | number | boolean | null>) => {
    await delay(500);
    
    let filteredOrders = [...purchaseOrders];
    
    // Apply filters if provided
    if (filters) {
      if (filters.supplierId) {
        filteredOrders = filteredOrders.filter(order => 
          order.supplierId === filters.supplierId
        );
      }
      
      if (filters.status) {
        filteredOrders = filteredOrders.filter(order => 
          order.status === filters.status
        );
      }
      
      if (filters.search) {
        const searchTerm = String(filters.search).toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.supplierName.toLowerCase().includes(searchTerm) || 
          order.id.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return apiResponse({
      orders: filteredOrders,
      total: filteredOrders.length
    });
  },
  
  getPurchaseOrderById: async (id: string) => {
    await delay(300);
    const order = purchaseOrders.find(order => order.id === id);
    
    if (!order) {
      return apiResponse(null, false, 'Purchase order not found');
    }
    
    return apiResponse(order);
  },
  
  createPurchaseOrder: async (orderData: Partial<PurchaseOrder>) => {
    await delay(700);
    
    const newOrder: PurchaseOrder = {
      id: `${purchaseOrders.length + 1}`,
      supplierId: orderData.supplierId || '1',
      supplierName: orderData.supplierName || suppliers.find(s => s.id === orderData.supplierId)?.name || 'Unknown Supplier',
      orderDate: orderData.orderDate || new Date().toISOString(),
      expectedDeliveryDate: orderData.expectedDeliveryDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: orderData.status || 'pending',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || orderData.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0
    };
    
    return apiResponse(newOrder);
  },
  
  updatePurchaseOrder: async (id: string, orderData: Partial<PurchaseOrder>) => {
    await delay(500);
    
    const orderIndex = purchaseOrders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      return apiResponse(null, false, 'Purchase order not found');
    }
    
    const updatedOrder = {
      ...purchaseOrders[orderIndex],
      ...orderData,
      // Recalculate total if items changed
      totalAmount: orderData.items 
        ? orderData.items.reduce((sum, item) => sum + item.totalPrice, 0) 
        : orderData.totalAmount || purchaseOrders[orderIndex].totalAmount
    };
    
    return apiResponse(updatedOrder);
  }
};

// Shipment API
export const shipmentApi = {
  getShipments: async (filters?: Record<string, string | number | boolean | null>) => {
    await delay(500);
    
    let filteredShipments = [...shipments];
    
    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        filteredShipments = filteredShipments.filter(shipment => 
          shipment.status === filters.status
        );
      }
      
      if (filters.search) {
        const searchTerm = String(filters.search).toLowerCase();
        filteredShipments = filteredShipments.filter(shipment => 
          shipment.referenceNumber.toLowerCase().includes(searchTerm) || 
          shipment.origin.toLowerCase().includes(searchTerm) ||
          shipment.destination.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return apiResponse({
      shipments: filteredShipments,
      total: filteredShipments.length
    });
  },
  
  getShipmentById: async (id: string) => {
    await delay(300);
    const shipment = shipments.find(shipment => shipment.id === id);
    
    if (!shipment) {
      return apiResponse(null, false, 'Shipment not found');
    }
    
    return apiResponse(shipment);
  },
  
  createShipment: async (shipmentData: Partial<Shipment>) => {
    await delay(700);
    
    const newShipment: Shipment = {
      id: `${shipments.length + 1}`,
      referenceNumber: shipmentData.referenceNumber || `SHIP-${Date.now().toString().slice(-6)}`,
      origin: shipmentData.origin || 'Warehouse A',
      destination: shipmentData.destination || 'Unknown',
      shipmentDate: shipmentData.shipmentDate || new Date().toISOString(),
      expectedArrivalDate: shipmentData.expectedArrivalDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: shipmentData.status || 'pending',
      items: shipmentData.items || []
    };
    
    return apiResponse(newShipment);
  },
  
  updateShipment: async (id: string, shipmentData: Partial<Shipment>) => {
    await delay(500);
    
    const shipmentIndex = shipments.findIndex(shipment => shipment.id === id);
    
    if (shipmentIndex === -1) {
      return apiResponse(null, false, 'Shipment not found');
    }
    
    const updatedShipment = {
      ...shipments[shipmentIndex],
      ...shipmentData
    };
    
    return apiResponse(updatedShipment);
  }
};

// Report API
export const reportApi = {
  getReports: async () => {
    await delay(400);
    return apiResponse(reports);
  },
  
  getReportById: async (id: string) => {
    await delay(300);
    const report = reports.find(report => report.id === id);
    
    if (!report) {
      return apiResponse(null, false, 'Report not found');
    }
    
    return apiResponse(report);
  },
  
  generateReport: async (reportType: string, _parameters: Record<string, string | number | boolean | string[] | number[] | null>) => {
    await delay(1000); // Simulate longer processing time for report generation
    
    // In a real app, this would generate a report based on actual data
    // For our mock, we'll return pre-defined data based on the report type
    switch (reportType) {
      case 'inventory':
        return apiResponse(mockReportData.inventory);
      case 'procurement':
        return apiResponse(mockReportData.procurement);
      case 'shipment':
        return apiResponse(mockReportData.shipment);
      default:
        return apiResponse({
          summary: 'Custom report generated successfully',
          data: []
        });
    }
  },
  
  saveReport: async (reportData: Partial<Report>) => {
    await delay(500);
    
    const newReport: Report = {
      id: `${reports.length + 1}`,
      name: reportData.name || 'New Report',
      type: reportData.type || 'custom',
      createdAt: new Date().toISOString(),
      createdBy: reportData.createdBy || 'Current User',
      parameters: reportData.parameters || {}
    };
    
    return apiResponse(newReport);
  }
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    await delay(500);
    return apiResponse(dashboardStats);
  },
  
  getRecentActivities: async (limit = 5) => {
    await delay(300);
    const recentActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return apiResponse(recentActivities);
  }
};

// Export all APIs
export const mockApi = {
  auth: authApi,
  inventory: inventoryApi,
  procurement: procurementApi,
  shipment: shipmentApi,
  report: reportApi,
  dashboard: dashboardApi
};
