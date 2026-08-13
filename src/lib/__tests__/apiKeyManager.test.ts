import {
  generateApiKey,
  revokeApiKey,
  validateApiKeyToken,
  INITIAL_API_KEYS,
} from "../apiKeyManager";

describe("apiKeyManager module", () => {
  it("should generate a new active API key with specified rate limit", () => {
    const key = generateApiKey("Grafana Integration", 5000);
    expect(key.name).toBe("Grafana Integration");
    expect(key.key).toContain("sentinel_live_sk_");
    expect(key.rateLimitReqPerMin).toBe(5000);
    expect(key.status).toBe("ACTIVE");
  });

  it("should revoke an active API key", () => {
    const updated = revokeApiKey("key-1", INITIAL_API_KEYS);
    const revokedKey = updated.find((k) => k.id === "key-1");
    expect(revokedKey?.status).toBe("REVOKED");
  });

  it("should validate active API key tokens and reject revoked keys", () => {
    const validRes = validateApiKeyToken(INITIAL_API_KEYS[0].key, INITIAL_API_KEYS);
    expect(validRes.valid).toBe(true);

    const revokedKeys = revokeApiKey("key-1", INITIAL_API_KEYS);
    const invalidRes = validateApiKeyToken(INITIAL_API_KEYS[0].key, revokedKeys);
    expect(invalidRes.valid).toBe(false);
    expect(invalidRes.message).toContain("REVOKED");
  });
});
