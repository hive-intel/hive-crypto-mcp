#!/usr/bin/env node
import { Command, CommanderError } from "commander";
import { CLI_VERSION } from "./version.js";
import { setOutputOptions, red } from "./cli/output.js";
import { setCliFlags } from "./cli/config-dir.js";
import { ExitCode } from "./cli/errors.js";
import { NAMESPACE } from "./cli/namespace.js";
import { executeTool } from "./cli/execute.js";
import { checkForUpdates } from "./cli/update-check.js";

// ─── Global safety net ──────────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  const msg =
    err instanceof Error
      ? process.env.DEBUG
        ? err.stack
        : err.message
      : String(err);
  process.stderr.write(`Fatal: ${msg}\n`);
  process.exit(ExitCode.GENERAL_ERROR);
});

process.on("uncaughtException", (err) => {
  process.stderr.write(
    `Fatal: ${process.env.DEBUG ? err.stack : err.message}\n`,
  );
  process.exit(ExitCode.GENERAL_ERROR);
});

process.on("SIGINT", () => process.exit(130));
process.on("SIGTERM", () => process.exit(143));

// ─── Program definition ─────────────────────────────────────────────
const program = new Command();

program
  .name("hive")
  .version(CLI_VERSION)
  .description(
    "Hive Intelligence CLI — crypto, DeFi, stocks, forex, and macro data",
  )
  .exitOverride()
  .configureOutput({
    writeErr: (str) => process.stderr.write(str),
    outputError: (str, write) => {
      write(process.stderr.isTTY ? red(str) : str);
    },
  })
  .showHelpAfterError("(use --help for usage)")
  .option("--json", "Force JSON envelope output")
  .option("--pretty", "Force human-readable output")
  .option("--fields <list>", "Comma-separated fields to include in output")
  .option("-q, --quiet", "Suppress all non-data output")
  .option("-v, --verbose", "Show debug info")
  .option("--no-color", "Disable ANSI colors")
  .option("--env-file <path>", "Path to .env file", ".env")
  .option("--timeout <ms>", "Tool execution timeout in ms", "30000")
  .option("--no-retry", "Disable automatic retry on failure")
  .option("--no-cache", "Bypass tool catalog cache")
  .option("--jq <expr>", "Filter JSON output with query expression")
  .option("--csv", "Output as CSV")
  .option("--api-key <key>", "Override API key for this command");

// ─── Hook: set global output options before any command runs ─────────
program.hook("preAction", (thisCommand) => {
  const opts = thisCommand.opts();
  setOutputOptions({
    json: opts.json,
    pretty: opts.pretty,
    fields: opts.fields,
    quiet: opts.quiet,
    verbose: opts.verbose,
    noColor: opts.color === false,
    jq: opts.jq,
    csv: opts.csv,
  });
  if (opts.verbose) {
    process.env.DEBUG = "1";
  }
  setCliFlags({ apiKey: opts.apiKey, noRetry: opts.retry === false });
});

// ─── Default action (no subcommand) = show help ─────────────────────
program.action(() => {
  program.help();
});

