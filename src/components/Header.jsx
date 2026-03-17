// Reusable Component
import React from 'react';

const Header = ({ adminName, onLogout }) => {
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="system-info">
          <h1 className="system-title">🚗 Smart Parking System</h1>
          <p className="system-subtitle">Admin Dashboard</p>
        </div>
        
        <div className="header-right">
          <div className="datetime-display">
            <span className="current-time">{currentTime}</span>
          </div>
          
          <div className="admin-profile">
            <div className="profile-info">
              <span className="admin-name">{adminName || 'Admin User'}</span>
              <span className="admin-role">Administrator</span>
            </div>
            <div className="profile-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          
          <button className="logout-btn" onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
