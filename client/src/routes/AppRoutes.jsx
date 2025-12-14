import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/dashboard/Home";
import Products from "../pages/dashboard/Products";
import Auth from "../pages/AuthPage/Auth";
import { useAuth } from "../hooks/useAuth";
import Profile from "../pages/dashboard/Profile";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { token } = useAuth();

  return (
    <Routes>
      {/* SMART ROOT */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard/home" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      <Route path="/auth/*" element={<Auth />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<div className="p-6">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
