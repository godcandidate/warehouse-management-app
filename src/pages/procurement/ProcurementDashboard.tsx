import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Business as BusinessIcon,
  LocalShipping as LocalShippingIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getPurchaseOrders } from '../../services/procurementService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`procurement-tabpanel-${index}`}
      aria-labelledby={`procurement-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `procurement-tab-${index}`,
    'aria-controls': `procurement-tabpanel-${index}`,
  };
}

const ProcurementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);

  // Fetch recent purchase orders
  const { data: recentOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['recentPurchaseOrders'],
    queryFn: () => getPurchaseOrders(1, 5),
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Procurement
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/procurement/purchase-order/add')}
            sx={{ mr: 2 }}
          >
            New Purchase Order
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate('/procurement/supplier/add')}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <ShoppingCartIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {isLoadingOrders ? <Skeleton width={60} /> : '24'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Purchase Orders
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {isLoadingOrders ? <Skeleton width={60} /> : '15'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Suppliers
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
            <LocalShippingIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {isLoadingOrders ? <Skeleton width={60} /> : '8'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Deliveries
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="procurement tabs">
            <Tab label="Purchase Orders" {...a11yProps(0)} />
            <Tab label="Suppliers" {...a11yProps(1)} />
            <Tab label="Requests" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Recent Purchase Orders</Typography>
            <Button 
              variant="text" 
              onClick={() => navigate('/procurement/orders')}
            >
              View All
            </Button>
          </Box>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {isLoadingOrders ? (
              // Loading skeleton
              Array.from(new Array(5)).map((_, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Skeleton width="40%" />}
                      secondary={
                        <>
                          <Skeleton width="60%" />
                          <Skeleton width="30%" />
                        </>
                      }
                    />
                    <Skeleton variant="rectangular" width={80} height={30} />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              // Actual data
              (recentOrders?.data || []).map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/procurement/orders/${order.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <ShoppingCartIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`PO-${order.id.substring(0, 8)}`}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {order.supplierName}
                          </Typography>
                          {` — $${order.totalAmount.toFixed(2)}`}
                          <Typography variant="caption" display="block">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                    <Chip 
                      label={getStatusLabel(order.status)} 
                      color={getStatusColor(order.status)} 
                      size="small" 
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            )}
            {!isLoadingOrders && (!recentOrders?.data || recentOrders.data.length === 0) && (
              <ListItem>
                <ListItemText primary="No purchase orders found" />
              </ListItem>
            )}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Active Suppliers</Typography>
            <Button 
              variant="text" 
              onClick={() => navigate('/procurement/suppliers')}
            >
              View All
            </Button>
          </Box>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {/* Mock supplier data */}
            {['Acme Supplies', 'Global Distributors', 'Tech Warehouse', 'Quality Parts Inc.', 'Industrial Solutions'].map((supplier, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  alignItems="flex-start" 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/procurement/supplier/edit/${index + 1}`)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <BusinessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={supplier}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Contact: John Doe
                        </Typography>
                        {` — john.doe@example.com`}
                        <Typography variant="caption" display="block">
                          +1 (555) 123-4567
                        </Typography>
                      </>
                    }
                  />
                  <Chip 
                    label="Active" 
                    color="success" 
                    size="small" 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Procurement Requests</Typography>
            <Button 
              variant="text" 
              onClick={() => navigate('/procurement/requests')}
            >
              View All
            </Button>
          </Box>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {/* Mock request data */}
            {['Office Supplies', 'Raw Materials', 'Packaging Materials', 'Maintenance Parts', 'IT Equipment'].map((request, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  alignItems="flex-start" 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/procurement/requests/${index + 1}`)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <ShoppingCartIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Request for ${request}`}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Requested by: Jane Smith
                        </Typography>
                        <Typography variant="caption" display="block">
                          {new Date(2023, 0, index + 1).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                  <Chip 
                    label={index % 2 === 0 ? "Pending" : "Approved"} 
                    color={index % 2 === 0 ? "warning" : "success"} 
                    size="small" 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ProcurementDashboard;
