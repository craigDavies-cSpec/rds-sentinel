import { 
  scanQueriesForSecrets, 
  generateComplianceReport 
} from "../complianceExporter";

describe("complianceExporter module", () => {
  it("should detect secret tokens in unmasked query strings", () => {
    const cleanQueries = [
      "SELECT * FROM users WHERE email = $1",
      "UPDATE orders SET status = 'completed' WHERE id = 42",
    ];

    const cleanResult = scanQueriesForSecrets(cleanQueries);
    expect(cleanResult.count).toBe(0);
    expect(cleanResult.foundSecrets.length).toBe(0);

    const dirtyQueries = [
      "SELECT * FROM users WHERE aws_key = 'AKIA-IOSFODNN7EXAMPLE'",
      "INSERT INTO payments VALUES ('sk_mock_51Nx000000000000000000000')",
    ];

    const dirtyResult = scanQueriesForSecrets(dirtyQueries);
    expect(dirtyResult.count).toBe(2);
    expect(dirtyResult.foundSecrets).toContain("AKIA-IOSFODNN7EXAMPLE");
  });

  it("should generate a 100% COMPLIANT SOC2 report when masking is active and zero secrets are found", () => {
    const queries = ["SELECT * FROM users WHERE email = $1"];
    const report = generateComplianceReport(queries, true, "Acme Corp");

    expect(report.organization).toBe("Acme Corp");
    expect(report.summary.complianceScorePct).toBe(100);
    expect(report.summary.status).toBe("COMPLIANT");
    expect(report.auditChecks.every((check) => check.passed)).toBe(true);
  });

  it("should generate a WARNING or NON_COMPLIANT report when masking is OFF or secrets exist", () => {
    const queries = ["SELECT * FROM users WHERE email = 'test@example.com'"];
    const reportUnmasked = generateComplianceReport(queries, false, "Beta Corp");

    expect(reportUnmasked.summary.complianceScorePct).toBe(70);
    expect(reportUnmasked.summary.status).toBe("WARNING");
    expect(reportUnmasked.summary.hasUnmaskedPii).toBe(true);

    const dirtyQueries = ["SELECT * FROM keys WHERE key = 'AKIA-IOSFODNN7EXAMPLE'"];
    const reportDirty = generateComplianceReport(dirtyQueries, false, "Gamma Corp");
    expect(reportDirty.summary.complianceScorePct).toBe(30);
    expect(reportDirty.summary.status).toBe("NON_COMPLIANT");
  });
});
