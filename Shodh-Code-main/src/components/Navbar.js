import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
          <div className="user-menu">
            <button 
              className="navbar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FiUser />
              <span className="user-name">{user?.username}</span>
              {isAdmin && <span className="admin-badge">Admin</span>}
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-email">{user?.email}</div>
                  <div className="user-role">{user?.role}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">
                  <FiSettings />
                  Settings
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 