import { describe, expect, test, vi } from "vitest";
import { createHiveLangChainTools } from "../src/langchain.js";
import {
  HIVE_CATEGORY_TOOL_NAMES,
  HIVE_CORE_TOOL_NAMES,
  type HiveMcpClient,
  type HiveToolResponseCache,
} from "../src/index.js";

describe("createHiveLangChainTools", () => {
  test("creates current root tools including search and prediction markets", async () => {
    const client: HiveMcpClient = {
      callTool: vi.fn(async ({ name, arguments: args }) => ({
        content: [{ type: "text", text: JSON.stringify({ args, name }) }],
      })),
      close: vi.fn(async () => undefined),
      getPrompt: vi.fn(async () => ({ messages: [] })),
      listPrompts: vi.fn(async () => ({ prompts: [] })),
      listResources: vi.fn(async () => ({ resources: [] })),
      listTools: vi.fn(async () => ({ tools: [] })),
      readResource: vi.fn(async () => ({ contents: [] })),
      withSubject: vi.fn(() => client),
    };
    const tools = createHiveLangChainTools({ client });
    const names = tools.map((tool) => tool.name);

    expect(names).toEqual([...HIVE_CORE_TOOL_NAMES, ...HIVE_CATEGORY_TOOL_NAMES]);
    expect(names).toContain("search_tools");
    expect(names).toContain("get_prediction_markets_endpoints");
    expect(names).not.toContain("get_social_sentiment_endpoints");

    const category = tools.find(
      (tool) => tool.name === "get_prediction_markets_endpoints"
    );
    await category?.invoke({ limit: 5, search: "polymarket" });
    expect(client.callTool).toHaveBeenCalledWith({
      arguments: { limit: 5, search: "polymarket" },
      name: "get_prediction_markets_endpoints",
    });
  });

  test("caches successful calls with deep stable args", async () => {
    const store = new Map<string, string>();
    const cache: HiveToolResponseCache = {
      get: (key) => store.get(key) ?? null,
      set: (key, value) => {
        store.set(key, value);
      },
    };
    const client: HiveMcpClient = {
      callTool: vi.fn(async ({ name }) => ({
        content: [{ type: "text", text: JSON.stringify({ name }) }],
      })),
      close: vi.fn(async () => undefined),
      getPrompt: vi.fn(async () => ({ messages: [] })),
      listPrompts: vi.fn(async () => ({ prompts: [] })),
      listResources: vi.fn(async () => ({ resources: [] })),
      listTools: vi.fn(async () => ({ tools: [] })),
      readResource: vi.fn(async () => ({ contents: [] })),
      withSubject: vi.fn(() => client),
    };
    const invoke = createHiveLangChainTools({ cache, client }).find(
      (tool) => tool.name === "invoke_api_endpoint"
    );
    await invoke?.invoke({
      args: { ids: "bitcoin", vs_currencies: "usd" },
      endpoint_name: "get_price",
    });
    await invoke?.invoke({
      endpoint_name: "get_price",
      args: { vs_currencies: "usd", ids: "bitcoin" },
    });

    expect(client.callTool).toHaveBeenCalledTimes(1);
  });
});
