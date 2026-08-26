const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response had no JSON body, keep the generic message
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function fetchTelemetry({ satelliteId, status } = {}) {
  const params = new URLSearchParams();
  if (satelliteId) params.set('satelliteId', satelliteId);
  if (status) params.set('status', status);

  const query = params.toString();
  const res = await fetch(`${API_URL}/telemetry${query ? `?${query}` : ''}`);
  return handleResponse(res);
}

export async function createTelemetry(entry) {
  const res = await fetch(`${API_URL}/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return handleResponse(res);
}

export async function deleteTelemetry(id) {
  const res = await fetch(`${API_URL}/telemetry/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
