import type { User, InventoryItem, Category, Supplier, PurchaseOrder, Shipment, Report, Activity } from '../types/index';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@example.com',
    role: 'manager',
    firstName: 'Manager',
    lastName: 'User'
  },
  {
    id: '3',
    username: 'staff',
    email: 'staff@example.com',
    role: 'staff',
    firstName: 'Staff',
    lastName: 'User'
  }
];

// Mock Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and components'
  },
  {
    id: '2',
    name: 'Office Supplies',
    description: 'Office stationery and supplies'
  },
  {
    id: '3',
    name: 'Furniture',
    description: 'Office and warehouse furniture'
  },
  {
    id: '4',
    name: 'Tools',
    description: 'Hand tools and power tools'
  },
  {
    id: '5',
    name: 'Packaging',
    description: 'Packaging materials and supplies'
  }
];

// Mock Inventory Items
export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop',
    sku: 'ELEC-001',
    category: 'Electronics',
    description: 'Business laptop with 16GB RAM, 512GB SSD',
    quantity: 25,
    unitPrice: 1200,
    location: 'Warehouse A, Shelf 1',
    threshold: 10,
    lastUpdated: new Date(2025, 4, 1).toISOString(),
    status: 'in-stock'
  },
  {
    id: '2',
    name: 'Office Chair',
    sku: 'FURN-001',
    category: 'Furniture',
    description: 'Ergonomic office chair with adjustable height',
    quantity: 8,
    unitPrice: 250,
    location: 'Warehouse B, Shelf 3',
    threshold: 10,
    lastUpdated: new Date(2025, 4, 2).toISOString(),
    status: 'low-stock'
  },
  {
    id: '3',
    name: 'Printer',
    sku: 'ELEC-002',
    category: 'Electronics',
    description: 'Color laser printer',
    quantity: 12,
    unitPrice: 350,
    location: 'Warehouse A, Shelf 2',
    threshold: 5,
    lastUpdated: new Date(2025, 4, 3).toISOString(),
    status: 'in-stock'
  },
  {
    id: '4',
    name: 'Paper Clips',
    sku: 'OFSP-001',
    category: 'Office Supplies',
    description: 'Box of 100 paper clips',
    quantity: 0,
    unitPrice: 2.5,
    location: 'Warehouse A, Shelf 5',
    threshold: 20,
    lastUpdated: new Date(2025, 4, 4).toISOString(),
    status: 'out-of-stock'
  },
  {
    id: '5',
    name: 'Packing Tape',
    sku: 'PACK-001',
    category: 'Packaging',
    description: 'Heavy duty packing tape, 50m roll',
    quantity: 35,
    unitPrice: 4.5,
    location: 'Warehouse C, Shelf 1',
    threshold: 15,
    lastUpdated: new Date(2025, 4, 5).toISOString(),
    status: 'in-stock'
  },
  {
    id: '6',
    name: 'Screwdriver Set',
    sku: 'TOOL-001',
    category: 'Tools',
    description: 'Set of 10 precision screwdrivers',
    quantity: 7,
    unitPrice: 25,
    location: 'Warehouse B, Shelf 4',
    threshold: 8,
    lastUpdated: new Date(2025, 4, 5).toISOString(),
    status: 'low-stock'
  }
];

// Mock Suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '555-123-4567',
    address: '123 Tech Blvd, Silicon Valley, CA',
    status: 'active'
  },
  {
    id: '2',
    name: 'Office Depot',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@officedepot.com',
    phone: '555-987-6543',
    address: '456 Office Way, Business Park, NY',
    status: 'active'
  },
  {
    id: '3',
    name: 'Furniture World',
    contactPerson: 'Michael Brown',
    email: 'michael@furnitureworld.com',
    phone: '555-456-7890',
    address: '789 Furniture Ave, Design District, MI',
    status: 'active'
  },
  {
    id: '4',
    name: 'Tool Masters',
    contactPerson: 'David Wilson',
    email: 'david@toolmasters.com',
    phone: '555-234-5678',
    address: '321 Tool St, Industrial Zone, TX',
    status: 'inactive'
  }
];

