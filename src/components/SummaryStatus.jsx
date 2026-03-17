import React from 'react';

const SummaryStatus = ({ parkingSlots, activityLogs, totalRevenue, hourlyRate }) => {
  const totalSlots = parkingSlots.length;
  const occupiedSlots = parkingSlots.filter(slot => slot.isOccupied).length;
  const availableSlots = totalSlots - occupiedSlots;
  const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  // Calculate today's activity
  const today = new Date().toDateString();
  const todayActivity = activityLogs.filter(log => 
    new Date(log.entryTime).toDateString() === today
  );
  
  const todayVehicles = todayActivity.length;
  const todayRevenue = todayActivity
    .filter(log => log.status === 'completed' && log.fee)
    .reduce((sum, log) => sum + log.fee, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getOccupancyColor = (rate) => {
    if (rate >= 80) return '#ef4444';
    if (rate >= 60) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="summary-status">
      <div className="status-header">
        <h2>Parking Summary</h2>
        <div className="status-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="status-overview">
        <div className="overview-cards">
          <div className="status-card">
            <div className="card-icon total">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="card-content">
              <h3>Total Slots</h3>
              <p className="card-value">{totalSlots}</p>
            </div>
          </div>

          <div className="status-card">
            <div className="card-icon occupied">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>Occupied</h3>
              <p className="card-value">{occupiedSlots}</p>
            </div>
          </div>

          <div className="status-card">
            <div className="card-icon available">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <div className="card-content">
              <h3>Available</h3>
              <p className="card-value">{availableSlots}</p>
            </div>
          </div>

          <div className="status-card">
            <div className="card-icon revenue">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="card-content">
              <h3>Total Revenue</h3>
              <p className="card-value">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="occupancy-gauge">
          <div className="gauge-container">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={getOccupancyColor(occupancyRate)}
                strokeWidth="20"
                strokeDasharray={`${(occupancyRate / 100) * 502.4} 502.4`}
                strokeDashoffset="125.6"
                transform="rotate(-90 100 100)"
                className="gauge-progress"
              />
              <text x="100" y="90" textAnchor="middle" className="gauge-value">
                {occupancyRate}%
              </text>
              <text x="100" y="115" textAnchor="middle" className="gauge-label">
                Occupancy Rate
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className="status-details">
        <div className="detail-section">
          <h3>Today's Activity</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Vehicles Parked</span>
              <span className="detail-value">{todayVehicles}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Today's Revenue</span>
              <span className="detail-value">{formatCurrency(todayRevenue)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hourly Rate</span>
              <span className="detail-value">{formatCurrency(hourlyRate)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Average Stay</span>
              <span className="detail-value">2.5 hrs</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Peak Hours</h3>
          <div className="peak-hours">
            <div className="hour-bar">
              <span>8AM - 12PM</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '75%' }}></div>
              </div>
              <span>75%</span>
            </div>
            <div className="hour-bar">
              <span>12PM - 4PM</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '90%' }}></div>
              </div>
              <span>90%</span>
            </div>
            <div className="hour-bar">
              <span>4PM - 8PM</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: '60%' }}></div>
              </div>
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStatus;
