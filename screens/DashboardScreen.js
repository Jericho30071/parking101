import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import WebLikeLayout from './WebLikeLayout'

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalSlots: 2,
    occupiedSlots: 1,
    availableSlots: 1,
    totalRevenue: 60.0,
    occupancyRate: 50,
  })

  useEffect(() => {
    setTimeout(() => {
      setStats((prev) => ({ ...prev }))
    }, 500)
  }, [])

  const cardData = [
    { key: 'total', title: 'TOTAL SLOTS', value: stats.totalSlots, icon: '▣', border: '#60a5fa' },
    { key: 'occ', title: 'OCCUPIED', value: stats.occupiedSlots, icon: '🚗', border: '#f87171' },
    { key: 'avail', title: 'AVAILABLE', value: stats.availableSlots, icon: '◔', border: '#4ade80' },
    { key: 'rate', title: 'OCCUPANCY RATE', value: `${stats.occupancyRate}%`, icon: '▥', border: '#f59e0b' },
  ]

  return (
    <WebLikeLayout navigation={navigation} activeTab="Dashboard">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <View style={styles.cardsRow}>
            {cardData.map((card) => (
              <View key={card.key} style={[styles.summaryCard, { borderTopColor: card.border }]}>
                <Text style={styles.summaryTitle}>{card.title}</Text>
                <Text style={styles.summaryValue}>{card.value}</Text>
                <Text style={styles.summaryIcon}>{card.icon}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Parking Slots Overview</Text>
            <View style={styles.legendRow}>
              <Text style={styles.legendItem}>🟩 Available</Text>
              <Text style={styles.legendItem}>🟥 Occupied</Text>
            </View>
          </View>

          <View style={[styles.slotRow, styles.slotOccupied]}>
            <Text style={styles.slotNumber}>F1</Text>
            <Text style={styles.slotMeta}>CAR</Text>
            <Text style={styles.slotTime}>Since 10:05 PM</Text>
          </View>
          <View style={[styles.slotRow, styles.slotAvailable]}>
            <Text style={styles.slotNumber}>F2</Text>
            <Text style={styles.slotMeta}>Available</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>PLATE NUMBER</Text>
            <Text style={styles.tableCell}>SLOT</Text>
            <Text style={styles.tableCell}>STATUS</Text>
          </View>
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
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e5eaf0',
    borderTopWidth: 3,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  summaryTitle: { fontSize: 10, fontWeight: '700', color: '#64748b', letterSpacing: 0.3 },
  summaryValue: { fontSize: 30, fontWeight: '700', color: '#0f172a', marginVertical: 6 },
  summaryIcon: { fontSize: 18, color: '#334155' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#1f2937' },
  legendRow: { flexDirection: 'row', gap: 10 },
  legendItem: { fontSize: 11, color: '#64748b' },
  slotRow: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  slotOccupied: { backgroundColor: '#fff5f5', borderColor: '#fecaca' },
  slotAvailable: { backgroundColor: '#f0fdf4', borderColor: '#86efac' },
  slotNumber: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  slotMeta: { fontSize: 12, color: '#475569', marginTop: 2, textTransform: 'uppercase' },
  slotTime: { fontSize: 11, color: '#64748b', marginTop: 2 },
  tableHeader: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e5eaf0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
  },
  tableCell: { fontSize: 10, fontWeight: '700', color: '#64748b' },
})

export default DashboardScreen
