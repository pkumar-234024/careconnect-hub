/**
 * Lightweight API client wrapper.
 * Today it returns mock data via the static modules in /data.
 * Tomorrow, swap fetch implementations here without touching feature code.
 */

const SIMULATED_LATENCY_MS = 150;

export async function mockFetch<T>(data: T): Promise<T> {
  await new Promise((r) => setTimeout(r, SIMULATED_LATENCY_MS));
  return data;
}

// When backend is ready:
// export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, init);
//   if (!res.ok) throw new Error(`API ${res.status}`);
//   return res.json() as Promise<T>;
// }
