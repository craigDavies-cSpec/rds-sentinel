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
import { maskSQLQuery } from "@/lib/logSanitizer";
import { calculateNextIntervalMs, TelemetryOutboxQueue } from "@/lib/dynamicTelemetry";
import { getLayoutAction, saveLayoutAction } from "./actions";
import { exportCSVReport } from "@/lib/reportExporter";
import { dispatchWebhookAlert, WebhookDispatchResult } from "@/lib/webhookSimulator";
import { analyzeSlowQuery } from "@/lib/indexAdvisor";
import { getClusterTopology, ClusterNode, ClusterTopologyData } from "@/lib/clusterTopology";
import { getLocalizedTourSteps, isTourCompleted, markTourCompleted, resetTourState } from "@/lib/productTour";
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
import { generateHipaaBaaAgreement, HipaaBaaAgreement } from "@/lib/agentBacklogEnhancements";
import { t, LanguageCode, SUPPORTED_LANGUAGES } from "@/lib/localization";
import { AccentTheme, ACCENT_THEMES } from "@/lib/themeAccent";
import { evaluateControlTowerGuardrails } from "@/lib/controlTower";
import {
  calculateAccountMonthlyCost,
  syncLiveAWSPricings,
  getPricingSyncMetadata,
  PricingSyncMetadata,
} from "@/lib/awsPricingEngine";
import { validateMfaToken } from "@/lib/securityControlMonitor";
import { queryGraphQLTelemetry } from "@/lib/graphQLResolver";
import {
  generateCloudFormationRoleTemplate,
  generateServiceCatalogBlueprint,
  downloadTemplateFile,
} from "@/lib/cloudFormationExporter";
import {
  generateOwaspPassword,
  evaluatePasswordStrength,
  PasswordAnalysis,
} from "@/lib/enterpriseSecurityVault";
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

// Modular Sub-Components
import { HeaderToolbar } from "@/components/HeaderToolbar";
import { TelemetrySandbox } from "@/components/TelemetrySandbox";
import { CostRecommendations } from "@/components/CostRecommendations";
import { SlowQueryInspector } from "@/components/SlowQueryInspector";
import { TopologyVisualizer } from "@/components/TopologyVisualizer";
import { SettingsModal } from "@/components/SettingsModal";
import { GraphQLInspectorModal } from "@/components/GraphQLInspectorModal";
import { EvidenceInspectorDrawer } from "@/components/EvidenceInspectorDrawer";
import { TierConfirmationModal } from "@/components/TierConfirmationModal";
import { ProductTourModal } from "@/components/ProductTourModal";

// Initialize the telemetry outbox queue
const outbox = new TelemetryOutboxQueue();

