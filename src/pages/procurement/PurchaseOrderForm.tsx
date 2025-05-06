import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Skeleton,
  Divider,
  InputAdornment,
  Stack,
  Fade,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppButton from '../../components/ui/AppButton';
import { 
  getPurchaseOrderById, 
  createPurchaseOrder, 
  updatePurchaseOrder 
} from '../../services/procurementService';
import { getSuppliers } from '../../services/procurementService';
import { getInventoryItems } from '../../services/inventoryService';
import type { PurchaseOrder, PurchaseOrderItem, Supplier, InventoryItem } from '../../types';

type FormData = Omit<PurchaseOrder, 'id'> & { id?: string };

const initialFormData: FormData = {
  supplierId: '',
  supplierName: '',
  orderDate: new Date().toISOString(),
  expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  status: 'pending',
  items: [],
  totalAmount: 0,
};

const PurchaseOrderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [newItem, setNewItem] = useState<Partial<PurchaseOrderItem>>({
    itemId: '',
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);

  // Fetch purchase order data if in edit mode
  const {
    data: orderData,
    isLoading: isLoadingOrder,
  } = useQuery({
    queryKey: ['purchaseOrder', id],
    queryFn: () => getPurchaseOrderById(id as string),
    enabled: isEditMode,
  });

  // Fetch suppliers for dropdown
  const { 
    data: suppliersData = { data: [] },
    isLoading: isLoadingSuppliers
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => getSuppliers(),
  });

  // Fetch inventory items for dropdown
  const { 
    data: inventoryItemsResponse,
    isLoading: isLoadingInventory
  } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: () => getInventoryItems(),
  });

  // Extract inventory items array from the response
  const inventoryItems = inventoryItemsResponse?.data || [];

  // Set form data when order data is loaded
  useEffect(() => {
    if (isEditMode && orderData) {
      setFormData({
        ...orderData,
      });
    }
  }, [isEditMode, orderData]);

  // Not currently used but kept for future form fields
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  //   
  //   // Clear error when field is changed
  //   if (errors[name as keyof FormData]) {
  //     setErrors(prev => ({
  //       ...prev,
  //       [name]: undefined
  //     }));
  //   }
  // };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const supplierId = e.target.value;
    const supplier = suppliersData.data.find((s: Supplier) => s.id === supplierId);
    
    setFormData(prev => ({
      ...prev,
      supplierId,
      supplierName: supplier ? supplier.name : '',
    }));
  };

  const handleDateChange = (field: 'orderDate' | 'expectedDeliveryDate') => (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date.toISOString(),
      }));
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedItem = { ...newItem, [name]: value };
    
    // Calculate total price if quantity or unit price changes
    if (name === 'quantity' || name === 'unitPrice') {
      const quantity = name === 'quantity' ? Number(value) : Number(newItem.quantity);
      const unitPrice = name === 'unitPrice' ? Number(value) : Number(newItem.unitPrice);
      updatedItem.totalPrice = quantity * unitPrice;
    }
    
    setNewItem(updatedItem);
  };

  const handleInventoryItemSelect = (_event: React.SyntheticEvent, item: InventoryItem | null) => {
    setSelectedInventoryItem(item);
    if (item) {
      setNewItem({
        ...newItem,
        itemId: item.id,
        itemName: item.name,
        unitPrice: item.unitPrice,
        totalPrice: Number(newItem.quantity || 1) * item.unitPrice,
      });
    } else {
      setNewItem({
        itemId: '',
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
    }
  };

  const addItemToOrder = () => {
    if (!newItem.itemId || !newItem.quantity) {
      return; // Validate required fields
    }
    
    const itemToAdd = {
      id: `temp-${Date.now()}`, // Temporary ID for new items
      itemId: newItem.itemId as string,
      itemName: newItem.itemName as string,
      quantity: Number(newItem.quantity),
      unitPrice: Number(newItem.unitPrice),
      totalPrice: Number(newItem.totalPrice),
    };
    
    const updatedItems = [...formData.items, itemToAdd];
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount,
    }));
    
    // Reset new item form
    setNewItem({
      itemId: '',
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
    setSelectedInventoryItem(null);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }
    
    if (!formData.orderDate) {
      newErrors.orderDate = 'Order date is required';
    }
    
    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = 'Expected delivery date is required';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode && id) {
        // Update existing purchase order
        await updatePurchaseOrder(id, formData);
      } else {
        // Create new purchase order
        await createPurchaseOrder(formData);
      }
      
      // Navigate back to procurement dashboard
      navigate('/procurement');
    } catch (error) {
      console.error('Error saving purchase order:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleCancel = () => {
    navigate('/procurement');
  };

  if (isEditMode && isLoadingOrder) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" height={60} width="50%" />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Fade in={true} timeout={500}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2
          }}>
            <ShoppingCartIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              {isEditMode ? 'Edit Purchase Order' : 'Create Purchase Order'}
            </Typography>
          </Box>
          
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: 'linear-gradient(to bottom right, #ffffff, #f9f9f9)'
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Order Information Section */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                    Order Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        select
                        label="Supplier"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleSupplierChange}
                        error={!!errors.supplierId}
                        helperText={errors.supplierId}
                        required
                        disabled={isLoadingSuppliers}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {isLoadingSuppliers ? (
                          <MenuItem value="">Loading suppliers...</MenuItem>
                        ) : (
                          suppliersData.data.map((supplier: Supplier) => (
                            <MenuItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <DatePicker
                        label="Order Date"
                        value={formData.orderDate ? new Date(formData.orderDate) : null}
                        onChange={handleDateChange('orderDate')}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.orderDate,
                            helperText: errors.orderDate,
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarIcon color="primary" />
                                </InputAdornment>
                              ),
                            },
                          },
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <DatePicker
                        label="Expected Delivery Date"
                        value={formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate) : null}
                        onChange={handleDateChange('expectedDeliveryDate')}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.expectedDeliveryDate,
                            helperText: errors.expectedDeliveryDate,
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarIcon color="primary" />
                                </InputAdornment>
                              ),
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                <Divider />
                
                {/* Order Items Section */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                    Order Items
                  </Typography>
                  
                  {/* Add New Item Form */}
                  <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>Add Item</Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'flex-start' }}>
                      <Autocomplete
                        sx={{ flex: 2 }}
                        options={inventoryItems}
                        getOptionLabel={(option: InventoryItem) => `${option.name} (${option.sku})`}
                        loading={isLoadingInventory}
                        value={selectedInventoryItem}
                        onChange={handleInventoryItemSelect}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Item"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start">
                                    <InventoryIcon color="primary" />
                                  </InputAdornment>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      
                      <TextField
                        sx={{ flex: 1 }}
                        type="number"
                        label="Quantity"
                        name="quantity"
                        value={newItem.quantity}
                        onChange={handleNewItemChange}
                        inputProps={{ min: 1 }}
                        variant="outlined"
                        fullWidth
                      />
                      
                      <TextField
                        sx={{ flex: 1 }}
                        type="number"
                        label="Unit Price ($)"
                        name="unitPrice"
                        value={newItem.unitPrice}
                        onChange={handleNewItemChange}
                        inputProps={{ min: 0, step: 0.01 }}
                        variant="outlined"
                        fullWidth
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
                        <AppButton
                          variant="primary"
                          onClick={addItemToOrder}
                          disabled={!newItem.itemId}
                          startIcon={<AddIcon />}
                        >
                          Add
                        </AppButton>
                      </Box>
                    </Box>
                  </Paper>
                  
                  {/* Items Table */}
                  {errors.items && (
                    <Typography color="error" sx={{ mb: 2 }}>
                      {errors.items}
                    </Typography>
                  )}
                  
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table>
                      <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                          <TableCell sx={{ color: 'white' }}>Item</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">Quantity</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">Unit Price ($)</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">Total ($)</TableCell>
                          <TableCell sx={{ color: 'white' }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No items added yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          formData.items.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.itemName}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell align="right">${item.totalPrice.toFixed(2)}</TableCell>
                              <TableCell align="center">
                                <IconButton 
                                  color="error" 
                                  size="small"
                                  onClick={() => removeItem(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                        {formData.items.length > 0 && (
                          <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                              Total Amount:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              ${formData.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <AppButton 
                    variant="light"
                    onClick={handleCancel}
                    size="large"
                  >
                    Cancel
                  </AppButton>
                  <AppButton 
                    variant="primary"
                    type="submit"
                    size="large"
                  >
                    {isEditMode ? 'Update Order' : 'Create Order'}
                  </AppButton>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Fade>
    </LocalizationProvider>
  );
};

export default PurchaseOrderForm;
