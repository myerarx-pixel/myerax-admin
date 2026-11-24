const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001';

export async function adminRequest<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof json.error === 'string'
        ? json.error
        : json.error?.formErrors?.[0] || JSON.stringify(json.error) || res.statusText;
    throw new Error(msg || 'Request failed');
  }
  return json as T;
}
