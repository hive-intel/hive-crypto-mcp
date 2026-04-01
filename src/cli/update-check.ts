import { join } from "node:path";
import { CLI_VERSION as SERVER_VERSION } from "../version.js";
import {
  getConfigDir,
  ensureConfigDir,
  readJsonFile,
  writeJsonFile,
} from "./config-dir.js";

const CACHE_TTL_MS = 86_400_000; // 24 hours

interface UpdateCache {
  checkedAt: string;
  latestVersion: string | null;
}

function getCachePath(): string {
  return join(getConfigDir(), "cache", "update-check.json");
}

export async function checkForUpdates(): Promise<void> {
  if (
    process.env.CI ||
    process.env.HIVE_NO_UPDATE_CHECK ||
    !process.stderr.isTTY
  ) {
    return;
  }

  const cached = readJsonFile<UpdateCache>(getCachePath());
  if (cached?.checkedAt) {
    const age = Date.now() - new Date(cached.checkedAt).getTime();
    if (age < CACHE_TTL_MS) {
      if (cached.latestVersion && cached.latestVersion !== SERVER_VERSION) {
        showUpdateMessage(cached.latestVersion);
      }
      return;
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://registry.npmjs.org/hive-intelligence/latest", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return;
    const data = (await res.json()) as { version?: string };

    ensureConfigDir();
    writeJsonFile(getCachePath(), {
      checkedAt: new Date().toISOString(),
      latestVersion: data.version ?? null,
    });

    if (!data.version || data.version === SERVER_VERSION) return;
    showUpdateMessage(data.version);
  } catch {
    // Silently ignore — never block CLI on update check failures
  }
}

function showUpdateMessage(newVersion: string): void {
  process.stderr.write(
    `\nUpdate available: ${SERVER_VERSION} → ${newVersion}\n` +
      `  npm: npm update -g hive-intelligence\n` +
      `  bun: bun update -g hive-intelligence\n\n`,
  );
}
