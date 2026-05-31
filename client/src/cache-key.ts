function stableStringifyValue(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringifyValue(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringifyValue(record[key])}`)
    .join(",")}}`;
}

export function stableHiveCacheKey(
  toolName: string,
  args: Record<string, unknown> = {}
): string {
  return `${toolName}:${stableStringifyValue(args)}`;
}
