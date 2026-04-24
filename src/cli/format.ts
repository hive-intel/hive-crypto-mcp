export function pad(str: string, width: number): string {
  return str.length >= width
    ? str.slice(0, width)
    : str + " ".repeat(width - str.length);
}

export function table(headers: string[], rows: string[][]): string {
  const widths = headers.map(
    (h, i) => Math.max(h.length, ...rows.map((r) => (r[i] || "").length)) + 2,
  );
  const headerLine = headers.map((h, i) => pad(h, widths[i])).join("");
  const separator = widths.map((w) => "-".repeat(w)).join("");
  const dataLines = rows.map((row) =>
    row.map((cell, i) => pad(cell, widths[i])).join(""),
  );
  return [headerLine, separator, ...dataLines].join("\n");
}

const LABEL_KEYS = ["name", "title", "slug", "symbol", "label", "id"];

function pickLabel(obj: Record<string, unknown>): string | null {
  for (const k of LABEL_KEYS) {
    const v = obj[k];
    if (typeof v === "string" && v) return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
  }
  return null;
}

/** Render any value to a compact cell string — avoids "[object Object]". */
export function formatCell(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return "";
    if (v.every((x) => x == null || typeof x !== "object")) {
      return v.map((x) => (x == null ? "" : String(x))).join(", ");
    }
    const labels = v
      .map((x) =>
        x && typeof x === "object"
          ? pickLabel(x as Record<string, unknown>)
          : null,
      )
      .filter((x): x is string => x !== null);
    if (labels.length === v.length) return labels.join(", ");
    return `[${v.length} items]`;
  }
  if (typeof v === "object") {
    const label = pickLabel(v as Record<string, unknown>);
    if (label) return label;
    return `{${Object.keys(v as object).length} keys}`;
  }
  return String(v);
}

/** Auto-format an array of objects as a fixed-width table. */
export function formatTable(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "(empty result)";

  const maxCols = 8;
  const maxWidth = 40;

  const allKeys = [...new Set(data.flatMap(Object.keys))];
  const cols = allKeys.slice(0, maxCols);

  const cells = data.map((row) =>
    cols.map((col) => formatCell(row[col]).slice(0, maxWidth)),
  );

  const widths = cols.map((col, i) =>
    Math.max(col.length, ...cells.map((r) => r[i].length)),
  );

  const header = cols.map((col, i) => col.padEnd(widths[i])).join("  ");
  const separator = widths.map((w) => "-".repeat(w)).join("  ");
  const rows = cells.map((row) =>
    row.map((cell, i) => cell.padEnd(widths[i])).join("  "),
  );

  return [header, separator, ...rows].join("\n");
}
