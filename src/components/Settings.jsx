import React, { useMemo, useState } from 'react';

const Settings = ({ settings, onSave }) => {
  const initialForm = useMemo(() => ({
    hourlyRate: settings?.hourlyRate ?? 2.5,
    refreshIntervalSec: settings?.refreshIntervalSec ?? 5,
    sessionHours: settings?.sessionHours ?? 24
  }), [settings]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const next = {};

    if (!Number.isFinite(form.hourlyRate) || form.hourlyRate <= 0) {
      next.hourlyRate = 'Hourly rate must be greater than 0';
    }

    if (!Number.isFinite(form.refreshIntervalSec) || form.refreshIntervalSec < 2 || form.refreshIntervalSec > 60) {
      next.refreshIntervalSec = 'Refresh interval must be between 2 and 60 seconds';
    }

    if (!Number.isFinite(form.sessionHours) || form.sessionHours < 1 || form.sessionHours > 168) {
      next.sessionHours = 'Session duration must be between 1 and 168 hours';
    }

    return next;
  };

  const handleNumberChange = (key) => (e) => {
    const raw = e.target.value;
    const value = raw === '' ? NaN : Number(raw);

    setForm(prev => ({
      ...prev,
      [key]: value
    }));

    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }

    if (saved) setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSaved(false);
      return;
    }

    onSave({
      hourlyRate: Number(form.hourlyRate),
      refreshIntervalSec: Number(form.refreshIntervalSec),
      sessionHours: Number(form.sessionHours)
    });

    setErrors({});
    setSaved(true);
  };

  const handleReset = () => {
    setForm({
      hourlyRate: 2.5,
      refreshIntervalSec: 5,
      sessionHours: 24
    });
    setErrors({});
    setSaved(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Configure system behavior and pricing</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3>Pricing</h3>

          <div className="form-group">
            <label htmlFor="hourlyRate">Hourly Rate (PHP)</label>
            <input
              id="hourlyRate"
              type="number"
              min="0.01"
              step="0.01"
              value={Number.isNaN(form.hourlyRate) ? '' : form.hourlyRate}
              onChange={handleNumberChange('hourlyRate')}
              className={errors.hourlyRate ? 'error' : ''}
            />
            {errors.hourlyRate && <span className="field-error">{errors.hourlyRate}</span>}
          </div>
        </div>

        <div className="settings-section">
          <h3>Live Updates</h3>

          <div className="form-group">
            <label htmlFor="refreshIntervalSec">Refresh Interval (seconds)</label>
            <input
              id="refreshIntervalSec"
              type="number"
              min="2"
              max="60"
              step="1"
              value={Number.isNaN(form.refreshIntervalSec) ? '' : form.refreshIntervalSec}
              onChange={handleNumberChange('refreshIntervalSec')}
              className={errors.refreshIntervalSec ? 'error' : ''}
            />
            {errors.refreshIntervalSec && <span className="field-error">{errors.refreshIntervalSec}</span>}
          </div>
        </div>

        <div className="settings-section">
          <h3>Security</h3>

          <div className="form-group">
            <label htmlFor="sessionHours">Session Duration (hours)</label>
            <input
              id="sessionHours"
              type="number"
              min="1"
              max="168"
              step="1"
              value={Number.isNaN(form.sessionHours) ? '' : form.sessionHours}
              onChange={handleNumberChange('sessionHours')}
              className={errors.sessionHours ? 'error' : ''}
            />
            {errors.sessionHours && <span className="field-error">{errors.sessionHours}</span>}
          </div>
        </div>

        {saved && (
          <div className="settings-saved">
            Settings saved successfully.
          </div>
        )}

        <div className="settings-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset Defaults
          </button>
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
