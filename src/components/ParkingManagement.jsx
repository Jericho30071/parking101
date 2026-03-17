import React, { useState } from 'react';
import PaymentModal from './PaymentModal';
import ConfirmDialog from './ConfirmDialog';

const ParkingManagement = ({ parkingSlots, hourlyRate, onAddSlot, onAssignVehicle, onReleaseVehicle, onDeleteSlot, onUpdateSlot, showNotification }) => {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAssignVehicle, setShowAssignVehicle] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newSlotNumber, setNewSlotNumber] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [slotToRelease, setSlotToRelease] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    slotId: null,
    title: '',
    message: ''
  });
  const [showEditSlot, setShowEditSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editSlotNumber, setEditSlotNumber] = useState('');
  const [editVehiclePlate, setEditVehiclePlate] = useState('');
  const [editVehicleType, setEditVehicleType] = useState('car');

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

  const handleDeleteSlot = (slotId) => {
    setConfirmDialog({
      isOpen: true,
      slotId: slotId,
      title: 'Delete Parking Slot',
      message: 'Are you sure you want to delete this parking slot? This action cannot be undone.',
      type: 'danger'
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const confirmDelete = () => {
    if (confirmDialog.slotId) {
      onDeleteSlot(confirmDialog.slotId);
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setEditSlotNumber(slot.number);
    if (slot.isOccupied) {
      setEditVehiclePlate(slot.vehiclePlate || '');
      setEditVehicleType(slot.vehicleType || 'car');
    } else {
      setEditVehiclePlate('');
      setEditVehicleType('car');
    }
    setShowEditSlot(true);
  };

  const handleUpdateSlot = () => {
    if (editingSlot && editSlotNumber.trim() && onUpdateSlot) {
      onUpdateSlot(editingSlot.id, editSlotNumber.trim(), editVehiclePlate, editVehicleType);
      setShowEditSlot(false);
      setEditingSlot(null);
      setEditSlotNumber('');
      setEditVehiclePlate('');
      setEditVehicleType('car');
    }
  };

  const handleDeleteSlotWithCheck = (slot) => {
    if (slot.isOccupied) {
      showNotification('Cannot Delete', 'Cannot delete slot that is currently occupied. Please release the vehicle first.', 'warning');
      return;
    }
    handleDeleteSlot(slot.id);
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
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
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
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    Assign
                  </button>
                )}
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEditSlot(slot)}
                  title="Edit slot"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDeleteSlotWithCheck(slot)}
                  disabled={slot.isOccupied}
                  title={slot.isOccupied ? "Cannot delete occupied slot" : "Delete slot"}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDelete}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Edit Slot Modal */}
      {showEditSlot && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingSlot?.isOccupied ? 'Edit Vehicle Assignment' : 'Edit Parking Slot'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowEditSlot(false);
                  setEditingSlot(null);
                  setEditSlotNumber('');
                  setEditVehiclePlate('');
                  setEditVehicleType('car');
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
                <label>Slot Number</label>
                <input
                  type="text"
                  value={editSlotNumber}
                  onChange={(e) => setEditSlotNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., A1, B2"
                />
              </div>
              {editingSlot?.isOccupied && (
                <>
                  <div className="form-group">
                    <label>Vehicle Plate Number</label>
                    <input
                      type="text"
                      value={editVehiclePlate}
                      onChange={(e) => setEditVehiclePlate(e.target.value.toUpperCase())}
                      placeholder="e.g., ABC-123"
                    />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Type</label>
                    <select
                      value={editVehicleType}
                      onChange={(e) => setEditVehicleType(e.target.value)}
                      className="vehicle-type-select"
                    >
                      {vehicleTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditSlot(false);
                  setEditingSlot(null);
                  setEditSlotNumber('');
                  setEditVehiclePlate('');
                  setEditVehicleType('car');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdateSlot}
                disabled={!editSlotNumber.trim()}
              >
                {editingSlot?.isOccupied ? 'Update Assignment' : 'Update Slot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingManagement;
