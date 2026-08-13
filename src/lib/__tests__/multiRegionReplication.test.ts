import {
  calculateReplicationMetrics,
  simulateFailoverEvent,
  INITIAL_REGIONS,
} from "../multiRegionReplication";

describe("multiRegionReplication module", () => {
  it("should calculate dynamic replication lag and readiness states", () => {
    const metrics = calculateReplicationMetrics(80, INITIAL_REGIONS);
    expect(metrics.length).toBe(4);
    expect(metrics[0].role).toBe("PRIMARY_WRITER");
    expect(metrics[0].replicationLagMs).toBe(0);

    const euRegion = metrics.find((r) => r.regionCode === "eu-central-1");
    expect(euRegion).toBeDefined();
    expect(euRegion!.replicationLagMs).toBeGreaterThan(145);
  });

  it("should simulate zero-data-loss cross-region failover", () => {
    const failover = simulateFailoverEvent("us-east-1", "eu-central-1");
    expect(failover.previousPrimary).toBe("us-east-1");
    expect(failover.newPrimary).toBe("eu-central-1");
    expect(failover.dataLossBytes).toBe(0);
    expect(failover.status).toBe("SUCCESSFUL_FAILOVER");
  });
});
