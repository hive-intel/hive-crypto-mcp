import { exec } from "node:child_process";
import { platform } from "node:os";

const URLS: Record<string, string> = {
  dashboard: "https://hiveintelligence.xyz",
  docs: "https://docs.hiveintelligence.xyz",
  status: "https://status.hiveintelligence.xyz",
  github: "https://github.com/hive-intelligence/hive-mcp",
};

function openUrl(url: string): void {
  const cmd =
    platform() === "darwin"
      ? "open"
      : platform() === "win32"
        ? "start"
        : "xdg-open";
  exec(`${cmd} ${url}`, (err) => {
    if (err) process.stderr.write(`Open this URL manually: ${url}\n`);
  });
}

export function runOpen(target?: string): void {
  const key = target ?? "dashboard";
  const url = URLS[key];
  if (!url) {
    process.stderr.write(
      `Unknown target: "${key}". Available: ${Object.keys(URLS).join(", ")}\n`,
    );
    process.exit(2);
  }
  process.stderr.write(`Opening ${url}...\n`);
  openUrl(url);
}
