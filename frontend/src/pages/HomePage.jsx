import React from "react";
import Header from "../components/Header";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import SpendSheet from "../components/SpendSheet";
import SpendSheetMobile from "../components/SpendSheetMobile";
import useIsMobile from "../hooks/useIsMobile";
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

  const isMobile = useIsMobile(1024);

  return (
    <div>
      <Header onSignOut={handleSignOut} />
      <div className="home-container">
        {isMobile ? <SpendSheetMobile /> : <SpendSheet />}
      </div>
    </div>
  );
}

export default HomePage;