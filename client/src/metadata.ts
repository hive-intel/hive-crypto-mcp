import {
  HIVE_COMPACT_METADATA_RESOURCE_URIS,
  HIVE_METADATA_RESOURCE_URIS,
  type HiveMetadataResourceUri,
} from "./constants.js";
import type { HiveMetadataClient, HiveMetadataSnapshot } from "./types.js";

const DEFAULT_METADATA_TTL_MS = 5 * 60 * 1000;

type CachedSnapshot = {
  expiresAt: number;
  snapshot: HiveMetadataSnapshot;
};

type ResourceContent = {
  blob?: string;
  text?: string;
};

let metadataCache = new WeakMap<object, CachedSnapshot>();

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isKnownResourceUri(uri: string): uri is HiveMetadataResourceUri {
  return (HIVE_METADATA_RESOURCE_URIS as readonly string[]).includes(uri);
}

export function isHiveMetadataResourceUri(uri: string): boolean {
  return isKnownResourceUri(uri);
}

function decodeResourceContent(content: ResourceContent | undefined):
  | string
  | undefined {
  if (!content) {
    return undefined;
  }
  if (typeof content.text === "string") {
    return content.text;
  }
  if (typeof content.blob === "string") {
    return Buffer.from(content.blob, "base64").toString("utf8");
  }
  return undefined;
}

function parseResourceText(text: string): {
  error?: string;
  ok: boolean;
  value?: unknown;
} {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { error: "Malformed JSON metadata resource", ok: false };
  }
}

export function resetHiveMetadataCache(client?: HiveMetadataClient): void {
  if (client && typeof client === "object") {
    metadataCache.delete(client);
    return;
  }
  metadataCache = new WeakMap<object, CachedSnapshot>();
}

export async function readHiveMetadataSnapshot(
  client: HiveMetadataClient,
  {
    forceRefresh = false,
    now = Date.now(),
    resourceUris = HIVE_COMPACT_METADATA_RESOURCE_URIS,
    ttlMs = DEFAULT_METADATA_TTL_MS,
  }: {
    forceRefresh?: boolean;
    now?: number;
    resourceUris?: readonly HiveMetadataResourceUri[];
    ttlMs?: number;
  } = {}
): Promise<HiveMetadataSnapshot> {
  if (!forceRefresh && typeof client === "object") {
    const cached = metadataCache.get(client);
    if (cached && cached.expiresAt > now) {
      return cached.snapshot;
    }
  }

  const resources: HiveMetadataSnapshot["resources"] = {};
  const errors: HiveMetadataSnapshot["errors"] = {};
  let availableResourceUris: string[] = [];

  try {
    const listed = await client.listResources();
    availableResourceUris = listed.resources
      .map((resource) => resource.uri)
      .filter(Boolean);
  } catch (error) {
    errors.list = errorMessage(error);
  }

  const targetUris =
    availableResourceUris.length > 0
      ? resourceUris.filter((uri) => availableResourceUris.includes(uri))
      : resourceUris;

  const reads = await Promise.all(
    targetUris.map(async (uri) => {
      try {
        const result = await client.readResource({ uri });
        const firstContent = result.contents[0] as ResourceContent | undefined;
        const text = decodeResourceContent(firstContent);
        if (!text) {
          return { uri, error: "Metadata resource returned no text" };
        }
        const parsed = parseResourceText(text);
        if (parsed.ok) {
          return { uri, value: parsed.value };
        }
        return { uri, error: parsed.error };
      } catch (error) {
        return { uri, error: errorMessage(error) };
      }
    })
  );

  for (const read of reads) {
    if ("value" in read && isKnownResourceUri(read.uri)) {
      resources[read.uri] = read.value;
    } else if (read.error && isKnownResourceUri(read.uri)) {
      errors[read.uri] = read.error;
    }
  }

  const loadedCount = Object.keys(resources).length;
  const status =
    loadedCount === resourceUris.length
      ? "available"
      : loadedCount > 0
        ? "partial"
        : "unavailable";

  const snapshot: HiveMetadataSnapshot = {
    availableResourceUris,
    errors,
    fetchedAt: now,
    resources,
    status,
  };

  if (typeof client === "object") {
    metadataCache.set(client, {
      expiresAt: now + ttlMs,
      snapshot,
    });
  }

  return snapshot;
}
