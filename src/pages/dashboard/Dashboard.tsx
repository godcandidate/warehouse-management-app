import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ProcurementIcon,
  LocalShipping as ShippingIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getDashboardStats, getInventoryStatusCounts, getProcurementStatusCounts, getShipmentStatusCounts, getLowStockItems } from '../../services/dashboardService';

const Dashboard: React.FC = () => {
  const theme = useTheme();

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
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              borderLeft: '4px solid #1976d2',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                Total Inventory
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <InventoryIcon />
              </Avatar>
            </Box>
            {isLoadingStats ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                {dashboardStats?.totalInventoryItems || 0}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total items in inventory
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              borderLeft: '4px solid #ff9800',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                Low Stock Items
              </Typography>
              <Avatar sx={{ bgcolor: '#ff9800' }}>
                <WarningIcon />
              </Avatar>
            </Box>
            {isLoadingStats ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                {dashboardStats?.lowStockItems || 0}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Items below threshold
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              borderLeft: '4px solid #9c27b0',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                Pending Orders
              </Typography>
              <Avatar sx={{ bgcolor: '#9c27b0' }}>
                <ProcurementIcon />
              </Avatar>
            </Box>
            {isLoadingStats ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                {dashboardStats?.pendingOrders || 0}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Awaiting processing
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              borderLeft: '4px solid #4caf50',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                Active Shipments
              </Typography>
              <Avatar sx={{ bgcolor: '#4caf50' }}>
                <ShippingIcon />
              </Avatar>
            </Box>
            {isLoadingStats ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                {dashboardStats?.activeShipments || 0}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              In transit
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Inventory Status Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Inventory Status" />
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
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Procurement Trends */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Procurement Trends" />
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
                    <Tooltip />
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
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Low Stock Items" 
              action={
                <Button color="primary" size="small">
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
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Recent Activities" 
              action={
                <Button color="primary" size="small">
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
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<InventoryIcon />}
            sx={{ p: 1.5 }}
            onClick={() => window.location.href = '/inventory/add'}
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
            sx={{ p: 1.5 }}
            onClick={() => window.location.href = '/procurement/orders/create'}
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
            sx={{ p: 1.5 }}
            onClick={() => window.location.href = '/shipments/create'}
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
            sx={{ p: 1.5 }}
            onClick={() => window.location.href = '/reports/generate'}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
