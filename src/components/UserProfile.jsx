import React, { useEffect, useMemo, useState } from 'react'

const UserProfile = ({ user, onSave }) => {
  const initialForm = useMemo(() => ({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    username: user?.username || '',
    email: user?.email || '',
  }), [user])

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setForm(initialForm)
    setErrors({})
    setSaved(false)
  }, [initialForm])

  const validate = () => {
    const next = {}

    if (!String(form.firstName || '').trim()) {
      next.firstName = 'First name is required'
    }

    if (!String(form.lastName || '').trim()) {
      next.lastName = 'Last name is required'
    }

    if (!String(form.username || '').trim()) {
      next.username = 'Username is required'
    }

    return next
  }

  const handleChange = (key) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }

    if (saved) setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSaved(false)
      return
    }

    setIsSaving(true)
    setErrors({})

    try {
      await onSave({
        firstName: String(form.firstName || '').trim(),
        lastName: String(form.lastName || '').trim(),
        username: String(form.username || '').trim(),
        email: String(form.email || '').trim(),
      })
      setSaved(true)
    } catch (error) {
      const message = String(error?.message || 'Failed to update profile')
      const lowered = message.toLowerCase()

      if (lowered.includes('first_name')) {
        setErrors({ firstName: 'First name is required' })
      } else if (lowered.includes('last_name')) {
        setErrors({ lastName: 'Last name is required' })
      } else if (lowered.includes('username')) {
        setErrors({ username: message })
      } else {
        setErrors({ profile: message })
      }
      setSaved(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Profile</h2>
        <p>View and update your personal information</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        {errors.profile && (
          <div className="error-message">{errors.profile}</div>
        )}

        <div className="settings-section">
          <h3>Personal Information</h3>

          <div className="form-group">
            <label htmlFor="profileFirstName">First Name</label>
            <input
              id="profileFirstName"
              type="text"
              value={form.firstName}
              onChange={handleChange('firstName')}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="profileLastName">Last Name</label>
            <input
              id="profileLastName"
              type="text"
              value={form.lastName}
              onChange={handleChange('lastName')}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="profileUsername">Username</label>
            <input
              id="profileUsername"
              type="text"
              value={form.username}
              onChange={handleChange('username')}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="profileEmail">Email</label>
            <input
              id="profileEmail"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
        </div>

        {saved && (
          <div className="settings-saved">
            Profile updated successfully.
          </div>
        )}

        <div className="settings-actions">
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserProfile
