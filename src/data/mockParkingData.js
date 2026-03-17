// Mock parking slots data
export const mockParkingSlots = [
  { id: 1, number: 'A1', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
  { id: 2, number: 'A2', isOccupied: true, vehicleType: 'car', vehiclePlate: 'ABC-123', entryTime: '2026-02-18T10:30:00' },
  { id: 3, number: 'A3', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
  { id: 4, number: 'A4', isOccupied: true, vehicleType: 'suv', vehiclePlate: 'XYZ-789', entryTime: '2026-02-18T09:15:00' },
  { id: 5, number: 'A5', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
  { id: 6, number: 'B1', isOccupied: true, vehicleType: 'car', vehiclePlate: 'DEF-456', entryTime: '2026-02-18T11:45:00' },
  { id: 7, number: 'B2', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
  { id: 8, number: 'B3', isOccupied: true, vehicleType: 'motorcycle', vehiclePlate: 'GHI-012', entryTime: '2026-02-18T12:00:00' },
  { id: 9, number: 'B4', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
  { id: 10, number: 'B5', isOccupied: true, vehicleType: 'car', vehiclePlate: 'JKL-345', entryTime: '2026-02-18T13:20:00' },
  { id: 11, number: 'C1', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
  { id: 12, number: 'C2', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
  { id: 13, number: 'C3', isOccupied: true, vehicleType: 'truck', vehiclePlate: 'MNO-678', entryTime: '2026-02-18T08:00:00' },
  { id: 14, number: 'C4', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
  { id: 15, number: 'C5', isOccupied: false, vehicleType: null, vehiclePlate: null, entryTime: null },
];

// Mock activity logs
export const mockActivityLogs = [
  { id: 1, plateNumber: 'ABC-123', slotNumber: 'A2', entryTime: '2026-02-18T10:30:00', exitTime: null, status: 'active', fee: null },
  { id: 2, plateNumber: 'XYZ-789', slotNumber: 'A4', entryTime: '2026-02-18T09:15:00', exitTime: '2026-02-18T11:30:00', status: 'completed', fee: 5.00 },
  { id: 3, plateNumber: 'DEF-456', slotNumber: 'B1', entryTime: '2026-02-18T11:45:00', exitTime: null, status: 'active', fee: null },
  { id: 4, plateNumber: 'GHI-012', slotNumber: 'B3', entryTime: '2026-02-18T12:00:00', exitTime: null, status: 'active', fee: null },
  { id: 5, plateNumber: 'JKL-345', slotNumber: 'B5', entryTime: '2026-02-18T13:20:00', exitTime: null, status: 'active', fee: null },
  { id: 6, plateNumber: 'MNO-678', slotNumber: 'C3', entryTime: '2026-02-18T08:00:00', exitTime: '2026-02-18T14:15:00', status: 'completed', fee: 312.50 },
  { id: 7, plateNumber: 'PQR-901', slotNumber: 'A1', entryTime: '2026-02-18T07:30:00', exitTime: '2026-02-18T09:00:00', status: 'completed', fee: 100.00 },
  { id: 8, plateNumber: 'STU-234', slotNumber: 'B2', entryTime: '2026-02-18T14:00:00', exitTime: null, status: 'active', fee: null },
];

// Configuration
export const parkingConfig = {
  hourlyRate: 50.00, // ₱50.00 per hour
  currency: 'PHP',
  timeFormat: '12-hour',
};
