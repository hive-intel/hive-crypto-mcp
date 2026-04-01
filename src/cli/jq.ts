/**
 * Minimal jq-like evaluator for CLI --jq flag.
 * Supports: .field, .a.b, .[N], .[] | .field, .[] | select(.field op val)
 */
export function jqEval(data: unknown, expr: string): unknown {
  const trimmed = expr.trim();
  if (trimmed === ".") return data;

  // Handle pipe: split on " | " and chain
  if (trimmed.includes(" | ")) {
    const parts = trimmed.split(" | ");
    let result = data;
    for (const part of parts) {
      result = jqEval(result, part.trim());
    }
    return result;
  }

  // Handle select(.field op value)
  const selectMatch = trimmed.match(
    /^select\(\.(\w[\w.]*)\s*(>|<|>=|<=|==|!=)\s*(.+)\)$/,
  );
  if (selectMatch) {
    const [, field, op, rawVal] = selectMatch;
    if (!Array.isArray(data)) return data;
    const val = parseValue(rawVal);
    return data.filter((item) => {
      const fieldVal = extractPath(item, field);
      return compare(fieldVal, op, val);
    });
  }

  // If data is an array and expression is a plain field access, map over elements.
  // Exclude bracket expressions like .[1] or .[] to avoid false-positive mapping.
  if (
    Array.isArray(data) &&
    trimmed.startsWith(".") &&
    !trimmed.includes("[")
  ) {
    const path = trimmed.slice(1);
    if (path && !path.includes(" ")) {
      return data.map((item) => extractPath(item, path));
    }
  }

  // Handle .[] (iterate array)
  if (trimmed === ".[]") {
    if (Array.isArray(data)) return data;
    if (typeof data === "object" && data !== null) return Object.values(data);
    return data;
  }

  // Handle .[N] (array index)
  const indexMatch = trimmed.match(/^\.\[(\d+)\]$/);
  if (indexMatch) {
    const idx = parseInt(indexMatch[1], 10);
    if (Array.isArray(data)) return data[idx];
    return undefined;
  }

  // Handle .field or .a.b.c — may include .[] in path
  if (trimmed.startsWith(".")) {
    const path = trimmed.slice(1);
    return extractPath(data, path);
  }

  return extractPath(data, trimmed);
}

function extractPath(data: unknown, path: string): unknown {
  if (!path) return data;

  const parts: string[] = [];
  let current = "";
  for (let i = 0; i < path.length; i++) {
    if (path[i] === "." && path[i + 1] === "[" && path[i + 2] === "]") {
      if (current) parts.push(current);
      parts.push("[]");
      current = "";
      i += 2;
    } else if (path[i] === "." && current) {
      parts.push(current);
      current = "";
    } else if (path[i] !== "." || current) {
      current += path[i];
    }
  }
  if (current) parts.push(current);

  let result: unknown = data;
  for (const part of parts) {
    if (result == null) return undefined;
    if (part === "[]") {
      if (Array.isArray(result)) return result;
      return undefined;
    }
    if (typeof result === "object" && result !== null) {
      result = (result as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return result;
}

function parseValue(raw: string): string | number | boolean {
  const trimmed = raw.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^".*"$/.test(trimmed)) return trimmed.slice(1, -1);
  const num = Number(trimmed);
  if (!isNaN(num)) return num;
  return trimmed;
}

function compare(a: unknown, op: string, b: unknown): boolean {
  switch (op) {
    case "==":
      return a === b;
    case "!=":
      return a !== b;
    case ">":
      return typeof a === "number" && typeof b === "number" && a > b;
    case "<":
      return typeof a === "number" && typeof b === "number" && a < b;
    case ">=":
      return typeof a === "number" && typeof b === "number" && a >= b;
    case "<=":
      return typeof a === "number" && typeof b === "number" && a <= b;
    default:
      return false;
  }
}
