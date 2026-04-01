import { existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import {
  getConfigDir,
  ensureConfigDir,
  readJsonFile,
  writeJsonFile,
} from "./config-dir.js";

const DEFAULT_TTL_MS = 300_000; // 5 minutes

interface CacheEntry {
  fetchedAt: string;
  data: unknown[];
}

function getCachePath(): string {
  return join(getConfigDir(), "cache", "tools.json");
}

function getTtlMs(): number {
  const envTtl = process.env.HIVE_CACHE_TTL_MS;
  if (envTtl) {
    const parsed = parseInt(envTtl, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_TTL_MS;
}

export function getCachedTools(): unknown[] | null {
  const path = getCachePath();
  const entry = readJsonFile<CacheEntry>(path);
  if (!entry || !entry.fetchedAt || !Array.isArray(entry.data)) return null;

  const age = Date.now() - new Date(entry.fetchedAt).getTime();
  if (age > getTtlMs()) return null;

  return entry.data;
}

export function setCachedTools(data: unknown[]): void {
  ensureConfigDir();
  const entry: CacheEntry = {
    fetchedAt: new Date().toISOString(),
    data,
  };
  writeJsonFile(getCachePath(), entry);
}

export function clearCache(): void {
  const path = getCachePath();
  if (existsSync(path)) unlinkSync(path);
  const updatePath = join(getConfigDir(), "cache", "update-check.json");
  if (existsSync(updatePath)) unlinkSync(updatePath);
}
