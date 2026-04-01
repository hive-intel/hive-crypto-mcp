import { homedir, platform } from "node:os";
import { join } from "node:path";

function getEnvBlock(): Record<string, string> {
  const envs: Record<string, string> = {};
  const keys = [
    "COINGECKO_PRO_API_KEY",
    "COINGECKO_DEMO_API_KEY",
    "DEBANK_API_KEY",
    "GOPLUS_APP_KEY",
    "GOPLUS_APP_SECRET",
    "LUNARCRUSH_API_KEY",
    "CODEX_API_KEY",
    "GOLDRUSH_API_KEY",
    "FINNHUB_API_KEY",
    "FRED_API_KEY",
  ];
  for (const key of keys) {
    if (process.env[key]) envs[key] = process.env[key]!;
  }
  return envs;
}

export function configClaudeDesktop(): void {
  const env = getEnvBlock();
  const config = {
    "hive-mcp": {
      command: "npx",
      args: ["-y", "hive-mcp"],
      env,
    },
  };
  const p =
    platform() === "darwin"
      ? join(
          homedir(),
          "Library",
          "Application Support",
          "Claude",
          "claude_desktop_config.json",
        )
      : platform() === "win32"
        ? join(
            homedir(),
            "AppData",
            "Roaming",
            "Claude",
            "claude_desktop_config.json",
          )
        : join(homedir(), ".config", "claude", "claude_desktop_config.json");
  console.log(
    '\nAdd this to your claude_desktop_config.json under "mcpServers":\n',
  );
  console.log(`Config file: ${p}\n`);
  console.log(JSON.stringify(config, null, 2));
}

export function configCursor(): void {
  const env = getEnvBlock();
  const config = {
    mcpServers: {
      "hive-mcp": { command: "npx", args: ["-y", "hive-mcp"], env },
    },
  };
  console.log("\nAdd to .cursor/mcp.json:\n");
  console.log(JSON.stringify(config, null, 2));
}

export function configVscode(): void {
  const env = getEnvBlock();
  const config = {
    servers: {
      "hive-mcp": {
        type: "stdio",
        command: "npx",
        args: ["-y", "hive-mcp"],
        env,
      },
    },
  };
  console.log("\nAdd to .vscode/mcp.json:\n");
  console.log(JSON.stringify(config, null, 2));
}

export function configClaudeCode(): void {
  const envFlags = Object.entries(getEnvBlock())
    .map(([k, v]) => `-e ${k}=${v}`)
    .join(" ");
  console.log("\nRun this command:\n");
  console.log(`claude mcp add ${envFlags} hive-mcp -- npx -y hive-mcp`);
}

export function configHttpUrl(url: string): void {
  console.log(`\nRemote MCP server URL: ${url}/mcp`);
  console.log("\nFor Claude Code:");
  console.log(`  claude mcp add --transport http hive-mcp ${url}/mcp`);
  console.log("\nFor clients without HTTP support:");
  console.log(`  npx mcp-remote ${url}/mcp`);
}
