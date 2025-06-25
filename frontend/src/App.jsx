import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SpendChartsPage from "./pages/SpendChartsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { signOutCurrentUser } from "./utils/auth";

function App() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOutCurrentUser();
    navigate("/login", { replace: true });
  };
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/charts"
        element={
          <ProtectedRoute>
            <SpendChartsPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;