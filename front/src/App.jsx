import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar2.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Footer from './components/footer1.jsx'; // Ensure correct casing
import LoadingScreen from './components/LoadingScreen.jsx'; // Import the LoadingScreen component
import Profile from './pages/general/Profile.jsx';
import ChangePassword from './pages/general/chpass.jsx';
import NotFound from './pages/general/NotFound.jsx';
import ForgotPassword from './pages/ForgotPassword';
import ManageUsers from './pages/other/Manageuser.jsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePageLoad = () => {
      // Ensure the loading screen is shown for at least 2 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    };

    // Check if the page is already fully loaded
    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <><div className="page-container">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Login />} />
        <Route path="/manageusers" element={<ManageUsers />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/changepassword/:token" element={<ChangePassword />} />
        <Route path="/ordermanagement" element={<Login />} />
        <Route path="/a/notification" element={<Login />} />
        <Route path="/itemmanagement" element={<Login />} />
        <Route path="/taskmanage" element={<Login />} />



        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      </div></>
  );
}

export default App;