export default function Dashboard() {
  // Subscription tier state: gates dashboard features
  const [tier, setTier] = useState<TierType>("medium");
  const [pendingTier, setPendingTier] = useState<TierType>("enterprise");
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentTheme, setAccentTheme] = useState<AccentTheme>("aws_orange");
  const [language, setLanguage] = useState<LanguageCode>("en");

  // App & View State
  const [appMode, setAppMode] = useState<"mode_a" | "mode_b">("mode_a");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("ALL_ACCOUNTS");
  const [selectedCostCenterTag, setSelectedCostCenterTag] = useState<string>("ALL_TAGS");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGraphQLModalOpen, setIsGraphQLModalOpen] = useState(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  // Settings Modal State
  const [settingsTab, setSettingsTab] = useState<"preferences" | "aws_accounts" | "billing" | "security">("preferences");
  const [appPreferences, setAppPreferences] = useState<UserAppPreferences>(INITIAL_APP_PREFERENCES);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAwsAccount[]>(INITIAL_LINKED_AWS_ACCOUNTS);
  const [newAccountForm, setNewAccountForm] = useState({ accountName: "", accountId: "", roleArn: "", externalId: "" });
  const [iamTestStatus, setIamTestStatus] = useState<string | null>(null);
  const [activeBaa, setActiveBaa] = useState<HipaaBaaAgreement | null>(null);
  const [mfaTokenInput, setMfaTokenInput] = useState("");
  const [mfaStatus, setMfaStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [owaspPasswordLength, setOwaspPasswordLength] = useState(28);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordAnalysis, setPasswordAnalysis] = useState<PasswordAnalysis | null>(null);

  // Telemetry & Sandbox State
  const [instances, setInstances] = useState<DBInstance[]>(MOCK_INSTANCES);
  const [selectedDbId, setSelectedDbId] = useState<string>("db-free-tier-sandbox");
  const [maskSql, setMaskSql] = useState(true);
  const [activeAdvisorQueryId, setActiveAdvisorQueryId] = useState<string | null>(null);
  const [copiedDdlQueryId, setCopiedDdlQueryId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [calculatedIntervalMs, setCalculatedIntervalMs] = useState(15000);
  const [isOnline, setIsOnline] = useState(true);
  const [circuitBreakerState, setCircuitBreakerState] = useState<"CLOSED" | "HALF_OPEN" | "OPEN">("CLOSED");
  const [outboxCount, setOutboxCount] = useState(0);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [cpuSparklineData, setCpuSparklineData] = useState<number[]>([18, 22, 19, 25, 20, 18, 24, 21, 18, 19]);
  const [hoveredSparklineIndex, setHoveredSparklineIndex] = useState<number | null>(null);

  // Product Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStepIndex, setCurrentTourStepIndex] = useState(0);

  // Topology & Modeler State
  const [selectedTopologyNode, setSelectedTopologyNode] = useState<ClusterNode | null>(null);
  const [roiDbCount, setRoiDbCount] = useState(10);
  const [graphQLQuery, setGraphQLQuery] = useState(`query {
  instances {
    id
    name
    cpuLoad
  }
}`);
  const [graphQLResult, setGraphQLResult] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pricingSyncMetadata, setPricingSyncMetadata] = useState<PricingSyncMetadata>(getPricingSyncMetadata());

  // Layout order
  const [layoutOrder, setLayoutOrder] = useState<string[]>(["databases", "balancer", "logs"]);

  // Toast Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Trigger tier upgrade confirmation modal
  const handleRequestTierChange = (targetTier: TierType) => {
    setPendingTier(targetTier);
    setIsTierModalOpen(true);
  };

  // Sync theme class to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Load layout order from SQLite server action
  useEffect(() => {
    async function loadLayout() {
      try {
        const savedOrder = await getLayoutAction();
        if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
          setLayoutOrder(savedOrder);
        }
      } catch (err) {
        console.error("Failed to load layout order:", err);
      }
    }
    loadLayout();
  }, []);

  const moveLeft = async (componentKey: string) => {
    const key = componentKey === "recommendations" ? "balancer" : componentKey;
    const idx = layoutOrder.indexOf(key);
    if (idx > 0) {
      const newOrder = [...layoutOrder];
      const temp = newOrder[idx - 1];
      newOrder[idx - 1] = newOrder[idx];
      newOrder[idx] = temp;
      setLayoutOrder(newOrder);
      await saveLayoutAction(newOrder);
    }
  };

  const moveRight = async (componentKey: string) => {
    const key = componentKey === "recommendations" ? "balancer" : componentKey;
    const idx = layoutOrder.indexOf(key);
    if (idx < layoutOrder.length - 1) {
      const newOrder = [...layoutOrder];
      const temp = newOrder[idx + 1];
      newOrder[idx + 1] = newOrder[idx];
      newOrder[idx] = temp;
      setLayoutOrder(newOrder);
      await saveLayoutAction(newOrder);
    }
  };

  const [draggedKey, setDraggedKey] = useState<string | null>(null);

  const resetDefaultLayout = async () => {
    const defaultOrder = ["databases", "balancer", "logs"];
    setLayoutOrder(defaultOrder);
    await saveLayoutAction(defaultOrder);
    showToast(t("layoutResetToast", language));
  };

  const handleDragStart = (e: React.DragEvent, componentKey: string) => {
    setDraggedKey(componentKey);
    e.dataTransfer.setData("text/plain", componentKey);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    if (!draggedKey || draggedKey === targetKey) return;

    const fromIndex = layoutOrder.indexOf(draggedKey);
    const toIndex = layoutOrder.indexOf(targetKey);

    if (fromIndex !== -1 && toIndex !== -1) {
      const newOrder = [...layoutOrder];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed);
      setLayoutOrder(newOrder);
      setDraggedKey(null);
      await saveLayoutAction(newOrder);
      showToast(t("layoutReorderedToast", language));
    }
  };

  // Multi-Account & Cost-Center Filtering
  const multiAccountInstances = useMemo(() => {
    return getAggregatedMultiAccountInstances(instances, selectedAccountId);
  }, [instances, selectedAccountId]);

  const filteredInstances = useMemo(() => {
    return filterInstancesByCostCenter(multiAccountInstances, selectedCostCenterTag);
  }, [multiAccountInstances, selectedCostCenterTag]);

  const availableCostCenterTags = useMemo(() => {
    return getAvailableCostCenterTags(instances);
  }, [instances]);

  const selectedDb = useMemo(() => {
    return instances.find((i) => i.id === selectedDbId) || instances[0];
  }, [instances, selectedDbId]);

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

  const accountMonthlyCost = useMemo(() => {
    return calculateAccountMonthlyCost(filteredInstances);
  }, [filteredInstances]);

  const potentialSavings = useMemo(() => {
    return activeRecommendations
      .filter((rec) => rec.costDelta < 0)
      .reduce((acc, rec) => acc + Math.abs(rec.costDelta), 0);
  }, [activeRecommendations]);

  const healthMetrics = useMemo(() => {
    return calculateAccountHealthScore(filteredInstances, activeRecommendations, MOCK_SLOW_QUERIES, maskSql);
  }, [filteredInstances, activeRecommendations, maskSql]);

  const filteredSlowQueries = useMemo(() => {
    const activeDbIds = new Set(filteredInstances.map((d) => d.id));
    return MOCK_SLOW_QUERIES.filter((q) => activeDbIds.has(q.dbInstanceId));
  }, [filteredInstances]);

  const filteredLogs = useMemo(() => {
    const activeDbIds = new Set(filteredInstances.map((d) => d.id));
    return MOCK_LOGS.filter((l) => activeDbIds.has(l.dbInstanceId));
  }, [filteredInstances]);

  const hasFeature = (feature: string) => {
    if (tier === "trial" || tier === "small") return false;
    if (tier === "medium") return feature !== "webhooks";
    return true;
  };

  const handleSelectDb = (id: string) => {
    setIsTransitioning(true);
    setSelectedDbId(id);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleCpuSliderChange = (newCpu: number) => {
    setInstances((prev) =>
      prev.map((inst) => (inst.id === selectedDbId ? { ...inst, cpuLoad: newCpu } : inst))
    );
    setCpuSparklineData((prev) => [...prev.slice(-49), newCpu]);
  };

  const handleResetCpuToBaseline = (id: string) => {
    const baselineMap: Record<string, number> = {
      "db-free-tier-sandbox": 18,
      "db-sales-prod": 70,
      "db-billing-mysql": 28,
      "db-dev-sandbox": 12,
      "db-analytics-aurora": 45,
    };
    const baseline = baselineMap[id] || 25;
    setInstances((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, cpuLoad: baseline } : inst))
    );
    showToast(`🔄 CPU load reset to baseline (${baseline}%) for ${selectedDb.name}`);
  };

  const handleResetAllSimulators = () => {
    setInstances(MOCK_INSTANCES);
    setRoiDbCount(10);
    setMaskSql(true);
    setIsOnline(true);
    setCircuitBreakerState("CLOSED");
    setOutboxCount(0);
    showToast("🔄 All telemetry load spikes, circuit breakers, and sliders reset to baseline!");
  };

  const clusterTopology = useMemo(() => {
    return getClusterTopology(selectedAccountId === "ALL_ACCOUNTS" ? "all" : selectedAccountId);
  }, [selectedAccountId]);

  const evidencePackage = useMemo(() => {
    return generateAuditEvidencePackage(
      "cSpec Customer Enterprise",
      "compliance@cspec.co.uk"
    );
  }, []);

  return (
    <div className="min-h-screen bg-aws-lightBg dark:bg-aws-dark transition-colors duration-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-aws-orange text-white font-bold text-xs rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}

      {/* 1. Global Header Toolbar */}
      <HeaderToolbar
        appMode={appMode}
        setAppMode={setAppMode}
        language={language}
        setLanguage={setLanguage}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        resetTourState={resetTourState}
        setCurrentTourStepIndex={setCurrentTourStepIndex}
        setIsTourActive={setIsTourActive}
        exportCSVReport={() => exportCSVReport(filteredInstances, activeRecommendations, filteredSlowQueries)}
        instances={instances}
        recommendations={activeRecommendations}
        slowQueries={filteredSlowQueries}
        generateComplianceReport={generateComplianceReport}
        maskSql={maskSql}
        downloadCompliancePackage={downloadCompliancePackage}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        isDevToolsOpen={isDevToolsOpen}
        setIsDevToolsOpen={setIsDevToolsOpen}
        queryGraphQLTelemetry={queryGraphQLTelemetry}
        graphQLQuery={graphQLQuery}
        setGraphQLResult={setGraphQLResult}
        setIsGraphQLModalOpen={setIsGraphQLModalOpen}
        handleResetAllSimulators={handleResetAllSimulators}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        linkedAccounts={linkedAccounts}
        selectedCostCenterTag={selectedCostCenterTag}
        setSelectedCostCenterTag={setSelectedCostCenterTag}
        availableCostCenterTags={availableCostCenterTags}
        tier={tier}
        setTier={handleRequestTierChange}
        healthMetrics={healthMetrics}
        accountMonthlyCost={accountMonthlyCost}
        pricingSyncMetadata={pricingSyncMetadata}
        syncLiveAWSPricings={syncLiveAWSPricings}
        setPricingSyncMetadata={setPricingSyncMetadata}
        showToast={showToast}
        resetDefaultLayout={resetDefaultLayout}
      />

      {/* Live Account Banner */}
      {selectedAccountId === "616399034957" && (
        <div id="live-account-active-banner" className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 flex flex-wrap items-center justify-between text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>🟢 {t("activeAccountBanner", language)} <strong>{t("liveAwsAccountLabel", language)} (616399034957)</strong> {t("liveAccountIn", language)} <strong>eu-west-1 (Ireland)</strong></span>
          </div>
          <span className="text-[11px] bg-emerald-900/80 text-emerald-200 px-3 py-1 rounded border border-emerald-400/40">
            {t("liveMonitoredDb", language)} free-tier-sandbox-db (RDS PostgreSQL db.t4g.micro)
          </span>
        </div>
      )}

      {/* Main Grid View Layout */}
      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Telemetry Sandbox & Topology Visualizer */}
        <section
          draggable={true}
          onDragStart={(e) => handleDragStart(e, "databases")}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "databases")}
          style={{ order: layoutOrder.indexOf("databases") >= 0 ? layoutOrder.indexOf("databases") : 0 }}
          className="flex flex-col gap-6 transition-all duration-200"
        >
          <TelemetrySandbox
            filteredInstances={filteredInstances}
            selectedDbId={selectedDbId}
            setSelectedDbId={setSelectedDbId}
            selectedDb={selectedDb}
            tier={tier}
            language={language}
            isTransitioning={isTransitioning}
            handleSelectDb={handleSelectDb}
            handleCpuSliderChange={handleCpuSliderChange}
            handleResetCpuToBaseline={handleResetCpuToBaseline}
            calculatedIntervalMs={calculatedIntervalMs}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            circuitBreakerState={circuitBreakerState}
            setCircuitBreakerState={setCircuitBreakerState}
            outboxCount={outboxCount}
            setOutboxCount={setOutboxCount}
            consecutiveFailures={consecutiveFailures}
            cpuSparklineData={cpuSparklineData}
            hoveredSparklineIndex={hoveredSparklineIndex}
            setHoveredSparklineIndex={setHoveredSparklineIndex}
            moveLeft={moveLeft}
            moveRight={moveRight}
          />

          <TopologyVisualizer
            topologyData={clusterTopology}
            selectedTopologyNode={selectedTopologyNode}
            setSelectedTopologyNode={setSelectedTopologyNode}
            language={language}
          />
        </section>

        {/* Column 2: Cost Recommendations & Optimization Tools */}
        <section
          draggable={true}
          onDragStart={(e) => handleDragStart(e, "balancer")}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "balancer")}
          style={{ order: layoutOrder.indexOf("balancer") >= 0 ? layoutOrder.indexOf("balancer") : 1 }}
          className="flex flex-col gap-6 transition-all duration-200"
        >
          <CostRecommendations
            totalCost={accountMonthlyCost}
            potentialSavings={potentialSavings}
            activeRecommendations={activeRecommendations}
            tier={tier}
            language={language}
            hasFeature={hasFeature}
            topologyData={clusterTopology}
            selectedTopologyNode={selectedTopologyNode}
            setSelectedTopologyNode={setSelectedTopologyNode}
            roiDbCount={roiDbCount}
            setRoiDbCount={setRoiDbCount}
            handleTierClick={handleRequestTierChange}
            showToast={showToast}
            moveLeft={moveLeft}
            moveRight={moveRight}
          />
        </section>

        {/* Column 3: Slow Query Inspector & Log Watcher */}
        <section
          draggable={true}
          onDragStart={(e) => handleDragStart(e, "logs")}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "logs")}
          style={{ order: layoutOrder.indexOf("logs") >= 0 ? layoutOrder.indexOf("logs") : 2 }}
          className="flex flex-col gap-6 transition-all duration-200"
        >
          <SlowQueryInspector
            filteredSlowQueries={filteredSlowQueries}
            instances={instances}
            maskSql={maskSql}
            setMaskSql={setMaskSql}
            language={language}
            activeAdvisorQueryId={activeAdvisorQueryId}
            setActiveAdvisorQueryId={setActiveAdvisorQueryId}
            copiedDdlQueryId={copiedDdlQueryId}
            setCopiedDdlQueryId={setCopiedDdlQueryId}
            tier={tier}
            handleTierClick={handleRequestTierChange}
            filteredLogs={filteredLogs}
            hasFeature={hasFeature}
          />
        </section>
      </main>

      {/* Tier Upgrade Confirmation Modal */}
      <TierConfirmationModal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        currentTier={tier}
        pendingTier={pendingTier}
        language={language}
        onConfirmTier={(tierCode, mode) => {
          setTier(tierCode);
          setIsTierModalOpen(false);
          showToast(
            mode === "sandbox"
              ? `🎉 Tier updated to ${TIER_PRICING_PLANS[tierCode].name} (Sandbox Mode)`
              : `⚡ Connected to AWS Marketplace Metering Service (MMS). Subscription activated!`
          );
        }}
      />

      {/* Settings & Subscription Billing Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settingsTab={settingsTab}
        setSettingsTab={setSettingsTab}
        appPreferences={appPreferences}
        setAppPreferences={setAppPreferences}
        linkedAccounts={linkedAccounts}
        setLinkedAccounts={setLinkedAccounts}
        newAccountForm={newAccountForm}
        setNewAccountForm={setNewAccountForm}
        iamTestStatus={iamTestStatus}
        setIamTestStatus={setIamTestStatus}
        tier={tier}
        setTier={setTier}
        activeBaa={activeBaa}
        setActiveBaa={setActiveBaa}
        mfaTokenInput={mfaTokenInput}
        setMfaTokenInput={setMfaTokenInput}
        mfaStatus={mfaStatus}
        setMfaStatus={setMfaStatus}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        newApiKeyName={newApiKeyName}
        setNewApiKeyName={setNewApiKeyName}
        owaspPasswordLength={owaspPasswordLength}
        setOwaspPasswordLength={setOwaspPasswordLength}
        generatedPassword={generatedPassword}
        setGeneratedPassword={setGeneratedPassword}
        passwordAnalysis={passwordAnalysis}
        setPasswordAnalysis={setPasswordAnalysis}
        accentTheme={accentTheme}
        setAccentTheme={setAccentTheme}
        language={language}
        setLanguage={setLanguage}
        onOpenEvidenceDrawer={() => setIsEvidenceDrawerOpen(true)}
        testIamRoleConnection={testIamRoleConnection}
        checkInstanceCapacity={checkInstanceCapacity}
        showToast={showToast}
        instanceCount={filteredInstances.length}
        instances={instances}
      />

      {/* Developer GraphQL API Modal */}
      <GraphQLInspectorModal
        isOpen={isGraphQLModalOpen}
        onClose={() => setIsGraphQLModalOpen(false)}
        graphQLQuery={graphQLQuery}
        setGraphQLQuery={setGraphQLQuery}
        graphQLResult={graphQLResult}
        setGraphQLResult={setGraphQLResult}
        queryGraphQLTelemetry={queryGraphQLTelemetry}
        language={language}
      />

      {/* Audit Evidence Inspector Drawer */}
      <EvidenceInspectorDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        evidencePackage={evidencePackage}
        downloadAuditEvidencePackageFile={downloadAuditEvidencePackageFile}
        language={language}
      />

      {/* Guided Product Tour Modal */}
      <ProductTourModal
        isTourActive={isTourActive}
        currentStepIndex={currentTourStepIndex}
        setCurrentStepIndex={setCurrentTourStepIndex}
        setIsTourActive={setIsTourActive}
        language={language}
      />
    </div>
  );
}
