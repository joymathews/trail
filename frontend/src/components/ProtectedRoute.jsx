import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};
const userPool = new CognitoUserPool(poolData);

function isAuthenticated() {
  const user = userPool.getCurrentUser();
  return new Promise((resolve) => {
    if (!user) return resolve(false);
    user.getSession((err, session) => {
      if (err || !session || !session.isValid()) return resolve(false);
      resolve(true);
    });
  });
}

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