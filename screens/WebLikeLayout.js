import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'

const tabs = [
  { key: 'Dashboard', label: 'Dashboard', icon: '⌘' },
  { key: 'Parking', label: 'Manage', icon: '▭' },
  { key: 'Summary', label: 'Summary', icon: '▥' },
  { key: 'Settings', label: 'Settings', icon: '⚙' },
]

export default function WebLikeLayout({ navigation, activeTab, children }) {
  const now = new Date().toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.systemTitle}>🚗 Smart Parking System</Text>
              <Text style={styles.systemSubtitle}>Admin Dashboard</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
              <Text style={styles.logoutText}>↪ Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerMetaRow}>
            <Text style={styles.timeBadge}>{now}</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminName}>ADMIN</Text>
              <Text style={styles.adminRole}>Administrator</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.contentInner}>{children}</View>
        </View>

        <View style={styles.bottomNav}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.navItem}
                onPress={() => navigation.navigate(tab.key)}
              >
                <Text style={[styles.navIcon, isActive && styles.navActive]}>{tab.icon}</Text>
                <Text style={[styles.navLabel, isActive && styles.navActive]}>{tab.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef1f5' },
  page: { flex: 1, backgroundColor: '#eef1f5' },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dde3ea',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  systemTitle: { fontSize: 28, fontWeight: '700', color: '#1f2937' },
  systemSubtitle: { fontSize: 13, color: '#7b8794', marginTop: 2 },
  timeBadge: {
    backgroundColor: '#f3f6fa',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 11,
    color: '#465466',
  },
  adminBadge: {
    backgroundColor: '#f3f6fa',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  adminName: { fontSize: 11, fontWeight: '700', color: '#1f2937' },
  adminRole: { fontSize: 10, color: '#7b8794' },
  logoutBtn: {
    borderWidth: 1,
    borderColor: '#dbe2ea',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  content: { flex: 1, paddingHorizontal: 10, paddingTop: 10 },
  contentInner: {
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  bottomNav: {
    height: 72,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dbe2ea',
    flexDirection: 'row',
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 15, color: '#7c8ca2' },
  navLabel: { fontSize: 11, color: '#7c8ca2', marginTop: 2 },
  navActive: { color: '#556ee6', fontWeight: '700' },
})
