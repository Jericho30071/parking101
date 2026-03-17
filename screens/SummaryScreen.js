import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const SummaryScreen = ({ navigation }) => {
  const [revenue, setRevenue] = useState('1875.50');
  const [todayActivity, setTodayActivity] = useState([
    { id: 1, slot: 'A1', action: 'Vehicle Released', fee: 50.00, time: '2h 15m' },
    { id: 2, slot: 'B1', action: 'Vehicle Assigned', fee: 0, time: '-' },
    { id: 3, slot: 'C1', action: 'Vehicle Released', fee: 75.00, time: '3h 30m' },
  ]);

  const ActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityHeader}>
        <Text style={styles.activitySlot}>Slot {item.slot}</Text>
        <Text style={styles.activityAction}>{item.action}</Text>
      </View>
      <View style={styles.activityDetails}>
        <Text style={styles.activityFee}>
          {item.fee > 0 ? `Fee: ₱${item.fee}` : 'No fee'}
        </Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Summary & Reports</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's Revenue</Text>
        <TextInput
          style={styles.revenueInput}
          value={revenue}
          onChangeText={setRevenue}
          placeholder="Enter revenue amount"
          keyboardType="numeric"
        />
        <Text style={styles.revenueLabel}>Total: ₱{revenue}</Text>
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {todayActivity.map(item => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Occupancy Trends</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>📊 Chart visualization coming soon</Text>
        </View>
      </View>
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
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  revenueInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  revenueLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  textAlign: 'center',
  },
  activitySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  activityItem: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activitySlot: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  activityAction: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    textAlign: 'right',
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityFee: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  chartSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default SummaryScreen;
