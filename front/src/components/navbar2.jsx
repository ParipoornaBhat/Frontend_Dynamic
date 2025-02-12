import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Profile from "../pages/general/Profile"; // Ensure correct path to Profile
import "../css/navBar.css";
import logo from "../assets/Untitled.jpg";

const NavBar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [actions, setActions] = useState({});
  const [employeeRoles, setEmpRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isNavActive, setIsNavActive] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mouseAtTop, setMouseAtTop] = useState(false);
  const token = localStorage.getItem("token");
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile state
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const navRef = useRef(); // Reference for the navbar element
  const hamburgerRef = useRef(); // Reference for the hamburger button

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
      alert("You are not logged in.");
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
      } else {
        console.error("Logout failed:", response.status, response.data);
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out. Please check your connection or try again later.");
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
        setRole(storedRole);

        if (!storedRole) {
          console.error("No role found in localStorage");
          alert("No role found in localStorage");
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
          console.error(`Error fetching roles1: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching roles2:", error);
      }
    };

    if (token) {
      fetchRoles();
    } else {
      console.warn("No token found in localStorage.");
    }

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
  }, [token]);

  return (
    <>
      <div className="nav-con">
        <nav className={`navbar ${isNavbarVisible ? "" : "navbar-hidden"}`} id="navbar" ref={navRef}>
          <Link to="/">
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
              <Link to="/">Home</Link>
            </li>
            {token ? (
              <>
                <li>
                  <a href="#" className="navbar-profile-button" onClick={(e) => { e.preventDefault(); handleProfileToggle(); }}>
                    Profile
                  </a>
                </li>
                {employeeRoles.some(r => r.roleName === role) && (
                  <>
                    {(actions.some(action => action.canView && (action.name === "GetAllEmployees" || action.name === "GetAllUsers"))) && (
                      <li key="manage-users">
                        <Link to="/manageusers">Manage Users</Link>
                      </li>
                    )}
                    {(actions.some(action => action.canView && (action.name === "ItemManagementBOPP" || action.name === "ItemManagementPET"))) && (
                      <li key="manage-items">
                        <Link to="/itemmanagement">Manage Items</Link>
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
    </>
  );
};

export default NavBar;
