// Reusable Component
import React from 'react';
import { formatTime, formatDate } from '../utils/api';

const ActivityLogTable = ({ activityLogs }) => {
  const getStatusBadge = (status) => {
    const baseClass = 'status-badge';
    switch (status) {
      case 'active':
        return `${baseClass} status-active`;
      case 'completed':
        return `${baseClass} status-completed`;
      default:
        return baseClass;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Parked';
      case 'completed':
        return 'Exited';
      default:
        return status;
    }
  };

  return (
    <div className="activity-log-container">
      <div className="activity-log-header">
        <h2>Recent Activity</h2>
        <div className="refresh-indicator">
          <div className="pulse-dot"></div>
          <span>Live</span>
        </div>
      </div>
      
      <div className="activity-table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Plate Number</th>
              <th>Slot</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <tr key={log.id} className={`activity-row ${log.status}`}>
                  <td className="plate-number">
                    <span className="plate-badge">{log.plateNumber}</span>
                  </td>
                  <td className="slot-number">
                    <span className="slot-badge">{log.slotNumber}</span>
                  </td>
                  <td className="entry-time">
                    <div className="time-info">
                      <span className="time">{formatTime(log.entryTime)}</span>
                      <span className="date">{formatDate(log.entryTime)}</span>
                    </div>
                  </td>
                  <td className="exit-time">
                    {log.exitTime ? (
                      <div className="time-info">
                        <span className="time">{formatTime(log.exitTime)}</span>
                        <span className="date">{formatDate(log.exitTime)}</span>
                      </div>
                    ) : (
                      <span className="no-exit">Still parked</span>
                    )}
                  </td>
                  <td className="status">
                    <span className={getStatusBadge(log.status)}>
                      {getStatusText(log.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-activity">
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <p>No recent activity</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="activity-footer">
        <p>Showing last {activityLogs.length} activities</p>
        <button className="view-all-btn">View All Activity</button>
      </div>
    </div>
  );
};

export default ActivityLogTable;
