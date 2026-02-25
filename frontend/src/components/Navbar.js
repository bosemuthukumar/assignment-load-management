import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import "../styles/Navbar.css";

const Navbar = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = user?.role === "admin";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();

    if (isAdmin) {
      navigate("/admin/login");
    } else {
      navigate("/user/login");
    }
  };

  // const handleDashboardClick = () => {

  //   if (isAdmin) {
  //     navigate("/admin/dashboard");
  //   } else {
  //     navigate("/user/dashboard");
  //   }
  // };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Load Management</h1>
        </div>
        <div className="navbar-links">
          {isAuthenticated && (
            <div className="user-avatar-dropdown">
              <button
                className="avatar-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="avatar-image">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user?.name}</span>
              </button>
              {dropdownOpen && (
                <div className="avatar-dropdown-menu">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-role">
                      {isAdmin ? "Admin" : "User"}
                    </p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="dropdown-logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