// Mock Purchase Orders
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    supplierId: '1',
    supplierName: 'Tech Solutions Inc.',
    orderDate: new Date(2025, 4, 1).toISOString(),
    expectedDeliveryDate: new Date(2025, 4, 15).toISOString(),
    status: 'pending',
    items: [
      {
        id: '1',
        itemId: '1',
        itemName: 'Laptop',
        quantity: 5,
        unitPrice: 1200,
        totalPrice: 6000
      },
      {
        id: '2',
        itemId: '3',
        itemName: 'Printer',
        quantity: 2,
        unitPrice: 350,
        totalPrice: 700
      }
    ],
    totalAmount: 6700
  },
  {
    id: '2',
    supplierId: '2',
    supplierName: 'Office Depot',
    orderDate: new Date(2025, 4, 2).toISOString(),
    expectedDeliveryDate: new Date(2025, 4, 10).toISOString(),
    status: 'approved',
    items: [
      {
        id: '1',
        itemId: '4',
        itemName: 'Paper Clips',
        quantity: 50,
        unitPrice: 2.5,
        totalPrice: 125
      }
    ],
    totalAmount: 125
  },
  {
    id: '3',
    supplierId: '3',
    supplierName: 'Furniture World',
    orderDate: new Date(2025, 4, 3).toISOString(),
    expectedDeliveryDate: new Date(2025, 4, 20).toISOString(),
    status: 'delivered',
    items: [
      {
        id: '1',
        itemId: '2',
        itemName: 'Office Chair',
        quantity: 10,
        unitPrice: 250,
        totalPrice: 2500
      }
    ],
    totalAmount: 2500
  }
];

// Mock Shipments
export const shipments: Shipment[] = [
  {
    id: '1',
    referenceNumber: 'SHIP-001',
    origin: 'Warehouse A',
    destination: 'Customer HQ, New York',
    shipmentDate: new Date(2025, 4, 5).toISOString(),
    expectedArrivalDate: new Date(2025, 4, 10).toISOString(),
    status: 'in-transit',
    items: [
      {
        id: '1',
        itemId: '1',
        itemName: 'Laptop',
        quantity: 2
      },
      {
        id: '2',
        itemId: '3',
        itemName: 'Printer',
        quantity: 1
      }
    ]
  },
  {
    id: '2',
    referenceNumber: 'SHIP-002',
    origin: 'Warehouse B',
    destination: 'Branch Office, Chicago',
    shipmentDate: new Date(2025, 4, 3).toISOString(),
    expectedArrivalDate: new Date(2025, 4, 8).toISOString(),
    status: 'delivered',
    items: [
      {
        id: '1',
        itemId: '2',
        itemName: 'Office Chair',
        quantity: 5
      }
    ]
  },
  {
    id: '3',
    referenceNumber: 'SHIP-003',
    origin: 'Warehouse C',
    destination: 'Retail Store, Los Angeles',
    shipmentDate: new Date(2025, 4, 7).toISOString(),
    expectedArrivalDate: new Date(2025, 4, 12).toISOString(),
    status: 'pending',
    items: [
      {
        id: '1',
        itemId: '5',
        itemName: 'Packing Tape',
        quantity: 20
      }
    ]
  }
];

// Mock Activities
export const activities: Activity[] = [
  {
    id: '1',
    type: 'inventory',
    action: 'Item Added',
    description: 'Added 10 new laptops to inventory',
    timestamp: new Date(2025, 4, 1, 9, 30).toISOString(),
    userId: '1',
    userName: 'Admin User'
  },
  {
    id: '2',
    type: 'procurement',
    action: 'Order Created',
    description: 'Created new purchase order for Office Depot',
    timestamp: new Date(2025, 4, 2, 11, 45).toISOString(),
    userId: '2',
    userName: 'Manager User'
  },
  {
    id: '3',
    type: 'shipment',
    action: 'Shipment Sent',
    description: 'Shipment SHIP-001 sent to Customer HQ',
    timestamp: new Date(2025, 4, 5, 14, 15).toISOString(),
    userId: '3',
    userName: 'Staff User'
  },
  {
    id: '4',
    type: 'inventory',
    action: 'Stock Updated',
    description: 'Updated stock levels after inventory check',
    timestamp: new Date(2025, 4, 4, 16, 0).toISOString(),
    userId: '1',
    userName: 'Admin User'
  },
  {
    id: '5',
    type: 'procurement',
    action: 'Order Received',
    description: 'Received order from Furniture World',
    timestamp: new Date(2025, 4, 3, 10, 30).toISOString(),
    userId: '2',
    userName: 'Manager User'
  }
];

