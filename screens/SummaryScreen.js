import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import WebLikeLayout from './WebLikeLayout'

const SummaryScreen = ({ navigation }) => {
  return (
    <WebLikeLayout navigation={navigation} activeTab="Summary">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Parking Summary</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>

          <View style={styles.cardsRow}>
            <View style={styles.infoCard}>
              <Text style={styles.cardLabel}>Total Slots</Text>
              <Text style={styles.cardValue}>2</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.cardLabel}>Occupied</Text>
              <Text style={styles.cardValue}>1</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.cardLabel}>Available</Text>
              <Text style={styles.cardValue}>1</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.cardLabel}>Total Revenue</Text>
              <Text style={styles.cardValue}>PHP 60.00</Text>
            </View>
          </View>

          <View style={styles.gaugeCard}>
            <Text style={styles.gaugeValue}>50%</Text>
            <Text style={styles.gaugeLabel}>Occupancy Rate</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Vehicles Parked</Text>
            <Text style={styles.metricValue}>4</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Today's Revenue</Text>
            <Text style={styles.metricValue}>PHP 60.00</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Hourly Rate</Text>
            <Text style={styles.metricValue}>PHP 20.00</Text>
          </View>
          <View style={[styles.metric, styles.metricLast]}>
            <Text style={styles.metricLabel}>Average Stay</Text>
            <Text style={styles.metricValue}>2.5 hrs</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Peak Hours</Text>
          <View style={styles.peakRow}>
            <Text style={styles.peakLabel}>8AM - 12PM</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '75%' }]} />
            </View>
            <Text style={styles.peakValue}>75%</Text>
          </View>
          <View style={styles.peakRow}>
            <Text style={styles.peakLabel}>12PM - 4PM</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '90%' }]} />
            </View>
            <Text style={styles.peakValue}>90%</Text>
          </View>
          <View style={styles.peakRow}>
            <Text style={styles.peakLabel}>4PM - 8PM</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '60%' }]} />
            </View>
            <Text style={styles.peakValue}>60%</Text>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#1f2937' },
  dateText: { fontSize: 11, color: '#64748b' },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5eaf0',
    borderRadius: 10,
    padding: 10,
    minHeight: 90,
    justifyContent: 'center',
  },
  cardLabel: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  cardValue: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginTop: 6 },
  gaugeCard: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e5eaf0',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  gaugeValue: { fontSize: 38, fontWeight: '700', color: '#0f172a' },
  gaugeLabel: { fontSize: 12, color: '#64748b' },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  metricLast: { borderBottomWidth: 0 },
  metricLabel: { fontSize: 12, color: '#64748b' },
  metricValue: { fontSize: 12, fontWeight: '700', color: '#1f2937' },
  peakRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  peakLabel: { width: 78, fontSize: 11, color: '#64748b' },
  barTrack: { flex: 1, height: 7, backgroundColor: '#dbe2ea', borderRadius: 10, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#667eea' },
  peakValue: { width: 34, fontSize: 11, fontWeight: '700', color: '#1f2937', textAlign: 'right' },
})

export default SummaryScreen

