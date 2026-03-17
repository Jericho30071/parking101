// Mock API functions to simulate backend calls
import { mockParkingSlots, mockActivityLogs, parkingConfig } from '../data/mockParkingData.js';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get parking slots data
export const fetchParkingSlots = async () => {
  await delay(500);
  return [...mockParkingSlots];
};

// Get activity logs
export const fetchActivityLogs = async () => {
  await delay(300);
  return [...mockActivityLogs];
};

// Get parking configuration
export const fetchParkingConfig = async () => {
  await delay(200);
  return { ...parkingConfig };
};

// Add new parking slot
export const addParkingSlot = async (slotNumber) => {
  await delay(300);
  const newSlot = {
    id: Math.max(...mockParkingSlots.map(s => s.id)) + 1,
    number: slotNumber.toUpperCase(),
    isOccupied: false,
    vehicleType: null,
    vehiclePlate: null,
    entryTime: null
  };
  mockParkingSlots.push(newSlot);
  return newSlot;
};

// Assign vehicle to parking slot
export const assignVehicleToSlot = async (slotId, vehiclePlate, vehicleType = 'car') => {
  await delay(400);
  const slot = mockParkingSlots.find(s => s.id === slotId);
  if (slot && !slot.isOccupied) {
    slot.isOccupied = true;
    slot.vehiclePlate = vehiclePlate.toUpperCase();
    slot.vehicleType = vehicleType;
    slot.entryTime = new Date().toISOString();
    
    // Add to activity logs
    const newLog = {
      id: Math.max(...mockActivityLogs.map(l => l.id)) + 1,
      plateNumber: vehiclePlate.toUpperCase(),
      slotNumber: slot.number,
      entryTime: slot.entryTime,
      exitTime: null,
      status: 'active',
      fee: null
    };
    mockActivityLogs.unshift(newLog);
    
    return slot;
  }
  throw new Error('Slot not available');
};

// Release vehicle from parking slot
export const releaseVehicleFromSlot = async (slotId) => {
  await delay(400);
  const slot = mockParkingSlots.find(s => s.id === slotId);
  if (slot && slot.isOccupied) {
    const exitTime = new Date().toISOString();
    const entryTime = new Date(slot.entryTime);
    const durationHours = (exitTime - entryTime) / (1000 * 60 * 60);
    const fee = Math.ceil(durationHours * parkingConfig.hourlyRate * 100) / 100;
    
    // Update activity log
    const log = mockActivityLogs.find(l => 
      l.plateNumber === slot.vehiclePlate && 
      l.slotNumber === slot.number && 
      l.status === 'active'
    );
    
    if (log) {
      log.exitTime = exitTime;
      log.status = 'completed';
      log.fee = fee;
    }
    
    // Clear slot
    const vehicleInfo = {
      vehiclePlate: slot.vehiclePlate,
      entryTime: slot.entryTime,
      exitTime: exitTime,
      fee: fee,
      duration: durationHours
    };
    
    slot.isOccupied = false;
    slot.vehicleType = null;
    slot.vehiclePlate = null;
    slot.entryTime = null;
    
    return vehicleInfo;
  }
  throw new Error('No vehicle to release');
};

// Calculate parking fee
export const calculateParkingFee = (entryTime, exitTime, hourlyRate = parkingConfig.hourlyRate) => {
  if (!entryTime || !exitTime) return 0;
  
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const durationHours = (exit - entry) / (1000 * 60 * 60);
  
  // Minimum charge is 1 hour
  const billableHours = Math.max(1, Math.ceil(durationHours));
  return Math.round(billableHours * hourlyRate * 100) / 100;
};

// Get total revenue
export const getTotalRevenue = async () => {
  await delay(200);
  return mockActivityLogs
    .filter(log => log.status === 'completed' && log.fee)
    .reduce((sum, log) => sum + log.fee, 0);
};

// Simulate real-time parking slot updates
export const simulateParkingUpdate = async () => {
  await delay(1000);
  const randomSlotIndex = Math.floor(Math.random() * mockParkingSlots.length);
  const slot = mockParkingSlots[randomSlotIndex];
  
  // Only update if probability is right (to avoid too frequent changes)
  if (Math.random() > 0.7) {
    if (slot.isOccupied) {
      // Randomly release some vehicles
      if (Math.random() > 0.5) {
        try {
          await releaseVehicleFromSlot(slot.id);
        } catch {
          // Ignore if no vehicle to release
        }
      }
    } else {
      // Randomly assign vehicles
      if (Math.random() > 0.6) {
        const randomPlate = `TEST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        try {
          await assignVehicleToSlot(slot.id, randomPlate);
        } catch {
          // Ignore if slot not available
        }
      }
    }
  }
  
  return [...mockParkingSlots];
};

// Update parking configuration
export const updateParkingConfig = async (config) => {
  await delay(300);
  Object.assign(parkingConfig, config);
  return { ...parkingConfig };
};

// Format time for display
export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Format duration
export const formatDuration = (entryTime, exitTime = null) => {
  const start = new Date(entryTime);
  const end = exitTime ? new Date(exitTime) : new Date();
  const durationMs = end - start;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Format currency
export const formatCurrency = (amount, currency = 'PHP') => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
