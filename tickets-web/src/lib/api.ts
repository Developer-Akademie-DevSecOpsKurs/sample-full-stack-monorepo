export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status}`);
  }
  return (await res.json()) as T;
}