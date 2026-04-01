#!/usr/bin/env node

const major = parseInt(process.versions.node.split(".")[0], 10);
if (major < 20) {
  process.stderr.write(
    `Error: hive requires Node.js 20 or later (found ${process.versions.node}).\n`,
  );
  process.exit(1);
}

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, "..", "build", "cli.js");

if (!existsSync(cliPath)) {
  process.stderr.write(
    "Error: build/cli.js not found. Run `npm run build` first.\n",
  );
  process.exit(1);
}

await import(cliPath);
