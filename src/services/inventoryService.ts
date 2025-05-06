import type { InventoryItem, Category, PaginatedResponse } from '../types/index';
import { inventoryApi } from '../mock/mockApi';

// Inventory Items
export const getInventoryItems = async (
  page = 1,
  limit = 10,
  search = '',
  category = '',
  status = ''
): Promise<PaginatedResponse<InventoryItem>> => {
  // Using mock API instead of real API call
  const response = await inventoryApi.getItems({
    search: search || null,
    category: category || null,
    status: status || null
  });
  
  // Convert to paginated response format
  return {
    data: response.data.items,
    total: response.data.total,
    page,
    limit,
    totalPages: Math.ceil(response.data.total / limit)
  };
};

export const getInventoryItemById = async (id: string): Promise<InventoryItem> => {
  // Using mock API instead of real API call
  const response = await inventoryApi.getItemById(id);
  if (!response.data) {
    throw new Error('Item not found');
  }
  return response.data;
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  // Using mock API instead of real API call
  const response = await inventoryApi.createItem(item);
  return response.data;
};

export const updateInventoryItem = async (
  id: string,
  item: Partial<InventoryItem>
): Promise<InventoryItem> => {
  // Using mock API instead of real API call
  const response = await inventoryApi.updateItem(id, item);
  if (!response.data) {
    throw new Error('Failed to update item');
  }
  return response.data;
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  // Using mock API instead of real API call
  await inventoryApi.deleteItem(id);
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  // Using mock API instead of real API call
  const response = await inventoryApi.getCategories();
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  // Using mock API instead of real API call
  // Find the category in the mock data
  const categories = await getCategories();
  const category = categories.find(c => c.id === id);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  // Using mock data since we don't have a specific mock API for this
  const newCategory: Category = {
    id: `${Date.now()}`,
    name: category.name,
    description: category.description || ''
  };
  return newCategory;
};

export const updateCategory = async (
  id: string,
  category: Partial<Category>
): Promise<Category> => {
  // Using mock data since we don't have a specific mock API for this
  const existingCategory = await getCategoryById(id);
  return {
    ...existingCategory,
    ...category
  };
};

export const deleteCategory = async (_id: string): Promise<void> => {
  // Using mock data - in a real app this would delete from the database
  // Here we just simulate the API call
  return Promise.resolve();
};

// Inventory Statistics
export const getInventoryStatistics = async (): Promise<{
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoryCounts: Record<string, number>;
}> => {
  // Using mock data
  const items = await getInventoryItems();
  const categories = await getCategories();
  
  // Calculate statistics from mock data
  const lowStockItems = items.data.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = items.data.filter(item => item.status === 'out-of-stock').length;
  
  // Create category counts
  const categoryCounts: Record<string, number> = {};
  categories.forEach(category => {
    categoryCounts[category.name] = items.data.filter(item => item.category === category.name).length;
  });
  
  return {
    totalItems: items.data.length,
    lowStockItems,
    outOfStockItems,
    categoryCounts
  };
};
