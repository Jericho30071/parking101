import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalSlots: 12,
    occupiedSlots: 8,
    availableSlots: 4,
    totalRevenue: 1250.50,
    occupancyRate: 67
  });

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      setStats({
        totalSlots: 15,
        occupiedSlots: 10,
        availableSlots: 5,
        totalRevenue: 1875.75,
        occupancyRate: 67
      });
    }, 2000);
  }, []);

  const StatCard = ({ title, value, color, icon }) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statIcon}>{icon}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Parking Dashboard</Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Slots"
            value={stats.totalSlots}
            color="#3b82f6"
            icon="🅿️"
          />
          <StatCard
            title="Occupied"
            value={stats.occupiedSlots}
            color="#ef4444"
            icon="🚗"
          />
          <StatCard
            title="Available"
            value={stats.availableSlots}
            color="#10b981"
            icon="✅"
          />
          <StatCard
            title="Revenue"
            value={`₱${stats.totalRevenue}`}
            color="#f59e0b"
            icon="💰"
          />
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Parking')}
          >
            <Text style={styles.actionText}>Manage Parking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    minWidth: 160,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statIcon: {
    fontSize: 20,
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
