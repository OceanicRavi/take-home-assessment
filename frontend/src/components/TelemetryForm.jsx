import { useState } from 'react';

const STATUS_OPTIONS = ['healthy', 'warning', 'critical'];

const initialFormState = {
  satelliteId: '',
  timestamp: '',
  altitude: '',
  velocity: '',
  status: 'healthy',
};

function validate(form) {
  const errors = {};

  if (!form.satelliteId.trim()) {
    errors.satelliteId = 'Satellite ID is required';
  }

  if (!form.timestamp) {
    errors.timestamp = 'Timestamp is required';
  } else if (Number.isNaN(Date.parse(form.timestamp))) {
    errors.timestamp = 'Timestamp must be a valid date/time';
  }

  const altitude = Number(form.altitude);
  if (form.altitude === '' || Number.isNaN(altitude) || altitude <= 0) {
    errors.altitude = 'Altitude must be a positive number';
  }

  const velocity = Number(form.velocity);
  if (form.velocity === '' || Number.isNaN(velocity) || velocity <= 0) {
    errors.velocity = 'Velocity must be a positive number';
  }

  if (!form.status) {
    errors.status = 'Health status is required';
  }

  return errors;
}

export default function TelemetryForm({ onSubmit }) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    await onSubmit({
      satelliteId: form.satelliteId.trim(),
      timestamp: new Date(form.timestamp).toISOString(),
      altitude: Number(form.altitude),
      velocity: Number(form.velocity),
      status: form.status,
    });

    setForm(initialFormState);
    setErrors({});
  }

  return (
    <form className="telemetry-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Telemetry Entry</h2>

      <div className="form-row">
        <label>
          Satellite ID
          <input
            type="text"
            value={form.satelliteId}
            onChange={(e) => handleChange('satelliteId', e.target.value)}
          />
          {errors.satelliteId && <span className="field-error">{errors.satelliteId}</span>}
        </label>

        <label>
          Timestamp
          <input
            type="datetime-local"
            value={form.timestamp}
            onChange={(e) => handleChange('timestamp', e.target.value)}
          />
          {errors.timestamp && <span className="field-error">{errors.timestamp}</span>}
        </label>
      </div>

      <div className="form-row">
        <label>
          Altitude (km)
          <input
            type="number"
            step="any"
            value={form.altitude}
            onChange={(e) => handleChange('altitude', e.target.value)}
          />
          {errors.altitude && <span className="field-error">{errors.altitude}</span>}
        </label>

        <label>
          Velocity (km/s)
          <input
            type="number"
            step="any"
            value={form.velocity}
            onChange={(e) => handleChange('velocity', e.target.value)}
          />
          {errors.velocity && <span className="field-error">{errors.velocity}</span>}
        </label>

        <label>
          Health Status
          <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.status && <span className="field-error">{errors.status}</span>}
        </label>
      </div>

      <button type="submit">Add Entry</button>
    </form>
  );
}
