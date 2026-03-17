import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ParkingScreen = ({ navigation }) => {
  const [parkingSlots, setParkingSlots] = useState([
    { id: 1, number: 'A1', isOccupied: true, vehiclePlate: 'ABC-123', vehicleType: 'car', entryTime: '2024-03-17T14:30:00Z' },
    { id: 2, number: 'A2', isOccupied: false, vehiclePlate: null, vehicleType: null, entryTime: null },
    { id: 3, number: 'B1', isOccupied: true, vehiclePlate: 'XYZ-456', vehicleType: 'suv', entryTime: '2024-03-17T13:15:00Z' },
    { id: 4, number: 'B2', isOccupied: false, vehiclePlate: null, vehicleType: null, entryTime: null },
    { id: 5, number: 'C1', isOccupied: false, vehiclePlate: null, vehicleType: null, entryTime: null },
  ]);

  const ParkingSlotCard = ({ slot }) => (
    <View style={[styles.slotCard, slot.isOccupied ? styles.occupiedCard : styles.availableCard]}>
      <View style={styles.slotHeader}>
        <Text style={styles.slotNumber}>{slot.number}</Text>
        <View style={[styles.statusBadge, { backgroundColor: slot.isOccupied ? '#ef4444' : '#10b981' }]}>
          <Text style={styles.statusText}>{slot.isOccupied ? 'Occupied' : 'Available'}</Text>
        </View>
      </View>
      
      <View style={styles.slotContent}>
        {slot.isOccupied ? (
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehiclePlate}>{slot.vehiclePlate}</Text>
            <Text style={styles.vehicleType}>{slot.vehicleType}</Text>
            <Text style={styles.entryTime}>
              Since {new Date(slot.entryTime).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.assignButton}
            onPress={() => {
              Alert.alert(
                'Assign Vehicle',
                `Assign vehicle to slot ${slot.number}?`,
                [
                  { text: 'Assign', onPress: () => handleAssignVehicle(slot) },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
          >
            <Text style={styles.assignButtonText}>Assign Vehicle</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.slotActions}>
        {slot.isOccupied && (
          <TouchableOpacity 
            style={styles.releaseButton}
            onPress={() => {
              Alert.alert(
                'Release Vehicle',
                `Release vehicle from slot ${slot.number}?`,
                [
                  { text: 'Release', onPress: () => handleReleaseVehicle(slot) },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
          >
            <Text style={styles.buttonText}>Release</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            Alert.alert(
              'Edit Slot',
              `Edit slot ${slot.number}?`,
              [
                { text: 'Edit Number', onPress: () => handleEditSlot(slot) },
                { text: 'Edit Vehicle', onPress: () => handleEditVehicle(slot), style: 'cancel' },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAssignVehicle = (slot) => {
    // Simulate vehicle assignment
    Alert.alert('Success', `Vehicle assigned to slot ${slot.number}`);
  };

  const handleReleaseVehicle = (slot) => {
    // Simulate vehicle release
    Alert.alert('Success', `Vehicle released from slot ${slot.number}`);
  };

  const handleEditSlot = (slot) => {
    // Simulate slot editing
    Alert.alert('Success', `Slot ${slot.number} updated`);
  };

  const handleEditVehicle = (slot) => {
    // Simulate vehicle editing
    Alert.alert('Success', `Vehicle details updated for slot ${slot.number}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Parking Management</Text>
      
      <View style={styles.slotsGrid}>
        {parkingSlots.map(slot => (
          <ParkingSlotCard key={slot.id} slot={slot} />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          Alert.alert(
            'Add Slot',
            'Add new parking slot?',
            [
              { text: 'Add', onPress: () => Alert.alert('Coming Soon', 'Add slot functionality will be available') },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }}
      >
        <Text style={styles.addButtonText}>+ Add Slot</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  slotCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  occupiedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  availableCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  slotNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  slotContent: {
    minHeight: 80,
  },
  vehicleInfo: {
    alignItems: 'center',
  },
  vehiclePlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  entryTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  slotActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  assignButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  releaseButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ParkingScreen;
