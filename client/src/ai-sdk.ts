import {
  HIVE_CATEGORY_TOOL_NAMES,
  HIVE_CORE_TOOL_NAMES,
  HIVE_DEFAULT_MCP_URL,
  HIVE_REMOVED_CATEGORY_TOOL_NAMES,
} from "./constants.js";
import { rankHiveCategoriesForQuery } from "./discovery.js";
import { buildHiveAuthHeaders } from "./auth.js";
import { buildHiveSubjectHeaders } from "./subject.js";
import type { HiveMcpClientOptions, HiveMetadataSnapshot } from "./types.js";

type ToolDefinition = {
  name: string;
};

type ToolDefinitions<TTool extends ToolDefinition = ToolDefinition> = {
  tools: TTool[];
};

export type HiveAiSdkToolSelectionMode = "all" | "core" | "ranked";

type AiSdkToolClient<TDefinitions extends ToolDefinitions, TTools> = {
  listTools(): Promise<TDefinitions>;
  toolsFromDefinitions(definitions: TDefinitions): TTools | Promise<TTools>;
};

export function buildAiSdkHiveMcpTransportConfig(
  options: HiveMcpClientOptions & { transportType?: "http" | "sse" } = {}
) {
  const url = options.url ?? HIVE_DEFAULT_MCP_URL;
  const subjectSigningSecret =
    options.subject?.signingSecret ?? options.subjectSigningSecret;
  if (options.subject && !subjectSigningSecret) {
    throw new Error(
      "Hive B2B subject signing secret is required when subject is set."
    );
  }
  const subjectHeaders =
    options.subject && subjectSigningSecret
      ? buildHiveSubjectHeaders({
          endUserId: options.subject.endUserId,
          method: "POST",
          path: new URL(url).pathname || "/",
          signingSecret: subjectSigningSecret,
          tenantId: options.subject.tenantId,
        })
      : {};
  return {
    transport: {
      type: options.transportType ?? ("http" as const),
      url,
      headers: buildHiveAuthHeaders({
        apiKey: options.apiKey,
        authScheme: options.authScheme,
        headers: {
          Accept: "application/json, text/event-stream",
          ...subjectHeaders,
          ...(options.headers ?? {}),
        },
      }),
    },
  };
}

export function selectHiveMcpToolDefinitions<TTool extends ToolDefinition>({
  definitions,
  includeAllCategories,
  maxCategoryTools = 4,
  query,
  selectionMode,
  snapshot,
}: {
  definitions: ToolDefinitions<TTool>;
  includeAllCategories?: boolean;
  maxCategoryTools?: number;
  query?: string;
  selectionMode?: HiveAiSdkToolSelectionMode;
  snapshot?: HiveMetadataSnapshot | null;
}): ToolDefinitions<TTool> {
  const mode =
    selectionMode ?? (includeAllCategories === true ? "all" : "ranked");
  const removed = new Set<string>(HIVE_REMOVED_CATEGORY_TOOL_NAMES);

  if (mode === "all") {
    return {
      ...definitions,
      tools: definitions.tools.filter((tool) => !removed.has(tool.name)),
    };
  }

  const allowed = new Set<string>(HIVE_CORE_TOOL_NAMES);

  if (mode === "core") {
    return {
      ...definitions,
      tools: definitions.tools.filter((tool) => allowed.has(tool.name)),
    };
  }

  const ranked = rankHiveCategoriesForQuery(query ?? "", snapshot).slice(
    0,
    maxCategoryTools
  );
  for (const entry of ranked) {
    allowed.add(entry.toolName);
  }
  if (ranked.length === 0) {
    allowed.add("get_market_and_price_endpoints");
    allowed.add("get_token_contract_endpoints");
    allowed.add("get_search_discovery_endpoints");
  }

  return {
    ...definitions,
    tools: definitions.tools.filter((tool) => allowed.has(tool.name)),
  };
}

export async function prepareHiveAiSdkTools<
  TDefinitions extends ToolDefinitions,
  TTools,
>({
  client,
  maxCategoryTools,
  query,
  selectionMode,
  snapshot,
}: {
  client: AiSdkToolClient<TDefinitions, TTools>;
  maxCategoryTools?: number;
  query?: string;
  selectionMode: HiveAiSdkToolSelectionMode;
  snapshot?: HiveMetadataSnapshot | null;
}): Promise<{ definitions: TDefinitions; tools: Awaited<TTools> }> {
  const runtimeDefinitions = await client.listTools();
  const definitions = selectHiveMcpToolDefinitions({
    definitions: runtimeDefinitions,
    maxCategoryTools,
    query,
    selectionMode,
    snapshot,
  }) as TDefinitions;
  const tools = await client.toolsFromDefinitions(definitions);

  return { definitions, tools };
}
