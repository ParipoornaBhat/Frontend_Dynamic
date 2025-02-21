import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Profile from "../pages/general/Profile"; // Ensure correct path to Profile
import "../css/navBar.css";
import logo from "../assets/Untitled.jpg";
import ManageUserError from '../pages/other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../pages/other/SuccessMessage'; // Import the SuccessMessage component

const NavBar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [actions, setActions] = useState({});
  const [employeeRoles, setEmpRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isNavActive, setIsNavActive] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mouseAtTop, setMouseAtTop] = useState(false);
  const token = localStorage.getItem("token");
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile state
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const navRef = useRef(); // Reference for the navbar element
  const hamburgerRef = useRef(); // Reference for the hamburger button

//handle check jwt validity
const checkJWTValidity = async () => {
  try {
      const token = localStorage.getItem("token");
      if (!token) {
          console.log("No token found in localStorage");
          setErrorMessage("No token!! Unauthorized access. Logging out...");
          handleLogout();
          return;
      }
      console.log("check")
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/emp/validatejwt`, {
          headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
          console.log("Token is valid");
      } else {
          console.log("Unexpected response:", response.data);
      }
  } catch (error) {
      if (error.response) {
          console.log("JWT validation error:", error.response.data.message);
          if (error.response.status === 403 || error.response.status === 401) {
              setErrorMessage("Your session has expired. Logging out...");
              handleLogout2(); // Logout if token is expired or unauthorized
          }
      } else {
          console.log("Network or server error:", error.message);
      }
  }


return { checkJWTValidity };
};

  const handleProfileToggle = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/emp/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      } else  if (response.status === 202) {
        setErrorMessage("Please login(No Token)")
        navigate("/login");
      } else  if (response.status === 201) {
        setErrorMessage(" Please re-login(Blacklisted/already logged out)")
        navigate("/login");
      } else{
        console.log("Logout failed:", response.status, response.data);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const handleLogout2 = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/emp/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.clear();
        setTimeout(() => navigate("/login"), 4000);
    } else if (response.status === 202) {navigate("/login")
    } else if (response.status === 201) {navigate("/login")
    } else {
        console.error("Logout failed:", response.status, response.data);
    }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (mouseAtTop) return;
      if (currentScroll > 50 && currentScroll > scrollPosition && isNavbarVisible) {
        setIsNavbarVisible(false);
      } else if (currentScroll <= 0 || currentScroll < scrollPosition) {
        setIsNavbarVisible(true);
      }
      setScrollPosition(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition, isNavbarVisible, mouseAtTop]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY <= 10) {
        setMouseAtTop(true);
        setIsNavbarVisible(true);
      } else {
        setMouseAtTop(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  useEffect(() => {
    
  
  const fetchRoles = async () => {
      try {
          const storedRole = localStorage.getItem("role");
          if (!storedRole) {
              console.log("No roles stored, no token too found in localStorage");
              return;
          }
          setRole(storedRole);
  
          const token = localStorage.getItem("token");
          if (!token) {
              console.log("No token found in localStorage");
              return;
          }
  
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/general/getRoles`, {
              headers: { Authorization: `Bearer ${token}` },
          });
  
          if (response.status === 200) {
              const data = response.data;
              localStorage.setItem("actions", JSON.stringify(data.actions));
              setActions(data.actions);
              localStorage.setItem("employeeRoles", JSON.stringify(data.employeeRoles));
              setEmpRoles(data.employeeRoles);
              localStorage.setItem("userRoles", JSON.stringify(data.userRoles));
              setUserRoles(data.userRoles);
          } else {
              console.log(`Error fetching roles: ${response.data.message}`);
              setErrorMessage("Your session has expired. Logging out...");
              handleLogout();  // Call logout instead of redirecting directly

          }
      } catch (error) {
          if (error.response) {
              console.log("Error fetching roles:", error.response.data.message);
              if (error.response.status === 403) {
                  setErrorMessage("Your session has expired. Logging out...");
                  handleLogout();  // Call logout instead of redirecting directly
              }
          } else {
              console.log("Network or server error:");
          }
      }
  };
  

  fetchRoles();

 

    // Hide the navbar menu when clicking outside
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target) && !hamburgerRef.current.contains(e.target)) {
        setIsNavActive(false); // Close the menu if the click is outside the navbar
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // For mouse clicks
    document.addEventListener("touchstart", handleClickOutside); // For touch events

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [token, navigate]);  // Use a **single** dependency array

  return (
    <>
      <div className="nav-con">
        
        <nav className={`navbar ${isNavbarVisible ? "" : "navbar-hidden"}`} id="navbar" ref={navRef}>
          <Link to="/" >
            <div className="navbar-logo-container">
              <img
                src="https://static.wixstatic.com/media/a8353f_7ff69ee6a4554f56993ee82720450d16~mv2.png/v1/fill/w_316,h_60,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DYNAMIC%20LOGO.png"
                alt="Logo"
                className="navbar-logo-image"
              />
            </div>
          </Link>
          <div className="navbar-hamburger" onClick={toggleNav} ref={hamburgerRef} id="hamburger">
            <span className="navbar-line"></span>
            <span className="navbar-line"></span>
            <span className="navbar-line"></span>
          </div>
          <ul className={`navbar-links ${isNavActive ? "navbar-links-active" : ""}`} id="nav-links">
            <li>
              <Link to="/" >Home</Link>
            </li>
            {token ? (
              <>
                <li>
                  <a href="#" className="navbar-profile-button" onClick={(e) => { e.preventDefault(); checkJWTValidity();handleProfileToggle();}}>
                    Profile
                  </a>
                </li>
                {employeeRoles.some(r => r.roleName === role) && (
                  <>
                    {(actions.some(action => action.canView && (action.name === "GetAllEmployees" || action.name === "GetAllUsers"))) && (
                      <li key="manage-users">
                        <Link to="/manageusers" onClick={checkJWTValidity}>Manage Users</Link>
                      </li>
                    )}
                    {(actions.some(action => action.canView && (action.name === "ItemManagementBOPP" || action.name === "ItemManagementPET"))) && (
                      <li key="manage-items">
                        <Link to="/itemmanagement" onClick={checkJWTValidity}>Manage Items</Link>
                      </li>
                    )}
                  </>
                )}
                <li>
                  <a href="#" onClick={handleLogout} style={{ color: window.innerWidth < 768 ? "rgb(0,0,01)" : "rgb(0,0,01)", fontWeight: window.innerWidth < 768 ? "" : "" }}>
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Render the Profile slide-in card */}
      {isProfileOpen && <Profile onClose={toggleProfile} />}
      <Profile
        isVisible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />
       {/* Display error and success messages */}
       {errorMessage && (
        <ManageUserError errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
      )}
      {successMessage && (
        <ManageUserSuccess successMessage={successMessage} onClose={() => setSuccessMessage('')} />
      )}
    </>
  );
};

export default NavBar;
