import { distance } from "fastest-levenshtein";

export const ExitCode = {
  SUCCESS: 0,
  GENERAL_ERROR: 1,
  INVALID_ARGS: 2,
  TOOL_NOT_FOUND: 3,
  API_ERROR: 4,
  AUTH_FAILURE: 5,
  RATE_LIMITED: 6,
  TIMEOUT: 124,
} as const;

export type ExitCodeValue = (typeof ExitCode)[keyof typeof ExitCode];

export type ErrorCode =
  | "GENERAL_ERROR"
  | "INVALID_ARGS"
  | "TOOL_NOT_FOUND"
  | "API_ERROR"
  | "PROVIDER_UNAVAILABLE"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "VALIDATION_ERROR";

const ERROR_CODE_TO_EXIT: Record<ErrorCode, ExitCodeValue> = {
  GENERAL_ERROR: ExitCode.GENERAL_ERROR,
  INVALID_ARGS: ExitCode.INVALID_ARGS,
  TOOL_NOT_FOUND: ExitCode.TOOL_NOT_FOUND,
  API_ERROR: ExitCode.API_ERROR,
  PROVIDER_UNAVAILABLE: ExitCode.AUTH_FAILURE,
  RATE_LIMITED: ExitCode.RATE_LIMITED,
  TIMEOUT: ExitCode.TIMEOUT,
  VALIDATION_ERROR: ExitCode.INVALID_ARGS,
};

export const ERROR_DOC_URLS: Partial<Record<ErrorCode, string>> = {
  RATE_LIMITED: "https://docs.hiveintelligence.xyz/errors/rate-limited",
  TIMEOUT: "https://docs.hiveintelligence.xyz/errors/timeout",
  PROVIDER_UNAVAILABLE:
    "https://docs.hiveintelligence.xyz/errors/provider-unavailable",
  TOOL_NOT_FOUND: "https://docs.hiveintelligence.xyz/errors/tool-not-found",
};

export class CliError extends Error {
  public readonly code: ErrorCode;
  public readonly exitCode: ExitCodeValue;
  public readonly suggestion?: string;
  public readonly docUrl?: string;

  constructor(
    code: ErrorCode,
    message: string,
    suggestion?: string,
    docUrl?: string,
  ) {
    super(message);
    this.name = "CliError";
    this.code = code;
    this.exitCode = ERROR_CODE_TO_EXIT[code] ?? ExitCode.GENERAL_ERROR;
    this.suggestion = suggestion;
    this.docUrl = docUrl ?? ERROR_DOC_URLS[code];
  }
}

export function classifyError(error: unknown, toolName?: string): CliError {
  if (error instanceof CliError) return error;

  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  if (lower.includes("timed out") || lower.includes("timeout")) {
    return new CliError("TIMEOUT", msg, "Increase timeout with --timeout <ms>");
  }
  if (lower.includes("rate limit") || lower.includes("429")) {
    return new CliError(
      "RATE_LIMITED",
      msg,
      "Wait and retry, or reduce request frequency",
    );
  }
  if (
    lower.includes("api key") ||
    lower.includes("unauthorized") ||
    lower.includes("not configured") ||
    lower.includes("unavailable")
  ) {
    return new CliError(
      "PROVIDER_UNAVAILABLE",
      msg,
      "Run: hive-mcp auth login",
    );
  }
  if (lower.includes("not found") && toolName) {
    return new CliError(
      "TOOL_NOT_FOUND",
      msg,
      `Run: hive-mcp tools search "${toolName}"`,
    );
  }

  return new CliError("API_ERROR", msg);
}

export function suggestSimilarTools(
  input: string,
  toolNames: string[],
  maxDistance: number = 3,
): string[] {
  return toolNames
    .map((name) => ({ name, dist: distance(input, name) }))
    .filter((entry) => entry.dist <= maxDistance)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3)
    .map((entry) => entry.name);
}
