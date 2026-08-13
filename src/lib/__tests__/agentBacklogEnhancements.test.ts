import {
  scanAwsOrganizationsForDatabases,
  generateHipaaBaaAgreement,
} from "../agentBacklogEnhancements";

describe("agentBacklogEnhancements module", () => {
  it("should simulate AWS Organizations Auto-Discovery scanner", () => {
    const discovered = scanAwsOrganizationsForDatabases(["123456789012", "987654321098"]);
    expect(discovered.length).toBe(2);
    expect(discovered[0].name).toBe("fintech-payment-vault-db");
    expect(discovered[0].status).toBe("discovered");
  });

  it("should generate executed HIPAA BAA agreement package", () => {
    const baa = generateHipaaBaaAgreement("HealthCorp Enterprise", "ciso@healthcorp.com");
    expect(baa.organizationName).toBe("HealthCorp Enterprise");
    expect(baa.signatoryEmail).toBe("ciso@healthcorp.com");
    expect(baa.status).toBe("ACTIVE_EXECUTED");
    expect(baa.agreementId).toContain("BAA-HIPAA-");
  });
});
