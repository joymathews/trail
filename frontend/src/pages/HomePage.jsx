import React from "react";
import Header from "../components/Header";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import SpendSheet from "../components/SpendSheet";
import "./HomePage.scss";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};
const userPool = new CognitoUserPool(poolData);

function HomePage() {
  const handleSignOut = () => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
      window.location.href = "/login";
    }
  };

  return (
    <div>
      <Header onSignOut={handleSignOut} />
      <div className="home-container">
        <SpendSheet />
      </div>
    </div>
  );
}

export default HomePage;