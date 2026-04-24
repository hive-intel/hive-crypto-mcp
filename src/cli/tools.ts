import {
  shouldOutputJson,
  writeOutput,
  successEnvelope,
  info,
} from "./output.js";
import { fetchToolCatalog } from "./api-client.js";

interface ToolEntry {
  name: string;
  title?: string;
  description?: string;
  inputSchema?: unknown;
  annotations?: Record<string, unknown>;
  provider?: string;
}

async function loadToolCatalog(): Promise<ToolEntry[]> {
  const { getCachedTools, setCachedTools } = await import("./cache.js");
  const cached = getCachedTools();
  if (cached) return cached as ToolEntry[];

  const response = await fetchToolCatalog();
  if (!response.ok) {
    const msg =
      response.error &&
      typeof response.error === "object" &&
      "message" in response.error
        ? String(response.error.message)
        : "Failed to fetch tool catalog";
    const { CliError } = await import("./errors.js");
    const { outputError } = await import("./output.js");
    await outputError(
      new CliError("API_ERROR", msg, "Check: hive doctor"),
      {},
    );
    return [];
  }
  const data = response.data as
    | { totalCount?: number; tools?: ToolEntry[] }
    | ToolEntry[];
  const tools = Array.isArray(data)
    ? data
    : data &&
        typeof data === "object" &&
        "tools" in data &&
        Array.isArray(data.tools)
      ? data.tools
      : [];

  setCachedTools(tools);
  return tools;
}

export async function listTools(opts: {
  category?: string;
  provider?: string;
  limit?: string;
  offset?: string;
}): Promise<void> {
  let tools = await loadToolCatalog();

  if (opts.provider) {
    const prefix = opts.provider.toLowerCase();
    tools = tools.filter((t) => t.name.toLowerCase().startsWith(prefix + "_"));
  }

  if (opts.category) {
    const { NAMESPACE } = await import("./namespace.js");
    const cat = opts.category.toLowerCase();
    const ns = NAMESPACE.find(
      (d) => d.name === cat || d.description.toLowerCase().includes(cat),
    );
    if (ns) {
      const categoryTools = new Set(ns.commands.map((cmd) => cmd.tool));
      tools = tools.filter((t) => categoryTools.has(t.name));
    } else {
      // Fallback: substring match on name/provider for unknown categories
      tools = tools.filter(
        (t) =>
          (t.provider ?? "").toLowerCase().includes(cat) ||
          (t.name ?? "").toLowerCase().includes(cat),
      );
    }
  }

  const totalFiltered = tools.length;
  const limit = Math.max(1, parseInt(opts.limit ?? "50", 10) || 50);
  const offset = Math.max(0, parseInt(opts.offset ?? "0", 10) || 0);
  tools = tools.slice(offset, offset + limit);

  const items = tools.map((t) => ({
    name: t.name,
    title: t.title,
    description:
      t.description && t.description.length > 120
        ? t.description.slice(0, 117) + "..."
        : t.description,
  }));

  const data = {
    totalCount: totalFiltered,
    offset,
    limit,
    showing: items.length,
    tools: items,
  };

  if (shouldOutputJson()) {
    await writeOutput(successEnvelope(data, {}));
    return;
  }

  const { table } = await import("./format.js");
  const rangeStart = totalFiltered === 0 ? 0 : offset + 1;
  const rangeEnd = offset + items.length;
  info(`\nShowing ${rangeStart}-${rangeEnd} of ${totalFiltered} tools\n`);
  info(
    table(
      ["Name", "Title"],
      items.map((t) => [t.name, t.title ?? ""]),
    ),
  );
}

export async function searchTools(query: string): Promise<void> {
  const allTools = await loadToolCatalog();
  const q = query.toLowerCase();

  const matches = allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      (t.description ?? "").toLowerCase().includes(q) ||
      (t.title ?? "").toLowerCase().includes(q),
  );

  const items = matches.map((t) => ({
    name: t.name,
    title: t.title,
    description:
      t.description && t.description.length > 120
        ? t.description.slice(0, 117) + "..."
        : t.description,
  }));

  const data = { totalCount: items.length, query, tools: items };

  if (shouldOutputJson()) {
    await writeOutput(successEnvelope(data, {}));
    return;
  }

  const { table } = await import("./format.js");
  info(`\n${matches.length} matches for "${query}"\n`);
  if (matches.length === 0) {
    info("No tools found. Try a broader search term.\n");
    return;
  }
  info(
    table(
      ["Name", "Title"],
      matches.map((t) => [t.name, t.title ?? ""]),
    ),
  );
}

export async function toolInfo(name: string): Promise<void> {
  const allTools = await loadToolCatalog();
  const tool = allTools.find((t) => t.name === name);

  if (!tool) {
    const { CliError, suggestSimilarTools } = await import("./errors.js");
    const { outputError } = await import("./output.js");
    const similar = suggestSimilarTools(
      name,
      allTools.map((t) => t.name),
    );
    const suggestion =
      similar.length > 0
        ? `Did you mean: ${similar.join(", ")}?`
        : `Run: hive tools search "${name}"`;
    await outputError(
      new CliError("TOOL_NOT_FOUND", `Tool "${name}" not found`, suggestion),
      { tool: name },
    );
  }

  // After outputError (which calls process.exit), this is unreachable,
  // but TypeScript doesn't know that. The non-null assertion is safe.
  const t = tool!;

  const data = {
    name: t.name,
    title: t.title,
    provider: t.provider ?? null,
    readOnly: t.annotations?.readOnlyHint ?? null,
    description: t.description,
    inputSchema: t.inputSchema,
  };

  if (shouldOutputJson()) {
    await writeOutput(successEnvelope(data, { tool: name }));
    return;
  }

  info(`\n${t.title ?? t.name}`);
  info(`Name: ${t.name}`);
  if (t.provider) info(`Provider: ${t.provider}`);
  info(`Read-only: ${t.annotations?.readOnlyHint ?? "unknown"}`);
  info(`\nDescription:\n${t.description}\n`);
  if (t.inputSchema) {
    info("Input Schema:");
    info(JSON.stringify(t.inputSchema, null, 2));
  }
}

export async function refreshTools(): Promise<void> {
  const { clearCache } = await import("./cache.js");
  const { info: printInfo } = await import("./output.js");
  clearCache();
  printInfo("Cache cleared. Fetching fresh tool catalog...\n");
  const tools = await loadToolCatalog();
  printInfo(`${tools.length} tools loaded.\n`);
}
