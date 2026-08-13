// Account Settings & Subscription Billing Engine (Phase 6)

export type TierType = "trial" | "small" | "medium" | "enterprise";

export interface UserAppPreferences {
  theme: "dark" | "light" | "system";
  telemetryRefreshIntervalMs: number; // 5000, 15000, 30000
  notificationFrequency: "immediate" | "daily_digest" | "weekly_summary";
  defaultLandingView: "dashboard" | "topology" | "slow_queries";
  timezone: string;
}

export interface LinkedAwsAccount {
  id: string;
  accountName: string;
  roleArn: string;
  externalId: string;
  region: string;
  status: "active" | "testing" | "error";
  monitoredServices: string[]; // e.g. ["sales-db-prod", "analytics-aurora-cluster"]
}

export interface TierPricingPlan {
  tier: TierType;
  name: string;
  monthlyPrice: number;
  maxInstances: number; // -1 for unlimited
  features: string[];
}

export const TIER_PRICING_PLANS: Record<TierType, TierPricingPlan> = {
  trial: {
    tier: "trial",
    name: "7-Day Free Trial",
    monthlyPrice: 0,
    maxInstances: 2,
    features: [
      "Max 2 DB Instances",
      "Basic Performance Insights",
      "Daily Slow Query Digest",
      "Sandbox Demo Simulator",
    ],
  },
  small: {
    tier: "small",
    name: "Small Business",
    monthlyPrice: 59,
    maxInstances: 5,
    features: [
      "Max 5 DB Instances",
      "Standard Cost Recommendations",
      "Standard Email Alerts",
      "Parameter Masking Protection",
    ],
  },
  medium: {
    tier: "medium",
    name: "Medium Business",
    monthlyPrice: 179,
    maxInstances: 15,
    features: [
      "Max 15 DB Instances",
      "Real-Time Log Streaming",
      "Automated EXPLAIN Index Advisor",
      "RDS Proxy & Multi-Region Latency",
    ],
  },
  enterprise: {
    tier: "enterprise",
    name: "Enterprise",
    monthlyPrice: 499,
    maxInstances: -1, // Unlimited
    features: [
      "Unlimited DB Instances",
      "Custom Anomaly Thresholds (EMA)",
      "Cross-Account IAM Vault",
      "Slack / PagerDuty Webhooks",
      "SOC2 / HIPAA Compliance Exporter",
    ],
  },
};

export interface SubscriptionBillingState {
  currentTier: TierType;
  billingProvider: "aws_marketplace" | "stripe_portal";
  paymentMethodMasked: string; // e.g. "AWS Invoice (Account 123456789012)" or "Visa ending in 4242"
  nextBillingDate: string;
  autoRenew: boolean;
}

export const INITIAL_APP_PREFERENCES: UserAppPreferences = {
  theme: "dark",
  telemetryRefreshIntervalMs: 5000,
  notificationFrequency: "immediate",
  defaultLandingView: "dashboard",
  timezone: "UTC (GMT+00:00)",
};

export const INITIAL_LINKED_AWS_ACCOUNTS: LinkedAwsAccount[] = [
  {
    id: "123456789012",
    accountName: "Production Primary",
    roleArn: "arn:aws:iam::123456789012:role/RDSSentinelMonitoringRole",
    externalId: "ext-prod-9401-sec",
    region: "us-east-1",
    status: "active",
    monitoredServices: ["sales-db-prod", "analytics-aurora-cluster", "billing-db-replica"],
  },
  {
    id: "987654321098",
    accountName: "Staging & Dev",
    roleArn: "arn:aws:iam::987654321098:role/RDSSentinelStagingRole",
    externalId: "ext-stg-3320-dev",
    region: "us-west-2",
    status: "active",
    monitoredServices: ["staging-mysql-dev"],
  },
];

/**
 * Calculates prorated cost delta when switching subscription tiers
 */
export function calculateTierProration(
  currentTier: TierType,
  targetTier: TierType
): { priceDeltaMonthly: number; textSummary: string } {
  const currentPlan = TIER_PRICING_PLANS[currentTier];
  const targetPlan = TIER_PRICING_PLANS[targetTier];

  const priceDeltaMonthly = targetPlan.monthlyPrice - currentPlan.monthlyPrice;

  if (priceDeltaMonthly > 0) {
    return {
      priceDeltaMonthly,
      textSummary: `+$${priceDeltaMonthly}.00/mo prorated increase`,
    };
  } else if (priceDeltaMonthly < 0) {
    return {
      priceDeltaMonthly,
      textSummary: `-$${Math.abs(priceDeltaMonthly)}.00/mo prorated credit`,
    };
  } else {
    return {
      priceDeltaMonthly: 0,
      textSummary: "No price change (same plan)",
    };
  }
}

/**
 * Verifies if the requested database instance count fits within the target subscription tier
 */
export function checkInstanceCapacity(
  instanceCount: number,
  targetTier: TierType
): { allowed: boolean; maxAllowed: number; message: string } {
  const targetPlan = TIER_PRICING_PLANS[targetTier];

  if (targetPlan.maxInstances === -1 || instanceCount <= targetPlan.maxInstances) {
    return {
      allowed: true,
      maxAllowed: targetPlan.maxInstances,
      message: `Capacity OK (${instanceCount}/${targetPlan.maxInstances === -1 ? "Unlimited" : targetPlan.maxInstances} instances used)`,
    };
  }

  return {
    allowed: false,
    maxAllowed: targetPlan.maxInstances,
    message: `Instance Cap Exceeded! Plan max is ${targetPlan.maxInstances}, but you are monitoring ${instanceCount} instances. Upgrade required.`,
  };
}

/**
 * Simulates testing an AWS STS AssumeRole connection for a cross-account role
 */
export function testIamRoleConnection(
  roleArn: string,
  externalId: string
): { success: boolean; latencyMs: number; message: string } {
  if (!roleArn.startsWith("arn:aws:iam::") || !roleArn.includes(":role/")) {
    return {
      success: false,
      latencyMs: 0,
      message: "Invalid Role ARN format. Must follow arn:aws:iam::<AccountId>:role/<RoleName>",
    };
  }

  if (!externalId || externalId.length < 5) {
    return {
      success: false,
      latencyMs: 0,
      message: "Invalid ExternalId. Cryptographic token must be at least 5 characters.",
    };
  }

  const accountIdMatch = roleArn.match(/arn:aws:iam::(\d{12}):role/);
  const accountId = accountIdMatch ? accountIdMatch[1] : "Unknown";

  return {
    success: true,
    latencyMs: 42,
    message: `STS AssumeRole Successful! Authenticated via ExternalId to AWS Account ${accountId} in 42ms.`,
  };
}
