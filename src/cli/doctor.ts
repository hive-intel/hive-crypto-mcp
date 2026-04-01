import {
  shouldOutputJson,
  writeOutput,
  successEnvelope,
  info,
  debug,
} from "./output.js";
import { fetchToolCatalog } from "./api-client.js";

const DEFAULT_API_URL =
  "https://mcp.hiveintelligence.xyz";

function getApiUrl(): string {
  return process.env.HIVE_API_URL || DEFAULT_API_URL;
}

export async function runDoctor(opts: { probe?: boolean }): Promise<void> {
  const checks: { check: string; status: string; detail: string }[] = [];

  // Check HIVE_API_KEY (optional for now — API is free)
  const apiKey = process.env.HIVE_API_KEY;
  checks.push({
    check: "HIVE_API_KEY",
    status: apiKey ? "PASS" : "INFO",
    detail: apiKey
      ? `Set (${apiKey.slice(0, 4)}...)`
      : "Not set (optional — API is currently free)",
  });

  // Check HIVE_API_URL
  const apiUrl = process.env.HIVE_API_URL;
  checks.push({
    check: "HIVE_API_URL",
    status: "PASS",
    detail: apiUrl ? `Custom: ${apiUrl}` : `Default: ${DEFAULT_API_URL}`,
  });

  // Check server connectivity via /ping
  const healthUrl = `${getApiUrl()}/ping`;
  debug(`GET ${healthUrl}`);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const resp = await fetch(healthUrl, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (resp.ok) {
      const body = await resp.json().catch(() => null);
      const serverStatus =
        body && typeof body === "object" && "status" in body
          ? String((body as Record<string, unknown>).status)
          : "ok";
      checks.push({
        check: "Server health",
        status: "PASS",
        detail: `${resp.status} — ${serverStatus}`,
      });
    } else {
      checks.push({
        check: "Server health",
        status: "FAIL",
        detail: `HTTP ${resp.status} ${resp.statusText}`,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = err instanceof Error && err.name === "AbortError";
    checks.push({
      check: "Server health",
      status: "FAIL",
      detail: isTimeout
        ? `Timeout connecting to ${getApiUrl()}`
        : `Connection failed: ${msg}`,
    });
  }

  // Check tool catalog availability
  {
    debug("Fetching tool catalog...");
    try {
      const catalog = await fetchToolCatalog();
      const toolsData = catalog.data as
        | { totalCount?: number; tools?: unknown[] }
        | unknown[];
      const toolCount = Array.isArray(toolsData)
        ? toolsData.length
        : typeof toolsData === "object" &&
            toolsData !== null &&
            "totalCount" in toolsData
          ? (toolsData as { totalCount: number }).totalCount
          : 0;
      if (catalog.ok) {
        checks.push({
          check: "Tool catalog",
          status: toolCount > 0 ? "PASS" : "WARN",
          detail: `${toolCount} tools available`,
        });
      } else {
        const errMsg =
          catalog.error &&
          typeof catalog.error === "object" &&
          "message" in catalog.error
            ? String(catalog.error.message)
            : "Unknown error";
        checks.push({
          check: "Tool catalog",
          status: "FAIL",
          detail: errMsg,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      checks.push({
        check: "Tool catalog",
        status: "FAIL",
        detail: `Failed to fetch: ${msg}`,
      });
    }
  }

  // Probe: call server health endpoint with extended check
  if (opts.probe) {
    const probeUrl = `${getApiUrl()}/health?run=true`;
    debug(`Probe: GET ${probeUrl}`);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);
      const resp = await fetch(probeUrl, {
        headers: {
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (resp.ok) {
        const body = await resp.json().catch(() => null);
        if (body && typeof body === "object" && "providers" in body) {
          const providers = (body as Record<string, unknown>).providers;
          if (Array.isArray(providers)) {
            for (const p of providers) {
              const pObj = p as Record<string, unknown>;
              const name = String(pObj.name ?? pObj.provider ?? "unknown");
              const status = String(pObj.status ?? "unknown");
              const pass =
                status === "healthy" ||
                status === "passed" ||
                status === "partial";
              checks.push({
                check: `Probe: ${name}`,
                status: pass ? "PASS" : status === "inactive" ? "SKIP" : "FAIL",
                detail: status,
              });
            }
          }
        } else {
          checks.push({
            check: "Probe",
            status: "PASS",
            detail: `Server responded ${resp.status}`,
          });
        }
      } else {
        checks.push({
          check: "Probe",
          status: "FAIL",
          detail: `HTTP ${resp.status} ${resp.statusText}`,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      checks.push({
        check: "Probe",
        status: "FAIL",
        detail: `Failed: ${msg}`,
      });
    }
  }

  const fails = checks.filter((c) => c.status === "FAIL").length;
  const warns = checks.filter((c) => c.status === "WARN").length;
  const data = {
    checks,
    summary: {
      total: checks.length,
      pass: checks.filter((c) => c.status === "PASS").length,
      fail: fails,
      warn: warns,
    },
  };

  if (shouldOutputJson()) {
    await writeOutput(successEnvelope(data, {}));
    if (fails > 0) process.exit(1);
    return;
  }

  const { table } = await import("./format.js");
  info("\nHive MCP Doctor\n");
  info(
    table(
      ["Check", "Status", "Detail"],
      checks.map((c) => [c.check, c.status, c.detail]),
    ),
  );
  info(
    `\n${fails === 0 ? "All checks passed" : `${fails} issues found`}${warns ? ` (${warns} warnings)` : ""}\n`,
  );

  if (fails > 0) process.exit(1);
}

export async function runStatus(): Promise<void> {
  const { CLI_VERSION: SERVER_VERSION } = await import("../version.js");
  const { resolveApiKey, resolveApiUrl } = await import("./config-dir.js");
  const { getActiveProfile, maskKey } = await import("./auth.js");

  const apiUrl = resolveApiUrl();
  const apiKey = resolveApiKey();
  const profile = getActiveProfile();

  let apiStatus = "unknown";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(`${apiUrl}/ping`, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      signal: controller.signal,
    });
    clearTimeout(timer);
    apiStatus = resp.ok ? "healthy" : `HTTP ${resp.status}`;
  } catch {
    apiStatus = "unreachable";
  }

  if (shouldOutputJson()) {
    await writeOutput(
      successEnvelope(
        {
          version: SERVER_VERSION,
          profile: profile?.name ?? "(none)",
          apiUrl,
          apiStatus,
          hasKey: !!apiKey,
        },
        {},
      ),
    );
    return;
  }

  process.stderr.write(`\nHive CLI v${SERVER_VERSION}\n`);
  process.stderr.write(
    `Profile: ${profile ? `${profile.name} (${maskKey(profile.apiKey)})` : "(not logged in)"}\n`,
  );
  process.stderr.write(`API:     ${apiUrl} (${apiStatus})\n\n`);
}
