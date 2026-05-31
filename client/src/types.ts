import type {
  GetPromptResult,
  ListPromptsResult,
  ListResourcesResult,
  ListToolsResult,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import type {
  HiveCategoryToolName,
  HiveMetadataResourceUri,
} from "./constants.js";
import type { HiveSubjectContext } from "./subject.js";

export type HiveAuthScheme = "x-api-key" | "bearer" | "none";

export type HiveMcpRetryOptions = {
  attempts?: number;
  baseDelayMs?: number;
};

export type HiveMcpClientOptions = {
  apiKey?: string;
  authScheme?: HiveAuthScheme;
  clientName?: string;
  clientVersion?: string;
  connectTimeoutMs?: number;
  fetch?: typeof fetch;
  headers?: HeadersInit;
  metadataTtlMs?: number;
  requestTimeoutMs?: number;
  retry?: HiveMcpRetryOptions;
  subject?: HiveSubjectContext;
  subjectSigningSecret?: string;
  url?: string;
};

export type HiveCallToolArgs = {
  name: string;
  arguments?: Record<string, unknown>;
  subject?: HiveSubjectContext;
};

export type HiveCallToolOptions = {
  subject?: HiveSubjectContext;
};

export type HiveCallTool = {
  (args: HiveCallToolArgs, options?: HiveCallToolOptions): Promise<unknown>;
  (
    name: string,
    args?: Record<string, unknown>,
    options?: HiveCallToolOptions
  ): Promise<unknown>;
};

export type HiveMcpClient = {
  callTool: HiveCallTool;
  close(): Promise<void>;
  getPrompt(args: {
    arguments?: Record<string, string>;
    name: string;
  }): Promise<GetPromptResult>;
  listPrompts(): Promise<ListPromptsResult>;
  listResources(): Promise<ListResourcesResult>;
  listTools(): Promise<ListToolsResult>;
  readResource(args: { uri: string }): Promise<ReadResourceResult>;
  withSubject(subject: HiveSubjectContext): HiveMcpClient;
};

export type HiveMetadataClient = Pick<
  HiveMcpClient,
  "listResources" | "readResource"
>;

export type HiveMetadataSnapshot = {
  availableResourceUris: string[];
  errors: Partial<Record<HiveMetadataResourceUri | "list", string>>;
  fetchedAt: number;
  resources: Partial<Record<HiveMetadataResourceUri, unknown>>;
  status: "available" | "partial" | "unavailable";
};

export type HiveNormalizedToolResult = {
  isError: boolean;
  json?: unknown;
  raw: unknown;
  structuredContent?: unknown;
  text: string;
};

export type HiveSource = {
  category?: string;
  endpoint?: string;
  provider?: string;
  title: string;
  toolName?: string;
};

export type HiveCategoryRanking = {
  score: number;
  toolName: HiveCategoryToolName;
};

export type HiveLangChainToolOptions = {
  cache?: HiveToolResponseCache;
  client?: HiveMcpClient;
  clientOptions?: HiveMcpClientOptions;
};

export type HiveToolResponseCache = {
  get(key: string): Promise<string | null> | string | null;
  set(key: string, value: string): Promise<void> | void;
};
