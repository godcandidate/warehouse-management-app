import type { Shipment, PaginatedResponse } from '../types/index';
import { shipmentApi } from '../mock/mockApi';

export const getShipments = async (
  page = 1,
  limit = 10,
  search = '',
  status = ''
): Promise<PaginatedResponse<Shipment>> => {
  // Note: search and status parameters would be used for filtering in a real API
  // Using mock API instead of real API call
  const response = await shipmentApi.getShipments();
  
  // Convert to paginated response format
  return {
    data: response.data.shipments,
    total: response.data.total,
    page,
    limit,
    totalPages: Math.ceil(response.data.total / limit)
  };
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
  // Using mock API instead of real API call
  const response = await shipmentApi.getShipmentById(id);
  if (!response.data) {
    throw new Error(`Shipment with ID ${id} not found`);
  }
  return response.data;
};

export const createShipment = async (shipment: Omit<Shipment, 'id'>): Promise<Shipment> => {
  // Using mock API instead of real API call
  const response = await shipmentApi.createShipment(shipment);
  return response.data;
};

export const updateShipment = async (
  id: string,
  shipment: Partial<Shipment>
): Promise<Shipment> => {
  // Using mock API instead of real API call
  const response = await shipmentApi.updateShipment(id, shipment);
  return response.data;
};

export const deleteShipment = async (id: string): Promise<void> => {
  // Note: id would be used to delete the shipment in a real API
  // Using mock data - in a real app this would delete from the database
  // Here we just simulate the API call
  return Promise.resolve();
};

// Shipment Status Management
export const updateShipmentStatus = async (
  id: string,
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled'
): Promise<Shipment> => {
  // Using mock API - update the shipment with the new status
  return updateShipment(id, { status });
};

// Shipment Tracking
export interface TrackingEvent {
  location: string;
  timestamp: string;
  description: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
}

export const addTrackingEvent = async (
  id: string,
  event: TrackingEvent
): Promise<Shipment> => {
  // Using mock API - just update the shipment status
  return updateShipmentStatus(id, event.status);
};

export const getTrackingEvents = async (_id: string): Promise<TrackingEvent[]> => {
  // Using mock data for tracking events
  return [
    {
      location: 'Warehouse A',
      timestamp: new Date(2025, 4, 5, 9, 0).toISOString(),
      description: 'Shipment prepared',
      status: 'pending'
    },
    {
      location: 'Warehouse A',
      timestamp: new Date(2025, 4, 5, 14, 0).toISOString(),
      description: 'Shipment dispatched',
      status: 'in-transit'
    },
    {
      location: 'Distribution Center',
      timestamp: new Date(2025, 4, 7, 10, 0).toISOString(),
      description: 'Arrived at distribution center',
      status: 'in-transit'
    }
  ];
};

// Shipment Reports
export interface ShipmentReport {
  totalShipments: number;
  pendingShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
  cancelledShipments: number;
  averageDeliveryTime: number; // in days
}

export const getShipmentReports = async (startDate: string, endDate: string): Promise<ShipmentReport> => {
  // Note: startDate and endDate parameters would be used for filtering in a real API
  // Using mock data for shipment reports
  return {
    totalShipments: 10,
    pendingShipments: 3,
    inTransitShipments: 2,
    deliveredShipments: 4,
    cancelledShipments: 1,
    averageDeliveryTime: 4.5
  };
};

// Transfer Management
export const createTransfer = async (
  origin: string,
  destination: string,
  items: Array<{ itemId: string; quantity: number }>
): Promise<Shipment> => {
  // Using mock API - create a new shipment with transfer data
  const shipmentData: Omit<Shipment, 'id'> = {
    referenceNumber: `TRANSFER-${Date.now().toString().slice(-6)}`,
    origin,
    destination,
    shipmentDate: new Date().toISOString(),
    expectedArrivalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    items: items.map(item => ({
      id: `${Date.now()}-${item.itemId}`,
      itemId: item.itemId,
      itemName: `Item ${item.itemId}`, // In a real app, we'd look up the item name
      quantity: item.quantity
    }))
  };
  
  return createShipment(shipmentData);
};

export const getTransfers = async (
  page = 1,
  limit = 10,
  origin = '',
  destination = '',
  status = ''
): Promise<PaginatedResponse<Shipment>> => {
  // Note: origin, destination and status parameters would be used for filtering in a real API
  // Using mock API - filter shipments that are transfers
  // For simplicity, we'll just return all shipments in our mock implementation
  return getShipments(page, limit);
};
