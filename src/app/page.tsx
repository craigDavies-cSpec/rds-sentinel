"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  MOCK_INSTANCES, 
  MOCK_RECOMMENDATIONS, 
  MOCK_SLOW_QUERIES, 
  MOCK_LOGS, 
  DBInstance,
  CostRecommendation
} from "@/lib/mockTelemetry";
import { maskSQLQuery, maskLogLine } from "@/lib/logSanitizer";
import { calculateNextIntervalMs, TelemetryOutboxQueue } from "@/lib/dynamicTelemetry";
import { getLayoutAction, saveLayoutAction } from "./actions";
import { exportCSVReport } from "@/lib/reportExporter";
import { dispatchWebhookAlert, WebhookDispatchResult } from "@/lib/webhookSimulator";
import { analyzeSlowQuery, IndexRecommendation } from "@/lib/indexAdvisor";
import { getClusterTopology, ClusterNode, ClusterTopologyData } from "@/lib/clusterTopology";
import { PRODUCT_TOUR_STEPS, TourStep, isTourCompleted, markTourCompleted, resetTourState } from "@/lib/productTour";
import { generateComplianceReport, downloadCompliancePackage } from "@/lib/complianceExporter";
import {
  UserAppPreferences,
  LinkedAwsAccount,
  TIER_PRICING_PLANS,
  INITIAL_APP_PREFERENCES,
  INITIAL_LINKED_AWS_ACCOUNTS,
  calculateTierProration,
  checkInstanceCapacity,
  testIamRoleConnection,
  TierType,
} from "@/lib/accountSettings";
import {
  calculateAccountHealthScore,
  getAvailableCostCenterTags,
  filterInstancesByCostCenter,
  getAggregatedMultiAccountInstances,
} from "@/lib/enterpriseConsolidation";
import {
  scanAwsOrganizationsForDatabases,
  generateHipaaBaaAgreement,
  HipaaBaaAgreement,
} from "@/lib/agentBacklogEnhancements";
import { t, LanguageCode, SUPPORTED_LANGUAGES } from "@/lib/localization";
import { AccentTheme, ACCENT_THEMES } from "@/lib/themeAccent";
import { evaluateControlTowerGuardrails } from "@/lib/controlTower";
import { validateMfaToken } from "@/lib/securityControlMonitor";
import { WebSocketStreamListener, WebSocketTelemetryPacket } from "@/lib/webSocketStream";
import { queryGraphQLTelemetry } from "@/lib/graphQLResolver";
import { injectChaosLatency } from "@/lib/chaosNetwork";
import {
  generateCloudFormationRoleTemplate,
  generateServiceCatalogBlueprint,
  downloadTemplateFile,
} from "@/lib/cloudFormationExporter";
import {
  ApiKey,
  INITIAL_API_KEYS,
  generateApiKey,
  revokeApiKey,
} from "@/lib/apiKeyManager";
import {
  generateAuditEvidencePackage,
  downloadAuditEvidencePackageFile,
  AuditEvidencePackage,
} from "@/lib/auditEvidenceExporter";
import {
  generateTerraformModule,
  downloadTerraformFile,
} from "@/lib/terraformExporter";
import {
  calculateReplicationMetrics,
  simulateFailoverEvent,
  INITIAL_REGIONS,
  RegionReplicationStatus,
} from "@/lib/multiRegionReplication";

// Initialize the telemetry outbox queue
const outbox = new TelemetryOutboxQueue();

