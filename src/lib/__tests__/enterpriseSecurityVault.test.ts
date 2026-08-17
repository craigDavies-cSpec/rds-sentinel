import {
  generateOwaspPassword,
  evaluatePasswordStrength,
  sanitizeDeepCredentials,
  validateStsExternalId,
  getEnterpriseSecurityPolicy,
} from "../enterpriseSecurityVault";

describe("enterpriseSecurityVault module", () => {
  it("should generate OWASP-compliant high-entropy passwords (>120 bits)", () => {
    const analysis = generateOwaspPassword(28);
    expect(analysis.password.length).toBe(28);
    expect(analysis.entropyBits).toBeGreaterThanOrEqual(120);
    expect(analysis.qualityGrade).toBe("EXCELLENT");
    expect(analysis.isOwaspCompliant).toBe(true);
  });

  it("should accurately evaluate password strength and entropy rating", () => {
    const weak = evaluatePasswordStrength("password123");
    expect(weak.qualityGrade).toBe("WEAK");
    expect(weak.isOwaspCompliant).toBe(false);

    const strong = evaluatePasswordStrength("K9#mX2$vP7!qZ4*w");
    expect(strong.qualityGrade).toBe("STRONG");
  });

  it("should sanitize AWS access keys, secret keys, emails, and passwords from telemetry text", () => {
    const mockAwsKey = "AKIA" + "IOSFODNN7EXAMPLE";
    const rawTelemetry = `AWS Key ${mockAwsKey} and user email craig@cspec.uk with password = 'SecretPass123!'`;
    const result = sanitizeDeepCredentials(rawTelemetry);

    expect(result.sanitizedText).toContain("[REDACTED_AWS_ACCESS_KEY]");
    expect(result.sanitizedText).toContain("[REDACTED_EMAIL]");
    expect(result.sanitizedText).toContain("[REDACTED_PASSWORD]");
    expect(result.redactedCount).toBe(3);
    expect(result.redactedTypes.length).toBe(3);
  });

  it("should validate STS ExternalId against confused deputy attacks", () => {
    const weak = validateStsExternalId("123456");
    expect(weak.isValid).toBe(false);
    expect(weak.reason).toContain("ExternalId is too short");

    const valid = validateStsExternalId("Sentinel-Secret-Cryptographic-Key-0001");
    expect(valid.isValid).toBe(true);
    expect(valid.entropyScore).toBeGreaterThan(50);
  });

  it("should return complete Enterprise Security Policy status", () => {
    const policy = getEnterpriseSecurityPolicy();
    expect(policy.aesEncryption).toBe("ACTIVE_AES_256_GCM");
    expect(policy.confusedDeputyProtection).toBe("STS_EXTERNAL_ID_ENFORCED");
    expect(policy.soc2Status).toBe("COMPLIANT_TSC_2026");
  });
});
