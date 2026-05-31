import { createHmac } from "node:crypto";

export const HIVE_TENANT_ID_HEADER = "X-Hive-Tenant-Id";
export const HIVE_END_USER_ID_HEADER = "X-Hive-End-User-Id";
export const HIVE_SUBJECT_TIMESTAMP_HEADER = "X-Hive-Subject-Timestamp";
export const HIVE_SUBJECT_SIGNATURE_HEADER = "X-Hive-Subject-Signature";

export type HiveSubjectContext = {
  endUserId: string;
  signingSecret?: string;
  tenantId: string;
};

export type HiveSubjectSigningInput = {
  endUserId: string;
  method: string;
  path: string;
  secret: string;
  tenantId: string;
  timestamp: string;
};

export type HiveSubjectHeaderOptions = {
  endUserId: string;
  method: string;
  path: string;
  signingSecret?: string;
  tenantId: string;
  timestamp?: Date | number | string;
};

function normalizeTimestamp(value: Date | number | string | undefined): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "number") {
    return String(Math.floor(value));
  }
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return String(Math.floor(Date.now() / 1000));
}

function requireNonEmpty(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`Hive B2B subject ${field} is required.`);
  }
  return trimmed;
}

export function buildHiveSubjectSignaturePayload({
  endUserId,
  method,
  path,
  tenantId,
  timestamp,
}: Omit<HiveSubjectSigningInput, "secret">): string {
  return [
    requireNonEmpty(method, "method").toUpperCase(),
    requireNonEmpty(path, "path"),
    requireNonEmpty(tenantId, "tenantId"),
    requireNonEmpty(endUserId, "endUserId"),
    requireNonEmpty(timestamp, "timestamp"),
  ].join("\n");
}

export function signHiveSubjectHeaders(input: HiveSubjectSigningInput): string {
  const secret = requireNonEmpty(input.secret, "signingSecret");
  return createHmac("sha256", secret)
    .update(buildHiveSubjectSignaturePayload(input))
    .digest("hex");
}

export function buildHiveSubjectHeaders({
  endUserId,
  method,
  path,
  signingSecret,
  tenantId,
  timestamp,
}: HiveSubjectHeaderOptions): Record<string, string> {
  const normalizedTimestamp = normalizeTimestamp(timestamp);
  const normalizedTenantId = requireNonEmpty(tenantId, "tenantId");
  const normalizedEndUserId = requireNonEmpty(endUserId, "endUserId");
  const secret = requireNonEmpty(signingSecret ?? "", "signingSecret");
  return {
    [HIVE_TENANT_ID_HEADER]: normalizedTenantId,
    [HIVE_END_USER_ID_HEADER]: normalizedEndUserId,
    [HIVE_SUBJECT_TIMESTAMP_HEADER]: normalizedTimestamp,
    [HIVE_SUBJECT_SIGNATURE_HEADER]: signHiveSubjectHeaders({
      endUserId: normalizedEndUserId,
      method,
      path,
      secret,
      tenantId: normalizedTenantId,
      timestamp: normalizedTimestamp,
    }),
  };
}
