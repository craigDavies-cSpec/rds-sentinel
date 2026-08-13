import { generateAuditEvidencePackage } from "../auditEvidenceExporter";

describe("auditEvidenceExporter module", () => {
  it("should generate a valid SOC2 Type II audit evidence package", () => {
    const evidence = generateAuditEvidencePackage("HealthCorp Global", "auditor@healthcorp.com");
    expect(evidence.companyName).toBe("HealthCorp Global");
    expect(evidence.auditorEmail).toBe("auditor@healthcorp.com");
    expect(evidence.overallStatus).toBe("COMPLIANT");
    expect(evidence.trustServicesCriteria.length).toBe(3);
    expect(evidence.encryptionProof.tlsVersion).toContain("TLS 1.3");
  });
});
