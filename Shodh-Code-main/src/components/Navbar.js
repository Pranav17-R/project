import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Shodhcode</span>
          </Link>
        </div>

        <div className="navbar-search">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search problems, topics, or tags..."
              className="search-input"
            />
          </div>
        </div>

        <div className="navbar-actions">
          <button className="navbar-btn">
            <FiBell />
            <span className="notification-badge">3</span>
          </button>
          <button className="navbar-btn">
            <FiUser />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 