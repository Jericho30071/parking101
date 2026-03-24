const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '')

const getAuthToken = () => {
  try {
    const raw = localStorage.getItem('parkingAuth')
    if (!raw) return ''
    const parsed = JSON.parse(raw)
    return typeof parsed.token === 'string' ? parsed.token : ''
  } catch {
    return ''
  }
}

const apiFetch = async (path, options = {}) => {
  const token = getAuthToken()
  const headers = {
    ...(options.headers || {}),
  }

  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Token ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '')

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    if (data && typeof data === 'object') {
      if (data.detail || data.error) {
        message = data.detail || data.error
      } else {
        const firstKey = Object.keys(data)[0]
        const firstValue = firstKey ? data[firstKey] : null
        if (Array.isArray(firstValue) && firstValue.length > 0) {
          message = `${firstKey}: ${firstValue[0]}`
        } else if (typeof firstValue === 'string') {
          message = `${firstKey}: ${firstValue}`
        }
      }
    } else if (typeof data === 'string' && data) {
      message = data
    }
    throw new Error(message)
  }

  return data
}

export const login = async (username, password) => {
  return apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export const register = async (firstName, lastName, username, password, confirmPassword) => {
  return apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      confirm_password: confirmPassword,
    }),
  })
}

export const fetchCurrentUser = async () => {
  const data = await apiFetch('/auth/me/')
  return data?.user || null
}

export const updateUserProfile = async (profile) => {
  const data = await apiFetch('/auth/me/', {
    method: 'PATCH',
    body: JSON.stringify({
      first_name: profile?.firstName,
      last_name: profile?.lastName,
      username: profile?.username,
      email: profile?.email ?? '',
    }),
  })
  return data?.user || null
}

export const logout = async () => {
  return apiFetch('/auth/logout/', {
    method: 'POST',
  })
}

const getLocalConfig = () => {
  try {
    const raw = localStorage.getItem('parkingConfig')
    if (!raw) {
      return { hourlyRate: 50.0, currency: 'PHP', timeFormat: '12-hour' }
    }
    const parsed = JSON.parse(raw)
    return {
      hourlyRate: typeof parsed.hourlyRate === 'number' ? parsed.hourlyRate : 50.0,
      currency: typeof parsed.currency === 'string' ? parsed.currency : 'PHP',
      timeFormat: typeof parsed.timeFormat === 'string' ? parsed.timeFormat : '12-hour',
    }
  } catch {
    return { hourlyRate: 50.0, currency: 'PHP', timeFormat: '12-hour' }
  }
}

const setLocalConfig = (next) => {
  const current = getLocalConfig()
  const merged = { ...current, ...(next || {}) }
  localStorage.setItem('parkingConfig', JSON.stringify(merged))
  return merged
}

export const fetchParkingConfig = async () => {
  return getLocalConfig()
}

export const updateParkingConfig = async (config) => {
  return setLocalConfig(config)
}

const mapSlotsWithSessions = (slots, activeSessions, vehiclesById) => {
  const bySlotId = new Map()
  for (const s of activeSessions) {
    bySlotId.set(s.slot, s)
  }

  return slots.map((slot) => {
    const session = bySlotId.get(slot.id)
    const vehicle = session ? vehiclesById.get(session.vehicle) : null
    return {
      id: slot.id,
      number: slot.number,
      isOccupied: Boolean(session),
      vehicleType: vehicle?.vehicle_type ?? null,
      vehiclePlate: vehicle?.plate_number ?? null,
      entryTime: session?.entry_time ?? null,
    }
  })
}

export const fetchParkingSlots = async () => {
  const [slots, sessions, vehicles] = await Promise.all([
    apiFetch('/slots/'),
    apiFetch('/sessions/?status=active'),
    apiFetch('/vehicles/'),
  ])

  const vehiclesById = new Map((vehicles || []).map((v) => [v.id, v]))
  return mapSlotsWithSessions(slots || [], sessions || [], vehiclesById)
}

export const fetchActivityLogs = async () => {
  const [sessions, slots, vehicles] = await Promise.all([
    apiFetch('/sessions/'),
    apiFetch('/slots/'),
    apiFetch('/vehicles/'),
  ])

  const slotsById = new Map((slots || []).map((s) => [s.id, s]))
  const vehiclesById = new Map((vehicles || []).map((v) => [v.id, v]))

  return (sessions || []).map((s) => {
    const slot = slotsById.get(s.slot)
    const vehicle = vehiclesById.get(s.vehicle)
    return {
      id: s.id,
      plateNumber: vehicle?.plate_number ?? 'N/A',
      slotNumber: slot?.number ?? 'N/A',
      entryTime: s.entry_time,
      exitTime: s.exit_time,
      status: s.status,
      fee: s.fee,
    }
  })
}

