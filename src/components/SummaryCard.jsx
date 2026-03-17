// Reusable Component
import React from 'react';

const SummaryCard = ({ title, value, icon, color, trend }) => {
  const getCardClass = () => {
    const baseClass = 'summary-card';
    switch (color) {
      case 'green':
        return `${baseClass} summary-card-green`;
      case 'red':
        return `${baseClass} summary-card-red`;
      case 'blue':
        return `${baseClass} summary-card-blue`;
      case 'orange':
        return `${baseClass} summary-card-orange`;
      default:
        return baseClass;
    }
  };

  return (
    <div className={getCardClass()}>
      <div className="card-icon">
        {icon}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
        {trend && (
          <div className="card-trend">
            <span className={`trend-indicator ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="trend-text">from last hour</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
