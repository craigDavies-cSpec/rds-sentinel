import {
  calculateInstanceMonthlyCost,
  calculateAccountMonthlyCost,
  syncLiveAWSPricings,
  getPricingSyncMetadata,
  DEFAULT_AWS_PRICING_TABLE,
} from "../awsPricingEngine";
import { DBInstance } from "../mockTelemetry";

describe("awsPricingEngine module", () => {
  const mockFreeTierInstance: DBInstance = {
    id: "db-cspec-live",
    name: "free-tier-sandbox-db",
    engine: "RDS PostgreSQL",
    class: "db.t4g.micro",
    region: "eu-west-1 (Ireland)",
    status: "available",
    cpuLoad: 18,
    connections: 6,
    iops: 300,
    storageGb: 20,
    freeStorageGb: 18,
    accountId: "616399034957",
  };

  const mockProdInstance: DBInstance = {
    id: "db-prod-aurora",
    name: "sales-db-prod",
    engine: "Aurora PostgreSQL",
    class: "db.r6g.2xlarge",
    region: "us-east-1 (N. Virginia)",
    status: "available",
    cpuLoad: 72,
    connections: 142,
    iops: 4800,
    storageGb: 500,
    freeStorageGb: 142,
    accountId: "123456789012",
  };

  it("should enforce $0/mo cost for Free Tier micro instances", () => {
    const cost = calculateInstanceMonthlyCost(mockFreeTierInstance);
    expect(cost.isFreeTier).toBe(true);
    expect(cost.totalMonthlyCost).toBe(0);
    expect(cost.computeCost).toBe(0);
  });

  it("should calculate compute, storage, and IOPS costs accurately for production instances", () => {
    const cost = calculateInstanceMonthlyCost(mockProdInstance);
    expect(cost.isFreeTier).toBe(false);
    expect(cost.computeCost).toBe(525.60);
    expect(cost.storageCost).toBe(57.50); // 500 * 0.115
    expect(cost.iopsCost).toBe(96.00); // 4800 * 0.02
    expect(cost.totalMonthlyCost).toBe(679.10);
  });

  it("should aggregate total monthly account cost across multiple instances", () => {
    const total = calculateAccountMonthlyCost([mockFreeTierInstance, mockProdInstance]);
    expect(total).toBe(679.10);
  });

  it("should handle live pricing API sync and return pricing metadata", async () => {
    const metadata = await syncLiveAWSPricings();
    expect(metadata).toBeDefined();
    expect(metadata.lastSyncedAt).toBeDefined();
    expect(["AWS_PRICE_LIST_API", "LOCAL_CACHE", "OFFLINE_FALLBACK"]).toContain(metadata.source);
  });

  it("should retrieve stored pricing sync metadata", () => {
    const metadata = getPricingSyncMetadata();
    expect(metadata).toBeDefined();
    expect(metadata.region).toBeDefined();
  });
});
