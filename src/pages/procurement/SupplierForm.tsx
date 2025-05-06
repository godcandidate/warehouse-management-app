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
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import AppButton from '../../components/ui/AppButton';
import { 
  getSupplierById, 
  createSupplier, 
  updateSupplier 
} from '../../services/procurementService';
import type { Supplier } from '../../types';

type FormData = Omit<Supplier, 'id'> & { id?: string };

const initialFormData: FormData = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  status: 'active',
};

const SupplierForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Fetch supplier data if in edit mode
  const {
    data: supplierData,
    isLoading: isLoadingSupplier,
  } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => getSupplierById(id as string),
    enabled: isEditMode,
  });

  // Set form data when supplier data is loaded
  useEffect(() => {
    if (isEditMode && supplierData) {
      setFormData({
        ...supplierData,
      });
    }
  }, [isEditMode, supplierData]);

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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.checked ? 'active' : 'inactive'
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
        // Update existing supplier
        await updateSupplier(id, formData);
      } else {
        // Create new supplier
        await createSupplier(formData);
      }
      
      // Navigate back to procurement dashboard
      navigate('/procurement');
    } catch (error) {
      console.error('Error saving supplier:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleCancel = () => {
    navigate('/procurement');
  };

  if (isEditMode && isLoadingSupplier) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" height={60} width="50%" />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          <BusinessIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
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
            <Stack spacing={3}>
              {/* Supplier Information Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                  Supplier Information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Supplier Name"
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
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.status === 'active'}
                        onChange={handleStatusChange}
                        color="primary"
                      />
                    }
                    label={formData.status === 'active' ? 'Active' : 'Inactive'}
                    sx={{ 
                      ml: 2, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      px: 2,
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Contact Person"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    error={!!errors.contactPerson}
                    helperText={errors.contactPerson}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
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
                  {isEditMode ? 'Update Supplier' : 'Add Supplier'}
                </AppButton>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
};

export default SupplierForm;
