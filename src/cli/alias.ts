import { getConfig, saveConfig, ensureConfigDir } from "./config-dir.js";

export function getAliases(): Record<string, string> {
  return getConfig().aliases ?? {};
}

export function setAlias(name: string, command: string): void {
  ensureConfigDir();
  const config = getConfig();
  config.aliases = { ...config.aliases, [name]: command };
  saveConfig(config);
}

export function removeAlias(name: string): void {
  const config = getConfig();
  const { [name]: _, ...rest } = config.aliases;
  config.aliases = rest;
  saveConfig(config);
}

/**
 * If argv[2] matches an alias, expand it in-place.
 * Extra flags after the alias are appended.
 * Returns a new argv array (never mutates the original).
 */
export function expandAlias(argv: string[]): string[] {
  if (argv.length < 3) return argv;
  const aliases = getAliases();
  const candidate = argv[2];
  const expansion = aliases[candidate];
  if (!expansion) return argv;
  const expandedParts = expansion.split(/\s+/);
  const trailing = argv.slice(3);
  return [argv[0], argv[1], ...expandedParts, ...trailing];
}