// ─── Domain subcommands (auto-generated from NAMESPACE) ─────────────
for (const domain of NAMESPACE) {
  const domainCmd = program
    .command(domain.name)
    .description(domain.description);

  for (const sub of domain.commands) {
    const subCmd = domainCmd.command(sub.name).description(sub.description);

    if (sub.args) {
      for (const [, argDef] of Object.entries(sub.args)) {
        subCmd.option(
          argDef.flag,
          argDef.required
            ? `${argDef.description} (required)`
            : argDef.description,
        );
      }
    }

    subCmd.option("--args <json>", "Pass all arguments as JSON");

    subCmd.action(async (opts) => {
      let args: Record<string, unknown> = {};

      if (opts.args) {
        try {
          args = JSON.parse(opts.args);
        } catch {
          process.stderr.write("Error: Invalid JSON in --args\n");
          process.exit(ExitCode.INVALID_ARGS);
        }
      }

      if (sub.args) {
        for (const [paramName, argDef] of Object.entries(sub.args)) {
          const flagName = argDef.flag.replace(/^--/, "").split(/[\s<]/)[0];
          if (opts[flagName] !== undefined) {
            args[paramName] = opts[flagName];
          }
        }
      }

      // Interactive prompt for missing required params (TTY only)
      if (sub.args) {
        const missingRequired = Object.entries(sub.args).filter(
          ([paramName, argDef]) =>
            argDef.required && args[paramName] === undefined,
        );

        if (missingRequired.length > 0) {
          if (process.stdin.isTTY) {
            const { createInterface } = await import("node:readline");
            const rl = createInterface({
              input: process.stdin,
              output: process.stderr,
            });
            const ask = (q: string): Promise<string> =>
              new Promise((resolve) => rl.question(q, resolve));

            for (const [paramName, argDef] of missingRequired) {
              const answer = await ask(`${argDef.description || paramName}: `);
              if (answer.trim()) args[paramName] = answer.trim();
            }
            rl.close();
          }

          const stillMissing = missingRequired.filter(
            ([paramName]) => args[paramName] === undefined,
          );
          if (stillMissing.length > 0) {
            const names = stillMissing
              .map(([, argDef]) => argDef.flag.split(/[\s<]/)[0])
              .join(", ");
            process.stderr.write(
              `Error: missing required option(s): ${names}\n`,
            );
            process.exit(ExitCode.INVALID_ARGS);
          }
        }
      }

      const timeout = parseInt(program.opts().timeout, 10);
      await executeTool(sub.tool, args, timeout);
    });
  }
}

// ─── tools ───────────────────────────────────────────────────────────
const toolsCmd = program
  .command("tools")
  .description("Discover and execute tools");

toolsCmd
  .command("list")
  .description("List all registered tools")
  .option("--category <name>", "Filter by category")
  .option("--provider <name>", "Filter by provider prefix")
  .option("--limit <n>", "Max tools to show", "50")
  .option("--offset <n>", "Skip first N tools", "0")
  .action(async (opts) => {
    const { listTools } = await import("./cli/tools.js");
    await listTools(opts);
  });

toolsCmd
  .command("search <query>")
  .description("Search tools by name or description")
  .action(async (query: string) => {
    const { searchTools } = await import("./cli/tools.js");
    await searchTools(query);
  });

toolsCmd
  .command("info <name>")
  .description("Show detailed tool schema and description")
  .action(async (name: string) => {
    const { toolInfo } = await import("./cli/tools.js");
    await toolInfo(name);
  });

toolsCmd
  .command("call <name>")
  .description("Execute a tool by name")
  .option("--args <json>", "Tool arguments as JSON (or pipe JSON via stdin)")
  .action(async (name: string, opts) => {
    let args: Record<string, unknown> = {};
    if (opts.args) {
      try {
        args = JSON.parse(opts.args);
      } catch {
        process.stderr.write("Error: Invalid JSON in --args\n");
        process.exit(ExitCode.INVALID_ARGS);
      }
    } else if (!process.stdin.isTTY) {
      const chunks: Buffer[] = [];
      for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
      const input = Buffer.concat(chunks).toString("utf-8").trim();
      if (input) {
        try {
          args = JSON.parse(input);
        } catch {
          process.stderr.write("Error: Invalid JSON from stdin\n");
          process.exit(ExitCode.INVALID_ARGS);
        }
      }
    }
    const timeout = parseInt(program.opts().timeout, 10);
    await executeTool(name, args, timeout);
  });

toolsCmd
  .command("refresh")
  .description("Force-refresh the tool catalog cache")
  .action(async () => {
    const { refreshTools } = await import("./cli/tools.js");
    await refreshTools();
  });

// ─── config ──────────────────────────────────────────────────────────
const configCmd = program
  .command("config")
  .description("Generate configuration for MCP clients");

