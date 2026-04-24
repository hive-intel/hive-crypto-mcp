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
  // Version of the locally installed CLI at the time the cache was written.
  // If this no longer matches the running binary, the cache is considered
  // stale — this self-heals across upgrades regardless of install method
  // (global npm, npx, bun, pnpm, manual), without relying on postinstall.
  cliVersion: string;
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
  if (cached?.checkedAt && cached.cliVersion === SERVER_VERSION) {
    const age = Date.now() - new Date(cached.checkedAt).getTime();
    if (age < CACHE_TTL_MS) {
      if (cached.latestVersion && isNewer(cached.latestVersion, SERVER_VERSION)) {
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
      cliVersion: SERVER_VERSION,
    } satisfies UpdateCache);

    if (!data.version || !isNewer(data.version, SERVER_VERSION)) return;
    showUpdateMessage(data.version);
  } catch {
    // Silently ignore — never block CLI on update check failures
  }
}

// Returns true iff `latest` is a strictly newer semver than `current`.
// Handles MAJOR.MINOR.PATCH with an optional pre-release tag (1.0.0-rc.1).
// Per semver, a pre-release version has lower precedence than the same
// version without one (1.0.0-rc.1 < 1.0.0).
function isNewer(latest: string, current: string): boolean {
  const parse = (v: string) => {
    const [main, pre = ""] = v.split("-", 2);
    const parts = main.split(".").map((n) => parseInt(n, 10) || 0);
    return { parts, pre };
  };
  const a = parse(latest);
  const b = parse(current);
  for (let i = 0; i < 3; i++) {
    const ai = a.parts[i] ?? 0;
    const bi = b.parts[i] ?? 0;
    if (ai !== bi) return ai > bi;
  }
  if (a.pre === b.pre) return false;
  if (!a.pre) return true;
  if (!b.pre) return false;
  return a.pre > b.pre;
}

function showUpdateMessage(newVersion: string): void {
  process.stderr.write(
    `\nUpdate available: ${SERVER_VERSION} → ${newVersion}\n` +
      `  npm: npm update -g hive-intelligence\n` +
      `  bun: bun update -g hive-intelligence\n\n`,
  );
}
