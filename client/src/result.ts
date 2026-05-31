import type { HiveNormalizedToolResult } from "./types.js";

type TextContent = {
  text?: string;
  type?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function extractTextFromContent(content: unknown): string {
  if (!Array.isArray(content)) {
    return "";
  }
  return content
    .map((item) => {
      if (!isRecord(item)) {
        return "";
      }
      const block = item as TextContent;
      return block.type === "text" && typeof block.text === "string"
        ? block.text
        : "";
    })
    .filter(Boolean)
    .join("\n");
}

function parseJson(text: string): unknown | undefined {
  if (!text.trim()) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export function normalizeHiveToolResult(
  result: unknown
): HiveNormalizedToolResult {
  if (!isRecord(result)) {
    const text = typeof result === "string" ? result : JSON.stringify(result);
    return {
      isError: false,
      json: parseJson(text),
      raw: result,
      text,
    };
  }

  const text = extractTextFromContent(result.content);
  const structuredContent = result.structuredContent;
  const json = structuredContent ?? parseJson(text);
  const isError =
    result.isError === true ||
    (typeof text === "string" &&
      /^\s*(error:|\{"error"|{"message":"error)/i.test(text));

  return {
    isError,
    ...(json !== undefined ? { json } : {}),
    raw: result,
    ...(structuredContent !== undefined ? { structuredContent } : {}),
    text,
  };
}

export function stringifyHiveToolResult(result: unknown): string {
  const normalized = normalizeHiveToolResult(result);
  if (normalized.isError) {
    const text = normalized.text || JSON.stringify(normalized.json ?? normalized.raw);
    return text.startsWith("Error:") ? text : `Error: ${text}`;
  }
  if (normalized.text) {
    return normalized.text;
  }
  return JSON.stringify(normalized.json ?? normalized.raw);
}
