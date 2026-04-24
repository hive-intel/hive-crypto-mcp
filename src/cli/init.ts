import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";

const DEFAULT_API_URL =
  "https://mcp.hiveintelligence.xyz";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> =>
  new Promise((resolve) => rl.question(q, resolve));

export async function runInit(opts: {
  minimal?: boolean;
  dryRun?: boolean;
}): Promise<void> {
  console.log("\nHive MCP Setup\n");

  const envPath = join(process.cwd(), ".env");
  const existing: Record<string, string> = {};

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/);
      if (match) existing[match[1]] = match[2];
    }
    console.log(
      `Found existing .env with ${Object.keys(existing).length} keys.\n`,
    );
  }

  let apiKey = existing.HIVE_API_KEY || process.env.HIVE_API_KEY || "";
  let apiUrl = existing.HIVE_API_URL || process.env.HIVE_API_URL || "";

  if (opts.minimal) {
    // Minimal mode: just write defaults without prompts
    if (!apiKey) {
      console.log(
        "Warning: HIVE_API_KEY not set. Set it manually or re-run without --minimal.\n",
      );
    }
  } else {
    // Interactive: ask for API key
    const currentKeyTag = apiKey ? ` [current: ${apiKey.slice(0, 6)}...]` : "";
    const keyInput = await ask(
      `HIVE_API_KEY${currentKeyTag}\n  Your Hive Intelligence API key: `,
    );
    if (keyInput.trim()) {
      apiKey = keyInput.trim();
    }

    // Ask for API URL (optional)
    const currentUrlTag = apiUrl
      ? ` [current: ${apiUrl}]`
      : ` [default: ${DEFAULT_API_URL}]`;
    const urlInput = await ask(
      `\nHIVE_API_URL${currentUrlTag}\n  Server URL (press Enter for default): `,
    );
    if (urlInput.trim()) {
      apiUrl = urlInput.trim();
    }
  }

  rl.close();

  // Update env vars
  if (apiKey) existing.HIVE_API_KEY = apiKey;
  if (apiUrl) existing.HIVE_API_URL = apiUrl;

  // Validate the key by hitting the server health endpoint
  if (apiKey) {
    const baseUrl = apiUrl || DEFAULT_API_URL;
    console.log(`\nValidating API key against ${baseUrl}...`);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const resp = await fetch(`${baseUrl}/health`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (resp.ok) {
        console.log("API key validated successfully.\n");
      } else if (resp.status === 401 || resp.status === 403) {
        console.log(
          `Warning: Server returned ${resp.status} — key may be invalid.\n`,
        );
      } else {
        console.log(
          `Warning: Server returned ${resp.status} ${resp.statusText}.\n`,
        );
      }
    } catch {
      console.log(
        `Warning: Could not reach ${baseUrl} — check the URL and try again.\n`,
      );
    }
  }

  // Build env content
  const lines = Object.entries(existing)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  if (opts.dryRun) {
    console.log("Dry run — would write to .env:\n");
    console.log(lines);
    console.log("");
    return;
  }

  writeFileSync(envPath, lines + "\n", "utf-8");
  console.log(`.env written to ${envPath}`);
  console.log("Run: hive doctor  to verify connectivity\n");
}
