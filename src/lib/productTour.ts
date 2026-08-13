// Guided Interactive Product Tour Engine for Demo & Client Onboarding

export interface TourStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  targetElementId: string; // DOM element ID or CSS selector to highlight
  position: "bottom" | "top" | "left" | "right";
  badgeText: string;
}

export const PRODUCT_TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: "Multi-AWS Account Selector",
    subtitle: "Step 1 of 6 — Enterprise AWS Organizations",
    description: "Switch seamlessly between Production and Staging AWS Accounts. In Phase 6, selecting 'All AWS Accounts' aggregates metrics across your entire enterprise organization.",
    targetElementId: "#aws-account-selector",
    position: "bottom",
    badgeText: "Multi-Account",
  },
  {
    id: 2,
    title: "Instance Telemetry & CPU Simulator",
    subtitle: "Step 2 of 6 — Dynamic Scrapers",
    description: "Monitor real-time CPU utilization, IOPS, and connection pools. Drag the CPU Simulator slider to simulate load spikes and watch dynamic telemetry scrapers accelerate 3x.",
    targetElementId: "#cpu-simulator-slider",
    position: "right",
    badgeText: "Real-Time Telemetry",
  },
  {
    id: 3,
    title: "AWS Bill ROI Savings Calculator",
    subtitle: "Step 3 of 6 — Financial ROI Proof",
    description: "Drag the database instance slider to calculate your net financial return. At $145/mo savings per DB instance, RDS Sentinel delivers up to 8.1x Net ROI.",
    targetElementId: "#roi-db-slider",
    position: "top",
    badgeText: "Net Financial ROI",
  },
  {
    id: 4,
    title: "Aurora Cluster Topology Visualizer",
    subtitle: "Step 4 of 6 — Cluster High-Availability",
    description: "Interactive visual node graph mapping primary writers, in-region read replicas, and cross-region replicas. Click any node to inspect promotion priority and 98.5% failover readiness.",
    targetElementId: "#topology-visualizer-card",
    position: "top",
    badgeText: "Topology Visualizer",
  },
  {
    id: 5,
    title: "Automated Index & Query Optimization Advisor",
    subtitle: "Step 5 of 6 — 1-Click DDL Fixes",
    description: "Captured slow query logs are automatically analyzed by our EXPLAIN engine. Click 'Analyze & Suggest Index' to generate production CREATE INDEX statements with estimated 99.8% speedup.",
    targetElementId: "#slow-query-inspector-card",
    position: "top",
    badgeText: "EXPLAIN Engine",
  },
  {
    id: 6,
    title: "Enterprise Webhooks & Audit CSV Export",
    subtitle: "Step 6 of 6 — Enterprise Integrations",
    description: "Dispatch live Slack Block Kit and PagerDuty Events v2 alerts during database anomalies. One-click Export CSV generates sanitized audit reports for CISO compliance.",
    targetElementId: "#webhook-simulator-card",
    position: "top",
    badgeText: "Integrations & Audit",
  },
];

/**
 * Checks if tour has been completed previously in user's browser localStorage
 */
export function isTourCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("rds_sentinel_tour_completed") === "true";
}

/**
 * Sets tour completed state in browser localStorage
 */
export function markTourCompleted(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rds_sentinel_tour_completed", "true");
}

/**
 * Resets tour state to allow re-running the tour
 */
export function resetTourState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rds_sentinel_tour_completed");
}
