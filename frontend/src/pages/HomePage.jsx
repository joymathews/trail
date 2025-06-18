import React from "react";
import Header from "../components/Header";
import SpendSheet from "../components/spendSheet/SpendSheet";
import SpendSheetMobile from "../components/SpendSheetMobile";
import useIsMobile from "../hooks/useIsMobile";
import { signOutCurrentUser } from "../utils/auth";
import "./HomePage.scss";

function HomePage() {
  const handleSignOut = () => {
    signOutCurrentUser();
    window.location.href = "/login";
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