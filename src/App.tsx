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

// Lazy-loaded pages for better performance
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const InventoryList = lazy(() => import('./pages/inventory/InventoryList'));
const ProcurementDashboard = lazy(() => import('./pages/procurement/ProcurementDashboard'));
const ShipmentList = lazy(() => import('./pages/shipments/ShipmentList'));
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
                  {/* Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
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
                    <Route path="/inventory" element={<InventoryList />} />
                    <Route path="/procurement" element={<ProcurementDashboard />} />
                    <Route path="/shipments" element={<ShipmentList />} />
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
