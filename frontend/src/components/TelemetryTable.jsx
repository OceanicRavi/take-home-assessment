import { useMemo, useState } from 'react';

const SORTABLE_COLUMNS = {
  timestamp: (entry) => new Date(entry.timestamp).getTime(),
  altitude: (entry) => entry.altitude,
  velocity: (entry) => entry.velocity,
};

export default function TelemetryTable({ entries, onDelete }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sortedEntries = useMemo(() => {
    if (!sortKey) return entries;
    const getValue = SORTABLE_COLUMNS[sortKey];
    const sorted = [...entries].sort((a, b) => getValue(a) - getValue(b));
    return sortDir === 'asc' ? sorted : sorted.reverse();
  }, [entries, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function sortIndicator(key) {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  }

  return (
    <table className="telemetry-table">
      <thead>
        <tr>
          <th>Satellite ID</th>
          <th className="sortable" onClick={() => toggleSort('timestamp')}>
            Timestamp{sortIndicator('timestamp')}
          </th>
          <th className="sortable" onClick={() => toggleSort('altitude')}>
            Altitude (km){sortIndicator('altitude')}
          </th>
          <th className="sortable" onClick={() => toggleSort('velocity')}>
            Velocity (km/s){sortIndicator('velocity')}
          </th>
          <th>Health Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedEntries.length === 0 && (
          <tr>
            <td colSpan={6} className="empty-row">
              No telemetry entries found.
            </td>
          </tr>
        )}
        {sortedEntries.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.satelliteId}</td>
            <td>{new Date(entry.timestamp).toLocaleString()}</td>
            <td>{entry.altitude}</td>
            <td>{entry.velocity}</td>
            <td>
              <span className={`status-badge status-${entry.status.toLowerCase()}`}>
                {entry.status}
              </span>
            </td>
            <td>
              <button type="button" className="delete-btn" onClick={() => onDelete(entry.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
