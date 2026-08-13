import {
  calculateAccountHealthScore,
  getAvailableCostCenterTags,
  filterInstancesByCostCenter,
  getAggregatedMultiAccountInstances,
} from "../enterpriseConsolidation";
import { DBInstance, CostRecommendation, SlowQuery } from "../mockTelemetry";

describe("enterpriseConsolidation module", () => {
  const mockDbInstances: DBInstance[] = [
    {
      id: "sales-db-prod",
      name: "sales-db-prod",
      engine: "Aurora PostgreSQL",
      class: "db.r6g.2xlarge",
      region: "us-east-1",
      status: "available",
      cpuLoad: 88, // High CPU penalty
      connections: 240,
      iops: 12000,
      storageGb: 450,
      freeStorageGb: 120,
      accountId: "123456789012",
      projectTag: "Project: E-Commerce",
    },
    {
      id: "analytics-aurora",
      name: "analytics-aurora-cluster",
      engine: "Aurora PostgreSQL",
      class: "db.r6g.4xlarge",
      region: "us-east-1",
      status: "available",
      cpuLoad: 35,
      connections: 110,
      iops: 8500,
      storageGb: 1200,
      freeStorageGb: 600,
      accountId: "123456789012",
      projectTag: "CostCenter: CC-9401",
    },
    {
      id: "staging-dev",
      name: "staging-dev-db",
      engine: "RDS MySQL",
      class: "db.t4g.medium",
      region: "us-west-2",
      status: "available",
      cpuLoad: 20,
      connections: 15,
      iops: 1000,
      storageGb: 100,
      freeStorageGb: 75,
      accountId: "987654321098",
      projectTag: "Project: E-Commerce",
    },
  ];

  const mockRecommendations: CostRecommendation[] = [
    {
      id: "rec-1",
      dbInstanceId: "sales-db-prod",
      type: "downsize",
      title: "Downsize DB Class",
      impact: "High",
      costDelta: -145,
      reason: "Low CPU average",
    },
  ];

  const mockSlowQueries: SlowQuery[] = [
    {
      id: "sq-1",
      dbInstanceId: "sales-db-prod",
      timestamp: "2026-08-11 10:15:32",
      durationMs: 4200,
      rawSql: "SELECT * FROM users",
      maskedSql: "SELECT * FROM users",
      waitEvent: "IO:DataFileRead",
    },
  ];

  it("should calculate composite Account Health Score (0 - 100)", () => {
    const scoreResult = calculateAccountHealthScore(
      mockDbInstances,
      mockRecommendations,
      mockSlowQueries,
      true // Masking active
    );

    // High CPU penalty (12) + Slow query penalty (3) = 15 penalty => score 85 (Grade A)
    expect(scoreResult.healthScore).toBe(85);
    expect(scoreResult.grade).toBe("A");
    expect(scoreResult.highCpuCount).toBe(1);
    expect(scoreResult.totalIdentifiedSavingsMonthly).toBe(145);
  });

  it("should penalize health score heavily when parameter masking is OFF", () => {
    const scoreUnmasked = calculateAccountHealthScore(
      mockDbInstances,
      mockRecommendations,
      mockSlowQueries,
      false // Masking OFF => +5 penalty
    );

    expect(scoreUnmasked.healthScore).toBe(80);
    expect(scoreUnmasked.unmaskedPiiRiskCount).toBe(1);
  });

  it("should extract cost center tags and filter instances accordingly", () => {
    const tags = getAvailableCostCenterTags(mockDbInstances);
    expect(tags).toContain("ALL_TAGS");
    expect(tags).toContain("Project: E-Commerce");
    expect(tags).toContain("CostCenter: CC-9401");

    const filteredEcommerce = filterInstancesByCostCenter(mockDbInstances, "Project: E-Commerce");
    expect(filteredEcommerce.length).toBe(2);

    const filteredAll = filterInstancesByCostCenter(mockDbInstances, "ALL_TAGS");
    expect(filteredAll.length).toBe(3);
  });

  it("should aggregate all DB instances across all AWS sub-accounts when ALL_ACCOUNTS is selected", () => {
    const aggregatedAll = getAggregatedMultiAccountInstances(mockDbInstances, "ALL_ACCOUNTS");
    expect(aggregatedAll.length).toBe(3);

    const singleAcct = getAggregatedMultiAccountInstances(mockDbInstances, "123456789012");
    expect(singleAcct.length).toBe(2);
  });
});
