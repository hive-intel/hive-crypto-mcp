import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const child = spawn("hive", {
  env: process.env,
  stdio: ["pipe", "pipe", "pipe"],
});

child.on("error", (error) => {
  process.stderr.write(`Failed to start Hive MCP server: ${error.message}\n`);
  process.exit(1);
});

process.stdin.pipe(child.stdin);
child.stderr.pipe(process.stderr);

const stdout = createInterface({ input: child.stdout });
stdout.on("line", (line) => {
  if (line.trimStart().startsWith("{")) {
    process.stdout.write(`${line}\n`);
    return;
  }

  process.stderr.write(`${line}\n`);
});

let childClosed = false;
let stdoutClosed = false;
let exitCode = 0;
let exitSignal = null;

function maybeExit() {
  if (!childClosed || !stdoutClosed) {
    return;
  }

  if (exitSignal) {
    process.kill(process.pid, exitSignal);
    return;
  }

  process.exit(exitCode ?? 0);
}

stdout.on("close", () => {
  stdoutClosed = true;
  maybeExit();
});

child.on("exit", (code, signal) => {
  childClosed = true;
  exitCode = code;
  exitSignal = signal;
  maybeExit();
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal);
  });
}
