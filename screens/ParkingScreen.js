import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import WebLikeLayout from './WebLikeLayout'

const ParkingScreen = ({ navigation }) => {
  const [parkingSlots] = useState([
    { id: 1, number: 'F1', isOccupied: true, vehiclePlate: 'FAS1', vehicleType: 'car', entryTime: '10:05:45 PM' },
    { id: 2, number: 'F2', isOccupied: false, vehiclePlate: null, vehicleType: null, entryTime: null },
  ])

  const onAssign = (slot) => Alert.alert('Assign', `Assign vehicle to ${slot.number}`)
  const onRelease = (slot) => Alert.alert('Release', `Release vehicle from ${slot.number}`)
  const onEdit = (slot) => Alert.alert('Edit', `Edit ${slot.number}`)
  const onDelete = (slot) => Alert.alert('Delete', `Delete ${slot.number}`)

  return (
    <WebLikeLayout navigation={navigation} activeTab="Parking">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Parking Management</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>+ Add Slot</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Assign Vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.subheading}>Parking Slots</Text>

          {parkingSlots.map((slot) => (
            <View
              key={slot.id}
              style={[styles.slotCard, slot.isOccupied ? styles.slotOccupied : styles.slotAvailable]}
            >
              <View style={styles.slotInfo}>
                <Text style={styles.slotNumber}>{slot.number}</Text>
                <Text style={[styles.slotStatus, slot.isOccupied ? styles.textRed : styles.textGreen]}>
                  {slot.isOccupied ? 'Occupied' : 'Available'}
                </Text>
                {slot.vehiclePlate ? <Text style={styles.slotPlate}>{slot.vehiclePlate}</Text> : null}
                {slot.entryTime ? <Text style={styles.slotTime}>Since {slot.entryTime}</Text> : null}
              </View>

              <View style={styles.slotActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, slot.isOccupied ? styles.releaseBtn : styles.assignBtn]}
                  onPress={() => (slot.isOccupied ? onRelease(slot) : onAssign(slot))}
                >
                  <Text style={styles.actionBtnText}>{slot.isOccupied ? 'Release' : 'Assign'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => onEdit(slot)}>
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onDelete(slot)}>
                  <Text style={styles.actionBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </WebLikeLayout>
  )
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#1f2937' },
  subheading: { marginTop: 12, marginBottom: 10, fontSize: 15, fontWeight: '600', color: '#334155' },
  actionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 1 },
  primaryBtn: { backgroundColor: '#667eea', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryBtnText: { color: '#334155', fontSize: 12, fontWeight: '600' },
  slotCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  slotOccupied: { borderColor: '#fecaca', backgroundColor: '#fff5f5' },
  slotAvailable: { borderColor: '#86efac', backgroundColor: '#f0fdf4' },
  slotInfo: { gap: 2 },
  slotNumber: { fontSize: 22, fontWeight: '700', color: '#1f2937' },
  slotStatus: { fontSize: 12, fontWeight: '600' },
  textRed: { color: '#ef4444' },
  textGreen: { color: '#16a34a' },
  slotPlate: { fontSize: 12, color: '#334155' },
  slotTime: { fontSize: 11, color: '#64748b' },
  slotActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '55%' },
  actionBtn: { borderRadius: 7, paddingHorizontal: 10, paddingVertical: 7 },
  actionBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  releaseBtn: { backgroundColor: '#ef4444' },
  assignBtn: { backgroundColor: '#22c55e' },
  editBtn: { backgroundColor: '#667eea' },
  deleteBtn: { backgroundColor: '#94a3b8' },
})

export default ParkingScreen
