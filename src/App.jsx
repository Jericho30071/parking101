import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink } from 'react-router-dom'
import Header from './components/Header'
import SummaryCard from './components/SummaryCard'
import ParkingGrid from './components/ParkingGrid'
import ParkingSlot from './components/ParkingSlot'
import ActivityLogTable from './components/ActivityLogTable'
import Login from './components/Login'
import ParkingManagement from './components/ParkingManagement'
import SummaryStatus from './components/SummaryStatus'
import SlotDetailModal from './components/SlotDetailModal'
import Settings from './components/Settings'
import Notification from './components/Notification'
import { 
  logout as apiLogout,
  fetchParkingSlots, 
  fetchActivityLogs, 
  simulateParkingUpdate,
  getTotalRevenue,
  fetchParkingConfig,
  addParkingSlot,
  deleteParkingSlot,
  updateParkingSlot,
  updateVehicleAssignment,
  assignVehicleToSlot,
  releaseVehicleFromSlot,
  updateParkingConfig
} from './utils/api'
import { formatCurrency } from './utils/api'
import './App.css'

function App() {
  const defaultSettings = {
    hourlyRate: 2.5,
    refreshIntervalSec: 5,
    sessionHours: 24
  }

  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('parkingSettings')
      if (!raw) return defaultSettings
      const parsed = JSON.parse(raw)
      return {
        hourlyRate: typeof parsed.hourlyRate === 'number' ? parsed.hourlyRate : defaultSettings.hourlyRate,
        currency: typeof parsed.currency === 'string' ? parsed.currency : defaultSettings.currency,
        theme: typeof parsed.theme === 'string' ? parsed.theme : defaultSettings.theme,
        notifications: typeof parsed.notifications === 'boolean' ? parsed.notifications : defaultSettings.notifications,
        autoRefresh: typeof parsed.autoRefresh === 'boolean' ? parsed.autoRefresh : defaultSettings.autoRefresh,
        refreshIntervalSec: typeof parsed.refreshIntervalSec === 'number' ? parsed.refreshIntervalSec : defaultSettings.refreshIntervalSec,
        sessionHours: typeof parsed.sessionHours === 'number' ? parsed.sessionHours : defaultSettings.sessionHours
      }
    } catch {
      return defaultSettings
    }
  })

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [parkingSlots, setParkingSlots] = useState([])
  const [activityLogs, setActivityLogs] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [parkingConfig, setParkingConfig] = useState({ hourlyRate: 2.50 })
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate statistics
  const totalSlots = parkingSlots.length
  const occupiedSlots = parkingSlots.filter(slot => slot.isOccupied).length
  const availableSlots = totalSlots - occupiedSlots
  const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0

  // Check authentication on mount
  useEffect(() => {
    const authData = localStorage.getItem('parkingAuth')
    if (authData) {
      const { user, token, timestamp } = JSON.parse(authData)
      const sessionMs = (settings.sessionHours || 24) * 60 * 60 * 1000
      if (token && Date.now() - timestamp < sessionMs) {
        setUser(user)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('parkingAuth')
      }
    }
  }, [settings.sessionHours])

  useEffect(() => {
    const applyConfig = async () => {
      try {
        if (typeof settings.hourlyRate === 'number' && settings.hourlyRate > 0) {
          const updated = await updateParkingConfig({ hourlyRate: settings.hourlyRate })
          setParkingConfig(updated)
        }
      } catch (error) {
        console.error('Error applying settings:', error)
      }
    }

    applyConfig()
  }, [settings.hourlyRate])

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        try {
          setLoading(true)
          const [slotsData, logsData, revenueData, configData] = await Promise.all([
            fetchParkingSlots(),
            fetchActivityLogs(),
            getTotalRevenue(),
            fetchParkingConfig()
          ])
          setParkingSlots(slotsData)
          setActivityLogs(logsData)
          setTotalRevenue(revenueData)
          setParkingConfig(configData)
        } catch (error) {
          console.error('Error loading data:', error)
        } finally {
          setLoading(false)
        }
      }

      loadData()
    }
  }, [isAuthenticated])

  // Set up real-time updates
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(async () => {
        try {
          const updatedSlots = await simulateParkingUpdate()
          setParkingSlots(updatedSlots)
          
          // Update activity logs and revenue occasionally
          if (Math.random() > 0.7) {
            const [updatedLogs, updatedRevenue] = await Promise.all([
              fetchActivityLogs(),
              getTotalRevenue()
            ])
            setActivityLogs(updatedLogs)
            setTotalRevenue(updatedRevenue)
          }
        } catch (error) {
          console.error('Error updating data:', error)
        }
      }, (settings.refreshIntervalSec || 5) * 1000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated, settings.refreshIntervalSec])

  const handleLogin = (payload) => {
    const nextUser = payload?.user || null
    const nextToken = payload?.token || ''

    setUser(nextUser)
    setIsAuthenticated(true)
    if (window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/')
    }
    localStorage.setItem('parkingAuth', JSON.stringify({
      user: nextUser,
      token: nextToken,
      timestamp: Date.now()
    }))
  }

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('parkingAuth')
  }

  const handleSaveSettings = (nextSettings) => {
    setSettings(nextSettings)
    localStorage.setItem('parkingSettings', JSON.stringify(nextSettings))
  }

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot)
    setIsSlotModalOpen(true)
  }

  const showNotification = (title, message, type = 'info') => {
    setNotification({
      isOpen: true,
      title,
      message,
      type
    })
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }))
  }

  const handleAddSlot = async (slotNumber) => {
    try {
      await addParkingSlot(slotNumber)
      const updatedSlots = await fetchParkingSlots()
      setParkingSlots(updatedSlots)
    } catch (error) {
      console.error('Error adding slot:', error)
    }
  }

  const handleDeleteSlot = async (slotId) => {
    try {
      await deleteParkingSlot(slotId)
      const updatedSlots = await fetchParkingSlots()
      setParkingSlots(updatedSlots)
      showNotification('Success', 'Parking slot deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting slot:', error)
      // Handle specific error messages from backend
      const errorMessage = error.message || 'Unknown error occurred'
      if (errorMessage.includes('Cannot delete slot with currently parked vehicles')) {
        showNotification('Cannot Delete', 'Cannot delete slot with currently parked vehicles. Please release all vehicles first.', 'warning')
      } else if (errorMessage.includes('Cannot delete slot')) {
        showNotification('Delete Error', errorMessage, 'error')
      } else {
        showNotification('Error', 'Error deleting slot: ' + errorMessage, 'error')
      }
    }
  }

  const handleUpdateSlot = async (slotId, slotNumber, vehiclePlate = null, vehicleType = null) => {
    try {
      if (vehiclePlate && vehicleType) {
        // Update vehicle assignment
        await updateVehicleAssignment(slotId, vehiclePlate, vehicleType);
        showNotification('Success', 'Vehicle assignment updated successfully', 'success');
      } else {
        // Update slot number only
        await updateParkingSlot(slotId, slotNumber);
        showNotification('Success', 'Parking slot updated successfully', 'success');
      }
      
      const [updatedSlots, updatedLogs] = await Promise.all([
        fetchParkingSlots(),
        fetchActivityLogs()
      ])
      setParkingSlots(updatedSlots)
      setActivityLogs(updatedLogs)
    } catch (error) {
      console.error('Error updating slot:', error)
      showNotification('Error', 'Error updating slot: ' + error.message, 'error')
    }
  }

  const handleAssignVehicle = async (slotId, vehiclePlate, vehicleType) => {
    try {
      await assignVehicleToSlot(slotId, vehiclePlate, vehicleType)
      const [updatedSlots, updatedLogs] = await Promise.all([
        fetchParkingSlots(),
        fetchActivityLogs()
      ])
      setParkingSlots(updatedSlots)
      setActivityLogs(updatedLogs)
    } catch (error) {
      console.error('Error assigning vehicle:', error)
      showNotification('Error', 'Error assigning vehicle: ' + error.message, 'error')
    }
  }

  const handleReleaseVehicle = async (slotId, paymentAmount = null) => {
    try {
      const vehicleInfo = await releaseVehicleFromSlot(slotId, paymentAmount)
      
      // Show fee information with modern notification
      if (vehicleInfo.fee > 0) {
        const message = `Plate: ${vehicleInfo.vehiclePlate}\nDuration: ${Math.ceil(vehicleInfo.duration)} hours\nFee: ${formatCurrency(vehicleInfo.fee)}`
        showNotification('Vehicle released!', message, 'success')
      }
      
      const [updatedSlots, updatedLogs, updatedRevenue] = await Promise.all([
        fetchParkingSlots(),
        fetchActivityLogs(),
        getTotalRevenue()
      ])
      setParkingSlots(updatedSlots)
      setActivityLogs(updatedLogs)
      setTotalRevenue(updatedRevenue)
    } catch (error) {
      console.error('Error releasing vehicle:', error)
      showNotification('Error', 'Error releasing vehicle: ' + error.message, 'error')
    }
  }

  // Icons for summary cards
  const totalIcon = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="9" x2="15" y2="9"></line>
      <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
  )

  const occupiedIcon = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  )

  const availableIcon = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v6l4 2"></path>
    </svg>
  )

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading parking data...</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Header 
          adminName={user?.name || 'Admin User'} 
          onLogout={handleLogout}
        />
        
        <main className="dashboard-main">
          <Routes>
            <Route path="/" element={
              <div className="dashboard-container">
                {/* Summary Cards */}
                <div className="summary-cards">
                  <SummaryCard
                    title="Total Slots"
                    value={totalSlots}
                    icon={totalIcon}
                    color="blue"
                  />
                  <SummaryCard
                    title="Occupied"
                    value={occupiedSlots}
                    icon={occupiedIcon}
                    color="red"
                    trend={Math.floor(Math.random() * 10) - 5}
                  />
                  <SummaryCard
                    title="Available"
                    value={availableSlots}
                    icon={availableIcon}
                    color="green"
                    trend={Math.floor(Math.random() * 10) - 5}
                  />
                  <SummaryCard
                    title="Occupancy Rate"
                    value={`${occupancyRate}%`}
                    icon={
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    }
                    color="orange"
                  />
                </div>

                {/* Parking Grid */}
                <ParkingGrid 
                  parkingSlots={parkingSlots}
                  onSlotClick={handleSlotClick}
                />
                
                {/* Activity Log */}
                <div className="activity-section">
                  <ActivityLogTable activityLogs={activityLogs} />
                </div>

                {/* Slot Detail Modal */}
                <SlotDetailModal 
                  slot={selectedSlot}
                  hourlyRate={parkingConfig.hourlyRate}
                  isOpen={isSlotModalOpen}
                  onClose={() => setIsSlotModalOpen(false)}
                />
              </div>
            } />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            
            <Route path="/management" element={
              <div className="dashboard-container">
                <ParkingManagement 
                  parkingSlots={parkingSlots}
                  hourlyRate={parkingConfig.hourlyRate}
                  onAddSlot={handleAddSlot}
                  onAssignVehicle={handleAssignVehicle}
                  onReleaseVehicle={handleReleaseVehicle}
                  onDeleteSlot={handleDeleteSlot}
                  onUpdateSlot={handleUpdateSlot}
                  showNotification={showNotification}
                />
              </div>
            } />
            
            <Route path="/summary" element={
              <div className="dashboard-container">
                <SummaryStatus 
                  parkingSlots={parkingSlots}
                  activityLogs={activityLogs}
                  totalRevenue={totalRevenue}
                  hourlyRate={parkingConfig.hourlyRate}
                />
              </div>
            } />

            <Route path="/settings" element={
              <div className="dashboard-container">
                <Settings settings={settings} onSave={handleSaveSettings} />
              </div>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Navigation */}
        <nav className="bottom-nav">
          <div className="bottom-nav-content">
            <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/management" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
              <span>Manage</span>
            </NavLink>
            <NavLink to="/summary" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              <span>Summary</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Notification Component */}
        <Notification
          isOpen={notification.isOpen}
          onClose={closeNotification}
          title={notification.title}
          message={notification.message}
          type={notification.type}
        />
      </div>
    </Router>
  )
}

export default App
