import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { CircularProgress, Box } from '@mui/material';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Landing Page
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));

// Lazy-loaded pages for better performance
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

// Inventory pages
const InventoryList = lazy(() => import('./pages/inventory/InventoryList'));
const InventoryForm = lazy(() => import('./pages/inventory/InventoryForm'));
const InventoryDetail = lazy(() => import('./pages/inventory/InventoryDetail'));

// Procurement and Shipment pages
const ProcurementDashboard = lazy(() => import('./pages/procurement/ProcurementDashboard'));
const PurchaseOrderForm = lazy(() => import('./pages/procurement/PurchaseOrderForm'));
const SupplierForm = lazy(() => import('./pages/procurement/SupplierForm'));
const ShipmentList = lazy(() => import('./pages/shipments/ShipmentList'));
const ShipmentForm = lazy(() => import('./pages/shipments/ShipmentForm'));
const ReportGenerator = lazy(() => import('./pages/reports/ReportGenerator'));

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, you would check if the user is authenticated
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Landing Page Route */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                  </Route>

                  {/* Protected Routes */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Inventory Routes */}
                    <Route path="/inventory" element={<InventoryList />} />
                    <Route path="/inventory/add" element={<InventoryForm />} />
                    <Route path="/inventory/edit/:id" element={<InventoryForm />} />
                    <Route path="/inventory/view/:id" element={<InventoryDetail />} />
                    
                    {/* Procurement Routes */}
                    <Route path="/procurement" element={<ProcurementDashboard />} />
                    <Route path="/procurement/purchase-order/add" element={<PurchaseOrderForm />} />
                    <Route path="/procurement/purchase-order/edit/:id" element={<PurchaseOrderForm />} />
                    <Route path="/procurement/supplier/add" element={<SupplierForm />} />
                    <Route path="/procurement/supplier/edit/:id" element={<SupplierForm />} />
                    
                    {/* Shipment Routes */}
                    <Route path="/shipments" element={<ShipmentList />} />
                    <Route path="/shipments/create" element={<ShipmentForm />} />
                    <Route path="/shipments/edit/:id" element={<ShipmentForm />} />
                    <Route path="/shipments/view/:id" element={<ShipmentList />} />
                    
                    <Route path="/reports" element={<ReportGenerator />} />
                  </Route>

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
