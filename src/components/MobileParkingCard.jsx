import React from 'react';
import './MobileParkingCard.css';

const MobileParkingCard = ({ slot, onAssign, onRelease, onEdit, onDelete }) => {
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'car':
        return '🚗';
      case 'suv':
        return '🚙';
      case 'motorcycle':
        return '🏍️';
      case 'truck':
        return '🚚';
      case 'van':
        return '🚐';
      case 'bicycle':
        return '🚲';
      default:
        return '🚗';
    }
  };

  return (
    <div className={`mobile-parking-card ${slot.isOccupied ? 'occupied' : 'available'}`}>
      <div className="mobile-card-header">
        <div className="mobile-slot-number">{slot.number}</div>
        <div className="mobile-status-badge">
          {slot.isOccupied ? 'Occupied' : 'Available'}
        </div>
      </div>
      
      <div className="mobile-card-content">
        {slot.isOccupied ? (
          <div className="mobile-vehicle-info">
            <div className="vehicle-icon">
              {getVehicleIcon(slot.vehicleType)}
            </div>
            <div className="vehicle-details">
              <div className="vehicle-plate">{slot.vehiclePlate}</div>
              <div className="vehicle-type">{slot.vehicleType}</div>
              <div className="entry-time">
                Since {new Date(slot.entryTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="available-slot-info">
            <div className="available-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <div className="available-text">Tap to assign vehicle</div>
          </div>
        )}
      </div>

      <div className="mobile-card-actions">
        {slot.isOccupied ? (
          <div className="mobile-action-buttons">
            <button 
              className="mobile-btn mobile-btn-release"
              onClick={() => onRelease(slot)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H1m7 0v4a2 2 0 0 1 2 2h1m-7 0v4a2 2 0 0 1 2 2h1"/>
              </svg>
              Release
            </button>
            <button 
              className="mobile-btn mobile-btn-edit"
              onClick={() => onEdit(slot)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
              Edit
            </button>
          </div>
        ) : (
          <button 
            className="mobile-btn mobile-btn-assign"
            onClick={() => onAssign(slot)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6v6l4 2"/>
              <path d="M12 6l-4-2"/>
            </svg>
            Assign Vehicle
          </button>
        )}
        
        {!slot.isOccupied && (
          <button 
            className="mobile-btn mobile-btn-delete"
            onClick={() => onDelete(slot)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileParkingCard;