export const getTotalRevenue = async () => {
  const sessions = await apiFetch('/sessions/')
  return (sessions || [])
    .filter((s) => s.status === 'completed' && s.fee && !isNaN(s.fee))
    .reduce((sum, s) => sum + parseFloat(s.fee), 0)
}

export const addParkingSlot = async (slotNumber) => {
  const payload = { number: String(slotNumber || '').toUpperCase(), is_active: true }
  const created = await apiFetch('/slots/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return {
    id: created.id,
    number: created.number,
    isOccupied: false,
    vehicleType: null,
    vehiclePlate: null,
    entryTime: null,
  }
}

export const deleteParkingSlot = async (slotId) => {
  await apiFetch(`/slots/${slotId}/`, {
    method: 'DELETE',
  })
  return true
}

export const updateParkingSlot = async (slotId, slotNumber) => {
  const payload = { number: String(slotNumber || '').toUpperCase() }
  const updated = await apiFetch(`/slots/${slotId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

  return {
    id: updated.id,
    number: updated.number,
    isOccupied: false,
    vehicleType: null,
    vehiclePlate: null,
    entryTime: null,
  }
}

export const updateVehicleAssignment = async (slotId, vehiclePlate, vehicleType) => {
  // Find the active session for this slot
  const activeSessions = await apiFetch('/sessions/?status=active')
  const session = activeSessions.find(s => s.slot === slotId)
  
  if (!session) {
    throw new Error('No active vehicle assignment found for this slot')
  }

  // Update vehicle details
  const plate = String(vehiclePlate || '').toUpperCase()
  const vehicles = await apiFetch('/vehicles/')
  let vehicle = (vehicles || []).find((v) => v.id === session.vehicle) || null

  if (!vehicle) {
    throw new Error('Vehicle not found')
  }

  const updatedVehicle = await apiFetch(`/vehicles/${vehicle.id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ 
      plate_number: plate, 
      vehicle_type: vehicleType 
    }),
  })

  return updatedVehicle
}

const findActiveSessionForSlot = async (slotId) => {
  const active = await apiFetch('/sessions/?status=active')
  return (active || []).find((s) => s.slot === slotId) || null
}

export const assignVehicleToSlot = async (slotId, vehiclePlate, vehicleType = 'car') => {
  const activeSession = await findActiveSessionForSlot(slotId)
  if (activeSession) throw new Error('Slot not available')

  const plate = String(vehiclePlate || '').toUpperCase()
  const vehicles = await apiFetch('/vehicles/')
  let vehicle = (vehicles || []).find((v) => String(v.plate_number || '').toUpperCase() === plate) || null

  if (!vehicle) {
    vehicle = await apiFetch('/vehicles/', {
      method: 'POST',
      body: JSON.stringify({ plate_number: plate, vehicle_type: vehicleType }),
    })
  }

  await apiFetch('/sessions/', {
    method: 'POST',
    body: JSON.stringify({
      slot: slotId,
      vehicle: vehicle.id,
      entry_time: new Date().toISOString(),
      status: 'active',
    }),
  })

  return true
}

export const releaseVehicleFromSlot = async (slotId, paymentAmount = null) => {
  const session = await findActiveSessionForSlot(slotId)
  if (!session) throw new Error('No vehicle to release')

  const config = await fetchParkingConfig()
  const exitTime = new Date().toISOString()
  
  // Use provided payment amount or calculate fee
  let fee = paymentAmount
  if (fee === null) {
    fee = calculateParkingFee(session.entry_time, exitTime, config.hourlyRate)
  }

  await apiFetch(`/sessions/${session.id}/`, {
    method: 'PATCH',
    body: JSON.stringify({
      exit_time: exitTime,
      status: 'completed',
      fee: fee,
    }),
  })

  const vehicles = await apiFetch('/vehicles/')
  const vehicle = (vehicles || []).find((v) => v.id === session.vehicle)

  const durationHours = (new Date(exitTime) - new Date(session.entry_time)) / (1000 * 60 * 60)
  return {
    vehiclePlate: vehicle?.plate_number ?? 'N/A',
    entryTime: session.entry_time,
    exitTime,
    fee,
    duration: durationHours,
  }
}

export const simulateParkingUpdate = async () => {
  return fetchParkingSlots()
}

// Calculate parking fee
export const calculateParkingFee = (entryTime, exitTime, hourlyRate = getLocalConfig().hourlyRate) => {
  if (!entryTime || !exitTime) return 0;
  
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const durationHours = (exit - entry) / (1000 * 60 * 60);
  
  // Minimum charge is 1 hour
  const billableHours = Math.max(1, Math.ceil(durationHours));
  return Math.round(billableHours * hourlyRate * 100) / 100;
};



// Format time for display
export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Format duration
export const formatDuration = (entryTime, exitTime = null) => {
  const start = new Date(entryTime);
  const end = exitTime ? new Date(exitTime) : new Date();
  const durationMs = end - start;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Format currency
export const formatCurrency = (amount, currency = 'PHP') => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
