# Satellite Telemetry API

A REST API (Node.js + Express) for managing satellite telemetry data: satellite ID,
timestamp, altitude, velocity, and health status.

## Running locally

```bash
cd backend
npm install
npm start        # http://localhost:3001
```

For auto-reload during development:

```bash
npm run dev
```

The server port can be overridden with a `PORT` environment variable.

## Running with Docker

```bash
cd backend
docker build -t satellite-telemetry-api .
docker run -p 3001:3001 satellite-telemetry-api
```

## Running tests

```bash
npm test
```

Uses Jest + Supertest to exercise every endpoint, including validation and
not-found cases.

## API

Data is stored in an in-memory array (`src/models/telemetryStore.js`), seeded
with a few sample entries on startup. Data persists for the lifetime of the
process and resets on restart.

### `GET /api/telemetry`

Returns all telemetry entries. Supports optional query parameters:

- `satelliteId` — exact match filter.
- `status` — case-insensitive match filter (e.g. `healthy`, `warning`, `critical`).
- `page`, `limit` — when either is present, the response is paginated.

Without pagination params:

```json
{ "data": [ ... ], "total": 3 }
```

With `?page=1&limit=10`:

```json
{
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
}
```

### `POST /api/telemetry`

Creates a new entry. Body:

```json
{
  "satelliteId": "SAT-001",
  "timestamp": "2026-08-25T12:00:00Z",
  "altitude": 550.2,
  "velocity": 7.66,
  "status": "healthy"
}
```

Validation (400 with a `details` array on failure):
- `satelliteId` — required, non-empty string.
- `timestamp` — required, valid ISO 8601 datetime.
- `altitude`, `velocity` — required, positive numbers.
- `status` — required, non-empty string.

Returns `201` with the created entry (including a generated `id`).

### `GET /api/telemetry/:id`

Returns a single entry, or `404` if the id doesn't exist.

### `DELETE /api/telemetry/:id`

Deletes an entry, returning `204` on success or `404` if the id doesn't exist.

## Design notes / assumptions

- The data store is a plain in-memory array behind a small module (`getAll`,
  `getById`, `create`, `remove`) so it could be swapped for a real database
  later without changing the route handlers.
- `status` accepts any non-empty string rather than a fixed enum, since the
  spec only gives examples ("healthy", "critical") rather than a closed list.
- Pagination is opt-in: omitting `page`/`limit` returns the full filtered
  list, keeping the simple case simple while satisfying the bonus requirement.
- Routes are mounted under `/api` (e.g. `/api/telemetry`) rather than at the
  root, so the same paths work behind the `/api/*` rewrite in the repo-root
  [`vercel.json`](../vercel.json) when deployed alongside the frontend as a
  second Vercel service.
