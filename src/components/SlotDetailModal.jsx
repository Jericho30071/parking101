// Reusable Component
import React, { useState, useEffect } from 'react';
import { formatTime, formatDate, formatCurrency, calculateParkingFee } from '../utils/api.js';

const SlotDetailModal = ({ slot, hourlyRate, isOpen, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second to show real-time cost
  useEffect(() => {
    if (!isOpen || !slot?.isOccupied) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, slot]);

  if (!isOpen || !slot) return null;

  const getDurationAndCost = () => {
    if (!slot.isOccupied || !slot.entryTime) {
      return { duration: 'N/A', cost: 0 };
    }

    const entry = new Date(slot.entryTime);
    const now = currentTime;
    const durationMs = now - entry;
    
    // Calculate hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    // Calculate cost (minimum 1 hour charge)
    const totalHours = Math.max(1, hours + (minutes > 0 ? 1 : 0));
    const cost = calculateParkingFee(slot.entryTime, now.toISOString(), hourlyRate);
    
    return {
      duration: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      totalHours,
      cost,
      rawDuration: durationMs
    };
  };

  const { duration, totalHours, cost } = getDurationAndCost();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal slot-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Slot {slot.number} Details</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Slot Status */}
          <div className="slot-status-section">
            <div className={`status-badge-large ${slot.isOccupied ? 'occupied' : 'available'}`}>
              {slot.isOccupied ? 'Occupied' : 'Available'}
            </div>
          </div>

          {slot.isOccupied ? (
            <>
              {/* Vehicle Information */}
              <div className="detail-section">
                <h4>Vehicle Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Plate Number</span>
                    <span className="detail-value">{slot.vehiclePlate || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Vehicle Type</span>
                    <span className="detail-value capitalize">{slot.vehicleType || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Parking Duration */}
              <div className="detail-section">
                <h4>Parking Duration</h4>
                <div className="duration-display">
                  <div className="duration-value">{duration}</div>
                  <div className="duration-label">Time Parked</div>
                </div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Entry Time</span>
                    <span className="detail-value">{formatTime(slot.entryTime)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Entry Date</span>
                    <span className="detail-value">{formatDate(slot.entryTime)}</span>
                  </div>
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="detail-section cost-section">
                <h4>Current Cost</h4>
                <div className="cost-breakdown">
                  <div className="cost-item">
                    <span className="cost-label">Hourly Rate</span>
                    <span className="cost-value">{formatCurrency(hourlyRate)}</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Billable Hours</span>
                    <span className="cost-value">{totalHours} hrs</span>
                  </div>
                  <div className="cost-divider"></div>
                  <div className="cost-item total">
                    <span className="cost-label">Total Cost</span>
                    <span className="cost-value total">{formatCurrency(cost)}</span>
                  </div>
                </div>
                <div className="cost-note">
                  * Minimum charge is 1 hour. Cost updates in real-time.
                </div>
              </div>
            </>
          ) : (
            <div className="available-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <p>This slot is currently available for parking.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotDetailModal;
