// Master Enterprise Consolidation & Health Score Engine (Phase 7)
import { DBInstance, CostRecommendation, SlowQuery } from "./mockTelemetry";

export interface AccountHealthMetrics {
  healthScore: number; // 0 - 100
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  statusText: string;
  totalInstances: number;
  unmaskedPiiRiskCount: number;
  highCpuCount: number;
  totalIdentifiedSavingsMonthly: number;
}

export interface CostCenterFilterGroup {
  tag: string;
  count: number;
}

/**
 * Calculates overall Account Database Health Score (0 - 100)
 */
export function calculateAccountHealthScore(
  instances: DBInstance[],
  recommendations: CostRecommendation[],
  slowQueries: SlowQuery[],
  isMaskingActive: boolean
): AccountHealthMetrics {
  if (!instances || instances.length === 0) {
    return {
      healthScore: 100,
      grade: "A+",
      statusText: "Optimal Health — Zero Databases Monitored",
      totalInstances: 0,
      unmaskedPiiRiskCount: 0,
      highCpuCount: 0,
      totalIdentifiedSavingsMonthly: 0,
    };
  }

  let penalty = 0;

  // CPU Load penalty (> 80% CPU penalty)
  const highCpuInstances = instances.filter((i) => i.cpuLoad > 80);
  penalty += highCpuInstances.length * 12;

  // Unmasked PII Risk penalty
  const unmaskedPiiRiskCount = !isMaskingActive ? slowQueries.length : 0;
  penalty += unmaskedPiiRiskCount * 5;

  // Unoptimized query penalty
  const slowQueryPenalty = Math.min(slowQueries.length * 3, 20);
  penalty += slowQueryPenalty;

  const healthScore = Math.max(0, Math.min(100, 100 - penalty));

  let grade: "A+" | "A" | "B" | "C" | "D" | "F" = "A+";
  if (healthScore >= 95) grade = "A+";
  else if (healthScore >= 85) grade = "A";
  else if (healthScore >= 75) grade = "B";
  else if (healthScore >= 65) grade = "C";
  else if (healthScore >= 50) grade = "D";
  else grade = "F";

  const totalIdentifiedSavingsMonthly = recommendations.reduce((sum, r) => sum + Math.abs(r.costDelta), 0);

  let statusText = "Optimal Database Performance & Cost Efficiency";
  if (healthScore < 70) {
    statusText = "High Risk: Elevated CPU Load or Parameter Masking Inactive";
  } else if (healthScore < 90) {
    statusText = "Good Condition: Unoptimized Slow Queries Detected";
  }

  return {
    healthScore,
    grade,
    statusText,
    totalInstances: instances.length,
    unmaskedPiiRiskCount,
    highCpuCount: highCpuInstances.length,
    totalIdentifiedSavingsMonthly,
  };
}

/**
 * Extracts unique cost center tags from DB instances
 */
export function getAvailableCostCenterTags(instances: DBInstance[]): string[] {
  const tagsSet = new Set<string>();
  tagsSet.add("ALL_TAGS");

  for (const inst of instances) {
    if (inst.projectTag) {
      tagsSet.add(inst.projectTag);
    }
  }

  return Array.from(tagsSet);
}

/**
 * Filters database instances by target cost center tag
 */
export function filterInstancesByCostCenter(
  instances: DBInstance[],
  targetTag: string
): DBInstance[] {
  if (!targetTag || targetTag === "ALL_TAGS") {
    return instances;
  }

  return instances.filter((i) => i.projectTag === targetTag);
}

/**
 * Aggregates all DB instances across all AWS sub-accounts for "ALL_ACCOUNTS" selection
 */
export function getAggregatedMultiAccountInstances(
  allInstances: DBInstance[],
  selectedAccountId: string
): DBInstance[] {
  if (selectedAccountId === "ALL_ACCOUNTS") {
    return allInstances;
  }

  return allInstances.filter((i) => i.accountId === selectedAccountId);
}
