import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Skeleton,
  InputAdornment,
  Stack,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Autocomplete,
  Chip,
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  LocationOn as LocationIcon,
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
  getShipmentById, 
  createShipment, 
  updateShipment 
} from '../../services/shipmentService';
import { getInventoryItems } from '../../services/inventoryService';
import type { Shipment, ShipmentItem, InventoryItem } from '../../types';

type FormData = Omit<Shipment, 'id'> & { id?: string };

const initialFormData: FormData = {
  referenceNumber: `SHP-${Date.now().toString().slice(-6)}`,
  origin: '',
  destination: '',
  shipmentDate: new Date().toISOString(),
  expectedArrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  status: 'pending',
  items: [],
};

const ShipmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [newItem, setNewItem] = useState<Partial<ShipmentItem>>({
    itemId: '',
    itemName: '',
    quantity: 1,
  });
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);

  // Fetch shipment data if in edit mode
  const {
    data: shipmentData,
    isLoading: isLoadingShipment,
  } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => getShipmentById(id as string),
    enabled: isEditMode,
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

  // Set form data when shipment data is loaded
  useEffect(() => {
    if (isEditMode && shipmentData) {
      setFormData({
        ...shipmentData,
      });
    }
  }, [isEditMode, shipmentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleDateChange = (field: 'shipmentDate' | 'expectedArrivalDate') => (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date.toISOString(),
      }));
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleInventoryItemSelect = (_event: React.SyntheticEvent, item: InventoryItem | null) => {
    setSelectedInventoryItem(item);
    if (item) {
      setNewItem({
        ...newItem,
        itemId: item.id,
        itemName: item.name,
      });
    } else {
      setNewItem({
        itemId: '',
        itemName: '',
        quantity: 1,
      });
    }
  };

  const addItemToShipment = () => {
    if (!newItem.itemId || !newItem.quantity) {
      return; // Validate required fields
    }
    
    const itemToAdd = {
      id: `temp-${Date.now()}`, // Temporary ID for new items
      itemId: newItem.itemId as string,
      itemName: newItem.itemName as string,
      quantity: Number(newItem.quantity),
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, itemToAdd],
    }));
    
    // Reset new item form
    setNewItem({
      itemId: '',
      itemName: '',
      quantity: 1,
    });
    setSelectedInventoryItem(null);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.referenceNumber) {
      newErrors.referenceNumber = 'Reference number is required';
    }
    
    if (!formData.origin) {
      newErrors.origin = 'Origin is required';
    }
    
    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formData.shipmentDate) {
      newErrors.shipmentDate = 'Shipment date is required';
    }
    
    if (!formData.expectedArrivalDate) {
      newErrors.expectedArrivalDate = 'Expected arrival date is required';
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
        // Update existing shipment
        await updateShipment(id, formData);
      } else {
        // Create new shipment
        await createShipment(formData);
      }
      
      // Navigate back to shipments list
      navigate('/shipments');
    } catch (error) {
      console.error('Error saving shipment:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleCancel = () => {
    navigate('/shipments');
  };

  const getStatusChip = (status: string) => {
    let color: 'warning' | 'info' | 'success' | 'error' | 'default' = 'default';
    
    switch (status) {
      case 'pending':
        color = 'warning';
        break;
      case 'in-transit':
        color = 'info';
        break;
      case 'delivered':
        color = 'success';
        break;
      case 'cancelled':
        color = 'error';
        break;
    }
    
    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} 
        color={color}
        size="small"
        sx={{ ml: 2 }}
      />
    );
  };

  if (isEditMode && isLoadingShipment) {
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
            <LocalShippingIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              {isEditMode ? 'Edit Shipment' : 'Create Shipment'}
            </Typography>
            {isEditMode && getStatusChip(formData.status)}
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
                {/* Shipment Information Section */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                    Shipment Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Reference Number"
                      name="referenceNumber"
                      value={formData.referenceNumber}
                      onChange={handleChange}
                      error={!!errors.referenceNumber}
                      helperText={errors.referenceNumber}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalShippingIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <DatePicker
                      label="Shipment Date"
                      value={formData.shipmentDate ? new Date(formData.shipmentDate) : null}
                      onChange={handleDateChange('shipmentDate')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.shipmentDate,
                          helperText: errors.shipmentDate,
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
                    
                    <DatePicker
                      label="Expected Arrival Date"
                      value={formData.expectedArrivalDate ? new Date(formData.expectedArrivalDate) : null}
                      onChange={handleDateChange('expectedArrivalDate')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.expectedArrivalDate,
                          helperText: errors.expectedArrivalDate,
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
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <TextField
                      fullWidth
                      label="Origin"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      error={!!errors.origin}
                      helperText={errors.origin}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      error={!!errors.destination}
                      helperText={errors.destination}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Shipment Items Section */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                    Shipment Items
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
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
                        <AppButton
                          variant="primary"
                          onClick={addItemToShipment}
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
                          <TableCell sx={{ color: 'white' }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              No items added yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          formData.items.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.itemName}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
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
                    {isEditMode ? 'Update Shipment' : 'Create Shipment'}
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

export default ShipmentForm;
