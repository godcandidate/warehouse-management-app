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
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  Place as LocationIcon,
  Description as DescriptionIcon,
  QrCode as QrCodeIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import AppButton from '../../components/ui/AppButton';
import { getInventoryItem, getCategories } from '../../services/inventoryService';

type FormData = {
  name: string;
  sku: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  location: string;
  status: string;
};

const initialFormData: FormData = {
  name: '',
  sku: '',
  description: '',
  category: '',
  quantity: 0,
  unitPrice: 0,
  location: '',
  status: 'in-stock',
};

const InventoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Fetch item data if in edit mode
  const {
    data: itemData,
    isLoading: isLoadingItem,
  } = useQuery({
    queryKey: ['inventoryItem', id],
    queryFn: () => getInventoryItem(id as string),
    enabled: isEditMode,
  });

  // Fetch categories for dropdown
  const { 
    data: categories = [],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Set form data when item data is loaded
  useEffect(() => {
    if (isEditMode && itemData) {
      setFormData({
        name: itemData.name,
        sku: itemData.sku,
        description: itemData.description,
        category: itemData.category,
        quantity: itemData.quantity,
        unitPrice: itemData.unitPrice,
        location: itemData.location,
        status: itemData.status,
      });
    }
  }, [isEditMode, itemData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' 
        ? parseFloat(value) || 0 
        : value
    }));
    
    // Clear error when field is changed
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than zero';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real application, you would call an API to save the data
    console.log('Form data submitted:', formData);
    
    // For now, just navigate back to the inventory list
    navigate('/inventory');
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  if (isEditMode && isLoadingItem) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" height={60} width="50%" />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Box>
    );
  }
  
  // Define category type
  type CategoryItem = string | { id?: string; name?: string };
  
  // Helper function to render a category MenuItem
  const renderCategoryMenuItem = (category: CategoryItem) => {
    const id = typeof category === 'string' ? category : category.id || '';
    const name = typeof category === 'string' ? category : category.name || '';
    return (
      <MenuItem key={id} value={name}>
        {name}
      </MenuItem>
    );
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          <InventoryIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
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
              {/* Basic Information Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                  Basic Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Item Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InventoryIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="SKU"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      error={!!errors.sku}
                      helperText={errors.sku}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <QrCodeIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              
              <Divider />
              
              {/* Details Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                  Item Details
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        error={!!errors.category}
                        helperText={errors.category}
                        required
                        disabled={isLoadingCategories}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CategoryIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {isLoadingCategories ? (
                          <MenuItem value="">Loading categories...</MenuItem>
                        ) : (
                          categories.map(renderCategoryMenuItem)
                        )}
                      </TextField>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        error={!!errors.location}
                        helperText={errors.location}
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
                </Stack>
              </Box>
              
              <Divider />
              
              {/* Inventory Status Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                  Inventory Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      error={!!errors.quantity}
                      helperText={errors.quantity}
                      inputProps={{ min: 0, step: 1 }}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShippingIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Unit Price ($)"
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      error={!!errors.unitPrice}
                      helperText={errors.unitPrice}
                      inputProps={{ min: 0, step: 0.01 }}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    >
                      <MenuItem value="in-stock">In Stock</MenuItem>
                      <MenuItem value="low-stock">Low Stock</MenuItem>
                      <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                    </TextField>
                  </Box>
                </Box>
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
                  {isEditMode ? 'Update Item' : 'Add Item'}
                </AppButton>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
};

export default InventoryForm;
