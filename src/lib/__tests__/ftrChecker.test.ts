import { runFtrSecurityAudit } from "../ftrChecker";

describe("AWS FTR Security Scanner", () => {
  it("should run security audit across all 4 mandatory AWS FTR pillars", () => {
    const res = runFtrSecurityAudit();
    expect(res.items.length).toBe(4);
    expect(res.overallScore).toBe(100);
    expect(res.status).toBe("COMPLIANT_FOR_ISV_ACCELERATE");
  });

  it("should include IAM, PII data privacy, encryption, and DR resiliency audit items", () => {
    const res = runFtrSecurityAudit();
    const pillars = res.items.map((i) => i.pillar);
    expect(pillars).toContain("IAM_SECURITY");
    expect(pillars).toContain("DATA_PRIVACY");
    expect(pillars).toContain("ENCRYPTION");
    expect(pillars).toContain("RESILIENCY");
  });
});
