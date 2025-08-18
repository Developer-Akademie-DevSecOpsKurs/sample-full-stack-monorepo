export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const _path = path.endsWith("/") ? path : `${path}/`
  const res = await fetch(`${API_BASE}${_path}`, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status}`);
  }
  return (await res.json()) as T;
}