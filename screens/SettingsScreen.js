import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    hourlyRate: 50.00,
    notifications: true,
    autoRefresh: false,
    darkMode: false,
  });

  const SettingItem = ({ title, value, onToggle, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingTitle}>{title}</Text>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#3b82f6' }}
        />
      ) : (
        <TouchableOpacity 
          style={styles.settingValue}
          onPress={() => navigation.navigate('EditSetting', { setting: title })}
        >
          <Text style={styles.valueText}>{value}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Parking Settings</Text>
        
        <SettingItem
          title="Hourly Rate"
          value={`₱${settings.hourlyRate}`}
          onToggle={() => {}}
          type="text"
        />
        
        <SettingItem
          title="Notifications"
          value={settings.notifications ? 'Enabled' : 'Disabled'}
          onToggle={(value) => setSettings(prev => ({ ...prev, notifications: value }))}
        />
        
        <SettingItem
          title="Auto Refresh"
          value={settings.autoRefresh ? 'Enabled' : 'Disabled'}
          onToggle={(value) => setSettings(prev => ({ ...prev, autoRefresh: value }))}
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Display Settings</Text>
        
        <SettingItem
          title="Dark Mode"
          value={settings.darkMode ? 'On' : 'Off'}
          onToggle={(value) => setSettings(prev => ({ ...prev, darkMode: value }))}
        />
      </View>

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={() => {
          // Save settings logic
          Alert.alert('Success', 'Settings saved successfully!');
        }}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
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
  settingsSection: {
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
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingTitle: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    color: '#3b82f6',
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  valueText: {
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
