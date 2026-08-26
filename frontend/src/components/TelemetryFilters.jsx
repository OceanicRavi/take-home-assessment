const STATUS_OPTIONS = ['', 'healthy', 'warning', 'critical'];

export default function TelemetryFilters({ filters, onChange }) {
  return (
    <div className="filters">
      <label>
        Satellite ID
        <input
          type="text"
          placeholder="e.g. SAT-001"
          value={filters.satelliteId}
          onChange={(e) => onChange({ ...filters, satelliteId: e.target.value })}
        />
      </label>

      <label>
        Health Status
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === '' ? 'All' : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
