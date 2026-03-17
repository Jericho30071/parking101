// Reusable Component
import React from 'react';
import { formatTime, formatCurrency } from '../utils/api.js';

const PaymentModal = ({ slot, hourlyRate, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !slot) return null;

  const calculatePayment = () => {
    if (!slot.entryTime) return { duration: 'N/A', hours: 0, cost: 0 };

    const entry = new Date(slot.entryTime);
    const exit = new Date();
    const durationMs = exit - entry;
    
    // Calculate hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    // Calculate cost (minimum 1 hour charge, round up partial hours)
    const totalHours = Math.max(1, hours + (minutes > 0 ? 1 : 0));
    const cost = totalHours * hourlyRate;
    
    return {
      duration: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      totalHours,
      cost: Math.round(cost * 100) / 100,
      entryTime: entry,
      exitTime: exit
    };
  };

  const payment = calculatePayment();

  const handleConfirm = () => {
    onConfirm(payment.cost);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Payment Summary</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="payment-summary">
            <div className="payment-row">
              <span>Vehicle Plate:</span>
              <span className="font-bold">{slot.vehiclePlate}</span>
            </div>
            <div className="payment-row">
              <span>Slot Number:</span>
              <span>{slot.number}</span>
            </div>
            <div className="payment-row">
              <span>Entry Time:</span>
              <span>{formatTime(slot.entryTime)}</span>
            </div>
            <div className="payment-row">
              <span>Exit Time:</span>
              <span>{formatTime(payment.exitTime.toISOString())}</span>
            </div>
            <div className="payment-row">
              <span>Duration:</span>
              <span className="font-semibold">{payment.duration}</span>
            </div>
            <div className="payment-row">
              <span>Hourly Rate:</span>
              <span>{formatCurrency(hourlyRate)}</span>
            </div>
            <div className="payment-row">
              <span>Billable Hours:</span>
              <span>{payment.totalHours} hrs</span>
            </div>
            <div className="payment-row">
              <span>Total Amount Due:</span>
              <span className="payment-amount text-xl">{formatCurrency(payment.cost)}</span>
            </div>
          </div>

          <div className="payment-instructions">
            <h4>Smart Payment System</h4>
            <p>
              The driver has been notified of the total parking fee. 
              Payment is automatically processed through the smart parking system. 
              Click "Confirm Release" to complete the transaction and free the slot.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handleConfirm}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Confirm Release
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
