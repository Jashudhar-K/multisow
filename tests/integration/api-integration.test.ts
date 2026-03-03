import { describe, it, expect } from 'vitest';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchApi(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, options);
  return res;
}

describe('API Integration', () => {
  it('GET /api/crops returns array with length > 0', async () => {
    const res = await fetchApi('/crops');
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('GET /api/soils returns soil type array', async () => {
    const res = await fetchApi('/soils');
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST /api/strata/design with valid body returns 200', async () => {
    const res = await fetchApi('/strata/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area: 1, crops: ['Coconut', 'Banana'] }),
    });
    expect(res.ok).toBe(true);
  });

  it('GET /api/presets returns 6 preset objects', async () => {
    const res = await fetchApi('/presets');
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(6);
  });

  it('POST /api/advisor/compatibility returns compatibility score', async () => {
    const res = await fetchApi('/advisor/compatibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plants: [] }),
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(typeof data.score).toBe('number');
  });
});
