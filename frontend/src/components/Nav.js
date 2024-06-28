import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Nav.css";
import logo from "../image/logo.jpg";
import { FaFacebook, FaInstagram } from "react-icons/fa";

function Nav({ isLoggedIn, userName, handleLogout }) {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="navbar-center">
        <div className="header-text">
          <h1>Ottawa Tamil Sangam</h1>
          <nav className="nav-menu">
            <ul>
              <li>
                <NavLink to="/" activeclassname="active">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/event" activeclassname="active">
                  Event
                </NavLink>
              </li>
              <li>
                <NavLink to="/membership" activeclassname="active">
                  Membership
                </NavLink>
              </li>
              <li>
                <NavLink to="/volunteer" activeclassname="active">
                  Volunteer
                </NavLink>
              </li>
              <li>
                <NavLink to="/news" activeclassname="active">
                  News
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact-us" activeclassname="active">
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="user-info">
            <h3>Welcome, {userName}</h3>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="social-login-container">
            <div className="social-icons">
              <a href="https://www.facebook.com/TamilSangamofOttawa" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/ottawatamilsangam/" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>
            <button className="login-button" onClick={() => navigate("/login")}>
              Log In
            </button>
            <button className="login-button" onClick={() => navigate("/register")}>
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
