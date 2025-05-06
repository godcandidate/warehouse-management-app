import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Skeleton,
  Chip,
  Divider,
} from '@mui/material';
import AppButton from '../../components/ui/AppButton';
import { getInventoryItem } from '../../services/inventoryService';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['inventoryItem', id],
    queryFn: () => getInventoryItem(id as string),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'success';
      case 'low-stock':
        return 'warning';
      case 'out-of-stock':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEdit = () => {
    navigate(`/inventory/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/inventory');
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" height={60} width="50%" />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (error || !item) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading inventory item
        </Typography>
        <AppButton variant="light" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Inventory
        </AppButton>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Item Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <AppButton variant="light" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back
          </AppButton>
          <AppButton variant="primary" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit
          </AppButton>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" component="h2">
                {item.name}
              </Typography>
              <Chip
                label={item.status === 'in-stock' ? 'In Stock' : item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                color={getStatusColor(item.status) as 'success' | 'warning' | 'error' | 'default'}
              />
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              SKU: {item.sku}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1" gutterBottom>
              {item.category}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body1" gutterBottom>
              {item.location}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Quantity
            </Typography>
            <Typography variant="body1" gutterBottom>
              {item.quantity} units
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Unit Price
            </Typography>
            <Typography variant="body1" gutterBottom>
              ${item.unitPrice.toFixed(2)}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1" gutterBottom>
              {item.description || 'No description provided'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Value
            </Typography>
            <Typography variant="h6" gutterBottom>
              ${(item.quantity * item.unitPrice).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default InventoryDetail;
