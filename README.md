# Satellite Telemetry Dashboard

A take-home assessment: a system to view, filter, and add satellite telemetry
data (satellite ID, timestamp, altitude, velocity, health status).

- [`backend/`](backend) — REST API (Node.js + Express), in-memory store.
- [`frontend/`](frontend) — React + Vite dashboard.

## Quick start

```bash
# Terminal 1
cd backend
npm install
npm start          # http://localhost:3001

# Terminal 2
cd frontend
npm install
npm run dev         # http://localhost:5173
```

Open http://localhost:5173 — it talks to the API on port 3001 by default.

See each subproject's README for full details, API reference, Docker usage,
and test instructions:

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## Approach & assumptions

- **Backend**: Express with a small in-memory store module, custom validation
  middleware (no extra validation library, to keep the dependency surface
  small), and pagination that's opt-in via `page`/`limit` query params so the
  default `GET /telemetry` response stays simple. Covered by 13 Jest/Supertest
  tests. Docker support included.
- **Frontend**: React (Vite) with plain `useState`/`useEffect` for state —
  the app is small enough that Redux would add ceremony without benefit.
  Client-side validation mirrors the backend's rules so users get instant
  feedback before a request is even sent. Table sorting, a loading spinner,
  and an error banner for unreachable/failing API calls are all implemented.
  Covered by Vitest + React Testing Library tests.
- Both apps were run locally end-to-end (add, filter, sort, delete) against
  each other, not just against their own test suites.