configCmd
  .command("claude-desktop")
  .description("Print Claude Desktop config JSON")
  .action(async () => {
    const { configClaudeDesktop } = await import("./cli/config.js");
    configClaudeDesktop();
  });
configCmd
  .command("cursor")
  .description("Print Cursor config JSON")
  .action(async () => {
    const { configCursor } = await import("./cli/config.js");
    configCursor();
  });
configCmd
  .command("vscode")
  .description("Print VS Code mcp.json config")
  .action(async () => {
    const { configVscode } = await import("./cli/config.js");
    configVscode();
  });
configCmd
  .command("claude-code")
  .description("Print claude mcp add command")
  .action(async () => {
    const { configClaudeCode } = await import("./cli/config.js");
    configClaudeCode();
  });
configCmd
  .command("http [url]")
  .description("Print remote HTTP connection instructions")
  .action(async (url?: string) => {
    const { configHttpUrl } = await import("./cli/config.js");
    configHttpUrl(
      url ||
        process.env.HIVE_DEFAULT_URL ||
        "https://mcp.hiveintelligence.xyz",
    );
  });

// ─── init ────────────────────────────────────────────────────────────
program
  .command("init")
  .description("Interactive setup wizard for Hive API key")
  .option("--minimal", "Write defaults without interactive prompts")
  .option("--dry-run", "Preview changes without writing")
  .action(async (opts) => {
    const { runInit } = await import("./cli/init.js");
    await runInit(opts);
  });

// ─── doctor ──────────────────────────────────────────────────────────
program
  .command("doctor")
  .description("Diagnose environment and server connectivity")
  .option("--probe", "Run live API probes (slower)")
  .action(async (opts) => {
    const { runDoctor } = await import("./cli/doctor.js");
    await runDoctor(opts);
  });

// ─── completion ──────────────────────────────────────────────────────
program
  .command("completion <shell>")
  .description("Generate shell completion script (bash, zsh, fish, powershell)")
  .option("--install", "Auto-install to shell rc file")
  .action(async (shell: string, opts) => {
    if (opts.install) {
      const { installCompletion } = await import("./cli/completion.js");
      await installCompletion(shell);
    } else {
      const { generateCompletion } = await import("./cli/completion.js");
      await generateCompletion(shell);
    }
  });

// ─── auth ───────────────────────────────────────────────────────────
const authCmd = program
  .command("auth")
  .description("Manage authentication profiles");

authCmd
  .command("login")
  .description("Log in with your Hive API key")
  .option("--profile <name>", "Profile name", "default")
  .action(async (opts) => {
    const { runLogin } = await import("./cli/auth.js");
    await runLogin(opts);
  });

authCmd
  .command("logout")
  .description("Remove stored credentials")
  .action(async () => {
    const { runLogout } = await import("./cli/auth.js");
    await runLogout();
  });

authCmd
  .command("whoami")
  .description("Show current profile")
  .action(async () => {
    const { runWhoami } = await import("./cli/auth.js");
    await runWhoami();
  });

authCmd
  .command("profiles")
  .description("List all profiles")
  .action(async () => {
    const { runProfiles } = await import("./cli/auth.js");
    await runProfiles();
  });

authCmd
  .command("switch <name>")
  .description("Switch active profile")
  .action(async (name: string) => {
    const { runSwitch } = await import("./cli/auth.js");
    await runSwitch(name);
  });

// ─── status ─────────────────────────────────────────────────────────
program
  .command("status")
  .description("Quick health and version check")
  .action(async () => {
    const { runStatus } = await import("./cli/doctor.js");
    await runStatus();
  });

// ─── open ───────────────────────────────────────────────────────────
program
  .command("open [target]")
  .description("Open Hive dashboard, docs, status, or GitHub in browser")
  .action(async (target?: string) => {
    const { runOpen } = await import("./cli/open.js");
    runOpen(target);
  });

