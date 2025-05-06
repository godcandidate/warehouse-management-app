import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Skeleton,
  useTheme,
  Container,
  Stack,
  Fade,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ProcurementIcon,
  LocalShipping as ShippingIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Dashboard as DashboardIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getDashboardStats, getInventoryStatusCounts, getProcurementStatusCounts, getShipmentStatusCounts, getLowStockItems } from '../../services/dashboardService';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch dashboard statistics
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  // Fetch inventory status counts
  const { data: inventoryStatusCounts, isLoading: isLoadingInventoryStatus } = useQuery({
    queryKey: ['inventoryStatusCounts'],
    queryFn: getInventoryStatusCounts,
  });

  // Fetch procurement status counts
  const { data: procurementStatusCounts, isLoading: isLoadingProcurementStatus } = useQuery({
    queryKey: ['procurementStatusCounts'],
    queryFn: getProcurementStatusCounts,
  });

  // Fetch shipment status counts
  const { data: shipmentStatusCounts, isLoading: isLoadingShipmentStatus } = useQuery({
    queryKey: ['shipmentStatusCounts'],
    queryFn: getShipmentStatusCounts,
  });

  // Fetch low stock items
  const { data: lowStockItems, isLoading: isLoadingLowStockItems } = useQuery({
    queryKey: ['lowStockItems'],
    queryFn: () => getLowStockItems(5),
  });

  // Mock data for charts when real data is not available
  const mockInventoryData = [
    { name: 'In Stock', value: 65, color: '#4caf50' },
    { name: 'Low Stock', value: 25, color: '#ff9800' },
    { name: 'Out of Stock', value: 10, color: '#f44336' },
  ];

  const mockProcurementData = [
    { name: 'Jan', pending: 4, approved: 2, delivered: 6 },
    { name: 'Feb', pending: 3, approved: 1, delivered: 8 },
    { name: 'Mar', pending: 2, approved: 3, delivered: 5 },
    { name: 'Apr', pending: 5, approved: 4, delivered: 3 },
    { name: 'May', pending: 1, approved: 2, delivered: 7 },
  ];

  // Format data for charts
  const inventoryChartData = isLoadingInventoryStatus
    ? mockInventoryData
    : [
        { name: 'In Stock', value: inventoryStatusCounts?.['in-stock'] || 0, color: '#4caf50' },
        { name: 'Low Stock', value: inventoryStatusCounts?.['low-stock'] || 0, color: '#ff9800' },
        { name: 'Out of Stock', value: inventoryStatusCounts?.['out-of-stock'] || 0, color: '#f44336' },
      ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Section with Warehouse Image */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          color: 'white',
          py: 6,
          mb: 4,
          borderRadius: { xs: 0, sm: 2 },
          boxShadow: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern for visual interest */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <Container>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                    Warehouse Management
                  </Typography>
                  <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 3 }}>
                    Monitor your inventory, manage shipments, and track procurement in one place.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'transform 0.3s ease-in-out'
                    }}
                    onClick={() => navigate('/inventory')}
                  >
                    Explore Inventory
                  </Button>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Fade in={true} timeout={1500}>
                <Box sx={{ textAlign: 'center' }}>
                  <DashboardIcon sx={{ fontSize: 180, opacity: 0.8 }} />
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="medium">
            Dashboard Overview
          </Typography>
          <Tooltip title="Refresh data">
            <IconButton onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              height: '100%',
              background: `linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 4,
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip 
                label="Inventory" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.2)', 
                  color: 'primary.main',
                  fontWeight: 'medium',
                }} 
              />
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <InventoryIcon />
              </Avatar>
            </Box>
            {isLoadingStats ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
                {dashboardStats?.totalInventoryItems || 0}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary', fontWeight: 'medium' }}>
              Total items in inventory
            </Typography>
            <Button 
              endIcon={<ArrowForwardIcon />} 
              sx={{ mt: 2, alignSelf: 'flex-start', color: 'primary.main' }}
              onClick={() => navigate('/inventory')}
            >
              View inventory
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              height: '100%',
              background: `linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 4,
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip 
                label="Warning" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255, 152, 0, 0.2)', 
                  color: '#ff9800',
                  fontWeight: 'medium',
                }} 
              />
              <Avatar sx={{ bgcolor: '#ff9800', width: 48, height: 48 }}>
                <WarningIcon />
              </Avatar>
            </Box>
            {isLoadingStats ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold', color: '#ff9800' }}>
                {dashboardStats?.lowStockItems || 0}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary', fontWeight: 'medium' }}>
              Items below threshold
            </Typography>
            <Button 
              endIcon={<ArrowForwardIcon />} 
              sx={{ mt: 2, alignSelf: 'flex-start', color: '#ff9800' }}
              onClick={() => navigate('/inventory?filter=low-stock')}
            >
              View low stock
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              height: '100%',
              background: `linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 4,
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip 
                label="Orders" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(156, 39, 176, 0.2)', 
                  color: '#9c27b0',
                  fontWeight: 'medium',
                }} 
              />
              <Avatar sx={{ bgcolor: '#9c27b0', width: 48, height: 48 }}>
                <ProcurementIcon />
              </Avatar>
            </Box>
            {isLoadingStats ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold', color: '#9c27b0' }}>
                {dashboardStats?.pendingOrders || 0}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary', fontWeight: 'medium' }}>
              Pending purchase orders
            </Typography>
            <Button 
              endIcon={<ArrowForwardIcon />} 
              sx={{ mt: 2, alignSelf: 'flex-start', color: '#9c27b0' }}
              onClick={() => navigate('/procurement/orders?status=pending')}
            >
              View orders
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              height: '100%',
              background: `linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 4,
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip 
                label="Shipments" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(76, 175, 80, 0.2)', 
                  color: '#4caf50',
                  fontWeight: 'medium',
                }} 
              />
              <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48 }}>
                <ShippingIcon />
              </Avatar>
            </Box>
            {isLoadingStats ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold', color: '#4caf50' }}>
                {dashboardStats?.activeShipments || 0}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary', fontWeight: 'medium' }}>
              Active shipments in transit
            </Typography>
            <Button 
              endIcon={<ArrowForwardIcon />} 
              sx={{ mt: 2, alignSelf: 'flex-start', color: '#4caf50' }}
              onClick={() => navigate('/shipments?status=in-transit')}
            >
              View shipments
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Inventory Status Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
            <CardHeader 
              title="Inventory Status" 
              titleTypographyProps={{ fontWeight: 'medium' }}
              action={
                <Tooltip title="More options">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {isLoadingInventoryStatus ? (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inventoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Procurement Trends */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
            <CardHeader 
              title="Procurement Trends" 
              titleTypographyProps={{ fontWeight: 'medium' }}
              action={
                <Tooltip title="More options">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {isLoadingProcurementStatus ? (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockProcurementData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="pending" fill="#ff9800" name="Pending" />
                    <Bar dataKey="approved" fill="#2196f3" name="Approved" />
                    <Bar dataKey="delivered" fill="#4caf50" name="Delivered" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Items */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
            <CardHeader 
              title="Low Stock Items" 
              titleTypographyProps={{ fontWeight: 'medium' }}
              action={
                <Button 
                  color="primary" 
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/inventory?filter=low-stock')}
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {isLoadingLowStockItems ? (
                <Box sx={{ p: 2 }}>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
                  ))}
                </Box>
              ) : (
                <List sx={{ width: '100%' }}>
                  {(lowStockItems || []).map((item: any) => (
                    <React.Fragment key={item.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#ff9800' }}>
                            <WarningIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                SKU: {item.sku}
                              </Typography>
                              {` — Quantity: ${item.quantity} (Threshold: ${item.threshold})`}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                  {(!lowStockItems || lowStockItems.length === 0) && (
                    <ListItem>
                      <ListItemText primary="No low stock items found" />
                    </ListItem>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
            <CardHeader 
              title="Recent Activities" 
              titleTypographyProps={{ fontWeight: 'medium' }}
              action={
                <Button 
                  color="primary" 
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/activities')}
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {isLoadingStats ? (
                <Box sx={{ p: 2 }}>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
                  ))}
                </Box>
              ) : (
                <List sx={{ width: '100%' }}>
                  {(dashboardStats?.recentActivities || []).map((activity) => (
                    <React.Fragment key={activity.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 
                            activity.type === 'inventory' ? '#1976d2' : 
                            activity.type === 'procurement' ? '#9c27b0' : '#4caf50' 
                          }}>
                            {activity.type === 'inventory' ? <InventoryIcon /> : 
                             activity.type === 'procurement' ? <ProcurementIcon /> : <ShippingIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.action}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {activity.userName}
                              </Typography>
                              {` — ${activity.description}`}
                              <Typography variant="caption" display="block">
                                {new Date(activity.timestamp).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                  {(!dashboardStats?.recentActivities || dashboardStats.recentActivities.length === 0) && (
                    <ListItem>
                      <ListItemText primary="No recent activities found" />
                    </ListItem>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box 
        sx={{ 
          mt: 5, 
          mb: 3, 
          p: 4, 
          borderRadius: 4, 
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          boxShadow: 1
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="medium" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Quickly access common tasks and operations for your warehouse management.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<InventoryIcon />}
              sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                }
              }}
              onClick={() => navigate('/inventory/add')}
            >
              Add Item
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              startIcon={<ProcurementIcon />}
              sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                }
              }}
              onClick={() => navigate('/procurement/orders/create')}
            >
              New Order
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              fullWidth
              color="success"
              startIcon={<ShippingIcon />}
              sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                }
              }}
              onClick={() => navigate('/shipments/create')}
            >
              Create Shipment
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              fullWidth
              color="info"
              startIcon={<TrendingUpIcon />}
              sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                }
              }}
              onClick={() => navigate('/reports/generate')}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
