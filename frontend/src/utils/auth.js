// src/utils/auth.js
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);

export function getCurrentUser() {
  return userPool.getCurrentUser();
}

export function signOutCurrentUser() {
  const user = getCurrentUser();
  if (user) user.signOut();
}

export function isAuthenticated() {
  const user = getCurrentUser();
  return new Promise((resolve) => {
    if (!user) return resolve(false);
    user.getSession((err, session) => {
      if (err || !session || !session.isValid()) return resolve(false);
      resolve(true);
    });
  });
}

export function authenticateUser(username, password) {
  const user = new CognitoUser({ Username: username, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: username, Password: password });
  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        // Store JWT in localStorage
        const idToken = result.getIdToken().getJwtToken();
        localStorage.setItem('jwt', idToken);
        resolve(result);
      },
      onFailure: (err) => reject(err),
    });
  });
}

// Token renewal logic
export function renewTokenIfNeeded() {
  const user = getCurrentUser();
  return new Promise((resolve, reject) => {
    if (!user) return resolve(false);
    user.getSession((err, session) => {
      if (err || !session) return reject(err);
      if (!session.isValid()) {
        user.refreshSession(session.getRefreshToken(), (refreshErr, newSession) => {
          if (refreshErr) return reject(refreshErr);
          const idToken = newSession.getIdToken().getJwtToken();
          localStorage.setItem('jwt', idToken);
          resolve(true);
        });
      } else {
        // Token is still valid
        resolve(false);
      }
    });
  });
}
