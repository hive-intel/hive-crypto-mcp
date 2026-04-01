import { platform, release } from "node:os";
import { getConfig, saveConfig, ensureConfigDir } from "./config-dir.js";

interface TelemetryEvent {
  command: string;
  durationMs: number;
  errorCode?: string;
  cliVersion: string;
  os: string;
  nodeVersion: string;
}

const TELEMETRY_URL = "https://dev.hiveintelligence.xyz/api/v1/telemetry";

export function isTelemetryEnabled(): boolean {
  return getConfig().telemetry === true;
}

export function enableTelemetry(): void {
  ensureConfigDir();
  const config = getConfig();
  config.telemetry = true;
  saveConfig(config);
  process.stderr.write(
    "Telemetry enabled. Thank you for helping improve Hive CLI.\n",
  );
  process.stderr.write(
    "Only command names, duration, and error codes are collected.\n",
  );
  process.stderr.write("API keys, arguments, and data are never tracked.\n\n");
}

export function disableTelemetry(): void {
  ensureConfigDir();
  const config = getConfig();
  config.telemetry = false;
  saveConfig(config);
  process.stderr.write("Telemetry disabled.\n\n");
}

export function telemetryStatus(): void {
  const enabled = isTelemetryEnabled();
  process.stderr.write(`Telemetry: ${enabled ? "enabled" : "disabled"}\n\n`);
}

/** Fire-and-forget telemetry event. Never throws, never blocks. */
export function trackCommand(
  command: string,
  durationMs: number,
  errorCode?: string,
): void {
  if (!isTelemetryEnabled()) return;

  const event: TelemetryEvent = {
    command,
    durationMs,
    errorCode,
    cliVersion: process.env.npm_package_version ?? "0.1.2",
    os: `${platform()} ${release()}`,
    nodeVersion: process.version,
  };

  fetch(TELEMETRY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    signal: AbortSignal.timeout(3000),
  }).catch(() => {});
}
