import React from "react";
import "../css/loading.css";

const LoadingScreen = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-green-slide"></div>
      <div className="loading-logo-container">
        <img
          src="https://static.wixstatic.com/media/a8353f_c0f273fc598a4b53a7c0cbebf33d1f29~mv2.png/v1/crop/x_97,y_97,w_606,h_606/fill/w_120,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a8353f_c0f273fc598a4b53a7c0cbebf33d1f29~mv2.png"
alt="Logo"
          className="loading-logo"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
