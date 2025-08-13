import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiList, 
  FiPlus, 
  FiTrendingUp, 
  FiBarChart, 
  FiSettings,
  FiBookmark,
  FiTarget
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      icon: FiHome,
      label: 'Dashboard',
      description: 'Overview and statistics'
    },
    {
      path: '/problems',
      icon: FiList,
      label: 'Problems',
      description: 'View all saved problems'
    },
    {
      path: '/add-problem',
      icon: FiPlus,
      label: 'Add Problem',
      description: 'Save a new problem'
    },
    {
      path: '/recommendations',
      icon: FiTrendingUp,
      label: 'Recommendations',
      description: 'AI-powered suggestions'
    },
    {
      path: '/progress',
      icon: FiBarChart,
      label: 'Progress',
      description: 'Track your learning'
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <div className="sidebar-item-icon">
                  <Icon />
                </div>
                <div className="sidebar-item-content">
                  <span className="sidebar-item-label">{item.label}</span>
                  <span className="sidebar-item-description">{item.description}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <FiBookmark />
                <span>Bookmarks</span>
              </button>
              <button className="quick-action-btn">
                <FiTarget />
                <span>Goals</span>
              </button>
            </div>
          </div>
          
          <div className="sidebar-section">
            <Link to="/settings" className="sidebar-item">
              <div className="sidebar-item-icon">
                <FiSettings />
              </div>
              <div className="sidebar-item-content">
                <span className="sidebar-item-label">Settings</span>
                <span className="sidebar-item-description">Preferences</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 