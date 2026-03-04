import { API_BASE_URL } from "@/utils/constants";

export type ApiError = {
  message: string;
  details?: unknown;
};

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = (await readJson<unknown>(res).catch(() => null)) as
      | { message?: unknown; details?: unknown }
      | null;

    const message =
      (typeof body?.message === "string" ? body.message : undefined) || `Request failed (${res.status})`;
    const err: ApiError = { message, details: body?.details };
    throw err;
  }

  return readJson<T>(res);
}
