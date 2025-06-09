// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  // Close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={handleLinkClick}>
          TN events
        </Link>
        {user && (
          <>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
            <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
              <li>
                <Link to="/" onClick={handleLinkClick}>
                  Home
                </Link>
              </li>
              <li
                className="dropdown"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link to="/events" onClick={handleLinkClick}>
                  Events ▾
                </Link>
                {dropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/events/music" onClick={handleLinkClick}>
                        Music
                      </Link>
                    </li>
                    <li>
                      <Link to="/events/tech" onClick={handleLinkClick}>
                        Tech
                      </Link>
                    </li>
                    <li>
                      <Link to="/events/art" onClick={handleLinkClick}>
                        Art
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/contact" onClick={handleLinkClick}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={handleLinkClick}>
                  Dashboard
                </Link>
              </li>
               <li>
                <Link to="/about" onClick={handleLinkClick}>
                  About
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </ul>
          </>
        )}
        {/* Show dark mode toggle always */}
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        {/* When user is not logged in, show login/register links */}
        {!user && (
          <ul className="nav-menu">
            <li>
              <Link to="/login" onClick={handleLinkClick}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={handleLinkClick}>
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
