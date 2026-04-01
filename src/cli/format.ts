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

/** Auto-format an array of objects as a fixed-width table. */
export function formatTable(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "(empty result)";

  const maxCols = 8;
  const maxWidth = 40;

  const allKeys = [...new Set(data.flatMap(Object.keys))];
  const cols = allKeys.slice(0, maxCols);

  const widths = cols.map((col) => {
    const values = data.map((row) => String(row[col] ?? "").slice(0, maxWidth));
    return Math.max(col.length, ...values.map((v) => v.length));
  });

  const header = cols.map((col, i) => col.padEnd(widths[i])).join("  ");
  const separator = widths.map((w) => "-".repeat(w)).join("  ");
  const rows = data.map((row) =>
    cols
      .map((col, i) =>
        String(row[col] ?? "")
          .slice(0, maxWidth)
          .padEnd(widths[i]),
      )
      .join("  "),
  );

  return [header, separator, ...rows].join("\n");
}
