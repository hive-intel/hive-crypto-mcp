import { CliError, type ErrorCode } from "./errors.js";
import { jqEval } from "./jq.js";

// SIGPIPE — clean exit when piping to `head`, `less`, etc.
process.on("SIGPIPE", () => process.exit(0));

/** Global output options set from CLI flags. */
export interface OutputOptions {
  json?: boolean;
  pretty?: boolean;
  fields?: string;
  quiet?: boolean;
  verbose?: boolean;
  noColor?: boolean;
  jq?: string;
  csv?: boolean;
}

let globalOpts: OutputOptions = {};

export function setOutputOptions(opts: OutputOptions): void {
  globalOpts = opts;
}

/** Whether to emit JSON (non-TTY default, or --json flag). */
export function shouldOutputJson(): boolean {
  if (globalOpts.json) return true;
  if (globalOpts.pretty) return false;
  return !process.stdout.isTTY;
}

/** Whether color is enabled. */
export function colorEnabled(): boolean {
  if (globalOpts.noColor) return false;
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  return !!process.stdout.isTTY;
}

/** Apply ANSI color if enabled. */
export function red(s: string): string {
  return colorEnabled() ? `\x1b[31m${s}\x1b[0m` : s;
}
export function green(s: string): string {
  return colorEnabled() ? `\x1b[32m${s}\x1b[0m` : s;
}
export function yellow(s: string): string {
  return colorEnabled() ? `\x1b[33m${s}\x1b[0m` : s;
}
export function dim(s: string): string {
  return colorEnabled() ? `\x1b[2m${s}\x1b[0m` : s;
}
export function bold(s: string): string {
  return colorEnabled() ? `\x1b[1m${s}\x1b[0m` : s;
}

/** The standard envelope for all CLI output. */
export interface Envelope<T = unknown> {
  ok: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    suggestion?: string;
  };
  meta: {
    tool?: string;
    provider?: string;
    duration_ms?: number;
  };
}

/** Build a success envelope. */
export function successEnvelope<T>(
  data: T,
  meta: Envelope["meta"],
): Envelope<T> {
  return { ok: true, data, meta };
}

/** Build an error envelope. */
export function errorEnvelope(err: CliError, meta: Envelope["meta"]): Envelope {
  return {
    ok: false,
    error: {
      code: err.code,
      message: err.message,
      ...(err.suggestion && { suggestion: err.suggestion }),
    },
    meta,
  };
}

/** Apply --fields filtering to data. */
function applyFields<T>(data: T, fields: string | undefined): T {
  if (!fields) return data;
  const keys = fields.split(",").map((f) => f.trim());
  if (Array.isArray(data)) {
    return data.map((item) => pick(item, keys)) as T;
  }
  if (typeof data === "object" && data !== null) {
    return pick(data, keys) as T;
  }
  return data;
}

function pick(obj: unknown, keys: string[]): unknown {
  if (typeof obj !== "object" || obj === null) return obj;
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in (obj as Record<string, unknown>)) {
      result[key] = (obj as Record<string, unknown>)[key];
    }
  }
  return result;
}

/** Write an envelope to stdout. Handles JSON vs human mode. */
export async function writeOutput(envelope: Envelope): Promise<void> {
  if (globalOpts.fields && envelope.data) {
    envelope = {
      ...envelope,
      data: applyFields(envelope.data, globalOpts.fields),
    };
  }

  // Apply --jq filter
  if (globalOpts.jq && envelope.data != null) {
    envelope = { ...envelope, data: jqEval(envelope.data, globalOpts.jq) };
  }

  // CSV output mode
  if (globalOpts.csv && envelope.ok && Array.isArray(envelope.data)) {
    process.stdout.write(
      (await formatCsv(envelope.data as Record<string, unknown>[])) + "\n",
    );
    return;
  }

  if (shouldOutputJson()) {
    const output = JSON.stringify(envelope, null, 2);
    process.stdout.write(output + "\n");
    return;
  }

  // Human-readable mode
  if (!globalOpts.quiet && envelope.meta.tool) {
    const status = envelope.ok
      ? green(`✓ ${envelope.meta.tool}`)
      : red(`✗ ${envelope.meta.tool}`);
    const provider = envelope.meta.provider
      ? dim(` (${envelope.meta.provider})`)
      : "";
    const timing =
      envelope.meta.duration_ms != null
        ? dim(` ${envelope.meta.duration_ms}ms`)
        : "";
    process.stderr.write(`${status}${provider}${timing}\n\n`);
  }

  if (envelope.ok && envelope.data != null) {
    // Auto-table: array of objects renders as a fixed-width table
    if (
      Array.isArray(envelope.data) &&
      envelope.data.length > 0 &&
      typeof envelope.data[0] === "object" &&
      envelope.data[0] !== null
    ) {
      const { formatTable } = await import("./format.js");
      process.stdout.write(
        formatTable(envelope.data as Record<string, unknown>[]) + "\n",
      );
      return;
    }

    const text =
      typeof envelope.data === "string"
        ? envelope.data
        : JSON.stringify(envelope.data, null, 2);
    process.stdout.write(text + "\n");
  }

  if (!envelope.ok && envelope.error) {
    process.stderr.write(red(`Error: ${envelope.error.message}\n`));
    if (envelope.error.suggestion) {
      process.stderr.write(
        yellow(`  Suggestion: ${envelope.error.suggestion}\n`),
      );
    }
  }
}

/** Write a data envelope and exit. */
export async function outputSuccess<T>(
  data: T,
  meta: Envelope["meta"],
): Promise<void> {
  await writeOutput(successEnvelope(data, meta));
}

/** Write an error envelope and exit with the appropriate code. */
export async function outputError(
  err: CliError,
  meta: Envelope["meta"],
): Promise<never> {
  await writeOutput(errorEnvelope(err, meta));
  process.exit(err.exitCode);
}

/** Log to stderr (only when not --quiet). */
export function info(msg: string): void {
  if (!globalOpts.quiet) {
    process.stderr.write(msg + "\n");
  }
}

/** Log to stderr (only when --verbose). */
export function debug(msg: string): void {
  if (globalOpts.verbose) {
    process.stderr.write(dim(`[debug] ${msg}`) + "\n");
  }
}

/** Detect CI environment. */
export function isCI(): boolean {
  return !!(
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.GITLAB_CI ||
    process.env.JENKINS_URL ||
    process.env.HIVE_CI
  );
}

/** Format array of objects as RFC 4180 CSV. */
export async function formatCsv(
  data: Record<string, unknown>[],
): Promise<string> {
  if (data.length === 0) return "";
  const { formatCell } = await import("./format.js");
  const keys = [...new Set(data.flatMap((row) => Object.keys(row)))];
  const escape = (val: unknown): string => {
    const str = formatCell(val);
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  const header = keys.join(",");
  const rows = data.map((row) => keys.map((k) => escape(row[k])).join(","));
  return [header, ...rows].join("\n");
}
