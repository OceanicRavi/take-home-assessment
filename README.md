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

Open http://localhost:5173 — the Vite dev server proxies its `/api` calls to
the backend on port 3001 by default (see `frontend/vite.config.js`).

See each subproject's README for full details, API reference, Docker usage,
and test instructions:

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## Deploying (Vercel)

[`vercel.json`](vercel.json) at the repo root deploys both apps as a single
Vercel project with two services:

```json
{
  "services": {
    "frontend": { "root": "frontend", "framework": "vite" },
    "backend": { "root": "backend" }
  },
  "rewrites": [
    { "source": "/api(/.*)?", "destination": { "type": "service", "service": "backend" } },
    { "source": "/(.*)", "destination": { "type": "service", "service": "frontend" } }
  ]
}
```

Requests to `/api/*` are routed to the backend (which is why its routes are
mounted at `/api/telemetry`, not `/telemetry`); everything else goes to the
frontend. Since both are served from the same domain, the frontend's default
relative `/api` calls work with no extra configuration — no `VITE_API_URL`
needed.

To deploy: push the repo to GitHub, then import it in the Vercel dashboard
(or run `vercel` from the repo root) with this file in place. Vercel picks up
the multi-service config automatically.

Note the in-memory store resets whenever the backend service restarts or
scales — expected for this exercise, but worth knowing if telemetry entries
you added seem to disappear after a while.

## Approach & assumptions

- **Backend**: Express with a small in-memory store module, custom validation
  middleware (no extra validation library, to keep the dependency surface
  small), and pagination that's opt-in via `page`/`limit` query params so the
  default `GET /api/telemetry` response stays simple. Covered by 13 Jest/Supertest
  tests. Docker support included.
- **Frontend**: React (Vite) with plain `useState`/`useEffect` for state —
  the app is small enough that Redux would add ceremony without benefit.
  Client-side validation mirrors the backend's rules so users get instant
  feedback before a request is even sent. Table sorting, a loading spinner,
  and an error banner for unreachable/failing API calls are all implemented.
  Covered by Vitest + React Testing Library tests.
- Both apps were run locally end-to-end (add, filter, sort, delete) against
  each other, not just against their own test suites.
