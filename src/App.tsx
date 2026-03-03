import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCookie } from '@/lib/auth';

// Layouts
import AuthLayout from '@/components/AuthLayout';
import DashboardLayout from '@/components/DashboardLayout';

// Pages
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from '@/pages/ProductsPage';
import AddProductPage from '@/pages/AddProductPage';
import EditProductPage from '@/pages/EditProductPage';
import CategoriesPage from '@/pages/CategoriesPage';
import PublishersPage from '@/pages/PublishersPage';
import LocationsPage from '@/pages/LocationsPage';
import AdminUsersPage from '@/pages/AdminUsersPage';

// Guard: cek apakah sudah login
function RequireAuth({ children }: { children: React.ReactNode }) {
  const role = getCookie('user-role');
  if (!role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Guard: cek apakah sudah login tapi coba akses login lagi
function RequireGuest({ children }: { children: React.ReactNode }) {
  const role = getCookie('user-role');
  if (role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />
        </Route>

        {/* Dashboard Routes */}
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/add" element={<AddProductPage />} />
          <Route path="/products/edit/:id" element={<EditProductPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/publishers" element={<PublishersPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
