import { evaluateControlTowerGuardrails } from "../controlTower";
import { verifySecurityControls, validateMfaToken } from "../securityControlMonitor";
import { MOCK_INSTANCES } from "../mockTelemetry";

describe("controlTower module", () => {
  it("should evaluate database instances against AWS Control Tower guardrails", () => {
    const audit = evaluateControlTowerGuardrails(MOCK_INSTANCES);
    expect(audit.totalEvaluated).toBe(4);
    expect(audit.score).toBeGreaterThanOrEqual(75);
    expect(audit.guardrails[0].code).toBe("CT.RDS.PR.1");
    expect(audit.guardrails[0].status).toBe("COMPLIANT");
  });
});

describe("securityControlMonitor module", () => {
  it("should verify SOC2 Type II and HIPAA security controls", () => {
    const controls = verifySecurityControls();
    expect(controls.length).toBe(3);
    expect(controls[0].status).toBe("PASS");
  });

  it("should validate 6-digit MFA tokens", () => {
    expect(validateMfaToken("123456").valid).toBe(true);
    expect(validateMfaToken("invalid").valid).toBe(false);
    expect(validateMfaToken("123").valid).toBe(false);
  });
});
