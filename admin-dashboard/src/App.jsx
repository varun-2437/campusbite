import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import StudentLayout from './components/layout/StudentLayout';

// Student Pages
import StudentHome from './pages/student/StudentHome';
import CartCheckout from './pages/student/CartCheckout';
import OrderTracking from './pages/student/OrderTracking';
import OrderHistory from './pages/student/OrderHistory';
import LoyaltyRewards from './pages/student/LoyaltyRewards';

// Staff & Admin Pages
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
            {/* Student & Diner Experience Routes (Unified Main Interface) */}
            <Route element={<StudentLayout />}>
              <Route path="/" element={<StudentHome />} />
              <Route path="/cart" element={<CartCheckout />} />
              <Route path="/track" element={<OrderTracking />} />
              <Route path="/track/:orderId" element={<OrderTracking />} />
              <Route path="/history" element={<OrderHistory />} />
              <Route path="/loyalty" element={<LoyaltyRewards />} />
            </Route>

            {/* Public Staff Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Public TV Mode for Canteen Counter */}
            <Route path="/now-serving" element={<NowServingBoard />} />

            {/* Staff Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Cashier Dashboard */}
              <Route
                path="/cashier"
                element={
                  <ProtectedRoute allowedRoles={['cashier', 'manager']}>
                    <CashierDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Kitchen Display System */}
              <Route
                path="/kitchen"
                element={
                  <ProtectedRoute allowedRoles={['kitchen', 'manager']}>
                    <KitchenDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Juice / Beverage Counter */}
              <Route
                path="/beverage"
                element={
                  <ProtectedRoute allowedRoles={['beverage', 'manager']}>
                    <BeverageDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Serving / Pickup Counter */}
              <Route
                path="/counter"
                element={
                  <ProtectedRoute allowedRoles={['counter', 'manager']}>
                    <ServingCounter />
                  </ProtectedRoute>
                }
              />

              {/* Manager Pages */}
              <Route
                path="/manager/menu"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/inventory"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <InventoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/reports"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <SalesReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/staff"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <StaffAccounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/feedback"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <FeedbackOverview />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
