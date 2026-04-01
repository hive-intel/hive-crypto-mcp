import { executeTool } from "./execute.js";

const MAX_CONSECUTIVE_FAILURES = 10;

export async function runWatch(
  toolName: string,
  args: Record<string, unknown>,
  intervalSec: number,
  timeoutMs: number,
): Promise<void> {
  process.stderr.write(
    `Watching ${toolName} every ${intervalSec}s (Ctrl+C to stop)\n\n`,
  );

  let consecutiveFailures = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const run = async () => {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    process.stderr.write(`── ${timestamp} ──\n`);
    try {
      await executeTool(toolName, args, timeoutMs);
      consecutiveFailures = 0;
    } catch (err) {
      consecutiveFailures++;
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(
        `  Error (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES}): ${msg}\n`,
      );

      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        process.stderr.write(
          `\nAborting watch: ${MAX_CONSECUTIVE_FAILURES} consecutive failures.\n`,
        );
        process.exit(4);
      }
    }
    process.stderr.write("\n");

    // Exponential backoff on consecutive failures: double interval per failure, cap at 5x
    const backoffMultiplier = Math.min(Math.pow(2, consecutiveFailures), 5);
    const nextInterval =
      consecutiveFailures > 0 ? intervalSec * backoffMultiplier : intervalSec;

    if (consecutiveFailures > 0) {
      process.stderr.write(`  Backing off: next poll in ${nextInterval}s\n`);
    }

    timer = setTimeout(run, nextInterval * 1000);
  };

  await run();

  const cleanup = () => {
    if (timer) clearTimeout(timer);
    process.stderr.write("\nWatch stopped.\n");
    process.exit(0);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  await new Promise(() => {});
}
