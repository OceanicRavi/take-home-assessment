const express = require('express');
const store = require('../models/telemetryStore');
const { validateTelemetry } = require('../middleware/validateTelemetry');

const router = express.Router();

// GET /telemetry?satelliteId=&status=&page=&limit=
router.get('/', (req, res) => {
  const { satelliteId, status, page, limit } = req.query;

  const filtered = store.getAll({ satelliteId, status });

  // Pagination is opt-in: no page/limit means the full filtered list is returned.
  if (page === undefined && limit === undefined) {
    return res.json({ data: filtered, total: filtered.length });
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum);

  res.json({
    data: paginated,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum),
    },
  });
});

// GET /telemetry/:id
router.get('/:id', (req, res) => {
  const entry = store.getById(req.params.id);
  if (!entry) {
    return res.status(404).json({ error: 'Telemetry entry not found' });
  }
  res.json(entry);
});

// POST /telemetry
router.post('/', validateTelemetry, (req, res) => {
  const { satelliteId, timestamp, altitude, velocity, status } = req.body;
  const entry = store.create({ satelliteId, timestamp, altitude, velocity, status });
  res.status(201).json(entry);
});

// DELETE /telemetry/:id
router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Telemetry entry not found' });
  }
  res.status(204).send();
});

module.exports = router;
