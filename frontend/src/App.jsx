import { useEffect, useState, useCallback } from 'react';
import { fetchTelemetry, createTelemetry, deleteTelemetry } from './api/telemetryApi';
import TelemetryFilters from './components/TelemetryFilters';
import TelemetryForm from './components/TelemetryForm';
import TelemetryTable from './components/TelemetryTable';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';
import './App.css';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ satelliteId: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchTelemetry(filters);
      setEntries(result.data);
    } catch (err) {
      setError(err.message || 'Failed to load telemetry data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function handleCreate(entry) {
    try {
      await createTelemetry(entry);
      await loadEntries();
    } catch (err) {
      setError(err.message || 'Failed to add telemetry entry');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTelemetry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete telemetry entry');
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Satellite Telemetry Dashboard</h1>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <TelemetryForm onSubmit={handleCreate} />

      <section className="table-section">
        <TelemetryFilters filters={filters} onChange={setFilters} />
        {loading ? <LoadingSpinner /> : <TelemetryTable entries={entries} onDelete={handleDelete} />}
      </section>
    </div>
  );
}
