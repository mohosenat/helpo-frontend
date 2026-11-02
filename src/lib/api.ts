import { authClient } from "@/lib/auth-client";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const tokenResult = await authClient.token();
  const token = tokenResult.data?.token;
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });
  const data = await response
    .json()
    .catch(() => ({ message: "Unexpected server response" }));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data as T;
}
