import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

const ParkingManagement = ({ parkingSlots, hourlyRate, onAddSlot, onAssignVehicle, onReleaseVehicle }) => {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAssignVehicle, setShowAssignVehicle] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newSlotNumber, setNewSlotNumber] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [slotToRelease, setSlotToRelease] = useState(null);

  const vehicleTypes = [
    { value: 'car', label: 'Car', icon: '🚗' },
    { value: 'suv', label: 'SUV', icon: '🚙' },
    { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
    { value: 'truck', label: 'Truck', icon: '🚚' },
    { value: 'van', label: 'Van', icon: '🚐' },
    { value: 'bicycle', label: 'Bicycle', icon: '🚲' }
  ];

  const handleAddSlot = () => {
    if (newSlotNumber.trim()) {
      onAddSlot(newSlotNumber.trim());
      setNewSlotNumber('');
      setShowAddSlot(false);
    }
  };

  const handleAssignVehicle = () => {
    if (selectedSlot && vehiclePlate.trim()) {
      onAssignVehicle(selectedSlot.id, vehiclePlate.trim(), vehicleType);
      setVehiclePlate('');
      setVehicleType('car');
      setSelectedSlot(null);
      setShowAssignVehicle(false);
    }
  };

  const handleReleaseClick = (slot) => {
    setSlotToRelease(slot);
    setShowPaymentModal(true);
  };

  const handleConfirmRelease = (paymentAmount) => {
    if (slotToRelease) {
      onReleaseVehicle(slotToRelease.id, paymentAmount);
      setSlotToRelease(null);
      setShowPaymentModal(false);
    }
  };

  const availableSlots = parkingSlots.filter(slot => !slot.isOccupied);

  return (
    <div className="parking-management">
      <div className="management-header">
        <h2>Parking Management</h2>
        <div className="management-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddSlot(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Slot
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAssignVehicle(true)}
            disabled={availableSlots.length === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
            </svg>
            Assign Vehicle
          </button>
        </div>
      </div>

      <div className="slots-list">
        <h3>Parking Slots</h3>
        <div className="slots-grid">
          {parkingSlots.map(slot => (
            <div key={slot.id} className={`slot-item ${slot.isOccupied ? 'occupied' : 'available'}`}>
              <div className="slot-info">
                <span className="slot-number">{slot.number}</span>
                <span className="slot-status">
                  {slot.isOccupied ? 'Occupied' : 'Available'}
                </span>
                {slot.isOccupied && slot.vehiclePlate && (
                  <span className="vehicle-plate">{slot.vehiclePlate}</span>
                )}
                {slot.isOccupied && slot.entryTime && (
                  <span className="entry-time">
                    Since {new Date(slot.entryTime).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="slot-actions">
                {slot.isOccupied ? (
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleReleaseClick(slot)}
                  >
                    Release
                  </button>
                ) : (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setSelectedSlot(slot);
                      setShowAssignVehicle(true);
                    }}
                  >
                    Assign
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddSlot && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Parking Slot</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddSlot(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Slot Number</label>
                <input
                  type="text"
                  value={newSlotNumber}
                  onChange={(e) => setNewSlotNumber(e.target.value)}
                  placeholder="e.g., D1, D2"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddSlot(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddSlot}
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Vehicle Modal */}
      {showAssignVehicle && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Vehicle to Slot</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAssignVehicle(false);
                  setSelectedSlot(null);
                  setVehiclePlate('');
                  setVehicleType('car');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Slot</label>
                <select
                  value={selectedSlot?.id || ''}
                  onChange={(e) => {
                    const slot = availableSlots.find(s => s.id === parseInt(e.target.value));
                    setSelectedSlot(slot);
                  }}
                >
                  <option value="">Choose a slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vehicle Plate Number</label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  placeholder="e.g., ABC-123"
                />
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="vehicle-type-select"
                >
                  {vehicleTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowAssignVehicle(false);
                  setSelectedSlot(null);
                  setVehiclePlate('');
                  setVehicleType('car');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAssignVehicle}
                disabled={!selectedSlot || !vehiclePlate.trim()}
              >
                Assign Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal 
        slot={slotToRelease}
        hourlyRate={hourlyRate}
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSlotToRelease(null);
        }}
        onConfirm={handleConfirmRelease}
      />
    </div>
  );
};

export default ParkingManagement;
