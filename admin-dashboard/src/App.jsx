import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import CashierDashboard from './pages/cashier/CashierDashboard';
import KitchenDashboard from './pages/kitchen/KitchenDashboard';
import BeverageDashboard from './pages/beverage/BeverageDashboard';
import ServingCounter from './pages/counter/ServingCounter';
import NowServingBoard from './pages/counter/NowServingBoard';
import MenuManagement from './pages/manager/MenuManagement';
import InventoryManagement from './pages/manager/InventoryManagement';
import SalesReports from './pages/manager/SalesReports';
import StaffAccounts from './pages/manager/StaffAccounts';
import FeedbackOverview from './pages/manager/FeedbackOverview';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Public / TV Mode for Counter */}
            <Route path="/now-serving" element={<NowServingBoard />} />

            {/* Staff Protected App Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect to Cashier or based on role */}
              <Route index element={<Navigate to="/cashier" replace />} />

              {/* Cashier Dashboard */}
              <Route
                path="cashier"
                element={
                  <ProtectedRoute allowedRoles={['cashier', 'manager']}>
                    <CashierDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Kitchen Display System */}
              <Route
                path="kitchen"
                element={
                  <ProtectedRoute allowedRoles={['kitchen', 'manager']}>
                    <KitchenDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Juice / Beverage Counter */}
              <Route
                path="beverage"
                element={
                  <ProtectedRoute allowedRoles={['beverage', 'manager']}>
                    <BeverageDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Serving / Pickup Counter */}
              <Route
                path="counter"
                element={
                  <ProtectedRoute allowedRoles={['counter', 'manager']}>
                    <ServingCounter />
                  </ProtectedRoute>
                }
              />

              {/* Manager Pages */}
              <Route
                path="manager/menu"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/inventory"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <InventoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/reports"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <SalesReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/staff"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <StaffAccounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/feedback"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <FeedbackOverview />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
