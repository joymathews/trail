import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    isAuthenticated().then((valid) => {
      setIsAuth(valid);
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked) return null; // or a loading spinner
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;