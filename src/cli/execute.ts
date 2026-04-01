import ora from "ora";
import { executeRemoteTool } from "./api-client.js";
import { writeOutput, debug, shouldOutputJson } from "./output.js";
import type { Envelope } from "./output.js";
import { trackCommand } from "./telemetry.js";

export async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  timeoutMs: number = 30000,
): Promise<void> {
  debug(`Executing ${toolName} remotely`);

  // Spinner only when stderr is a TTY and output is not JSON (stdout is reserved for data)
  const showSpinner = !shouldOutputJson() && !!process.stderr.isTTY;
  const spinner = showSpinner
    ? ora({ text: `Calling ${toolName}...`, stream: process.stderr }).start()
    : null;

  const startMs = Date.now();
  let response: Awaited<ReturnType<typeof executeRemoteTool>>;
  try {
    response = await executeRemoteTool(toolName, args, timeoutMs);
    spinner?.succeed(`${toolName} (${Date.now() - startMs}ms)`);
  } catch (err) {
    spinner?.fail(`${toolName} failed (${Date.now() - startMs}ms)`);
    throw err;
  }

  trackCommand(
    toolName,
    Date.now() - startMs,
    response.ok ? undefined : response.error?.code,
  );

  await writeOutput(response as Envelope);

  if (!response.ok) {
    const exitCode =
      response.error?.code === "TOOL_NOT_FOUND"
        ? 3
        : response.error?.code === "PROVIDER_UNAVAILABLE"
          ? 5
          : response.error?.code === "RATE_LIMITED"
            ? 6
            : response.error?.code === "TIMEOUT"
              ? 124
              : 4;
    process.exit(exitCode);
  }
}
