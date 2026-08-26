const request = require('supertest');
const app = require('../src/app');

const validEntry = {
  satelliteId: 'SAT-TEST',
  timestamp: '2026-08-25T12:00:00Z',
  altitude: 500,
  velocity: 7.5,
  status: 'healthy',
};

describe('GET /telemetry', () => {
  it('returns all seeded telemetry entries', async () => {
    const res = await request(app).get('/telemetry');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  it('filters by satelliteId', async () => {
    const res = await request(app).get('/telemetry').query({ satelliteId: 'SAT-001' });
    expect(res.status).toBe(200);
    expect(res.body.data.every((e) => e.satelliteId === 'SAT-001')).toBe(true);
  });

  it('filters by status', async () => {
    const res = await request(app).get('/telemetry').query({ status: 'critical' });
    expect(res.status).toBe(200);
    expect(res.body.data.every((e) => e.status === 'critical')).toBe(true);
  });

  it('paginates results when page/limit are provided', async () => {
    const res = await request(app).get('/telemetry').query({ page: 1, limit: 2 });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 2 });
  });
});

describe('POST /telemetry', () => {
  it('creates a new telemetry entry with valid data', async () => {
    const res = await request(app).post('/telemetry').send(validEntry);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(validEntry);
    expect(res.body.id).toBeDefined();
  });

  it('rejects an invalid timestamp', async () => {
    const res = await request(app)
      .post('/telemetry')
      .send({ ...validEntry, timestamp: 'not-a-date' });
    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(expect.arrayContaining([expect.stringContaining('timestamp')]));
  });

  it('rejects a negative altitude', async () => {
    const res = await request(app)
      .post('/telemetry')
      .send({ ...validEntry, altitude: -10 });
    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(expect.arrayContaining([expect.stringContaining('altitude')]));
  });

  it('rejects a negative velocity', async () => {
    const res = await request(app)
      .post('/telemetry')
      .send({ ...validEntry, velocity: -1 });
    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(expect.arrayContaining([expect.stringContaining('velocity')]));
  });

  it('rejects a missing satelliteId', async () => {
    const { satelliteId, ...rest } = validEntry;
    const res = await request(app).post('/telemetry').send(rest);
    expect(res.status).toBe(400);
  });
});

describe('GET /telemetry/:id', () => {
  it('returns a single entry by id', async () => {
    const created = await request(app).post('/telemetry').send(validEntry);
    const res = await request(app).get(`/telemetry/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/telemetry/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /telemetry/:id', () => {
  it('deletes an existing entry', async () => {
    const created = await request(app).post('/telemetry').send(validEntry);
    const res = await request(app).delete(`/telemetry/${created.body.id}`);
    expect(res.status).toBe(204);

    const getRes = await request(app).get(`/telemetry/${created.body.id}`);
    expect(getRes.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete('/telemetry/does-not-exist');
    expect(res.status).toBe(404);
  });
});