// ─── watch ──────────────────────────────────────────────────────────
program
  .command("watch <domain> <command>")
  .description("Poll a tool on interval")
  .option("--interval <seconds>", "Poll interval in seconds", "30")
  .option("--args <json>", "Tool arguments as JSON")
  .action(async (domain: string, command: string, opts) => {
    const domainDef = NAMESPACE.find((d) => d.name === domain);
    if (!domainDef) {
      process.stderr.write(`Unknown domain: ${domain}\n`);
      process.exit(2);
    }
    const cmdDef = domainDef.commands.find((c) => c.name === command);
    if (!cmdDef) {
      process.stderr.write(`Unknown command: ${domain} ${command}\n`);
      process.exit(2);
    }
    let args: Record<string, unknown> = {};
    if (opts.args) {
      try {
        args = JSON.parse(opts.args);
      } catch {
        process.stderr.write("Invalid JSON\n");
        process.exit(2);
      }
    }
    const interval = parseInt(opts.interval, 10);
    const timeout = parseInt(program.opts().timeout, 10);
    const { runWatch } = await import("./cli/watch.js");
    await runWatch(cmdDef.tool, args, interval, timeout);
  });

// ─── alias ──────────────────────────────────────────────────────────
const aliasCmd = program.command("alias").description("Manage command aliases");

aliasCmd
  .command("set <name> <command>")
  .description("Create an alias")
  .action(async (name: string, command: string) => {
    const { setAlias } = await import("./cli/alias.js");
    setAlias(name, command);
    process.stderr.write(`Alias "${name}" set.\n`);
  });

aliasCmd
  .command("list")
  .description("Show all aliases")
  .action(async () => {
    const { getAliases } = await import("./cli/alias.js");
    const aliases = getAliases();
    const entries = Object.entries(aliases);
    if (entries.length === 0) {
      process.stderr.write("No aliases configured.\n");
      return;
    }
    for (const [name, cmd] of entries) {
      process.stderr.write(`  ${name} → ${cmd}\n`);
    }
    process.stderr.write("\n");
  });

aliasCmd
  .command("remove <name>")
  .description("Remove an alias")
  .action(async (name: string) => {
    const { removeAlias } = await import("./cli/alias.js");
    removeAlias(name);
    process.stderr.write(`Alias "${name}" removed.\n`);
  });

// ─── telemetry ──────────────────────────────────────────────────────
const telemetryCmd = program
  .command("telemetry")
  .description("Control anonymous usage telemetry");

telemetryCmd
  .command("enable")
  .description("Enable telemetry")
  .action(async () => {
    const { enableTelemetry } = await import("./cli/telemetry.js");
    enableTelemetry();
  });

telemetryCmd
  .command("disable")
  .description("Disable telemetry")
  .action(async () => {
    const { disableTelemetry } = await import("./cli/telemetry.js");
    disableTelemetry();
  });

telemetryCmd
  .command("status")
  .description("Show telemetry status")
  .action(async () => {
    const { telemetryStatus } = await import("./cli/telemetry.js");
    telemetryStatus();
  });

program.addHelpText(
  "after",
  `
Examples:
  $ hive auth login
  $ hive market price --ids bitcoin --vs usd
  $ hive defi tvl --protocol aave
  $ hive stocks quote --symbol AAPL
  $ hive tools search "price" --jq ".[] | .name"
  $ hive status
  $ hive alias set btc 'market price --ids bitcoin --vs usd'

  Run 'hive <domain> --help' for domain commands.
  Run 'hive tools list' for the full catalog.`,
);

// ─── Standard commander parse ────────────────────────────────────────
checkForUpdates();

// ─── Alias expansion ────────────────────────────────────────────────
{
  const { expandAlias } = await import("./cli/alias.js");
  const expanded = expandAlias(process.argv);
  if (expanded !== process.argv) {
    process.argv = expanded;
  }
}

try {
  await program.parseAsync();
} catch (err) {
  if (err instanceof CommanderError) {
    if (
      err.code === "commander.helpDisplayed" ||
      err.code === "commander.version"
    ) {
      process.exit(0);
    }
    process.exit(err.exitCode);
  }
  throw err;
}
