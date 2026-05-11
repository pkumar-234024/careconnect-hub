const DEFAULT_API_BASE_URL = "https://localhost:57679";

function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (configured || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";

  if (response.status === 204) {
    return undefined as T;
  }

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    let payload: unknown = undefined;
    try {
      payload = await parseResponse<unknown>(response.clone());
    } catch {
      payload = undefined;
    }

    const message =
      typeof payload === "string"
        ? payload
        : payload && typeof payload === "object"
          ? (payload as { message?: string; detail?: string; title?: string }).message ??
            (payload as { message?: string; detail?: string; title?: string }).detail ??
            (payload as { message?: string; detail?: string; title?: string }).title ??
            `Request failed with status ${response.status}`
          : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return parseResponse<T>(response);
}
