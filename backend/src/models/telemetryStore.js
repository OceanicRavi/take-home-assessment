const { v4: uuidv4 } = require('uuid');

// In-memory "database". A plain array is sufficient for this exercise and
// keeps the store swappable for a real DB later (same method signatures).
let telemetryEntries = [];

function seed() {
  telemetryEntries = [
    {
      id: uuidv4(),
      satelliteId: 'SAT-001',
      timestamp: '2026-08-24T10:00:00Z',
      altitude: 550.2,
      velocity: 7.66,
      status: 'healthy',
    },
    {
      id: uuidv4(),
      satelliteId: 'SAT-002',
      timestamp: '2026-08-24T10:05:00Z',
      altitude: 410.8,
      velocity: 7.71,
      status: 'warning',
    },
    {
      id: uuidv4(),
      satelliteId: 'SAT-001',
      timestamp: '2026-08-24T10:10:00Z',
      altitude: 548.9,
      velocity: 7.65,
      status: 'critical',
    },
  ];
}

function getAll({ satelliteId, status } = {}) {
  return telemetryEntries.filter((entry) => {
    if (satelliteId && entry.satelliteId !== satelliteId) return false;
    if (status && entry.status.toLowerCase() !== status.toLowerCase()) return false;
    return true;
  });
}

function getById(id) {
  return telemetryEntries.find((entry) => entry.id === id);
}

function create(data) {
  const entry = {
    id: uuidv4(),
    satelliteId: data.satelliteId,
    timestamp: data.timestamp,
    altitude: data.altitude,
    velocity: data.velocity,
    status: data.status,
  };
  telemetryEntries.push(entry);
  return entry;
}

function remove(id) {
  const index = telemetryEntries.findIndex((entry) => entry.id === id);
  if (index === -1) return false;
  telemetryEntries.splice(index, 1);
  return true;
}

seed();

module.exports = { getAll, getById, create, remove };
