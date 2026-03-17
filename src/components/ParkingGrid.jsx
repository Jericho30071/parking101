// Reusable Component
import React from 'react';
import ParkingSlot from './ParkingSlot';

const ParkingGrid = ({ parkingSlots, onSlotClick }) => {
  // Group slots by row (A, B, C, etc.)
  const groupSlotsByRow = (slots) => {
    const grouped = {};
    slots.forEach(slot => {
      const row = slot.number[0]; // Get first character (A, B, C, etc.)
      if (!grouped[row]) {
        grouped[row] = [];
      }
      grouped[row].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByRow(parkingSlots);
  const rows = Object.keys(groupedSlots).sort();

  return (
    <div className="parking-grid-container">
      <div className="parking-grid-header">
        <h2>Parking Slots Overview</h2>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color occupied"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>
      
      <div className="parking-grid">
        {rows.map(row => (
          <div key={row} className="parking-row">
            <div className="row-label">Row {row}</div>
            <div className="row-slots">
              {groupedSlots[row].map(slot => (
                <ParkingSlot 
                  key={slot.id} 
                  slot={slot} 
                  onClick={onSlotClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid-footer">
        <p>Total Slots: {parkingSlots.length}</p>
        <p>Click on any slot for more details</p>
      </div>
    </div>
  );
};

export default ParkingGrid;
