import {
  existsSync,
  readFileSync,
  appendFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { NAMESPACE } from "./namespace.js";

function getTopLevel(): string[] {
  return [
    "serve",
    "doctor",
    "tools",
    "config",
    "init",
    "completion",
    "auth",
    "status",
    "open",
    "watch",
    "alias",
    "telemetry",
    ...NAMESPACE.map((d) => d.name),
  ];
}

function getDomainSubs(): Record<string, string[]> {
  const subs: Record<string, string[]> = {};
  for (const domain of NAMESPACE) {
    subs[domain.name] = domain.commands.map((c) => c.name);
  }
  return subs;
}

export async function generateCompletion(shell: string): Promise<void> {
  switch (shell) {
    case "bash":
      return generateBash();
    case "zsh":
      return generateZsh();
    case "fish":
      return generateFish();
    case "powershell":
      return generatePowerShell();
    default:
      console.error(
        `Unsupported shell: ${shell}. Use: bash, zsh, fish, powershell`,
      );
      process.exit(2);
  }
}

function generateBash(): void {
  const topLevel = getTopLevel();
  const domainSubs = getDomainSubs();

  const cases = Object.entries(domainSubs)
    .map(
      ([domain, subs]) =>
        `    ${domain}) COMPREPLY=($(compgen -W "${subs.join(" ")}" -- "$cur")); return ;;`,
    )
    .join("\n");

  console.log(`# Hive MCP bash completion
# Add to ~/.bashrc: eval "$(hive-mcp completion bash)"
_hive_mcp_completions() {
  local cur="\${COMP_WORDS[COMP_CWORD]}"
  local prev="\${COMP_WORDS[COMP_CWORD-1]}"

  case "$prev" in
${cases}
    tools) COMPREPLY=($(compgen -W "list search info call refresh" -- "$cur")); return ;;
    config) COMPREPLY=($(compgen -W "claude-desktop cursor vscode claude-code http" -- "$cur")); return ;;
    auth) COMPREPLY=($(compgen -W "login logout whoami profiles switch" -- "$cur")); return ;;
    alias) COMPREPLY=($(compgen -W "set list remove" -- "$cur")); return ;;
    telemetry) COMPREPLY=($(compgen -W "enable disable status" -- "$cur")); return ;;
    open) COMPREPLY=($(compgen -W "dashboard docs status github" -- "$cur")); return ;;
    completion) COMPREPLY=($(compgen -W "bash zsh fish powershell install" -- "$cur")); return ;;
  esac

  COMPREPLY=($(compgen -W "${topLevel.join(" ")}" -- "$cur"))
}
complete -F _hive_mcp_completions hive-mcp`);
}

function generateZsh(): void {
  const domainEntries = NAMESPACE.map(
    (d) => `    '${d.name}:${d.description}'`,
  ).join("\n");

  const subcommandCases = NAMESPACE.map((d) => {
    const subs = d.commands
      .map((c) => `        '${c.name}:${c.description}'`)
      .join("\n");
    return `      ${d.name})
        local -a subcmds
        subcmds=(
${subs}
        )
        _describe 'subcommand' subcmds
        ;;`;
  }).join("\n");

  console.log(`# Hive MCP zsh completion
# Add to ~/.zshrc: eval "$(hive-mcp completion zsh)"
_hive_mcp() {
  local -a commands
  commands=(
    'serve:Start the MCP server'
    'doctor:Diagnose environment and connectivity'
    'tools:Discover and execute tools'
    'config:Generate MCP client configs'
    'init:Interactive API key setup'
    'completion:Generate shell completions'
    'auth:Manage authentication profiles'
    'status:Quick health and version check'
    'open:Open Hive dashboard in browser'
    'watch:Poll a tool on interval'
    'alias:Manage command aliases'
    'telemetry:Control anonymous usage telemetry'
${domainEntries}
  )

  if (( CURRENT == 2 )); then
    _describe 'command' commands
  elif (( CURRENT == 3 )); then
    case "\${words[2]}" in
${subcommandCases}
      tools)
        local -a subcmds
        subcmds=('list:List all tools' 'search:Search tools' 'info:Show tool info' 'call:Execute a tool' 'refresh:Refresh tool cache')
        _describe 'subcommand' subcmds
        ;;
      config)
        local -a subcmds
        subcmds=('claude-desktop:Claude Desktop config' 'cursor:Cursor config' 'vscode:VS Code config' 'claude-code:Claude Code config' 'http:HTTP remote config')
        _describe 'subcommand' subcmds
        ;;
      auth)
        local -a subcmds
        subcmds=('login:Log in with API key' 'logout:Remove credentials' 'whoami:Show current profile' 'profiles:List all profiles' 'switch:Switch active profile')
        _describe 'subcommand' subcmds
        ;;
      alias)
        local -a subcmds
        subcmds=('set:Create an alias' 'list:Show all aliases' 'remove:Delete an alias')
        _describe 'subcommand' subcmds
        ;;
      telemetry)
        local -a subcmds
        subcmds=('enable:Enable telemetry' 'disable:Disable telemetry' 'status:Show telemetry status')
        _describe 'subcommand' subcmds
        ;;
      open)
        local -a subcmds
        subcmds=('dashboard:Open dashboard' 'docs:Open documentation' 'status:Open status page' 'github:Open GitHub repo')
        _describe 'subcommand' subcmds
        ;;
    esac
  fi
}
compdef _hive_mcp hive-mcp`);
}

function generateFish(): void {
  const topLevel = getTopLevel();
  const lines: string[] = [
    "# Hive MCP fish completion",
    "# Save to: ~/.config/fish/completions/hive-mcp.fish",
    "",
  ];

  for (const cmd of topLevel) {
    const desc = NAMESPACE.find((d) => d.name === cmd)?.description ?? cmd;
    lines.push(
      `complete -c hive-mcp -n '__fish_use_subcommand' -a '${cmd}' -d '${desc}'`,
    );
  }

  const domainSubs = getDomainSubs();
  for (const [domain, subs] of Object.entries(domainSubs)) {
    for (const sub of subs) {
      const desc =
        NAMESPACE.find((d) => d.name === domain)?.commands.find(
          (c) => c.name === sub,
        )?.description ?? sub;
      lines.push(
        `complete -c hive-mcp -n '__fish_seen_subcommand_from ${domain}' -a '${sub}' -d '${desc}'`,
      );
    }
  }

  for (const sub of ["list", "search", "info", "call", "refresh"]) {
    lines.push(
      `complete -c hive-mcp -n '__fish_seen_subcommand_from tools' -a '${sub}'`,
    );
  }
  for (const sub of ["login", "logout", "whoami", "profiles", "switch"]) {
    lines.push(
      `complete -c hive-mcp -n '__fish_seen_subcommand_from auth' -a '${sub}'`,
    );
  }
  for (const sub of ["set", "list", "remove"]) {
    lines.push(
      `complete -c hive-mcp -n '__fish_seen_subcommand_from alias' -a '${sub}'`,
    );
  }

  console.log(lines.join("\n"));
}

function generatePowerShell(): void {
  const topLevel = getTopLevel();
  console.log(`# Hive MCP PowerShell completion
# Add to your $PROFILE: . (hive-mcp completion powershell)
Register-ArgumentCompleter -Native -CommandName hive-mcp -ScriptBlock {
  param($wordToComplete, $commandAst, $cursorPosition)
  $commands = @(${topLevel.map((c) => `'${c}'`).join(", ")})
  $commands | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
  }
}`);
}

export async function installCompletion(shell: string): Promise<void> {
  switch (shell) {
    case "bash": {
      const rcFile = join(homedir(), ".bashrc");
      const line = 'eval "$(hive-mcp completion bash)"';
      if (existsSync(rcFile) && readFileSync(rcFile, "utf-8").includes(line)) {
        process.stderr.write("Bash completion already installed.\n");
        return;
      }
      appendFileSync(rcFile, `\n# Hive MCP CLI completion\n${line}\n`);
      process.stderr.write(
        `Bash completion added to ${rcFile}. Restart your shell.\n`,
      );
      return;
    }
    case "zsh": {
      const rcFile = join(homedir(), ".zshrc");
      const line = 'eval "$(hive-mcp completion zsh)"';
      if (existsSync(rcFile) && readFileSync(rcFile, "utf-8").includes(line)) {
        process.stderr.write("Zsh completion already installed.\n");
        return;
      }
      appendFileSync(rcFile, `\n# Hive MCP CLI completion\n${line}\n`);
      process.stderr.write(
        `Zsh completion added to ${rcFile}. Restart your shell.\n`,
      );
      return;
    }
    case "fish": {
      const dir = join(homedir(), ".config", "fish", "completions");
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      const filePath = join(dir, "hive-mcp.fish");
      const { execFileSync } = await import("node:child_process");
      const bin = process.argv[1] ?? "hive-mcp";
      const output = execFileSync(bin, ["completion", "fish"], {
        encoding: "utf-8",
      });
      writeFileSync(filePath, output);
      process.stderr.write(`Fish completion written to ${filePath}.\n`);
      return;
    }
    default:
      process.stderr.write(
        `Unsupported shell for install: ${shell}. Use: bash, zsh, fish\n`,
      );
      process.exit(2);
  }
}