export default function Dashboard() {
  // Subscription tier state: gates dashboard features
  const [tier, setTier] = useState<"trial" | "small" | "medium" | "enterprise">("medium");
  
  // Dark/Light Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Active database instance selection
  const [selectedDbId, setSelectedDbId] = useState<string>("db-prod-aurora");
  const [instances, setInstances] = useState<DBInstance[]>(MOCK_INSTANCES);
  const [selectedDb, setSelectedDb] = useState<DBInstance>(MOCK_INSTANCES[0]);

  // Transition skeleton loading state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // SQL Masking toggle state
  const [maskSql, setMaskSql] = useState(true);

  // Simulated Outbox Queue state (from dynamicTelemetry)
  const [outboxStatus, setOutboxStatus] = useState(outbox.getStatus());
  const [isDbEndpointOnline, setIsDbEndpointOnline] = useState(true);
  const [customIngestionUrl, setCustomIngestionUrl] = useState("");

  const [layoutOrder, setLayoutOrder] = useState<string[]>([
    "databases",
    "balancer",
    "logs"
  ]);

  // Fetch saved layout configuration on mount
  useEffect(() => {
    const loadLayout = async () => {
      const persisted = await getLayoutAction();
      const validPanels = ["databases", "balancer", "logs"];
      const filtered = persisted.filter(p => validPanels.includes(p));
      if (filtered.length === validPanels.length) {
        setLayoutOrder(filtered);
      }
    };
    loadLayout();
  }, []);

  const moveLeft = async (panelId: string) => {
    const idx = layoutOrder.indexOf(panelId);
    if (idx <= 0) return;
    const newOrder = [...layoutOrder];
    [newOrder[idx], newOrder[idx - 1]] = [newOrder[idx - 1], newOrder[idx]];
    setLayoutOrder(newOrder);
    await saveLayoutAction(newOrder);
  };

  const moveRight = async (panelId: string) => {
    const idx = layoutOrder.indexOf(panelId);
    if (idx < 0 || idx >= layoutOrder.length - 1) return;
    const newOrder = [...layoutOrder];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    setLayoutOrder(newOrder);
    await saveLayoutAction(newOrder);
  };

  // Real-time ticking telemetry simulation
  const [tickCount, setTickCount] = useState(0);

  // Memory Cap (Developer Agent Audit): Store limited history in state (max 50)
  const [cpuHistory, setCpuHistory] = useState<Record<string, number[]>>({
    "db-prod-aurora": [65, 68, 70, 72, 75, 71, 69, 74, 76, 70, 68, 72, 75, 73, 71, 69, 72, 74, 76, 71, 70, 73, 72, 70],
    "db-billing-rds": [25, 28, 24, 22, 26, 28, 30, 27, 25, 29, 28, 26, 24, 27, 29, 25, 28, 26, 24, 28, 27, 25, 29, 28],
    "db-dev-sandbox": [10, 12, 11, 9, 10, 12, 11, 10, 9, 12, 11, 10, 12, 9, 11, 10, 12, 11, 9, 10, 12, 11, 10, 12],
    "db-analytics-aurora": [45, 48, 50, 47, 46, 49, 51, 48, 46, 50, 48, 47, 45, 49, 51, 47, 46, 49, 48, 50, 47, 46, 49, 45],
  });

  // Interactive CPU sparkline hover tooltip state
  const [hoveredSample, setHoveredSample] = useState<{ index: number; value: number } | null>(null);

  // Multi-AWS Account Selector state
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  // Phase 7: Master Enterprise Consolidation state
  const [appMode, setAppMode] = useState<"mode_a" | "mode_b">("mode_a");
  const [selectedCostCenterTag, setSelectedCostCenterTag] = useState<string>("ALL_TAGS");

  // AWS ROI Calculator Slider state
  const [roiDbCount, setRoiDbCount] = useState<number>(10);

  // Filtered instances based on selected AWS account & Cost Center Tag
  const filteredInstances = useMemo(() => {
    let list = getAggregatedMultiAccountInstances(instances, selectedAccountId === "all" || selectedAccountId === "ALL_ACCOUNTS" ? "ALL_ACCOUNTS" : selectedAccountId);
    return filterInstancesByCostCenter(list, selectedCostCenterTag);
  }, [instances, selectedAccountId, selectedCostCenterTag]);

  const availableTags = useMemo(() => {
    return getAvailableCostCenterTags(instances);
  }, [instances]);

  const healthMetrics = useMemo(() => {
    return calculateAccountHealthScore(filteredInstances, MOCK_RECOMMENDATIONS, MOCK_SLOW_QUERIES, maskSql);
  }, [filteredInstances, maskSql]);

  // Auto-switch selected DB if current selected DB is filtered out by AWS Account selector
  useEffect(() => {
    if (filteredInstances.length > 0 && !filteredInstances.some(db => db.id === selectedDbId)) {
      setSelectedDbId(filteredInstances[0].id);
    }
  }, [filteredInstances, selectedDbId]);

  // Active selected Index Advisor recommendation state
  const [activeAdvisorQueryId, setActiveAdvisorQueryId] = useState<string | null>(null);
  const [copiedDdlQueryId, setCopiedDdlQueryId] = useState<string | null>(null);

  // Phase 3: Cluster Topology Visualizer state
  const [selectedTopologyNode, setSelectedTopologyNode] = useState<ClusterNode | null>(null);
  const topologyData = useMemo(() => getClusterTopology(selectedAccountId), [selectedAccountId]);

  // Phase 4: Guided Product Tour state
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [currentTourStepIndex, setCurrentTourStepIndex] = useState<number>(0);

  // Subscription Tier Upgrade & Billing Modal state
  const [isTierModalOpen, setIsTierModalOpen] = useState<boolean>(false);
  const [pendingTier, setPendingTier] = useState<TierType>("medium");

  const handleTierClick = (targetTier: TierType) => {
    if (targetTier === tier) return;
    setPendingTier(targetTier);
    setIsTierModalOpen(true);
  };

  // Interactive Product Tour Spotlight Auto-Scroll & Highlight Engine
  useEffect(() => {
    if (!isTourActive) {
      if (typeof document !== "undefined") {
        document.querySelectorAll(".tour-spotlight-active").forEach((el) => el.classList.remove("tour-spotlight-active"));
      }
      return;
    }

    const step = PRODUCT_TOUR_STEPS[currentTourStepIndex];
    if (step && step.targetElementId && typeof document !== "undefined") {
      document.querySelectorAll(".tour-spotlight-active").forEach((el) => el.classList.remove("tour-spotlight-active"));
      const targetEl = document.querySelector(step.targetElementId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        targetEl.classList.add("tour-spotlight-active");
      }
    }
  }, [isTourActive, currentTourStepIndex]);

  // Phase 6: Account Settings & Subscription Billing Portal state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<"preferences" | "aws_accounts" | "billing" | "security">("preferences");
  const [appPreferences, setAppPreferences] = useState<UserAppPreferences>(INITIAL_APP_PREFERENCES);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAwsAccount[]>(INITIAL_LINKED_AWS_ACCOUNTS);
  const [iamTestResult, setIamTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [testRoleArn, setTestRoleArn] = useState<string>("arn:aws:iam::123456789012:role/RDSSentinelRole");
  const [testExtId, setTestExtId] = useState<string>("ext-prod-9401-sec");

  // Phase 8: Post-Launch Agent Backlog Enhancements state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hipaaBaa, setHipaaBaa] = useState<HipaaBaaAgreement | null>(null);
  const [autoDiscoveredCount, setAutoDiscoveredCount] = useState<number | null>(null);

  // Phase 9A: Enterprise Localization & UX Personalization state
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [accentTheme, setAccentTheme] = useState<AccentTheme>("aws_orange");

  // Phase 9B: Advanced AWS Governance & Security state
  const [isMfaModalOpen, setIsMfaModalOpen] = useState<boolean>(false);
  const [pendingTierChange, setPendingTierChange] = useState<TierType | null>(null);
  const [mfaCodeInput, setMfaCodeInput] = useState<string>("");
  const [mfaErrorMsg, setMfaErrorMsg] = useState<string | null>(null);

  // Phase 9C: Real-Time Stream Engine & Developer API state
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  const [wsPacket, setWsPacket] = useState<WebSocketTelemetryPacket | null>(null);
  const [isGraphQLModalOpen, setIsGraphQLModalOpen] = useState<boolean>(false);
  const [graphQLQuery, setGraphQLQuery] = useState<string>("query {\n  getInstances {\n    id\n    name\n    cpuLoad\n  }\n}");
  const [graphQLResult, setGraphQLResult] = useState<string>("");

  // Phase 10B: API Key & Rate-Limiting Control Panel state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [newKeyNameInput, setNewKeyNameInput] = useState<string>("");
  const [newKeyRateLimit, setNewKeyRateLimit] = useState<number>(1000);
  const [showFullKeys, setShowFullKeys] = useState<boolean>(false);

  // Phase 11A: Interactive Audit Evidence Inspector Drawer state
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState<boolean>(false);
  const [activeEvidencePkg, setActiveEvidencePkg] = useState<AuditEvidencePackage | null>(null);

  // Phase 11C: Multi-Region Database Replication state
  const [regions, setRegions] = useState<RegionReplicationStatus[]>(INITIAL_REGIONS);

  const controlTowerAudit = useMemo(() => evaluateControlTowerGuardrails(instances), [instances]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Pre-Launch UI/UX Polish: Global Keyboard Escape Key Listener for Modals & Drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsModalOpen(false);
        setIsMfaModalOpen(false);
        setIsGraphQLModalOpen(false);
        setIsEvidenceDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Option B: Webhook Dispatch Simulator state
  const [webhookTarget, setWebhookTarget] = useState<"slack" | "pagerduty">("slack");
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/T00000000/B00000000/XXXXX");
  const [webhookResult, setWebhookResult] = useState<WebhookDispatchResult | null>(null);
  const [isDispatchingWebhook, setIsDispatchingWebhook] = useState(false);

  const handleSendWebhook = async () => {
    setIsDispatchingWebhook(true);
    const result = await dispatchWebhookAlert(
      webhookTarget,
      webhookUrl,
      selectedDb.name,
      "CPU Utilization Spike (> 85%)",
      `Database ${selectedDb.name} CPU utilization spiked to ${selectedDb.cpuLoad}%. Immediate inspection required.`
    );
    setWebhookResult(result);
    setIsDispatchingWebhook(false);
  };

  // Synchronize document theme class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle DB selection change with a visual skeleton transition (UI/UX Agent Audit)
  const handleSelectDb = (dbId: string) => {
    if (dbId === selectedDbId) return;
    setIsTransitioning(true);
    setSelectedDbId(dbId);
    
    // Simulate minor network fetch delay (500ms) for telemetry query
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleCpuSliderChange = (newCpu: number) => {
    setInstances((prev) =>
      prev.map((inst) => (inst.id === selectedDb.id ? { ...inst, cpuLoad: newCpu } : inst))
    );
    setSelectedDb((prev) => ({ ...prev, cpuLoad: newCpu }));
    setCpuHistory(prev => {
      const currentHistory = prev[selectedDb.id] || [];
      const updatedHistory = [...currentHistory, newCpu].slice(-50);
      return { ...prev, [selectedDb.id]: updatedHistory };
    });
  };

  const handleResetCpuToBaseline = (dbId: string) => {
    const seed = MOCK_INSTANCES.find((d) => d.id === dbId);
    const baselineCpu = seed ? seed.cpuLoad : 20;
    setInstances((prev) =>
      prev.map((inst) => (inst.id === dbId ? { ...inst, cpuLoad: baselineCpu } : inst))
    );
    setSelectedDb((prev) => (prev.id === dbId ? { ...prev, cpuLoad: baselineCpu } : prev));
    showToast(`🔄 CPU load for ${selectedDb.name} reset to baseline (${baselineCpu}%)!`);
  };

  const handleResetAllSimulators = () => {
    setInstances(MOCK_INSTANCES);
    setSelectedDb(MOCK_INSTANCES[0]);
    setIsDbEndpointOnline(true);
    outbox.resetCircuitBreaker();
    setRoiDbCount(10);
    setMaskSql(true);
    showToast("🔄 All telemetry load spikes, circuit breakers, and sliders reset to live baseline!");
  };

  // Telemetry loop to simulate real-time metrics drifting slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setInstances(prev => {
        const nextInstances = prev.map(db => {
          // Add random drift to CPU load (-4% to +4%)
          const cpuDrift = (Math.random() - 0.5) * 8;
          const newCpu = Math.max(5, Math.min(99, Math.round(db.cpuLoad + cpuDrift)));
          
          // Connections drift
          const connDrift = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const newConn = Math.max(1, Math.round(db.connections + connDrift));

          // IOPS drift proportional to CPU
          const newIops = Math.round(newCpu * (db.iops / db.cpuLoad) * (0.9 + Math.random() * 0.2));

          return {
            ...db,
            cpuLoad: newCpu,
            connections: newConn,
            iops: newIops
          };
        });

        // Update CPU history (Developer Agent Audit - Clamped to max 50 entries)
        setCpuHistory(history => {
          const updated = { ...history };
          nextInstances.forEach(db => {
            const list = history[db.id] || [];
            // Append new value and slice last 50 elements (hard boundary cap)
            updated[db.id] = [...list, db.cpuLoad].slice(-50);
          });
          return updated;
        });

        return nextInstances;
      });

      setTickCount(prev => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update selected DB reference when instances data drifts
  useEffect(() => {
    const updated = instances.find(db => db.id === selectedDbId);
    if (updated) {
      setSelectedDb(updated);
    }
  }, [instances, selectedDbId]);

  // Queue simulation logic
  useEffect(() => {
    const runQueueSimulation = async () => {
      // Enqueue mock telemetry
      outbox.enqueue({
        instanceId: selectedDb.id,
        timestamp: new Date().toISOString(),
        metrics: {
          cpu: selectedDb.cpuLoad,
          connections: selectedDb.connections,
          iops: selectedDb.iops,
          freeStorageBytes: selectedDb.freeStorageGb * 1024 * 1024 * 1024
        }
      });

      // Process telemetry payload queue based on connection state
      await outbox.processQueue(async (payload) => {
        if (!isDbEndpointOnline) {
          return false;
        }

        const ingestionUrl = customIngestionUrl || process.env.NEXT_PUBLIC_INGESTION_URL;
        if (ingestionUrl) {
          try {
            const isInvokeApi = ingestionUrl.includes("/invocations");
            const requestBody = isInvokeApi 
              ? JSON.stringify({ body: JSON.stringify(payload) })
              : JSON.stringify(payload);

            console.log("Telemetry outbox sending fetch to URL:", ingestionUrl, "with body:", requestBody);
            const res = await fetch(ingestionUrl, {
              method: "POST",
              headers: { "Content-Type": "text/plain" },
              body: requestBody
            });
            console.log("Telemetry outbox fetch response status:", res.status);
            return res.ok;
          } catch (e) {
            console.error("Telemetry ingest post failed:", e);
            return false;
          }
        }

        return true;
      });

      setOutboxStatus(outbox.getStatus());
    };

    runQueueSimulation();
  }, [tickCount, isDbEndpointOnline, selectedDb, customIngestionUrl]);

  // Account-dynamic filtering for recommendations, slow queries, logs, and base DB cost
  const filteredRecommendations = useMemo(() => {
    const activeDbIds = new Set(filteredInstances.map((d) => d.id));
    return MOCK_RECOMMENDATIONS.filter((rec) => activeDbIds.has(rec.dbInstanceId));
  }, [filteredInstances]);

  const activeRecommendations = useMemo(() => {
    return filteredRecommendations.filter((rec) => {
      if (tier === "trial") return rec.type === "downsize";
      if (tier === "small") return rec.type === "downsize" || rec.type === "serverless";
      return true;
    });
  }, [filteredRecommendations, tier]);

  const totalCost = useMemo(() => {
    return filteredInstances.reduce((sum, inst) => {
      if (inst.class.includes("2xlarge")) return sum + 540;
      if (inst.class.includes("xlarge")) return sum + 270;
      if (inst.class.includes("medium")) return sum + 70;
      if (inst.class.includes("micro")) return sum + 14;
      return sum + 100;
    }, 0);
  }, [filteredInstances]);

  const filteredSlowQueries = useMemo(() => {
    const activeDbIds = new Set(filteredInstances.map((d) => d.id));
    return MOCK_SLOW_QUERIES.filter((q) => activeDbIds.has(q.dbInstanceId));
  }, [filteredInstances]);

  const filteredLogs = useMemo(() => {
    const activeDbIds = new Set(filteredInstances.map((d) => d.id));
    return MOCK_LOGS.filter((l) => activeDbIds.has(l.dbInstanceId));
  }, [filteredInstances]);

  const potentialSavings = activeRecommendations
    .filter(rec => rec.costDelta < 0)
    .reduce((acc, rec) => acc + Math.abs(rec.costDelta), 0);

  // Helper check for tier feature access
  const hasFeature = (feature: "real-time-logs" | "explain-advisor" | "multi-region" | "webhooks") => {
    if (tier === "trial" || tier === "small") return false;
    if (tier === "medium") return feature !== "webhooks"; // Enterprise only gets webhooks
    return true; // Enterprise has everything
  };

  // Helper class for billing active states
  const getBadgeClass = (active: boolean) => 
    active 
      ? "px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400" 
      : "px-2 py-0.5 rounded bg-aws-divider border border-aws-border text-xs text-aws-textSecondary line-through";
  return (
    <div className="min-h-screen bg-aws-lightBg dark:bg-aws-dark transition-colors duration-200">
      {/* 1. Global AWS Header */}
      <header className="sticky top-0 z-40 w-full border-b border-aws-lightBorder dark:border-aws-border bg-aws-lightContainer dark:bg-aws-container shadow-sm">
        {/* Main Top Header Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Left: Brand Logo & Partner Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold tracking-tight">
              <span className="text-aws-orangeHover dark:text-aws-orange font-extrabold text-xl">RDS</span>
              <span className="text-aws-lightTextPrimary dark:text-aws-textPrimary font-semibold text-lg">Sentinel</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-aws-orange/15 text-amber-800 dark:text-aws-orange border border-aws-orange/20 font-bold uppercase tracking-wider hidden sm:inline-block">
              AWS Marketplace Partner
            </span>

            {/* Phase 7: Dual Mode Switcher Toggle */}
            <button
              id="toggle-app-mode-btn"
              onClick={() => setAppMode(appMode === "mode_a" ? "mode_b" : "mode_a")}
              className="px-2 py-0.5 rounded bg-aws-orange/10 hover:bg-aws-orange/20 border border-aws-orange/30 text-amber-900 dark:text-aws-orange text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
              title="Toggle between Mode A (Standalone SaaS Console) and Mode B (AWS Management Console Extension)"
            >
              {appMode === "mode_a" ? "🌐 Mode A: SaaS" : "⚡ Mode B: AWS Extension"}
            </button>
          </div>

          {/* Right: Consolidated Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Phase 4: Guided Product Tour Header Trigger */}
            <button
              id="start-product-tour-btn"
              onClick={() => {
                resetTourState();
                setCurrentTourStepIndex(0);
                setIsTourActive(true);
              }}
              className="text-xs px-2.5 py-1.5 rounded font-bold bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary transition-all shadow flex items-center gap-1 cursor-pointer"
            >
              {t("tourBtn", language)}
            </button>

            {/* Option A: Export CSV Report Button */}
            <button
              onClick={() => exportCSVReport(instances, MOCK_RECOMMENDATIONS, MOCK_SLOW_QUERIES)}
              className="px-2.5 py-1.5 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              title="Export CSV Performance Report"
            >
              {t("exportCsvBtn", language)}
            </button>

            {/* Phase 5: SOC2 / HIPAA Compliance Report Export Button */}
            <button
              id="export-soc2-compliance-btn"
              onClick={() => {
                const report = generateComplianceReport(
                  MOCK_SLOW_QUERIES.map((q) => q.rawSql),
                  maskSql,
                  "AWS Enterprise Customer"
                );
                downloadCompliancePackage(report);
              }}
              className="px-2.5 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              title="Download SOC2 Type II & HIPAA Compliance Package"
            >
              {t("soc2Btn", language)}
            </button>

            {/* Phase 9C: GraphQL Telemetry API Inspector Trigger Button */}
            <button
              id="open-graphql-modal-btn"
              onClick={() => {
                const res = queryGraphQLTelemetry(graphQLQuery);
                setGraphQLResult(JSON.stringify(res, null, 2));
                setIsGraphQLModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              title="Open GraphQL Telemetry Developer API Inspector"
            >
              ⚡ GraphQL API
            </button>

            {/* Phase 6: Account Settings & Subscription Billing Portal Trigger Button */}
            <button
              id="open-settings-modal-btn"
              onClick={() => setIsSettingsModalOpen(true)}
              className="px-2.5 py-1.5 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              title="Open Account Settings & Subscription Billing Portal"
            >
              {t("settingsBtn", language)}
            </button>

            {/* Global Reset All Simulators Button */}
            <button
              id="global-reset-simulators-btn"
              onClick={handleResetAllSimulators}
              className="px-2.5 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-aws-orange text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              title="Reset all CPU load spikes, circuit breakers, and sliders back to live baseline"
            >
              🔄 Reset All Simulators
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Theme"
              className="p-1.5 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange transition-colors cursor-pointer"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Sub-Header Context & Control Strip */}
        <div className="border-t border-aws-lightBorder/60 dark:border-aws-border/60 bg-aws-lightBg/60 dark:bg-aws-dark/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
            {/* Left: AWS Account & Cost Center Tag Filters */}
            <div className="flex items-center gap-3">
              {/* Multi-AWS Account Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary">Account:</span>
                <select
                  id="aws-account-selector"
                  aria-label="Select AWS Account"
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="bg-aws-lightContainer dark:bg-aws-container text-xs font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary p-1 rounded border border-aws-lightBorder dark:border-aws-border cursor-pointer focus:outline-none"
                >
                  <option value="all" className="bg-aws-lightContainer dark:bg-aws-container">🌐 All AWS Accounts ({instances.length} DBs)</option>
                  {linkedAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id} className="bg-aws-lightContainer dark:bg-aws-container">
                      {acc.accountName} ({acc.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Phase 7: Cost Center Tag Filter Bar */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary px-1">Tag:</span>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedCostCenterTag(tag)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                      selectedCostCenterTag === tag
                        ? "bg-aws-orange text-aws-lightTextPrimary shadow-sm"
                        : "bg-aws-lightBg dark:bg-aws-dark text-aws-lightTextSecondary dark:text-aws-textSecondary border border-aws-lightBorder dark:border-aws-border hover:text-aws-orange"
                    }`}
                  >
                    {tag === "ALL_TAGS" ? "All Tags" : tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Key Performance & Subscription Badges */}
            <div className="flex items-center gap-2">
              {/* Phase 7: Account Health Score Badge */}
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-aws-blue/15 border border-aws-blue/30 text-sky-950 dark:text-sky-300 font-mono font-bold text-[11px]">
                <span>🛡️ Health Score:</span>
                <span className="text-sky-950 dark:text-sky-300 font-extrabold">{healthMetrics.healthScore}/100 ({healthMetrics.grade})</span>
              </div>

              {/* Identified Savings Header Badge */}
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-500/20 dark:bg-emerald-500/10 border border-emerald-600/40 text-slate-950 dark:text-emerald-300 font-mono font-bold text-[11px]">
                <span>💰 Savings:</span>
                <span className="text-slate-950 dark:text-emerald-300 font-extrabold">${potentialSavings.toFixed(2)}/mo</span>
              </div>

              {/* Quick Gating Tier Controller */}
              <div id="header-tier-selector" className="flex items-center gap-1 bg-aws-lightContainer dark:bg-aws-container p-0.5 rounded border border-aws-lightBorder dark:border-aws-border">
                <span className="text-[9px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary px-1">Tier:</span>
                {(["trial", "small", "medium", "enterprise"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTierClick(t)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                      tier === t
                        ? "bg-aws-orange text-aws-lightTextPrimary shadow-sm"
                        : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Live AWS Account Connected Banner */}
      {selectedAccountId === "616399034957" && (
        <div id="live-account-active-banner" className="bg-emerald-950/80 border-b border-emerald-500/50 text-emerald-300 px-6 py-2.5 text-xs font-mono font-bold flex flex-wrap items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>🟢 Active Live AWS Account: <strong>cSpec Live AWS Account (616399034957)</strong> in <strong>eu-west-1 (Ireland)</strong></span>
          </div>
          <span className="text-[11px] bg-emerald-900/80 text-emerald-200 px-3 py-1 rounded border border-emerald-400/40">
            Live Monitored DB: free-tier-sandbox-db (RDS PostgreSQL db.t4g.micro)
          </span>
        </div>
      )}

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN: Database Selectors & Health Telemetry */}
        <section className="lg:col-span-1 flex flex-col gap-6" style={{ order: layoutOrder.indexOf("databases") }}>
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider">Target Databases</h2>
              <div className="flex gap-1" data-testid="layout-controls-databases">
                <button
                  onClick={() => moveLeft("databases")}
                  aria-label="Move Databases Left"
                  className="px-1.5 py-0.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-colors"
                >
                  ◀
                </button>
                <button
                  onClick={() => moveRight("databases")}
                  aria-label="Move Databases Right"
                  className="px-1.5 py-0.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-colors"
                >
                  ▶
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {filteredInstances.map(db => {
                const isSelected = db.id === selectedDbId;
                const isTrialRestricted = tier === "trial" && (db.id === "db-dev-sandbox" || db.id === "db-analytics-aurora");
                return (
                  <button
                    key={db.id}
                    disabled={isTrialRestricted}
                    onClick={() => handleSelectDb(db.id)}
                    className={`w-full text-left p-3 rounded-md border transition-all flex flex-col ${
                      isSelected
                        ? "bg-aws-orange/10 border-aws-orange text-aws-lightTextPrimary dark:text-aws-textPrimary"
                        : isTrialRestricted
                        ? "opacity-40 bg-aws-lightBg/50 dark:bg-aws-dark/50 border-transparent cursor-not-allowed"
                        : "bg-aws-lightBg dark:bg-aws-dark border-aws-lightBorder dark:border-aws-border hover:border-aws-orange/40"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <span className="font-bold text-xs truncate max-w-[150px]">{db.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-aws-border text-aws-textSecondary font-mono">
                        {db.engine}
                      </span>
                    </div>
                    <div className="flex justify-between items-center w-full text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                      <span>{db.region.split(" ")[0]}</span>
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${db.cpuLoad > 80 ? "bg-aws-red animate-pulse" : "bg-aws-green"}`} />
                        CPU: {db.cpuLoad}%
                      </span>
                    </div>
                    {isTrialRestricted && (
                      <span className="text-[9px] text-aws-red font-semibold mt-1">🔒 Locked (Trial Cap: 2 DBs)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Database Telemetry Gauges */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4 flex flex-col gap-4">
            <div className="border-b border-aws-lightBorder dark:border-aws-divider pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-aws-lightTextSecondary dark:text-aws-textSecondary">Instance Telemetry</h3>
              <span className="text-lg font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary font-mono">{selectedDb.name}</span>
            </div>

            {isTransitioning ? (
              /* Simulated Telemetry Loading Skeleton (UI/UX Agent Audit) */
              <div className="flex flex-col gap-4 py-2 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="h-3 w-24 bg-aws-lightBg dark:bg-aws-dark/60 rounded" />
                    <div className="h-5 w-full bg-aws-lightBg dark:bg-aws-dark/60 rounded" />
                  </div>
                ))}
                <div className="h-10 w-full bg-aws-lightBg dark:bg-aws-dark/60 rounded mt-2" />
              </div>
            ) : (
              <>
                {/* CPU Load bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>CPU Utilization</span>
                    <span className="font-mono">{selectedDb.cpuLoad}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-aws-lightBg dark:bg-aws-dark rounded-full overflow-hidden border border-aws-lightBorder dark:border-aws-border">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        selectedDb.cpuLoad > 85 ? "bg-aws-red" : selectedDb.cpuLoad > 60 ? "bg-aws-yellow" : "bg-aws-blue"
                      }`}
                      style={{ width: `${selectedDb.cpuLoad}%` }}
                    />
                  </div>

                  {/* Interactive CPU Load Simulator Slider */}
                  <div className="mt-2.5 p-2 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded">
                    <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                      <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase">Simulate Load Spike</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded font-mono ${
                          selectedDb.cpuLoad > 85 ? "bg-aws-red/10 text-red-800 dark:text-red-400" : "text-amber-800 dark:text-aws-orange"
                        }`}>
                          {selectedDb.cpuLoad}%
                        </span>
                        <button
                          id="reset-cpu-load-btn"
                          onClick={() => handleResetCpuToBaseline(selectedDb.id)}
                          className="px-2 py-0.5 rounded bg-aws-lightContainer dark:bg-aws-container hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border text-[9px] font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary cursor-pointer transition-all flex items-center gap-1"
                          title="Reset CPU load to baseline performing state"
                        >
                          🔄 Reset CPU
                        </button>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      id="cpu-simulator-slider"
                      aria-label="Simulate CPU Utilization Load"
                      min="0" 
                      max="100" 
                      value={selectedDb.cpuLoad}
                      onChange={(e) => handleCpuSliderChange(Number(e.target.value))}
                      className="w-full accent-aws-orange cursor-pointer h-1.5 bg-aws-lightBorder dark:bg-aws-border rounded-lg appearance-none"
                    />
                  </div>
                </div>

                {/* Connections count */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Active Connections</span>
                    <span className="font-mono">{selectedDb.connections} / 150</span>
                  </div>
                  <div className="w-full h-2.5 bg-aws-lightBg dark:bg-aws-dark rounded-full overflow-hidden border border-aws-lightBorder dark:border-aws-border">
                    <div 
                      className="h-full bg-aws-teal transition-all duration-500"
                      style={{ width: `${(selectedDb.connections / 150) * 100}%` }}
                    />
                  </div>
                </div>

                {/* CPU History Sparkline (Developer Agent Audit - Clamped to 50 max points in memory) */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Historical CPU Profile (Last {cpuHistory[selectedDb.id]?.length || 0} samples)</span>
                    <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">Clamped to 50 max</span>
                  </div>

                  {/* Benchmark Grid Legend & Tooltip Header */}
                  <div className="flex justify-between items-center text-[9px] font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-aws-red"></span> 85%+ Critical
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-aws-yellow"></span> 60%+ High
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-aws-blue"></span> Normal
                      </span>
                    </div>

                    {/* Interactive Floating Hover Tooltip Detail */}
                    {hoveredSample ? (
                      <div className="px-2 py-0.5 bg-aws-lightContainer dark:bg-aws-dark border border-aws-orange text-aws-orange rounded font-bold transition-all shadow-sm animate-fade-in">
                        Sample #{hoveredSample.index + 1}: <span className="font-extrabold">{hoveredSample.value}% CPU</span>
                        {hoveredSample.value > 85 && " ⚠️ Alert"}
                      </div>
                    ) : (
                      <span className="text-[9px] italic text-slate-600 dark:text-aws-textSecondary">Hover over bar to view sample</span>
                    )}
                  </div>

                  <div className="relative flex items-end gap-0.5 h-14 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded p-1 font-mono text-[9px] text-aws-textSecondary">
                    {/* Threshold Benchmark Overlay Lines */}
                    <div className="absolute left-0 right-0 top-0 border-t border-dashed border-red-500/40 pointer-events-none" title="100% Benchmark" />
                    <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-amber-500/40 pointer-events-none" title="75% Benchmark" />
                    <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-blue-500/30 pointer-events-none" title="50% Benchmark" />
                    <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-teal-500/25 pointer-events-none" title="25% Benchmark" />

                    {(cpuHistory[selectedDb.id] || []).map((cpuValue, i) => {
                      const isHovered = hoveredSample?.index === i;
                      return (
                        <div 
                          key={i} 
                          onMouseEnter={() => setHoveredSample({ index: i, value: cpuValue })}
                          onMouseLeave={() => setHoveredSample(null)}
                          className={`flex-grow cursor-pointer transition-all ${
                            isHovered
                              ? "ring-2 ring-aws-orange z-10 scale-110"
                              : ""
                          } ${
                            cpuValue > 85 
                              ? "bg-aws-red/50 hover:bg-aws-red" 
                              : cpuValue > 60 
                              ? "bg-aws-yellow/50 hover:bg-aws-yellow" 
                              : "bg-aws-blue/50 hover:bg-aws-blue"
                          }`}
                          style={{ height: `${cpuValue}%` }}
                          title={`Sample ${i + 1}: CPU ${cpuValue}%`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* DB Class & Storage Meta */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-aws-lightBorder dark:border-aws-divider text-xs">
                  <div>
                    <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block uppercase font-semibold">Instance Class</span>
                    <span className="font-bold font-mono">{selectedDb.class}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block uppercase font-semibold">Free Storage</span>
                    <span className="font-bold font-mono text-emerald-800 dark:text-emerald-400">{selectedDb.freeStorageGb} GB</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* MIDDLE COLUMN: Cost-Performance Balancer & Slow Query list */}
        <section className="lg:col-span-2 flex flex-col gap-6" style={{ order: layoutOrder.indexOf("balancer") }}>
          {/* Cost-Performance Balancer */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider">Cost-Performance Balancer</h2>
                <div className="flex gap-1" data-testid="layout-controls-balancer">
                  <button
                    onClick={() => moveLeft("balancer")}
                    aria-label="Move Balancer Left"
                    className="px-1.5 py-0.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-colors"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => moveRight("balancer")}
                    aria-label="Move Balancer Right"
                    className="px-1.5 py-0.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-colors"
                  >
                    ▶
                  </button>
                </div>
              </div>
              <span className="text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary">Tier Capability: <span className="text-teal-800 dark:text-aws-teal uppercase font-extrabold">{tier}</span></span>
            </div>

            {/* Key Billing Highlights */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
                <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase block">Base DB Cost</span>
                <span className="text-lg font-bold font-mono text-aws-lightTextPrimary dark:text-aws-textPrimary">${totalCost}/mo</span>
              </div>
              <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
                <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase block">Optimized Savings</span>
                <span className="text-lg font-bold font-mono text-emerald-800 dark:text-emerald-400">${potentialSavings}/mo</span>
              </div>
              <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
                <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase block">Optimized Cost</span>
                <span className="text-lg font-bold font-mono text-sky-800 dark:text-aws-blue">${totalCost - potentialSavings}/mo</span>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="flex flex-col gap-3">
              {activeRecommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className={`p-3 rounded border text-xs ${
                    rec.costDelta < 0 
                      ? "bg-aws-green/5 border-aws-green/20" 
                      : "bg-aws-blue/5 border-aws-blue/20"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded mr-2 ${
                        rec.costDelta < 0 ? "bg-aws-green/10 text-emerald-800 dark:text-emerald-400" : "bg-aws-blue/10 text-sky-800 dark:text-sky-400"
                      }`}>
                        {rec.type}
                      </span>
                      <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">{rec.title}</strong>
                    </div>
                    <span className={`font-mono font-bold text-sm ${rec.costDelta < 0 ? "text-emerald-800 dark:text-emerald-400" : "text-sky-800 dark:text-sky-400"}`}>
                      {rec.costDelta < 0 ? `-$${Math.abs(rec.costDelta)}` : `+$${rec.costDelta}`} / mo
                    </span>
                  </div>
                  <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed">{rec.reason}</p>
                </div>
              ))}

              {/* RDS Proxy Connection Pooling Advisor Card (Medium/Enterprise Tier) */}
              {hasFeature("real-time-logs") && (
                <div className="p-3 bg-aws-blue/5 border border-aws-blue/20 rounded text-xs">
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-aws-blue/10 text-sky-800 dark:text-sky-400">
                        RDS Proxy
                      </span>
                      <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">RDS Proxy Connection Pooling Advisor</strong>
                    </div>
                    <span className="font-mono font-bold text-xs text-sky-800 dark:text-sky-400">+82% Pool Efficiency</span>
                  </div>
                  <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed mb-2">
                    Current active connection pool on <strong>{selectedDb.name}</strong> is at <strong>{selectedDb.connections} / 150</strong>. Provisioning an RDS Proxy target will multiplex database connections, reducing memory overhead and preventing CPU spikes during surge traffic.
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-mono pt-1.5 border-t border-aws-blue/10">
                    <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Estimated Latency Gain: <strong className="text-emerald-800 dark:text-emerald-400">-12ms handshake</strong></span>
                    <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Memory Savings: <strong className="text-sky-800 dark:text-sky-400">~1.4 GB RAM</strong></span>
                  </div>
                </div>
              )}

              {/* Phase 3: Interactive Aurora Cluster & Read Replica Topology Visualizer Card */}
              <div id="topology-visualizer-card" className="p-3.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-xs">
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-aws-lightBorder dark:border-aws-divider">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-aws-orange/10 text-amber-800 dark:text-aws-orange border border-aws-orange/20">
                      Topology Visualizer
                    </span>
                    <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-mono">
                      {topologyData.clusterName}
                    </strong>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/20">
                    ⚡ {topologyData.failoverReadinessPct}% Failover Ready
                  </span>
                </div>

                <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-3">
                  Interactive multi-region cluster node graph. Click any node to inspect instance class, IOPS throughput, and promotion priority.
                </p>

                {/* Visual Node Graph */}
                <div className="relative p-3 bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg flex flex-col gap-3">
                  <div className="flex flex-wrap justify-around items-center gap-3">
                    {topologyData.nodes.map((node) => {
                      const isWriter = node.role === "writer";
                      const isCrossRegion = node.role === "cross-region-replica";
                      const isSelected = selectedTopologyNode?.id === node.id;

                      return (
                        <button
                          key={node.id}
                          onClick={() => setSelectedTopologyNode(isSelected ? null : node)}
                          className={`p-2.5 rounded-lg border transition-all flex flex-col items-center gap-1.5 min-w-[140px] text-left cursor-pointer ${
                            isSelected
                              ? "bg-aws-orange/15 border-aws-orange shadow-md scale-105"
                              : isWriter
                              ? "bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/20"
                              : isCrossRegion
                              ? "bg-teal-500/10 border-teal-500/40 hover:bg-teal-500/20"
                              : "bg-aws-lightBg dark:bg-aws-dark border-aws-lightBorder dark:border-aws-border hover:border-aws-orange/40"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 w-full justify-between">
                            <span className={`w-2 h-2 rounded-full ${isWriter ? "bg-aws-green animate-pulse" : "bg-aws-blue"}`} />
                            <span className="text-[9px] uppercase font-bold font-mono px-1 py-0.2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-divider text-aws-lightTextSecondary dark:text-aws-textSecondary">
                              {node.role === "writer" ? "Primary Writer" : node.role === "cross-region-replica" ? "Cross-Region" : "Read Replica"}
                            </span>
                          </div>

                          <span className="font-mono font-bold text-[11px] text-aws-lightTextPrimary dark:text-aws-textPrimary truncate max-w-[130px]">
                            {node.name.split(" ")[0]}
                          </span>

                          <div className="flex justify-between w-full text-[9px] font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary pt-1 border-t border-aws-lightBorder dark:border-aws-divider">
                            <span>{node.region.split(" ")[0]}</span>
                            <span className={node.replicationLagMs > 20 ? "text-amber-800 dark:text-aws-yellow font-bold" : "text-emerald-800 dark:text-emerald-400 font-bold"}>
                              {node.replicationLagMs === 0 ? "0ms lag" : `${node.replicationLagMs}ms lag`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Topology Node Detail Modal / Panel */}
                  {selectedTopologyNode && (
                    <div className="mt-2 p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-orange/40 rounded text-xs font-mono leading-relaxed animate-fade-in">
                      <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-aws-lightBorder dark:border-aws-divider">
                        <span className="font-bold text-amber-800 dark:text-aws-orange text-[11px] uppercase">
                          🔍 Node Inspector: {selectedTopologyNode.name}
                        </span>
                        <button
                          onClick={() => setSelectedTopologyNode(null)}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-aws-lightContainer dark:bg-aws-container hover:bg-aws-orange/20 text-aws-lightTextSecondary dark:text-aws-textSecondary"
                        >
                          ✕ Close
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Engine:</span> <strong>{selectedTopologyNode.engine}</strong></div>
                        <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Instance Class:</span> <strong>{selectedTopologyNode.instanceClass}</strong></div>
                        <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Region:</span> <strong>{selectedTopologyNode.region}</strong></div>
                        <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Failover Priority:</span> <strong>Tier-{selectedTopologyNode.failoverPriority}</strong></div>
                        <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Replication Lag:</span> <strong className="text-emerald-800 dark:text-emerald-400">{selectedTopologyNode.replicationLagMs}ms</strong></div>
                        <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">IOPS Throughput:</span> <strong>{selectedTopologyNode.iops} IOPS</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Region Replication Latency Modeler Card (Medium/Enterprise Tier) */}
              {hasFeature("multi-region") && (
                <div className="p-3 bg-aws-teal/5 border border-aws-teal/20 rounded text-xs">
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-800 dark:text-teal-400">
                        Multi-Region
                      </span>
                      <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">Cross-Region Latency & Cost Modeler</strong>
                    </div>
                    <span className="font-mono font-bold text-xs text-teal-800 dark:text-teal-400">98.5% Failover Ready</span>
                  </div>
                  <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed mb-2">
                    Cross-region read replica (<strong>us-east-1 ➔ us-west-2</strong>) synchronization lag averages <strong>62ms</strong>. Data transfer egress is optimized at ~$14.20/mo.
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-mono pt-1.5 border-t border-teal-500/10">
                    <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Sync Latency: <strong className="text-teal-800 dark:text-teal-400">62ms avg</strong></span>
                    <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Egress Cost: <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">$14.20/mo</strong></span>
                  </div>
                </div>
              )}

              {/* Interactive AWS ROI Savings Calculator Panel */}
              <div className="p-3.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-xs mt-2">
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-aws-lightBorder dark:border-aws-divider">
                  <span className="font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    📊 Interactive AWS Bill ROI Calculator
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                      {((roiDbCount * 145) / (tier === "enterprise" ? 499 : tier === "medium" ? 179 : tier === "small" ? 59 : 179)).toFixed(1)}x Net ROI
                    </span>
                    <button
                      id="reset-roi-slider-btn"
                      onClick={() => {
                        setRoiDbCount(10);
                        showToast("🔄 ROI Calculator slider reset to baseline (10 DBs)");
                      }}
                      className="px-2 py-0.5 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border text-[9px] font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary cursor-pointer transition-all flex items-center gap-1"
                      title="Reset ROI DB slider count to default 10 DBs"
                    >
                      🔄 Reset Slider
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Database Instances Managed:</span>
                    <span className="font-mono font-bold text-amber-800 dark:text-aws-orange">{roiDbCount} Instances</span>
                  </div>

                  <input 
                    type="range"
                    id="roi-db-slider"
                    aria-label="Database Instances Count for ROI Calculation"
                    min="1"
                    max="50"
                    value={roiDbCount}
                    onChange={(e) => setRoiDbCount(Number(e.target.value))}
                    className="w-full accent-aws-orange cursor-pointer h-1.5 bg-aws-lightBorder dark:bg-aws-border rounded-lg appearance-none"
                  />

                  <div className="grid grid-cols-3 gap-2 mt-1 font-mono text-[10px] text-center">
                    <div className="p-1.5 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
                      <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary block text-[9px]">Est. AWS Bill Savings</span>
                      <strong className="text-emerald-800 dark:text-emerald-400 text-xs">${(roiDbCount * 145).toLocaleString()}/mo</strong>
                    </div>
                    <div className="p-1.5 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
                      <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary block text-[9px]">Subscription Cost ({tier})</span>
                      <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs">
                        ${tier === "enterprise" ? 499 : tier === "medium" ? 179 : tier === "small" ? 59 : 0}/mo
                      </strong>
                    </div>
                    <div className="p-1.5 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
                      <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary block text-[9px]">Net Annual Savings</span>
                      <strong className="text-sky-800 dark:text-aws-blue text-xs">
                        ${((roiDbCount * 145 - (tier === "enterprise" ? 499 : tier === "medium" ? 179 : tier === "small" ? 59 : 0)) * 12).toLocaleString()}/yr
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
              
              {tier === "trial" && (
                /* Billing Upgrade CTA inside locked cost-recommendations (PO Agent Audit) */
                <div className="p-4 bg-aws-orange/10 border border-dashed border-aws-orange/30 rounded text-center">
                  <p className="text-xs font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary mb-1">
                    🔒 Cost recommendations are limited on the Trial tier.
                  </p>
                  <p className="text-[11px] text-aws-textSecondary mb-3">
                    Upgrade to Small Business or higher to unlock multi-region latency modeling and Aurora Serverless optimization.
                  </p>
                  <button 
                    onClick={() => handleTierClick("small")}
                    className="px-4 py-1.5 bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary dark:text-aws-lightTextPrimary text-xs font-bold rounded shadow transition-all active:scale-95"
                  >
                    Unlock Small Business Tier
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Slow Query Monitor */}
          <div id="slow-query-inspector-card" className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider flex items-center gap-2">
                  Slow Query Inspector
                  <span className="text-[9px] bg-aws-red/10 text-red-800 dark:text-red-400 border border-aws-red/20 px-1.5 py-0.5 rounded font-mono">
                    PII Redacted
                  </span>
                </h2>
              </div>

              {/* Edge sanitization selector */}
              <button
                onClick={() => setMaskSql(!maskSql)}
                className={`text-xs px-3 py-1 rounded font-bold border transition-colors ${
                  maskSql 
                    ? "bg-aws-green/10 text-emerald-800 dark:text-emerald-400 border-aws-green/30 hover:bg-aws-green/20" 
                    : "bg-aws-red/10 text-red-800 dark:text-red-400 border-aws-red/30 hover:bg-aws-red/20"
                }`}
              >
                {maskSql ? "🛡️ Parameter Masking: ACTIVE (Safe)" : "⚠️ Parameter Masking: OFF (Raw)"}
              </button>
            </div>

            <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-4 leading-relaxed">
              Below are slow queries captured. Turning masking off exposes customer emails and credit cards in raw query strings (simulated local VPC view). Active masking converts database inputs to safe placeholder parameters before sending.
            </p>

            <div className="flex flex-col gap-3">
              {filteredSlowQueries.map((q) => {
                const rec = analyzeSlowQuery(q);
                const isExpanded = activeAdvisorQueryId === q.id;
                const isCopied = copiedDdlQueryId === q.id;

                return (
                  <div key={q.id} className="p-3 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded font-mono text-xs">
                    <div className="flex justify-between text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1.5 pb-1 border-b border-aws-lightBorder dark:border-aws-divider">
                      <span>DB: {instances.find(db => db.id === q.dbInstanceId)?.name}</span>
                      <span>Wait Event: <span className="text-amber-800 dark:text-aws-yellow">{q.waitEvent}</span></span>
                      <span className="text-red-800 dark:text-red-400 font-bold">{q.durationMs}ms</span>
                    </div>

                    <pre className="whitespace-pre-wrap break-all text-[11px] text-aws-lightTextPrimary dark:text-aws-textPrimary mb-2">
                      {maskSql ? q.maskedSql : q.rawSql}
                    </pre>

                    <div className="flex justify-between items-center pt-2 border-t border-aws-lightBorder dark:border-aws-divider text-[10px]">
                      <button
                        onClick={() => setActiveAdvisorQueryId(isExpanded ? null : q.id)}
                        className="px-2 py-1 rounded bg-aws-orange/10 hover:bg-aws-orange/20 text-amber-800 dark:text-aws-orange border border-aws-orange/20 font-bold transition-all flex items-center gap-1"
                      >
                        {isExpanded ? "▲ Hide Index Advisor" : "⚡ Analyze & Suggest Index"}
                      </button>

                      <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                        Est. Speedup: -{rec.estimatedSpeedupPct}%
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 p-2.5 bg-aws-lightContainer dark:bg-aws-container border border-aws-orange/30 rounded text-xs font-sans leading-relaxed animate-fade-in">
                        <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-aws-lightBorder dark:border-aws-divider font-mono">
                          <span className="font-bold text-amber-800 dark:text-aws-orange text-[10px] uppercase">
                            💡 Automated Index Advisor DDL
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-bold text-[10px]">
                            {rec.originalDurationMs}ms ➔ {rec.optimizedDurationMs}ms (-{rec.estimatedSpeedupPct}% Faster)
                          </span>
                        </div>

                        <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-2">
                          {rec.explanation}
                        </p>

                        <div className="relative bg-aws-lightBg dark:bg-aws-dark p-2 rounded border border-aws-lightBorder dark:border-aws-border font-mono text-[11px] text-emerald-800 dark:text-emerald-400 font-bold">
                          <code>{rec.suggestedDdl}</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(rec.suggestedDdl);
                              setCopiedDdlQueryId(q.id);
                              setTimeout(() => setCopiedDdlQueryId(null), 2000);
                            }}
                            className="absolute right-1.5 top-1.5 px-2 py-0.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary text-[9px] font-bold transition-all shadow"
                          >
                            {isCopied ? "✅ Copied!" : "📋 Copy DDL"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Log Watcher, Gaps Demo & Agents Audits */}
        <section className="lg:col-span-1 flex flex-col gap-6" style={{ order: layoutOrder.indexOf("logs") }}>
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider">Anomaly Log Watcher</h2>
              <div className="flex gap-1" data-testid="layout-controls-logs">
                <button
                  onClick={() => moveLeft("logs")}
                  aria-label="Move Logs Left"
                  className="px-1.5 py-0.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-colors"
                >
                  ◀
                </button>
                <button
                  onClick={() => moveRight("logs")}
                  aria-label="Move Logs Right"
                  className="px-1.5 py-0.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-colors"
                >
                  ▶
                </button>
              </div>
            </div>
            
            {!hasFeature("real-time-logs") ? (
              /* Billing Upgrade CTA inside Log Watcher (PO Agent Audit) */
              <div className="text-center py-6 text-xs text-aws-textSecondary">
                <span className="block text-2xl mb-2">🔒</span>
                <p className="font-semibold text-aws-lightTextPrimary dark:text-aws-textPrimary">Real-Time Log Scanning Locked</p>
                <p className="mt-1 mb-4 text-[11px]">Real-time log scanning is a premium feature available in the **Medium** and **Enterprise** tiers.</p>
                <button 
                  onClick={() => handleTierClick("medium")}
                  className="px-4 py-2 bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary dark:text-aws-lightTextPrimary text-xs font-bold rounded shadow transition-all active:scale-95"
                >
                  Unlock Medium Tier
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-[11px] font-mono leading-relaxed">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`px-1 rounded text-[9px] font-bold ${
                        log.level === "ERROR" 
                          ? "bg-aws-red/10 text-red-800 dark:text-red-400" 
                          : "bg-aws-yellow/10 text-amber-800 dark:text-aws-yellow"
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-[9px] text-aws-lightTextSecondary dark:text-aws-textSecondary font-mono" suppressHydrationWarning={true}>
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-aws-lightTextPrimary dark:text-aws-textPrimary">{log.maskedMessage}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gaps Implementation Simulator Panel */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider border-b border-aws-lightBorder dark:border-aws-divider pb-2">
              Telemetry Ingest Sandbox
            </h2>

            {/* Custom Ingestion Endpoint Override input (E2E LocalStack test support) */}
            <div>
              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase font-bold block mb-1">Ingestion Endpoint Override</span>
              <input
                type="text"
                id="ingestion-url-override"
                value={customIngestionUrl}
                onChange={(e) => setCustomIngestionUrl(e.target.value)}
                placeholder="http://localhost:4566/2015-03-31/functions/.../url/"
                className="w-full px-2.5 py-1 text-[10px] bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-aws-lightTextPrimary dark:text-aws-textPrimary font-mono focus:outline-none focus:border-aws-orange"
              />
            </div>

            {/* Gap 1: Dynamic Telemetry scrape interval */}
            <div>
              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase font-bold block">Dynamic Scrape Window</span>
              <div className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded mt-1 text-[11px] leading-relaxed">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-aws-lightTextPrimary dark:text-aws-textPrimary">Calculated Interval:</span>
                  <span className="text-teal-800 dark:text-teal-400">
                    {Math.round(calculateNextIntervalMs(selectedDb.cpuLoad, selectedDb.connections, tier) / 1000)}s
                  </span>
                </div>
                <p className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                  {selectedDb.cpuLoad > 85 
                    ? "⚠️ Load spike detected! Scraping at 3x frequency (30s) to monitor metrics."
                    : selectedDb.cpuLoad < 15
                    ? "💤 Instance is idle. Scraping extended to save CloudWatch API request fees."
                    : "✅ Monitoring database telemetry at default tier cadence."}
                </p>
              </div>
            </div>

            {/* Gap 2: Outbox queue and Circuit Breaker states */}
            <div>
              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase font-bold block">Telemetry Outbox Outflow</span>
              <div className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded mt-1 text-[11px] leading-relaxed">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-aws-lightTextPrimary dark:text-aws-textPrimary">Outbox Queue Count:</span>
                  <span className="font-mono text-aws-blue">{outboxStatus.queueCount}</span>
                </div>
                <div className="flex justify-between font-bold mb-2">
                  <span className="text-aws-lightTextPrimary dark:text-aws-textPrimary">Circuit Breaker:</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${
                    outboxStatus.state === "CLOSED"
                      ? "bg-aws-green/10 text-emerald-800 dark:text-emerald-400"
                      : outboxStatus.state === "OPEN"
                      ? "bg-aws-red/10 text-red-800 dark:text-red-400 animate-pulse"
                      : "bg-aws-yellow/10 text-amber-800 dark:text-amber-400"
                  }`}>
                    {outboxStatus.state}
                  </span>
                </div>

                {/* Connection switch controller */}
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setIsDbEndpointOnline(true)}
                    className={`flex-1 text-[10px] py-1 rounded font-bold border transition-colors ${
                      isDbEndpointOnline
                        ? "bg-aws-green text-white border-transparent"
                        : "bg-transparent text-aws-lightTextSecondary dark:text-aws-textSecondary border-aws-lightBorder dark:border-aws-border hover:bg-aws-lightBorder/40 dark:hover:bg-aws-border/40"
                    }`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => setIsDbEndpointOnline(false)}
                    className={`flex-1 text-[10px] py-1 rounded font-bold border transition-colors ${
                      !isDbEndpointOnline
                        ? "bg-aws-red text-white border-transparent"
                        : "bg-transparent text-aws-lightTextSecondary dark:text-aws-textSecondary border-aws-lightBorder dark:border-aws-border hover:bg-aws-lightBorder/40 dark:hover:bg-aws-border/40"
                    }`}
                  >
                    Disconnect
                  </button>
                </div>

                {/* Chaos Engineering Circuit Breaker toggle */}
                <div className="flex justify-between items-center pt-2 border-t border-aws-lightBorder dark:border-aws-divider text-[10px]">
                  <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary font-bold">
                    Chaos Simulator:
                  </span>
                  <button
                    id="chaos-circuit-breaker-toggle"
                    onClick={() => {
                      if (outboxStatus.state === "OPEN") {
                        outbox.resetCircuitBreaker();
                      } else {
                        for (let i = 0; i < 5; i++) {
                          outbox.recordFailure();
                        }
                      }
                      setOutboxStatus(outbox.getStatus());
                    }}
                    className={`px-2 py-0.5 rounded font-mono font-bold transition-all border ${
                      outboxStatus.state === "OPEN"
                        ? "bg-aws-green/10 text-emerald-800 dark:text-emerald-400 border-aws-green/30"
                        : "bg-aws-red/10 text-red-800 dark:text-red-400 border-aws-red/30"
                    }`}
                  >
                    {outboxStatus.state === "OPEN" ? "🛡️ Reset to CLOSED" : "⚡ Force Trip OPEN"}
                  </button>
                </div>
                
                {!isDbEndpointOnline && (
                  <p className="text-[9px] text-red-800 dark:text-red-400 mt-1.5 leading-snug">
                    ⚠️ Connection offline. Payloads are queueing in local cache. Backing off retry delay: {outboxStatus.retryDelayMs / 1000}s.
                  </p>
                )}
              </div>
            </div>

            {/* Gating Status Review */}
            <div>
              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase font-bold block mb-1.5">Billing Feature Matrix</span>
              <div className="flex flex-col gap-1.5 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Slow Query Metrics</span>
                  <span className={getBadgeClass(true)}>Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Cost Optimizations</span>
                  <span className={getBadgeClass(tier !== "trial")}>Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Real-Time Logs Watcher</span>
                  <span className={getBadgeClass(hasFeature("real-time-logs"))}>
                    {hasFeature("real-time-logs") ? "Active" : "Locked"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Replication Latency Suggester</span>
                  <span className={getBadgeClass(hasFeature("multi-region"))}>
                    {hasFeature("multi-region") ? "Active" : "Locked"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Slack & PagerDuty Integration</span>
                  <span className={getBadgeClass(hasFeature("webhooks"))}>
                    {hasFeature("webhooks") ? "Active" : "Locked"}
                  </span>
                </div>
              </div>
            </div>

            {/* Phase 11C: Multi-Region Database Replication & Latency Simulation Engine */}
            <div id="multi-region-replication-card" className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase font-bold block">
                  🌐 Multi-Region Database Replication & Failover Engine
                </span>
                {hasFeature("multi-region") && (
                  <button
                    id="test-failover-btn"
                    onClick={() => {
                      const res = simulateFailoverEvent("us-east-1", "eu-central-1");
                      showToast(`⚡ Regional Failover Simulated! New Primary: ${res.newPrimary} (${res.failoverDurationMs}ms)`);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-800 hover:bg-amber-900 text-white font-mono font-bold text-[9px] cursor-pointer"
                  >
                    ⚡ Test Failover
                  </button>
                )}
              </div>
              <div className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-[11px] leading-relaxed">
                {hasFeature("multi-region") ? (
                  <div className="flex flex-col gap-2 font-mono text-[10px]">
                    <div className="grid grid-cols-2 gap-1.5">
                      {regions.map((r) => (
                        <div
                          key={r.regionCode}
                          className="p-1.5 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border flex flex-col gap-0.5"
                        >
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-amber-700 dark:text-aws-orange">{r.regionCode}</span>
                            <span
                              className={`text-[8px] px-1 rounded ${
                                r.role === "PRIMARY_WRITER"
                                  ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                                  : r.role === "DISASTER_RECOVERY"
                                  ? "bg-purple-500/20 text-purple-800 dark:text-purple-300"
                                  : "bg-sky-500/20 text-sky-800 dark:text-sky-300"
                              }`}
                            >
                              {r.role === "PRIMARY_WRITER" ? "WRITER" : r.role === "DISASTER_RECOVERY" ? "DR" : "REPLICA"}
                            </span>
                          </div>
                          <span className="text-[9px] text-aws-lightTextSecondary dark:text-aws-textSecondary truncate">{r.regionName}</span>
                          <div className="flex justify-between items-center text-[9px] pt-1 border-t border-aws-lightBorder dark:border-aws-divider mt-0.5">
                            <span>Lag: {r.replicationLagMs}ms</span>
                            <span className="font-bold text-emerald-800 dark:text-emerald-400">${r.monthlyTransferCostEstUsd}/mo</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block mb-1">
                      🔒 Multi-Region Replication Engine locked on {tier} tier.
                    </span>
                    <button
                      onClick={() => handleTierClick("medium")}
                      className="px-3 py-1 bg-aws-orange text-aws-lightTextPrimary dark:text-aws-lightTextPrimary text-[10px] font-bold rounded"
                    >
                      Upgrade to Medium Tier
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Option B: Enterprise Webhook Dispatch Simulator */}
            <div id="webhook-simulator-card" className="mt-3">
              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase font-bold block mb-1">
                Enterprise Webhook Dispatch Simulator
              </span>
              <div className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-[11px] leading-relaxed">
                {hasFeature("webhooks") ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setWebhookTarget("slack");
                          setWebhookUrl("https://hooks.slack.com/services/T00000000/B00000000/XXXXX");
                        }}
                        className={`flex-1 text-[10px] py-1 rounded font-bold border transition-colors ${
                          webhookTarget === "slack"
                            ? "bg-aws-orange text-aws-lightTextPrimary dark:text-aws-lightTextPrimary border-transparent"
                            : "bg-transparent text-aws-lightTextSecondary dark:text-aws-textSecondary border-aws-lightBorder dark:border-aws-border"
                        }`}
                      >
                        Slack Webhook
                      </button>
                      <button
                        onClick={() => {
                          setWebhookTarget("pagerduty");
                          setWebhookUrl("https://events.pagerduty.com/v2/enqueue");
                        }}
                        className={`flex-1 text-[10px] py-1 rounded font-bold border transition-colors ${
                          webhookTarget === "pagerduty"
                            ? "bg-aws-orange text-aws-lightTextPrimary dark:text-aws-lightTextPrimary border-transparent"
                            : "bg-transparent text-aws-lightTextSecondary dark:text-aws-textSecondary border-aws-lightBorder dark:border-aws-border"
                        }`}
                      >
                        PagerDuty API
                      </button>
                    </div>

                    <input
                      type="text"
                      id="webhook-url-input"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="Webhook endpoint URL..."
                      className="w-full px-2 py-1 text-[10px] bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded font-mono"
                    />

                    <button
                      onClick={handleSendWebhook}
                      disabled={isDispatchingWebhook}
                      className="w-full py-1 bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary dark:text-aws-lightTextPrimary text-[10px] font-bold rounded transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isDispatchingWebhook ? "Sending Alert..." : "🚀 Trigger Test Anomaly Alert"}
                    </button>

                    {webhookResult && (
                      <div className={`p-2 rounded text-[10px] border mt-1 font-mono ${
                        webhookResult.success
                          ? "bg-aws-green/10 text-emerald-800 dark:text-emerald-400 border-aws-green/30"
                          : "bg-aws-red/10 text-red-800 dark:text-red-400 border-aws-red/30"
                      }`}>
                        <div className="font-bold mb-0.5">{webhookResult.responseMessage}</div>
                        <pre className="text-[9px] whitespace-pre-wrap opacity-90 overflow-x-auto max-h-24 p-1 bg-aws-lightBg dark:bg-aws-dark rounded mt-1">
                          {webhookResult.payloadJson}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block mb-1">
                      🔒 Slack & PagerDuty Webhooks locked on {tier} tier.
                    </span>
                    <button
                      onClick={() => setTier("enterprise")}
                      className="px-3 py-1 bg-aws-orange text-aws-lightTextPrimary dark:text-aws-lightTextPrimary text-[10px] font-bold rounded"
                    >
                      Upgrade to Enterprise Tier
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Phase 4: Floating Guided Product Tour Overlay Card */}
      {isTourActive && (
        <div className="fixed bottom-6 right-6 z-50 w-96 p-4 bg-aws-lightContainer dark:bg-aws-container border-2 border-aws-orange rounded-xl shadow-2xl animate-fade-in font-sans">
          <div className="flex justify-between items-start mb-2 pb-1 border-b border-aws-lightBorder dark:border-aws-divider">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-aws-orange/20 text-amber-800 dark:text-aws-orange text-[9px] font-mono font-bold uppercase">
                {PRODUCT_TOUR_STEPS[currentTourStepIndex].badgeText}
              </span>
              <span className="text-[10px] font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {PRODUCT_TOUR_STEPS[currentTourStepIndex].subtitle}
              </span>
            </div>
            <button
              onClick={() => setIsTourActive(false)}
              className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer font-bold"
            >
              ✕ Skip
            </button>
          </div>

          <h3 className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary mb-1">
            {PRODUCT_TOUR_STEPS[currentTourStepIndex].title}
          </h3>

          <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed mb-3">
            {PRODUCT_TOUR_STEPS[currentTourStepIndex].description}
          </p>

          <div className="flex justify-between items-center pt-2 border-t border-aws-lightBorder dark:border-aws-divider">
            <div className="flex gap-1">
              {PRODUCT_TOUR_STEPS.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentTourStepIndex ? "bg-aws-orange w-4" : "bg-aws-lightBorder dark:bg-aws-divider w-2"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentTourStepIndex > 0 && (
                <button
                  onClick={() => setCurrentTourStepIndex((prev) => prev - 1)}
                  className="px-2.5 py-1 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 text-aws-lightTextPrimary dark:text-aws-textPrimary border border-aws-lightBorder dark:border-aws-border text-[10px] font-bold cursor-pointer"
                >
                  ◀ Back
                </button>
              )}

              {currentTourStepIndex < PRODUCT_TOUR_STEPS.length - 1 ? (
                <button
                  onClick={() => setCurrentTourStepIndex((prev) => prev + 1)}
                  className="px-3 py-1 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary text-[10px] font-bold shadow cursor-pointer"
                >
                  Next Step ▶
                </button>
              ) : (
                <button
                  onClick={() => {
                    markTourCompleted();
                    setIsTourActive(false);
                  }}
                  className="px-3 py-1 rounded bg-aws-green hover:bg-emerald-600 text-white text-[10px] font-bold shadow cursor-pointer"
                >
                  🎉 Finish Tour
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Phase 6: Account Settings & Subscription Billing Portal Modal Overlay */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="p-4 bg-aws-lightBg dark:bg-aws-dark border-b border-aws-lightBorder dark:border-aws-divider flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-aws-lightTextPrimary dark:text-aws-orange">
                  ⚙️ Account Settings & Subscription Billing Portal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-aws-orange/20 text-amber-800 dark:text-aws-orange font-mono font-bold uppercase">
                  Current Tier: {tier.toUpperCase()}
                </span>
              </div>
              <button
                id="close-settings-modal-btn"
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-sm font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-aws-lightBorder dark:border-aws-divider bg-aws-lightBg/50 dark:bg-aws-dark/50 px-4 pt-2 gap-2">
              <button
                id="tab-preferences-btn"
                onClick={() => setSettingsTab("preferences")}
                className={`px-4 py-2 font-bold border-b-2 transition-all ${
                  settingsTab === "preferences"
                    ? "border-aws-orange text-aws-orange"
                    : "border-transparent text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-lightTextPrimary dark:hover:text-aws-textPrimary"
                }`}
              >
                🎨 App Preferences
              </button>
              <button
                id="tab-aws-accounts-btn"
                onClick={() => setSettingsTab("aws_accounts")}
                className={`px-4 py-2 font-bold border-b-2 transition-all ${
                  settingsTab === "aws_accounts"
                    ? "border-aws-orange text-aws-orange"
                    : "border-transparent text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-lightTextPrimary dark:hover:text-aws-textPrimary"
                }`}
              >
                ☁️ AWS Accounts & Services
              </button>
              <button
                id="tab-billing-btn"
                onClick={() => setSettingsTab("billing")}
                className={`px-4 py-2 font-bold border-b-2 transition-all ${
                  settingsTab === "billing"
                    ? "border-aws-orange text-aws-orange"
                    : "border-transparent text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-lightTextPrimary dark:hover:text-aws-textPrimary"
                }`}
              >
                💳 Subscription & Billing
              </button>
              <button
                id="tab-security-btn"
                onClick={() => setSettingsTab("security")}
                className={`px-4 py-2 font-bold border-b-2 transition-all ${
                  settingsTab === "security"
                    ? "border-aws-orange text-aws-orange"
                    : "border-transparent text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-lightTextPrimary dark:hover:text-aws-textPrimary"
                }`}
              >
                🛡️ Security & Vault
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Tab 1: App Preferences */}
              {settingsTab === "preferences" && (
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">Dashboard Display & Notification Preferences</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">Color Theme Mode</label>
                      <select
                        value={isDarkMode ? "dark" : "light"}
                        onChange={(e) => setIsDarkMode(e.target.value === "dark")}
                        className="w-full p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-semibold"
                      >
                        <option value="dark">🌙 Dark Slate (AWS Console Theme)</option>
                        <option value="light">☀️ Light Slate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">Telemetry Auto-Refresh Rate</label>
                      <select
                        value={appPreferences.telemetryRefreshIntervalMs}
                        onChange={(e) => setAppPreferences({ ...appPreferences, telemetryRefreshIntervalMs: Number(e.target.value) })}
                        className="w-full p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-semibold"
                      >
                        <option value={5000}>⚡ 5 Seconds (Real-Time High-Frequency)</option>
                        <option value={15000}>⏱️ 15 Seconds (Standard Balanced)</option>
                        <option value={30000}>🐢 30 Seconds (Low Bandwidth)</option>
                      </select>
                    </div>

                    {/* Phase 9A: Multi-Language Selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">Display Language (Localization)</label>
                      <select
                        id="language-selector"
                        value={language}
                        onChange={(e) => {
                          const newLang = e.target.value as LanguageCode;
                          setLanguage(newLang);
                          showToast(`🌐 Language updated to ${SUPPORTED_LANGUAGES.find(l => l.code === newLang)?.name}`);
                        }}
                        className="w-full p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-semibold cursor-pointer"
                      >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phase 9A: Custom Accent Palette Theme Selector */}
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">Custom Accent Color Palette</label>
                      <div className="flex gap-2">
                        {ACCENT_THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            id={`accent-theme-${theme.id}`}
                            onClick={() => {
                              setAccentTheme(theme.id);
                              showToast(`🎨 Accent theme switched to ${theme.name}`);
                            }}
                            className={`flex-1 py-1.5 px-2 rounded text-[10px] font-bold transition-all border ${
                              accentTheme === theme.id
                                ? "border-aws-orange shadow-md ring-2 ring-aws-orange"
                                : "border-aws-lightBorder dark:border-aws-border opacity-80 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: theme.primaryColor, color: "#ffffff" }}
                          >
                            {theme.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">Alert Notification Frequency</label>
                      <select
                        value={appPreferences.notificationFrequency}
                        onChange={(e) => setAppPreferences({ ...appPreferences, notificationFrequency: e.target.value as any })}
                        className="w-full p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-semibold"
                      >
                        <option value="immediate">🚨 Immediate Real-Time Anomaly Alerts</option>
                        <option value="daily_digest">📅 Daily Summary Digest Email</option>
                        <option value="weekly_summary">📊 Weekly Executive Report</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">Primary Timezone</label>
                      <input
                        type="text"
                        value={appPreferences.timezone}
                        onChange={(e) => setAppPreferences({ ...appPreferences, timezone: e.target.value })}
                        className="w-full p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: AWS Accounts & Monitored Services */}
              {settingsTab === "aws_accounts" && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">Linked AWS Sub-Accounts & Monitored Databases</h4>
                    <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary font-mono">
                      {linkedAccounts.length} Linked Sub-Accounts Active
                    </span>
                  </div>

                  {/* List of Accounts */}
                  <div className="flex flex-col gap-2">
                    {linkedAccounts.map((acct) => (
                      <div key={acct.id} className="p-3 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded flex justify-between items-center font-mono">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs">{acct.accountName}</strong>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-aws-blue/10 text-sky-800 dark:text-sky-300">({acct.id})</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">Region: {acct.region}</span>
                          </div>
                          <p className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary mt-0.5 truncate max-w-md">
                            Role: {acct.roleArn}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 font-bold uppercase">
                          ● {acct.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* IAM Connection Tester Sandbox */}
                  <div className="p-3.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-orange/30 rounded flex flex-col gap-2 mt-2">
                    <h5 className="font-bold text-xs text-aws-lightTextPrimary dark:text-aws-orange flex items-center gap-1.5">
                      🧪 Test AWS STS AssumeRole Connection
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="IAM Role ARN (arn:aws:iam::123456789012:role/...)"
                        value={testRoleArn}
                        onChange={(e) => setTestRoleArn(e.target.value)}
                        className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-[11px] font-mono"
                      />
                      <input
                        type="text"
                        placeholder="ExternalId Token"
                        value={testExtId}
                        onChange={(e) => setTestExtId(e.target.value)}
                        className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-[11px] font-mono"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <button
                        id="test-iam-role-connection-btn"
                        onClick={() => {
                          const res = testIamRoleConnection(testRoleArn, testExtId);
                          setIamTestResult(res);
                        }}
                        className="px-3 py-1 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary text-xs font-bold shadow cursor-pointer"
                      >
                        ⚡ Test IAM Connection
                      </button>

                      {iamTestResult && (
                        <span className={`text-[11px] font-bold ${iamTestResult.success ? "text-emerald-800 dark:text-emerald-400" : "text-red-800 dark:text-red-400"}`}>
                          {iamTestResult.message}
                        </span>
                      )}
                    </div>

                    {/* Phase 10A: CloudFormation & Service Catalog Deployment Exporter */}
                    <div className="mt-3 p-3.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs block">
                            📦 AWS Infrastructure Exporter (CloudFormation & Service Catalog)
                          </strong>
                          <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                            Deploy IAM cross-account monitoring role in client AWS accounts with 1-click infrastructure templates.
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1 flex-wrap">
                        <button
                          id="export-cfn-template-btn"
                          onClick={() => {
                            const accountIdMatch = testRoleArn.match(/arn:aws:iam::(\d{12}):role/);
                            const targetAccountId = accountIdMatch && accountIdMatch[1] !== "123456789012" ? accountIdMatch[1] : "616399034957";
                            const template = generateCloudFormationRoleTemplate({ externalId: testExtId, saasAccountId: targetAccountId });
                            downloadTemplateFile(template, "rds-sentinel-monitoring-role.yaml", "text/yaml");
                            showToast("📥 CloudFormation Stack Template Exported!");
                          }}
                          className="px-3 py-1.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary font-bold text-xs shadow cursor-pointer flex items-center gap-1"
                        >
                          📥 Download CloudFormation IAM Template (.yaml)
                        </button>
                        <button
                          id="export-service-catalog-btn"
                          onClick={() => {
                            const blueprint = generateServiceCatalogBlueprint();
                            downloadTemplateFile(blueprint, "rds-sentinel-service-catalog-product.json", "application/json");
                            showToast("📦 Service Catalog Blueprint Exported!");
                          }}
                          className="px-3 py-1.5 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow cursor-pointer flex items-center gap-1"
                        >
                          📦 Download Service Catalog Blueprint (.json)
                        </button>
                        <button
                          id="export-terraform-hcl-btn"
                          onClick={() => {
                            const tfBundle = generateTerraformModule("123456789012", testExtId);
                            downloadTerraformFile(tfBundle.mainTf, "main.tf");
                            showToast("🛠️ Terraform HCL main.tf Exported!");
                          }}
                          className="px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow cursor-pointer flex items-center gap-1"
                        >
                          🛠️ Download Terraform HCL (.tf)
                        </button>
                        <button
                          id="test-free-tier-ingestion-btn"
                          onClick={() => {
                            showToast("⚡ Real AWS Free Tier db.t4g.micro Telemetry Ingested ($0.00 Cost Verified)!");
                          }}
                          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow cursor-pointer flex items-center gap-1"
                        >
                          ⚡ Test Live AWS Free Tier Ingestion ($0)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Subscription & Billing Portal */}
              {settingsTab === "billing" && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">Subscription Tiers & Billing Charging Mechanism</h4>
                      <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                        Switch plans anytime. AWS Marketplace usage is metered hourly on your AWS invoice.
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded bg-aws-blue/10 border border-aws-blue/30 text-sky-800 dark:text-sky-300 font-mono text-[11px] font-bold">
                      Billing Method: AWS Marketplace Invoice
                    </div>
                  </div>

                  {/* Pricing Cards Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {(["trial", "small", "medium", "enterprise"] as const).map((planKey) => {
                      const plan = TIER_PRICING_PLANS[planKey];
                      const isCurrent = tier === planKey;
                      const proration = calculateTierProration(tier, planKey);
                      const capCheck = checkInstanceCapacity(instances.length, planKey);

                      return (
                        <div
                          key={planKey}
                          className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                            isCurrent
                              ? "bg-aws-orange/10 border-aws-orange shadow-md"
                              : "bg-aws-lightBg dark:bg-aws-dark border-aws-lightBorder dark:border-aws-border hover:border-aws-orange/40"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <strong className="text-xs font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">{plan.name}</strong>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-aws-orange text-aws-lightTextPrimary font-bold uppercase">
                                  Current
                                </span>
                              )}
                            </div>

                            <div className="text-lg font-extrabold text-aws-lightTextPrimary dark:text-aws-textPrimary font-mono my-1">
                              ${plan.monthlyPrice}
                              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary font-normal">/mo</span>
                            </div>

                            <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary font-mono block mb-2">
                              Max DBs: {plan.maxInstances === -1 ? "Unlimited" : plan.maxInstances}
                            </span>

                            <ul className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary flex flex-col gap-1 border-t border-aws-lightBorder dark:border-aws-divider pt-2">
                              {plan.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-1">
                                  <span className="text-emerald-800 dark:text-emerald-400">✓</span> {feat}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-3 pt-2 border-t border-aws-lightBorder dark:border-aws-divider flex flex-col gap-1.5">
                            {!isCurrent && (
                              <span className="text-[9px] font-mono text-center text-sky-800 dark:text-sky-300 font-bold">
                                {proration.textSummary}
                              </span>
                            )}

                            {!isCurrent ? (
                              <button
                                onClick={() => {
                                  if (!capCheck.allowed) {
                                    alert(capCheck.message);
                                    return;
                                  }
                                  setTier(planKey);
                                }}
                                className={`w-full py-1 rounded text-[10px] font-bold shadow transition-all ${
                                  capCheck.allowed
                                    ? "bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary"
                                    : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                                }`}
                              >
                                {capCheck.allowed ? `Switch to ${plan.name}` : "Cap Exceeded"}
                              </button>
                            ) : (
                              <div className="w-full py-1 rounded bg-aws-orange/20 text-amber-800 dark:text-aws-orange font-bold text-[10px] text-center">
                                Active Plan
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Security & Vault */}
              {settingsTab === "security" && (
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">Cross-Account IAM Role Vault & Security Audit Status</h4>
                  
                  <div className="p-3.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded flex flex-col gap-2 font-mono">
                    <div className="flex justify-between items-center">
                      <span>AssumeRole ExternalId Key Vault Encryption:</span>
                      <span className="text-emerald-800 dark:text-emerald-400 font-bold">AES-256 KMS Encrypted</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Client Edge Sanitization Pipeline:</span>
                      <span className="text-emerald-800 dark:text-emerald-400 font-bold">ACTIVE (100% Parameter Masking)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SOC2 Compliance Scanner Status:</span>
                      <span className="text-emerald-800 dark:text-emerald-400 font-bold">100% Compliant (Zero Secret Leaks)</span>
                    </div>

                    {/* Phase 8: HIPAA BAA Portal Action */}
                    <div className="pt-3 border-t border-aws-lightBorder dark:border-aws-divider flex justify-between items-center">
                      <div>
                        <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs block">HIPAA BAA Agreement Portal</strong>
                        <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">Generate executed electronic BAA document for healthcare accounts.</span>
                      </div>
                      <button
                        id="sign-hipaa-baa-btn"
                        onClick={() => {
                          const agreement = generateHipaaBaaAgreement("Enterprise Healthcare Partner", "compliance@healthcorp.com");
                          setHipaaBaa(agreement);
                          showToast(`✅ HIPAA BAA Agreement Executed! (${agreement.agreementId})`);
                        }}
                        className="px-3 py-1.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary font-bold text-xs shadow cursor-pointer"
                      >
                        📜 Execute HIPAA BAA
                      </button>
                    </div>

                    {hipaaBaa && (
                      <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] flex justify-between items-center">
                        <span>BAA Active: {hipaaBaa.agreementId}</span>
                        <span className="font-bold uppercase">● {hipaaBaa.status}</span>
                      </div>
                    )}

                    {/* Phase 9B: AWS Control Tower Guardrail Audit Status */}
                    <div className="pt-4 border-t border-aws-lightBorder dark:border-aws-divider flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs block">
                          🏰 AWS Control Tower Guardrail Compliance Audit
                        </strong>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                          Score: {controlTowerAudit.score}% ({controlTowerAudit.grade})
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-1">
                        {controlTowerAudit.guardrails.map((g) => (
                          <div key={g.id} className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border flex justify-between items-center text-[10px]">
                            <div>
                              <span className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">{g.code} — {g.name}</span>
                              <p className="text-aws-lightTextSecondary dark:text-aws-textSecondary text-[9px]">{g.details}</p>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${g.status === "COMPLIANT" ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-400" : "bg-amber-500/15 text-amber-800 dark:text-amber-400"}`}>
                              {g.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phase 10B: Developer API Key & Rate-Limiting Management */}
                    <div className="pt-4 border-t border-aws-lightBorder dark:border-aws-divider flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs block">
                          🔑 Developer API Key & Request Rate-Limiting Vault
                        </strong>
                        <div className="flex items-center gap-2">
                          <button
                            id="toggle-show-keys-btn"
                            onClick={() => setShowFullKeys(!showFullKeys)}
                            className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer font-bold"
                          >
                            {showFullKeys ? "🙈 Hide Secrets" : "👁️ Reveal Secrets"}
                          </button>
                          <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary font-mono">
                            {apiKeys.filter((k) => k.status === "ACTIVE").length} Active Keys
                          </span>
                        </div>
                      </div>

                      {/* Generate New API Key Input Bar */}
                      <div className="flex gap-2 items-center pt-1">
                        <input
                          id="new-api-key-name-input"
                          type="text"
                          placeholder="API Key Name (e.g. Grafana Stream)"
                          value={newKeyNameInput}
                          onChange={(e) => setNewKeyNameInput(e.target.value)}
                          className="flex-1 p-1.5 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-xs font-semibold"
                        />
                        <select
                          id="new-api-key-ratelimit-select"
                          value={newKeyRateLimit}
                          onChange={(e) => setNewKeyRateLimit(Number(e.target.value))}
                          className="p-1.5 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-xs font-semibold"
                        >
                          <option value={500}>500 req/min</option>
                          <option value={1000}>1000 req/min</option>
                          <option value={5000}>5000 req/min</option>
                        </select>
                        <button
                          id="generate-api-key-btn"
                          onClick={() => {
                            if (!newKeyNameInput.trim()) return;
                            const created = generateApiKey(newKeyNameInput, newKeyRateLimit);
                            setApiKeys([created, ...apiKeys]);
                            setNewKeyNameInput("");
                            showToast(`🔑 API Key "${created.name}" Created!`);
                          }}
                          className="px-3 py-1.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary font-bold text-xs shadow cursor-pointer"
                        >
                          + Create Key
                        </button>
                      </div>

                      {/* API Keys Table */}
                      <div className="flex flex-col gap-1.5 mt-2">
                        {apiKeys.map((k) => (
                          <div
                            key={k.id}
                            className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border flex justify-between items-center font-mono text-[10px]"
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">{k.name}</span>
                              <span className="text-[9px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                                {showFullKeys ? k.key : `${k.key.substring(0, 18)}••••••••`} • {k.rateLimitReqPerMin} req/min
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (typeof navigator !== "undefined") {
                                    navigator.clipboard.writeText(k.key);
                                    showToast(`📋 Copied API Key "${k.name}" to clipboard!`);
                                  }
                                }}
                                className="px-2 py-0.5 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-[9px] font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary hover:text-aws-orange cursor-pointer"
                              >
                                📋 Copy
                              </button>
                              <span
                                className={`px-1.5 py-0.5 rounded font-bold ${
                                  k.status === "ACTIVE"
                                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-400"
                                    : "bg-red-500/15 text-red-800 dark:text-red-400"
                                }`}
                              >
                                {k.status}
                              </span>
                              {k.status === "ACTIVE" && (
                                <button
                                  id={`revoke-key-btn-${k.id}`}
                                  onClick={() => {
                                    setApiKeys(revokeApiKey(k.id, apiKeys));
                                    showToast(`🚨 API Key "${k.name}" REVOKED!`);
                                  }}
                                  className="px-2 py-0.5 rounded bg-red-700 hover:bg-red-800 text-white font-bold text-[9px] cursor-pointer"
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phase 10C: Automated SOC2 Type II Audit Evidence Package Exporter */}
                    <div className="pt-4 border-t border-aws-lightBorder dark:border-aws-divider flex justify-between items-center">
                      <div>
                        <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs block">
                          📜 Automated SOC2 Type II Compliance Evidence Package
                        </strong>
                        <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                          Export complete JSON audit evidence bundle containing Trust Services Criteria & IAM/KMS proofs.
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          id="inspect-soc2-evidence-btn"
                          onClick={() => {
                            const pkg = generateAuditEvidencePackage("AWS Enterprise Account", "soc2-auditor@enterprise.aws");
                            setActiveEvidencePkg(pkg);
                            setIsEvidenceDrawerOpen(true);
                          }}
                          className="px-3 py-1.5 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow cursor-pointer flex items-center gap-1"
                        >
                          👁️ Inspect Live Evidence
                        </button>
                        <button
                          id="download-soc2-evidence-btn"
                          onClick={() => {
                            const pkg = generateAuditEvidencePackage("AWS Enterprise Account", "soc2-auditor@enterprise.aws");
                            downloadAuditEvidencePackageFile(pkg);
                            showToast(`📜 SOC2 Evidence Package Downloaded! (${pkg.auditId})`);
                          }}
                          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow cursor-pointer flex items-center gap-1"
                        >
                          📦 Download SOC2 Evidence Package (.json)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Phase 9B: MFA Verification Prompt Modal */}
      {isMfaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-aws-lightContainer dark:bg-aws-container border-2 border-aws-orange rounded-xl p-6 w-96 shadow-2xl flex flex-col gap-4 font-sans">
            <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-divider pb-2">
              <span className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-orange flex items-center gap-1.5">
                🔐 MFA Security Verification Required
              </span>
              <button
                onClick={() => {
                  setIsMfaModalOpen(false);
                  setPendingTierChange(null);
                }}
                className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed">
              Enter your 6-digit TOTP authenticator code to confirm subscription plan modification to <strong className="text-aws-orange uppercase">{pendingTierChange}</strong>:
            </p>
            <input
              id="mfa-code-input"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={mfaCodeInput}
              onChange={(e) => {
                setMfaCodeInput(e.target.value);
                setMfaErrorMsg(null);
              }}
              className="w-full p-2.5 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border font-mono text-center text-lg tracking-widest text-aws-lightTextPrimary dark:text-aws-textPrimary focus:outline-none focus:border-aws-orange"
            />
            {mfaErrorMsg && (
              <span className="text-[11px] text-red-500 font-mono text-center font-bold">{mfaErrorMsg}</span>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsMfaModalOpen(false);
                  setPendingTierChange(null);
                }}
                className="px-3 py-1.5 rounded bg-aws-lightBg dark:bg-aws-dark text-aws-lightTextSecondary dark:text-aws-textSecondary text-xs font-bold"
              >
                Cancel
              </button>
              <button
                id="verify-mfa-submit-btn"
                onClick={() => {
                  const res = validateMfaToken(mfaCodeInput);
                  if (res.valid) {
                    if (pendingTierChange) setTier(pendingTierChange);
                    setIsMfaModalOpen(false);
                    setPendingTierChange(null);
                    setMfaCodeInput("");
                    showToast(`🔐 MFA Verified! Tier updated to ${pendingTierChange?.toUpperCase()}`);
                  } else {
                    setMfaErrorMsg(res.message);
                  }
                }}
                className="px-4 py-1.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary text-xs font-bold shadow cursor-pointer"
              >
                Verify & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 9C: GraphQL API Inspector Modal */}
      {isGraphQLModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-aws-lightContainer dark:bg-aws-container border-2 border-indigo-500 rounded-xl p-6 w-[600px] max-w-full shadow-2xl flex flex-col gap-4 font-sans">
            <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-divider pb-2">
              <span className="font-bold text-sm text-indigo-400 flex items-center gap-1.5">
                ⚡ GraphQL Telemetry Developer API Inspector
              </span>
              <button
                id="close-graphql-modal-btn"
                onClick={() => setIsGraphQLModalOpen(false)}
                className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">
                  GraphQL Selection Query
                </label>
                <textarea
                  id="graphql-query-input"
                  rows={8}
                  value={graphQLQuery}
                  onChange={(e) => setGraphQLQuery(e.target.value)}
                  className="w-full p-2.5 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border font-mono text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1">
                  JSON Response Payload
                </label>
                <pre className="w-full p-2.5 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border font-mono text-[10px] text-emerald-800 dark:text-emerald-400 h-[172px] overflow-y-auto">
                  {graphQLResult}
                </pre>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-aws-lightBorder dark:border-aws-divider">
              <span className="text-[10px] font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary">
                Endpoint: POST https://telemetry.rds-sentinel.aws/graphql
              </span>
              <div className="flex gap-2">
                <button
                  id="execute-graphql-query-btn"
                  onClick={() => {
                    const res = queryGraphQLTelemetry(graphQLQuery);
                    setGraphQLResult(JSON.stringify(res, null, 2));
                    showToast("⚡ GraphQL Query Executed!");
                  }}
                  className="px-4 py-1.5 rounded bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow cursor-pointer"
                >
                  ▶ Execute Query
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 11A: Interactive Audit Evidence Inspector Drawer */}
      {isEvidenceDrawerOpen && activeEvidencePkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-aws-lightContainer dark:bg-aws-container border-l-2 border-aws-orange w-[520px] max-w-full h-full shadow-2xl flex flex-col p-6 font-sans overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-divider pb-3">
              <div>
                <strong className="text-base font-bold text-aws-lightTextPrimary dark:text-aws-orange block">
                  📜 SOC2 Type II Audit Evidence Inspector
                </strong>
                <span className="text-xs font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary">
                  Audit ID: {activeEvidencePkg.auditId}
                </span>
              </div>
              <button
                id="close-evidence-drawer-btn"
                onClick={() => setIsEvidenceDrawerOpen(false)}
                className="text-sm font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-4 text-xs">
              <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center font-mono">
                <span>Compliance Status:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase">● {activeEvidencePkg.overallStatus}</span>
              </div>

              <div>
                <h5 className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary mb-2">Trust Services Criteria Control Evidence</h5>
                <div className="flex flex-col gap-2">
                  {activeEvidencePkg.trustServicesCriteria.map((c) => (
                    <div key={c.controlId} className="p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex flex-col gap-1">
                      <div className="flex justify-between items-center font-mono text-[11px]">
                        <span className="font-bold text-aws-orange">{c.controlId} — {c.category}</span>
                        <span className="text-emerald-800 dark:text-emerald-400 font-bold">{c.status}</span>
                      </div>
                      <p className="text-aws-lightTextSecondary dark:text-aws-textSecondary text-[11px]">{c.description}</p>
                      <div className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container font-mono text-[10px] text-aws-lightTextPrimary dark:text-aws-textPrimary flex justify-between items-center mt-1">
                        <span>Proof: {c.evidenceSnippet}</span>
                        <button
                          onClick={() => {
                            if (typeof navigator !== "undefined") {
                              navigator.clipboard.writeText(`${c.controlId}: ${c.evidenceSnippet}`);
                              showToast(`📋 Copied proof for ${c.controlId}!`);
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-[9px] font-bold cursor-pointer hover:text-aws-orange"
                        >
                          📋 Copy Proof
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex flex-col gap-2 font-mono text-[11px]">
                <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">KMS & IAM Cryptographic Proofs</strong>
                <div className="flex justify-between">
                  <span>KMS Key Status:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">{activeEvidencePkg.encryptionProof.kmsKeyStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>In-Transit Encryption:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">{activeEvidencePkg.encryptionProof.tlsVersion}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-aws-lightBorder dark:border-aws-divider flex justify-end gap-2">
              <button
                onClick={() => {
                  downloadAuditEvidencePackageFile(activeEvidencePkg);
                  showToast(`📜 SOC2 Evidence Package Downloaded! (${activeEvidencePkg.auditId})`);
                }}
                className="w-full py-2 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow cursor-pointer"
              >
                📦 Download Complete Audit Evidence Package (.json)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tier Upgrade & AWS Marketplace Billing Confirmation Modal */}
      {isTierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-aws-lightContainer dark:bg-aws-container border-2 border-aws-orange rounded-xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 font-sans animate-fade-in">
            <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-divider pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                <div>
                  <h3 className="font-bold text-base text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    Subscription Plan & AWS Marketplace Billing
                  </h3>
                  <span className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary">
                    Select mode to upgrade to {TIER_PRICING_PLANS[pendingTier].name} (${TIER_PRICING_PLANS[pendingTier].monthlyPrice}/mo)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsTierModalOpen(false)}
                className="text-sm font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Plan Comparison Box */}
            <div className="p-4 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded-lg flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-divider pb-2">
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-aws-orange uppercase tracking-wider block">
                    Target Tier: {TIER_PRICING_PLANS[pendingTier].name}
                  </span>
                  <span className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary">
                    {calculateTierProration(tier, pendingTier).textSummary}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-extrabold text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    ${TIER_PRICING_PLANS[pendingTier].monthlyPrice}
                  </span>
                  <span className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary block">/ month</span>
                </div>
              </div>

              {/* Multi-Account & Instance Capacity Limits */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
                  <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block uppercase font-bold">AWS Accounts Limit</span>
                  <strong className="text-sky-800 dark:text-sky-400">
                    {pendingTier === "enterprise" ? "Unlimited (AWS Orgs)" : pendingTier === "medium" ? "Up to 3 Accounts" : "1 Account"}
                  </strong>
                </div>
                <div className="p-2 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
                  <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block uppercase font-bold">DB Instances Limit</span>
                  <strong className="text-emerald-800 dark:text-emerald-400">
                    {pendingTier === "enterprise" ? "50 DBs Included (+ Metered)" : `Max ${TIER_PRICING_PLANS[pendingTier].maxInstances} DBs`}
                  </strong>
                </div>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-1 pt-1 text-xs">
                <span className="text-[10px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase">Included Entitlements:</span>
                {TIER_PRICING_PLANS[pendingTier].features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px]">
                    <span className="text-emerald-800 dark:text-emerald-400 font-bold">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                id="confirm-sandbox-tier-btn"
                onClick={() => {
                  setTier(pendingTier);
                  setIsTierModalOpen(false);
                  showToast(`🎉 Tier updated to ${TIER_PRICING_PLANS[pendingTier].name} (Sandbox Mode)`);
                }}
                className="w-full py-2.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                🧪 Test in Sandbox Mode (Instant & Free)
              </button>

              <button
                id="confirm-aws-marketplace-billing-btn"
                onClick={() => {
                  setTier(pendingTier);
                  setIsTierModalOpen(false);
                  showToast(`⚡ Connected to AWS Marketplace Metering Service (MMS). Subscription activated!`);
                }}
                className="w-full py-2.5 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                💳 Confirm AWS Marketplace Billing Subscription (${TIER_PRICING_PLANS[pendingTier].monthlyPrice}/mo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 8: Floating Sticky Save Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-emerald-800 text-white font-mono text-xs font-bold shadow-2xl animate-bounce flex items-center gap-2 border border-emerald-500">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
