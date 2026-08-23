/**
 * BookEase API Client
 *
 * Thin fetch wrapper that:
 *  - Injects the JWT token from authStore on every request
 *  - Throws ApiError with status + message on non-2xx responses
 *  - Provides typed helpers: api.get / api.post / api.patch / api.delete
 *
 * Set BASE_URL to your server origin to activate real network calls.
 * While BASE_URL is empty the helpers throw ApiError(0) immediately so
 * store actions catch it and fall back to local optimistic logic.
 */

export const BASE_URL = ''; // e.g. 'https://api.bookease.app/v1'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  try {
    // Lazy require avoids circular dep — authStore must not import api/client
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useAuthStore } = require('../store/authStore');
    return useAuthStore.getState().token as string | null;
  } catch {
    return null;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (!BASE_URL) {
    throw new ApiError(0, 'No backend configured — using local store');
  }

  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)                => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown) => request<T>('POST',   path, body),
  patch:  <T>(path: string, body: unknown) => request<T>('PATCH',  path, body),
  delete: <T>(path: string)                => request<T>('DELETE', path),
};
