import { createInterface } from "node:readline";
import {
  ensureConfigDir,
  getConfig,
  saveConfig,
  getCredentials,
  saveCredentials,
} from "./config-dir.js";

interface ProfileInfo {
  name: string;
  apiKey: string;
  apiUrl: string;
  createdAt: string;
  isActive: boolean;
}

export function maskKey(key: string): string {
  if (!key) return "(empty)";
  const visible = Math.min(8, key.length - 1);
  return key.slice(0, visible) + "...";
}

export function saveProfile(
  name: string,
  apiKey: string,
  apiUrl: string,
): void {
  ensureConfigDir();
  const creds = getCredentials();
  creds.profiles[name] = {
    apiKey,
    apiUrl,
    createdAt: new Date().toISOString(),
  };
  saveCredentials(creds);
  const config = getConfig();
  config.activeProfile = name;
  saveConfig(config);
}

export function removeProfile(name: string): void {
  const creds = getCredentials();
  delete creds.profiles[name];
  saveCredentials(creds);
  const config = getConfig();
  if (config.activeProfile === name) {
    const remaining = Object.keys(creds.profiles);
    config.activeProfile = remaining[0] ?? "default";
    saveConfig(config);
  }
}

export function getActiveProfile(): ProfileInfo | null {
  const config = getConfig();
  const creds = getCredentials();
  const profile = creds.profiles[config.activeProfile];
  if (!profile) return null;
  return { name: config.activeProfile, ...profile, isActive: true };
}

export function listProfiles(): ProfileInfo[] {
  const config = getConfig();
  const creds = getCredentials();
  return Object.entries(creds.profiles).map(([name, p]) => ({
    name,
    ...p,
    isActive: name === config.activeProfile,
  }));
}

export function switchProfile(name: string): void {
  const creds = getCredentials();
  if (!creds.profiles[name]) {
    throw new Error(`Profile "${name}" not found`);
  }
  const config = getConfig();
  config.activeProfile = name;
  saveConfig(config);
}

const ask = (
  rl: ReturnType<typeof createInterface>,
  q: string,
): Promise<string> => new Promise((resolve) => rl.question(q, resolve));

/** Prompt for sensitive input with echo suppressed (shows asterisks) */
function askSecret(prompt: string): Promise<string> {
  // Non-TTY: fall back to regular readline (no masking possible)
  if (!process.stdin.isTTY) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stderr,
    });
    return new Promise((resolve) =>
      rl.question(prompt, (ans) => {
        rl.close();
        resolve(ans);
      }),
    );
  }

  return new Promise((resolve) => {
    process.stderr.write(prompt);
    const chunks: string[] = [];
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;

    if (typeof stdin.setRawMode === "function") {
      stdin.setRawMode(true);
    }
    stdin.resume();
    stdin.setEncoding("utf-8");

    const onData = (ch: string) => {
      const c = ch.toString();
      if (c === "\n" || c === "\r" || c === "\u0004") {
        stdin.removeListener("data", onData);
        if (typeof stdin.setRawMode === "function") {
          stdin.setRawMode(wasRaw ?? false);
        }
        stdin.pause();
        process.stderr.write("\n");
        resolve(chunks.join(""));
      } else if (c === "\u0003") {
        // Ctrl+C
        process.exit(130);
      } else if (c === "\u007f" || c === "\b") {
        // Backspace
        if (chunks.length > 0) {
          chunks.pop();
          process.stderr.write("\b \b");
        }
      } else {
        chunks.push(c);
        process.stderr.write("*");
      }
    };

    stdin.on("data", onData);
  });
}

export async function runLogin(opts: { profile?: string }): Promise<void> {
  const profileName = opts.profile ?? "default";
  process.stderr.write(`\nHive CLI — Login (profile: ${profileName})\n\n`);

  const keyInput = await askSecret("API Key: ");
  const apiKey = keyInput.trim();
  if (!apiKey) {
    process.stderr.write("No API key provided. Aborting.\n");
    process.exit(1);
  }

  const rl = createInterface({ input: process.stdin, output: process.stderr });
  const urlInput = await ask(
    rl,
    `API URL [https://mcp.hiveintelligence.xyz]: `,
  );
  rl.close();
  const apiUrl =
    urlInput.trim() ||
    "https://mcp.hiveintelligence.xyz";

  process.stderr.write(`\nValidating against ${apiUrl}...\n`);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const resp = await fetch(`${apiUrl}/ping`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (resp.ok) {
      process.stderr.write("Key validated successfully.\n");
    } else if (resp.status === 401 || resp.status === 403) {
      process.stderr.write(
        `Warning: Server returned ${resp.status} — key may be invalid.\n`,
      );
    } else {
      process.stderr.write(`Warning: Server returned ${resp.status}.\n`);
    }
  } catch {
    process.stderr.write("Warning: Could not reach server — saving anyway.\n");
  }

  saveProfile(profileName, apiKey, apiUrl);
  process.stderr.write(
    `\nProfile "${profileName}" saved. Key: ${maskKey(apiKey)}\n`,
  );
}

export async function runLogout(): Promise<void> {
  const config = getConfig();
  const profile = config.activeProfile;
  removeProfile(profile);
  process.stderr.write(`Logged out of profile "${profile}".\n`);
}

export async function runWhoami(): Promise<void> {
  const profile = getActiveProfile();
  if (!profile) {
    process.stderr.write("Not logged in. Run: hive auth login\n");
    return;
  }
  process.stderr.write(
    `\nProfile:  ${profile.name}${profile.isActive ? " (active)" : ""}\n`,
  );
  process.stderr.write(`API Key:  ${maskKey(profile.apiKey)}\n`);
  process.stderr.write(`API URL:  ${profile.apiUrl}\n`);
  process.stderr.write(`Created:  ${profile.createdAt}\n\n`);
}

export async function runProfiles(): Promise<void> {
  const profiles = listProfiles();
  if (profiles.length === 0) {
    process.stderr.write("No profiles configured. Run: hive auth login\n");
    return;
  }
  for (const p of profiles) {
    const marker = p.isActive ? " *" : "";
    process.stderr.write(
      `  ${p.name}${marker}  ${maskKey(p.apiKey)}  ${p.apiUrl}\n`,
    );
  }
  process.stderr.write("\n");
}

export async function runSwitch(name: string): Promise<void> {
  try {
    switchProfile(name);
    process.stderr.write(`Switched to profile "${name}".\n`);
  } catch (err) {
    process.stderr.write(
      (err instanceof Error ? err.message : String(err)) + "\n",
    );
    process.exit(1);
  }
}
