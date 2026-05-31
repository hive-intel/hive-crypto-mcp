import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import {
  HIVE_CATEGORY_TOOL_NAMES,
  HIVE_CORE_TOOL_NAMES,
  type HiveCategoryToolName,
} from "./constants.js";
import { createHiveMcpClient } from "./client.js";
import { stableHiveCacheKey } from "./cache-key.js";
import { stringifyHiveToolResult } from "./result.js";
import type {
  HiveLangChainToolOptions,
  HiveMcpClient,
  HiveToolResponseCache,
} from "./types.js";

type ToolCallInput = Record<string, unknown>;

const categorySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
});

const searchToolsSchema = z.object({
  category: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  provider: z.string().optional(),
  query: z.string().optional(),
});

const schemaLookupSchema = z.object({
  endpoint_name: z.string().describe("Exact Hive endpoint/tool name."),
});

const invokeSchema = z.object({
  args: z.record(z.string(), z.unknown()).optional(),
  arguments: z.record(z.string(), z.unknown()).optional(),
  endpoint_name: z.string().describe("Exact Hive endpoint/tool name."),
});

async function cacheGet(
  cache: HiveToolResponseCache | undefined,
  key: string
): Promise<string | null> {
  return (await cache?.get(key)) ?? null;
}

async function cacheSet(
  cache: HiveToolResponseCache | undefined,
  key: string,
  value: string
): Promise<void> {
  await cache?.set(key, value);
}

function shouldCacheResult(result: string): boolean {
  const lower = result.toLowerCase().trim();
  if (lower.startsWith("error:") || lower.startsWith("error -")) {
    return false;
  }
  if (lower.startsWith('{"error"') || lower.startsWith('{"message":"error')) {
    return false;
  }
  return true;
}

function categoryDescription(toolName: HiveCategoryToolName): string {
  return `List Hive endpoints in ${toolName
    .replace(/^get_/, "")
    .replace(/_endpoints$/, "")
    .replace(/_/g, " ")}. Supports optional search, limit, and cursor pagination.`;
}

export function createHiveLangChainTools(
  options: HiveLangChainToolOptions = {}
): DynamicStructuredTool[] {
  let sharedClient: Promise<HiveMcpClient> | undefined;
  const getClient = async () => {
    if (options.client) {
      return options.client;
    }
    sharedClient ??= createHiveMcpClient(options.clientOptions);
    return sharedClient;
  };

  const call = async (toolName: string, args: ToolCallInput) => {
    const key = stableHiveCacheKey(toolName, args);
    const cached = await cacheGet(options.cache, key);
    if (cached) {
      return cached;
    }
    const client = await getClient();
    const result = stringifyHiveToolResult(
      await client.callTool({ name: toolName, arguments: args })
    );
    if (shouldCacheResult(result)) {
      await cacheSet(options.cache, key, result);
    }
    return result;
  };

  const tools: DynamicStructuredTool[] = [
    new DynamicStructuredTool({
      name: "search_tools",
      description:
        "Search the full Hive tool catalog and canonical task toolsets by keyword, provider, or category.",
      schema: searchToolsSchema,
      func: async (input) => call("search_tools", input),
    }),
    new DynamicStructuredTool({
      name: "get_api_endpoint_schema",
      description:
        "Get the input and output schema for an exact Hive endpoint/tool name before invoking it.",
      schema: schemaLookupSchema,
      func: async (input) =>
        call("get_api_endpoint_schema", { endpoint: input.endpoint_name }),
    }),
    new DynamicStructuredTool({
      name: "invoke_api_endpoint",
      description:
        "Invoke any Hive endpoint by exact endpoint_name with schema-valid args. Use search_tools/category discovery, then schema, then invoke.",
      schema: invokeSchema,
      func: async (input) =>
        call("invoke_api_endpoint", {
          endpoint_name: input.endpoint_name,
          args: input.args ?? input.arguments ?? {},
        }),
    }),
  ];

  for (const toolName of HIVE_CATEGORY_TOOL_NAMES) {
    tools.push(
      new DynamicStructuredTool({
        name: toolName,
        description: categoryDescription(toolName),
        schema: categorySchema,
        func: async (input) => call(toolName, input),
      })
    );
  }

  if (tools.length !== HIVE_CORE_TOOL_NAMES.length + HIVE_CATEGORY_TOOL_NAMES.length) {
    throw new Error("Hive LangChain tool count mismatch");
  }

  return tools;
}