// Mock Dashboard Stats
export const dashboardStats = {
  totalInventoryItems: inventoryItems.length,
  lowStockItems: inventoryItems.filter(item => item.status === 'low-stock').length,
  pendingOrders: purchaseOrders.filter(order => order.status === 'pending').length,
  activeShipments: shipments.filter(shipment => shipment.status === 'in-transit').length,
  recentActivities: activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)
};

// Mock Reports
export const reports: Report[] = [
  {
    id: '1',
    name: 'Monthly Inventory Report',
    type: 'inventory',
    createdAt: new Date(2025, 4, 1).toISOString(),
    createdBy: 'Admin User',
    parameters: {
      month: 'May',
      year: '2025',
      categories: ['Electronics', 'Office Supplies']
    }
  },
  {
    id: '2',
    name: 'Quarterly Procurement Report',
    type: 'procurement',
    createdAt: new Date(2025, 3, 1).toISOString(),
    createdBy: 'Manager User',
    parameters: {
      quarter: 'Q2',
      year: '2025',
      suppliers: ['Tech Solutions Inc.', 'Office Depot']
    }
  },
  {
    id: '3',
    name: 'Shipment Status Report',
    type: 'shipment',
    createdAt: new Date(2025, 4, 5).toISOString(),
    createdBy: 'Staff User',
    parameters: {
      startDate: '2025-05-01',
      endDate: '2025-05-15',
      status: ['pending', 'in-transit']
    }
  }
];

// Mock Report Data
export const mockReportData = {
  inventory: {
    categoryDistribution: [
      { name: 'Electronics', value: 2 },
      { name: 'Office Supplies', value: 1 },
      { name: 'Furniture', value: 1 },
      { name: 'Tools', value: 1 },
      { name: 'Packaging', value: 1 }
    ],
    statusCounts: [
      { name: 'In Stock', value: 3 },
      { name: 'Low Stock', value: 2 },
      { name: 'Out of Stock', value: 1 }
    ],
    summary: 'This inventory report shows a total of 6 items across 5 categories. 3 items are in stock, 2 are low stock, and 1 is out of stock. Electronics is the largest category with 2 items.'
  },
  procurement: {
    supplierDistribution: [
      { name: 'Tech Solutions Inc.', value: 1 },
      { name: 'Office Depot', value: 1 },
      { name: 'Furniture World', value: 1 }
    ],
    monthlyTrends: [
      { month: 'Jan', count: 3, value: 5000 },
      { month: 'Feb', count: 5, value: 7500 },
      { month: 'Mar', count: 4, value: 6000 },
      { month: 'Apr', count: 6, value: 9000 },
      { month: 'May', count: 3, value: 9325 }
    ],
    summary: 'This procurement report shows 3 active purchase orders with a total value of $9,325. Orders are distributed evenly across suppliers with Tech Solutions Inc. having the highest order value.'
  },
  shipment: {
    statusDistribution: [
      { name: 'Pending', value: 1 },
      { name: 'In Transit', value: 1 },
      { name: 'Delivered', value: 1 }
    ],
    destinationCounts: [
      { name: 'New York', value: 1 },
      { name: 'Chicago', value: 1 },
      { name: 'Los Angeles', value: 1 }
    ],
    summary: 'This shipment report shows 3 shipments with varied statuses. Destinations are distributed across major cities with equal distribution. One shipment is pending, one is in transit, and one has been delivered.'
  }
};
