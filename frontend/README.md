# Satellite Telemetry Dashboard (Frontend)

A React + Vite web app for viewing, filtering, adding, and deleting satellite
telemetry entries against the [backend API](../backend).

## Running locally

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

By default the app talks to the backend at `http://localhost:3001`. To point
it elsewhere, copy `.env.example` to `.env` and set `VITE_API_URL`.

Make sure the backend is running first (see `../backend/README.md`).

## Running tests

```bash
npm test
```

Uses Vitest + React Testing Library to cover the table (rendering, sorting,
delete) and the form (client-side validation, valid submission).

## Building for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Features

- Table of telemetry entries (Satellite ID, Timestamp, Altitude, Velocity,
  Health Status) with click-to-sort on Timestamp, Altitude, and Velocity.
- Filter by Satellite ID (text) and Health Status (dropdown).
- Form to add a new entry, with client-side validation mirroring the backend
  rules (required fields, valid datetime, positive altitude/velocity).
- Delete button per row.
- Loading spinner while fetching, and a dismissible error banner if the API
  request fails (e.g. backend unreachable).

## Design notes / assumptions

- State is managed with local `useState`/`useEffect` in `App.jsx` — the app
  is small enough that Redux would be unnecessary overhead.
- The API client (`src/api/telemetryApi.js`) centralizes `fetch` calls and
  error normalization so components don't deal with `fetch` directly.
- Health status in the add-entry form is a fixed dropdown
  (`healthy` / `warning` / `critical`) to keep entries consistent with the
  filter dropdown, even though the backend itself accepts any string.
