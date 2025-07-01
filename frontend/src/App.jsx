import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ExpenseDashboardPage from "./pages/ExpenseDashboardPage";
import ExpenseForecast from "./pages/ExpenseForecastPage";
import SavingForecast from "./pages/SavingForecastPage";
import SavingDashboardPage from "./pages/SavingDashboardPage";
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
        path="/expense-dashboard"
        element={
          <ProtectedRoute>
            <ExpenseDashboardPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saving-dashboard"
        element={
          <ProtectedRoute>
            <SavingDashboardPage onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expense-forecast"
        element={
          <ProtectedRoute>
            <ExpenseForecast onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saving-forecast"
        element={
          <ProtectedRoute>
            <SavingForecast onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;