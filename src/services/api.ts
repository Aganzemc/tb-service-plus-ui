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
  const hasBody = options.body != null;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!headers.has("Content-Type") && hasBody && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = (await readJson<unknown>(res).catch(() => null)) as
      | { message?: unknown; details?: unknown }
      | null;

    const fallbackMessage =
      res.status === 413 ? "Image trop lourde. Choisissez une image plus legere." : `Request failed (${res.status})`;

    const message = (typeof body?.message === "string" ? body.message : undefined) || fallbackMessage;
    const err: ApiError = { message, details: body?.details };
    throw err;
  }

  return readJson<T>(res);
}