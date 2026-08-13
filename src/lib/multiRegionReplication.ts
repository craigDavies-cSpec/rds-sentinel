// Multi-Region Database Replication & Latency Engine (Phase 11C)

export interface RegionReplicationStatus {
  regionCode: string;
  regionName: string;
  role: "PRIMARY_WRITER" | "READ_REPLICA" | "DISASTER_RECOVERY";
  replicationLagMs: number;
  dataTransferRateGb: number;
  monthlyTransferCostEstUsd: number;
  failoverReadiness: "OPTIMAL" | "READY" | "DEGRADED";
}

export interface FailoverSimulationResult {
  previousPrimary: string;
  newPrimary: string;
  failoverDurationMs: number;
  dataLossBytes: number;
  status: "SUCCESSFUL_FAILOVER";
  timestamp: string;
}

export const INITIAL_REGIONS: RegionReplicationStatus[] = [
  {
    regionCode: "us-east-1",
    regionName: "N. Virginia (Primary)",
    role: "PRIMARY_WRITER",
    replicationLagMs: 0,
    dataTransferRateGb: 142.5,
    monthlyTransferCostEstUsd: 28.5,
    failoverReadiness: "OPTIMAL",
  },
  {
    regionCode: "eu-central-1",
    regionName: "Frankfurt (Cross-Region)",
    role: "READ_REPLICA",
    replicationLagMs: 145,
    dataTransferRateGb: 88.2,
    monthlyTransferCostEstUsd: 17.6,
    failoverReadiness: "READY",
  },
  {
    regionCode: "ap-northeast-1",
    regionName: "Tokyo (Disaster Recovery)",
    role: "DISASTER_RECOVERY",
    replicationLagMs: 220,
    dataTransferRateGb: 45.0,
    monthlyTransferCostEstUsd: 9.0,
    failoverReadiness: "READY",
  },
  {
    regionCode: "sa-east-1",
    regionName: "São Paulo (Edge Replica)",
    role: "READ_REPLICA",
    replicationLagMs: 310,
    dataTransferRateGb: 18.4,
    monthlyTransferCostEstUsd: 3.6,
    failoverReadiness: "DEGRADED",
  },
];

/**
 * Computes dynamic replication lag and transfer cost metrics based on network load
 */
export function calculateReplicationMetrics(
  networkLoadPct: number = 50,
  regions: RegionReplicationStatus[] = INITIAL_REGIONS
): RegionReplicationStatus[] {
  const loadMultiplier = 1 + (networkLoadPct - 50) / 100;

  return regions.map((r) => {
    if (r.role === "PRIMARY_WRITER") return r;

    const baseLag = r.regionCode === "eu-central-1" ? 145 : r.regionCode === "ap-northeast-1" ? 220 : 310;
    const replicationLagMs = Math.round(baseLag * loadMultiplier);
    const failoverReadiness = replicationLagMs < 200 ? "OPTIMAL" : replicationLagMs < 300 ? "READY" : "DEGRADED";

    return {
      ...r,
      replicationLagMs,
      failoverReadiness,
    };
  });
}

/**
 * Simulates Aurora / RDS Global Database failover event between regions
 */
export function simulateFailoverEvent(
  currentPrimary: string = "us-east-1",
  targetSecondary: string = "eu-central-1"
): FailoverSimulationResult {
  return {
    previousPrimary: currentPrimary,
    newPrimary: targetSecondary,
    failoverDurationMs: Math.floor(1800 + Math.random() * 600), // ~1.8s to 2.4s failover
    dataLossBytes: 0, // Zero Data Loss (RPO = 0)
    status: "SUCCESSFUL_FAILOVER",
    timestamp: new Date().toISOString(),
  };
}
