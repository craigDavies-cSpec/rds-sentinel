// Developer API Key & Rate-Limiting Management Engine (Phase 10B)

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  rateLimitReqPerMin: number;
  status: "ACTIVE" | "REVOKED";
}

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: "key-1",
    name: "Grafana Enterprise Dashboard Stream",
    key: "sentinel_live_sk_9401_grafana_prod",
    createdAt: new Date().toISOString(),
    rateLimitReqPerMin: 1000,
    status: "ACTIVE",
  },
  {
    id: "key-2",
    name: "CI/CD Pipeline Performance Gate",
    key: "sentinel_live_sk_3310_github_actions",
    createdAt: new Date().toISOString(),
    rateLimitReqPerMin: 500,
    status: "ACTIVE",
  },
];

/**
 * Generates a new cryptographically formatted API key
 */
export function generateApiKey(
  name: string,
  rateLimitReqPerMin: number = 1000
): ApiKey {
  const randomHex = Math.random().toString(36).substring(2, 10);
  return {
    id: `key-${Date.now()}`,
    name: name.trim() || "Unassigned Developer Key",
    key: `sentinel_live_sk_${randomHex}_secret`,
    createdAt: new Date().toISOString(),
    rateLimitReqPerMin,
    status: "ACTIVE",
  };
}

/**
 * Revokes an existing API key
 */
export function revokeApiKey(keyId: string, keys: ApiKey[]): ApiKey[] {
  return keys.map((k) =>
    k.id === keyId ? { ...k, status: "REVOKED" as const } : k
  );
}

/**
 * Validates an API key token against active keys
 */
export function validateApiKeyToken(
  token: string,
  keys: ApiKey[]
): { valid: boolean; message: string; keyObj?: ApiKey } {
  const match = keys.find((k) => k.key === token.trim());
  if (!match) {
    return { valid: false, message: "Invalid API Secret Key Token." };
  }
  if (match.status === "REVOKED") {
    return { valid: false, message: "API Secret Key has been REVOKED." };
  }
  return {
    valid: true,
    message: `API Key Active (${match.rateLimitReqPerMin} req/min allowed).`,
    keyObj: match,
  };
}
