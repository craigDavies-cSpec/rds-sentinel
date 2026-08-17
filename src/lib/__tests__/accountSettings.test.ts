import {
  calculateTierProration,
  checkInstanceCapacity,
  testIamRoleConnection,
  TIER_PRICING_PLANS,
} from "../accountSettings";

describe("accountSettings module", () => {
  it("should calculate correct prorated price deltas when upgrading and downgrading tiers", () => {
    // Small ($59) -> Medium ($179) => +$120
    const upgradeResult = calculateTierProration("small", "medium");
    expect(upgradeResult.priceDeltaMonthly).toBe(120);
    expect(upgradeResult.textSummary).toContain("+$120.00/mo");

    // Enterprise ($499) -> Small ($59) => -$440
    const downgradeResult = calculateTierProration("enterprise", "small");
    expect(downgradeResult.priceDeltaMonthly).toBe(-440);
    expect(downgradeResult.textSummary).toContain("-$440.00/mo");

    // Same tier => 0
    const sameResult = calculateTierProration("medium", "medium");
    expect(sameResult.priceDeltaMonthly).toBe(0);
  });

  it("should enforce instance capacity limits per tier", () => {
    // 3 instances on Trial (max 2) => Allowed = false
    const trialCapCheck = checkInstanceCapacity(3, "trial");
    expect(trialCapCheck.allowed).toBe(false);

    // 5 instances on Small (max 5) => Allowed = true
    const smallCapCheck = checkInstanceCapacity(5, "small");
    expect(smallCapCheck.allowed).toBe(true);

    // 10 instances on Enterprise (max -1) => Allowed = true
    const enterpriseCapCheck = checkInstanceCapacity(10, "enterprise");
    expect(enterpriseCapCheck.allowed).toBe(true);
  });

  it("should test IAM AssumeRole connection parameters", () => {
    const validRole = "arn:aws:iam::123456789012:role/RDSSentinelRole";
    const validExtId = "ext-secret-12345";

    const testValid = testIamRoleConnection(validRole, validExtId);
    expect(testValid.success).toBe(true);
    expect(testValid.message).toContain("123456789012");
    expect(testValid.discoveredAccount?.id).toBe("123456789012");
    expect(testValid.discoveredAccount?.monitoredServices).toContain("free-tier-sandbox-db");

    const testInvalidArn = testIamRoleConnection("invalid-arn", validExtId);
    expect(testInvalidArn.success).toBe(false);

    const testShortExtId = testIamRoleConnection(validRole, "abc");
    expect(testShortExtId.success).toBe(false);
  });
});
