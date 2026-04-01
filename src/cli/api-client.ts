import { resolveApiKey, resolveApiUrl, getNoRetry } from "./config-dir.js";

interface ApiResponse {
  ok: boolean;
  data?: unknown;
  error?: { code: string; message: string; suggestion?: string };
  meta: { tool?: string; duration_ms?: number };
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 5000;

type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

function isRetryable(status: number): boolean {
  return status >= 500 || status === 429;
}

function isRetryableError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    err.name === "AbortError" ||
    msg.includes("econnreset") ||
    msg.includes("econnrefused") ||
    msg.includes("etimedout") ||
    msg.includes("fetch failed")
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function computeDelay(
  attempt: number,
  retryAfterHeader?: string | null,
): number {
  if (retryAfterHeader) {
    const seconds = parseInt(retryAfterHeader, 10);
    if (!isNaN(seconds) && seconds > 0)
      return Math.min(seconds * 1000, MAX_DELAY_MS);
  }
  const exponential = BASE_DELAY_MS * Math.pow(2, attempt);
  const jitter = exponential * (0.75 + Math.random() * 0.5);
  return Math.min(jitter, MAX_DELAY_MS);
}

export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  fetchFn: FetchFn = fetch,
): Promise<Response> {
  const maxRetries = getNoRetry() ? 0 : MAX_RETRIES;
  let lastResponse: Response | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchFn(url, init);
      if (
        response.ok ||
        !isRetryable(response.status) ||
        attempt === maxRetries
      ) {
        return response;
      }
      lastResponse = response;
      const retryAfter = response.headers?.get?.("retry-after") ?? null;
      const waitMs = computeDelay(attempt, retryAfter);
      await delay(waitMs);
    } catch (err) {
      if (!isRetryableError(err) || attempt === maxRetries) throw err;
      const waitMs = computeDelay(attempt);
      await delay(waitMs);
    }
  }

  return lastResponse!;
}

function getHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": `hive-cli/${process.env.npm_package_version ?? "0.1.2"}`,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}

export async function executeRemoteTool(
  toolName: string,
  args: Record<string, unknown>,
  timeoutMs: number = 30000,
): Promise<ApiResponse> {
  const url = `${resolveApiUrl()}/api/v1/execute`;
  const apiKey = resolveApiKey();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify({ tool: toolName, args }),
      signal: controller.signal,
    });

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        error: {
          code: "TIMEOUT",
          message: `Request timed out after ${timeoutMs}ms`,
          suggestion: "Increase with --timeout <ms>",
        },
        meta: { tool: toolName },
      };
    }
    const msg = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      error: {
        code: "API_ERROR",
        message: `Connection failed: ${msg}`,
        suggestion: `Check HIVE_API_URL (${resolveApiUrl()})`,
      },
      meta: { tool: toolName },
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchToolCatalog(): Promise<ApiResponse> {
  const url = `${resolveApiUrl()}/api/v1/tools`;
  const apiKey = resolveApiKey();

  const response = await fetchWithRetry(url, {
    headers: getHeaders(apiKey),
  });
  return response.json();
}
