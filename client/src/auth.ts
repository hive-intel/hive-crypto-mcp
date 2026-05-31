import type { HiveAuthScheme } from "./types.js";

export type HiveAuthHeaderOptions = {
  apiKey?: string;
  authScheme?: HiveAuthScheme;
  headers?: HeadersInit;
};

function headersToRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) {
    return {};
  }
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return { ...headers };
}

export function buildHiveAuthHeaders({
  apiKey,
  authScheme = "x-api-key",
  headers,
}: HiveAuthHeaderOptions): Record<string, string> {
  const output = headersToRecord(headers);
  if (!apiKey || authScheme === "none") {
    return output;
  }
  if (authScheme === "bearer") {
    output.Authorization = `Bearer ${apiKey}`;
    return output;
  }
  output["x-api-key"] = apiKey;
  return output;
}
