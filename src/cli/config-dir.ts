import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface HiveConfig {
  activeProfile: string;
  aliases: Record<string, string>;
  telemetry: boolean;
}

export interface HiveCredentials {
  profiles: Record<
    string,
    {
      apiKey: string;
      apiUrl: string;
      createdAt: string;
    }
  >;
}

const DEFAULT_CONFIG: HiveConfig = {
  activeProfile: "default",
  aliases: {},
  telemetry: false,
};

const DEFAULT_CREDENTIALS: HiveCredentials = { profiles: {} };

/** Module-level overrides set by CLI flags (highest priority) */
let _flagApiKey: string | undefined;
let _flagNoRetry = false;

export function setCliFlags(opts: {
  apiKey?: string;
  noRetry?: boolean;
}): void {
  _flagApiKey = opts.apiKey;
  _flagNoRetry = opts.noRetry ?? false;
}

export function getNoRetry(): boolean {
  return _flagNoRetry;
}

export function getConfigDir(): string {
  return process.env.HIVE_CONFIG_DIR || join(homedir(), ".config", "hive");
}

export function ensureConfigDir(): void {
  const dir = getConfigDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const cacheDir = join(dir, "cache");
  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
}

export function readJsonFile<T>(filePath: string): T | null {
  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJsonFile(filePath: string, data: unknown): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", {
    encoding: "utf-8",
    mode: 0o600,
  });
}

export function getConfig(): HiveConfig {
  const filePath = join(getConfigDir(), "config.json");
  return readJsonFile<HiveConfig>(filePath) ?? { ...DEFAULT_CONFIG };
}

export function saveConfig(config: HiveConfig): void {
  ensureConfigDir();
  const filePath = join(getConfigDir(), "config.json");
  writeJsonFile(filePath, config);
}

export function getCredentials(): HiveCredentials {
  const filePath = join(getConfigDir(), "credentials.json");
  return (
    readJsonFile<HiveCredentials>(filePath) ?? {
      ...DEFAULT_CREDENTIALS,
      profiles: {},
    }
  );
}

export function saveCredentials(creds: HiveCredentials): void {
  ensureConfigDir();
  const filePath = join(getConfigDir(), "credentials.json");
  writeJsonFile(filePath, creds);
}

/** Resolve API key from: CLI flag > env var > active profile */
export function resolveApiKey(flagKey?: string): string | undefined {
  if (flagKey) return flagKey;
  if (_flagApiKey) return _flagApiKey;
  if (process.env.HIVE_API_KEY) return process.env.HIVE_API_KEY;
  const config = getConfig();
  const creds = getCredentials();
  return creds.profiles[config.activeProfile]?.apiKey;
}

/** Resolve API URL from: env var > active profile > default */
export function resolveApiUrl(): string {
  if (process.env.HIVE_API_URL) return process.env.HIVE_API_URL;
  const config = getConfig();
  const creds = getCredentials();
  return (
    creds.profiles[config.activeProfile]?.apiUrl ||
    "https://mcp.hiveintelligence.xyz"
  );
}
