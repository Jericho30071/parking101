import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native'
import WebLikeLayout from './WebLikeLayout'

const SettingsScreen = ({ navigation }) => {
  const [hourlyRate, setHourlyRate] = useState('20')
  const [refreshInterval, setRefreshInterval] = useState('15')
  const [sessionHours, setSessionHours] = useState('24')
  const [notifications, setNotifications] = useState(true)

  return (
    <WebLikeLayout navigation={navigation} activeTab="Settings">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>PRICING</Text>
          <Text style={styles.fieldLabel}>Hourly Rate (PHP)</Text>
          <TextInput style={styles.input} value={hourlyRate} onChangeText={setHourlyRate} keyboardType="numeric" />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>LIVE UPDATES</Text>
          <Text style={styles.fieldLabel}>Refresh Interval (seconds)</Text>
          <TextInput style={styles.input} value={refreshInterval} onChangeText={setRefreshInterval} keyboardType="numeric" />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>SECURITY</Text>
          <Text style={styles.fieldLabel}>Session Duration (hours)</Text>
          <TextInput style={styles.input} value={sessionHours} onChangeText={setSessionHours} keyboardType="numeric" />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.switchRow}>
            <Text style={styles.fieldLabel}>Enable Notifications</Text>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#cbd5e1', true: '#667eea' }} />
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.resetBtn}><Text style={styles.resetText}>Reset Defaults</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert('Saved', 'Settings saved successfully')}>
            <Text style={styles.saveText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </WebLikeLayout>
  )
}

const styles = StyleSheet.create({
  sectionCard:{backgroundColor:'#fff',borderWidth:1,borderColor:'#dbe2ea',borderRadius:12,padding:12,marginBottom:12},
  sectionHeader:{fontSize:12,fontWeight:'800',color:'#64748b',marginBottom:8,letterSpacing:0.4},
  fieldLabel:{fontSize:12,fontWeight:'600',color:'#334155',marginBottom:6},
  input:{height:46,borderWidth:1,borderColor:'#dbe2ea',borderRadius:8,paddingHorizontal:12,backgroundColor:'#f8fafc',fontSize:14,color:'#0f172a'},
  switchRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  actionRow:{flexDirection:'row',justifyContent:'flex-end',gap:8,marginBottom:12,flexWrap:'wrap'},
  resetBtn:{backgroundColor:'#f1f5f9',borderWidth:1,borderColor:'#dbe2ea',borderRadius:8,paddingHorizontal:14,paddingVertical:10,minWidth:120,alignItems:'center'},
  resetText:{fontSize:12,fontWeight:'700',color:'#475569'},
  saveBtn:{backgroundColor:'#667eea',borderRadius:8,paddingHorizontal:14,paddingVertical:10,minWidth:120,alignItems:'center'},
  saveText:{fontSize:12,fontWeight:'700',color:'#fff'},
})

export default SettingsScreen
