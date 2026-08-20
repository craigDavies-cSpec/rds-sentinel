"use client";
import TrustpilotBadge from './TrustpilotBadge';


import React from "react";
import { DBInstance, CostRecommendation, SlowQuery } from "@/lib/mockTelemetry";
import { t, LanguageCode, SUPPORTED_LANGUAGES } from "@/lib/localization";
import { LinkedAwsAccount, TierType } from "@/lib/accountSettings";
import { AccountHealthMetrics } from "@/lib/enterpriseConsolidation";
import { PricingSyncMetadata } from "@/lib/awsPricingEngine";

interface HeaderToolbarProps {
  appMode: "mode_a" | "mode_b";
  setAppMode: (mode: "mode_a" | "mode_b") => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  resetTourState: () => void;
  setCurrentTourStepIndex: (idx: number) => void;
  setIsTourActive: (active: boolean) => void;
  exportCSVReport: () => void;
  instances: DBInstance[];
  recommendations: CostRecommendation[];
  slowQueries: SlowQuery[];
  generateComplianceReport: (queries: string[], maskSql: boolean, customer?: string) => any;
  maskSql: boolean;
  downloadCompliancePackage: (report: any) => void;
  setIsSettingsModalOpen: (open: boolean) => void;
  isDevToolsOpen: boolean;
  setIsDevToolsOpen: (open: boolean) => void;
  queryGraphQLTelemetry: (query: string) => any;
  graphQLQuery: string;
  setGraphQLResult: (res: string) => void;
  setIsGraphQLModalOpen: (open: boolean) => void;
  handleResetAllSimulators: () => void;
  selectedAccountId: string;
  setSelectedAccountId: (id: string) => void;
  linkedAccounts: LinkedAwsAccount[];
  selectedCostCenterTag: string;
  setSelectedCostCenterTag: (tag: string) => void;
  availableCostCenterTags: string[];
  tier: TierType;
  setTier: (tier: TierType) => void;
  healthMetrics: AccountHealthMetrics;
  accountMonthlyCost: number;
  pricingSyncMetadata: PricingSyncMetadata;
  syncLiveAWSPricings: () => Promise<PricingSyncMetadata>;
  setPricingSyncMetadata: (meta: PricingSyncMetadata) => void;
  showToast?: (msg: string) => void;
  resetDefaultLayout?: () => void;
  applyLayoutPreset?: (presetOrder: string[], presetLabelKey: string) => void;
  setIsEdpModalOpen?: (open: boolean) => void;
  handleExportAceLeads?: () => void;
  handleRunFtrAudit?: () => void;
}

export function HeaderToolbar({
  appMode,
  setAppMode,
  language,
  setLanguage,
  isDarkMode,
  setIsDarkMode,
  resetTourState,
  setCurrentTourStepIndex,
  setIsTourActive,
  exportCSVReport,
  instances,
  recommendations,
  slowQueries,
  generateComplianceReport,
  maskSql,
  downloadCompliancePackage,
  setIsSettingsModalOpen,
  isDevToolsOpen,
  setIsDevToolsOpen,
  queryGraphQLTelemetry,
  graphQLQuery,
  setGraphQLResult,
  setIsGraphQLModalOpen,
  handleResetAllSimulators,
  selectedAccountId,
  setSelectedAccountId,
  linkedAccounts,
  selectedCostCenterTag,
  setSelectedCostCenterTag,
  availableCostCenterTags,
  tier,
  setTier,
  healthMetrics,
  accountMonthlyCost,
  pricingSyncMetadata,
  syncLiveAWSPricings,
  setPricingSyncMetadata,
  showToast,
  resetDefaultLayout,
  applyLayoutPreset,
  setIsEdpModalOpen,
  handleExportAceLeads,
  handleRunFtrAudit,
}: HeaderToolbarProps) {
  return (
    <header className="bg-aws-lightContainer dark:bg-aws-container border-b border-aws-lightBorder dark:border-aws-border px-4 py-3 shadow-md">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 max-w-[1600px] mx-auto">
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <TrustpilotBadge />
            {/* AWS Multi-Region Telemetry Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary tracking-wider hidden sm:inline-block">
                AWS Region:
              </span>
              <select
                id="aws-region-selector"
                aria-label="Select AWS Telemetry Region"
                value={pricingSyncMetadata.region}
                onChange={async (e) => {
                  const newRegion = e.target.value;
                  const fresh = await syncLiveAWSPricings(newRegion);
                  setPricingSyncMetadata(fresh);
                  if (showToast) showToast(`🌐 Telemetry Region Changed to AWS ${newRegion}`);
                }}
                className="px-2.5 py-1 rounded-md bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-aws-orange focus:outline-none"
              >
                <option value="eu-west-1">🇬🇧 London (eu-west-1)</option>
                <option value="us-east-1">🇺🇸 N. Virginia (us-east-1)</option>
                <option value="ap-northeast-1">🇯🇵 Tokyo (ap-northeast-1)</option>
                <option value="eu-central-1">🇩🇪 Frankfurt (eu-central-1)</option>
              </select>
            </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="font-extrabold text-aws-lightTextPrimary dark:text-aws-textPrimary tracking-tight text-base sm:text-lg flex items-center gap-2">
                {t("dashboardTitle", language)}
                <span className="text-[10px] bg-aws-orange/20 text-amber-950 dark:text-aws-orange font-extrabold border border-aws-orange/40 px-2 py-0.5 rounded-full font-mono hidden sm:inline-block">
                  v2.0 Enterprise
                </span>
              </h1>
            </div>
          </div>
          <span className="text-aws-lightBorder dark:text-aws-divider hidden md:inline">|</span>
          <span className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary font-medium hidden md:inline-block">
            {t("partnerBadge", language)}
          </span>
        </div>

        {/* Right Side: Global Controls */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* Subscribe on AWS Marketplace Procurement Badge */}
          <button
            id="subscribe-aws-marketplace-btn"
            onClick={() => setIsEdpModalOpen && setIsEdpModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-aws-orange/20 hover:from-amber-500/30 hover:to-aws-orange/30 border border-aws-orange/50 text-amber-950 dark:text-aws-orange font-extrabold text-xs rounded-md transition-all active:scale-95 shadow-sm cursor-pointer flex items-center gap-1.5"
            title={t("edpModalDesc", language)}
          >
            <span>🛒</span>
            <span>{t("subscribeAwsMarketplace", language)}</span>
            <span className="text-[9px] bg-aws-orange text-slate-950 px-1.5 py-0.5 rounded font-black uppercase hidden lg:inline-block">
              EDP
            </span>
          </button>

          <button
            id="start-product-tour-btn"
            onClick={() => {
              resetTourState();
              setCurrentTourStepIndex(0);
              setIsTourActive(true);
            }}
            className="px-3 py-1.5 bg-aws-orange/15 hover:bg-aws-orange/25 border border-aws-orange/40 text-amber-950 dark:text-aws-orange text-xs font-bold rounded-md transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            {t("tourBtn", language)}
          </button>

          <button
            id="export-csv-report-btn"
            onClick={exportCSVReport}
            className="px-3 py-1.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold rounded-md transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            {t("exportCsvBtn", language)}
          </button>

          <button
            id="export-soc2-compliance-btn"
            onClick={() => {
              const rep = generateComplianceReport(
                slowQueries.map((q) => q.rawSql),
                maskSql,
                "cSpec Enterprise"
              );
              downloadCompliancePackage(rep);
            }}
            className="px-3 py-1.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold rounded-md transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            {t("soc2Btn", language)}
          </button>

          <button
            id="open-settings-modal-btn"
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-3 py-1.5 bg-aws-orange text-aws-lightTextPrimary text-xs font-bold rounded-md transition-all active:scale-95 shadow-md hover:bg-aws-orange/90 cursor-pointer"
          >
            {t("settingsBtn", language)}
          </button>

          {/* Dev Tools Dropdown */}
          <div className="relative">
            <button
              id="dev-tools-dropdown-btn"
              onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
              className="px-3 py-1.5 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold rounded-md transition-all active:scale-95 shadow-sm cursor-pointer flex items-center gap-1"
            >
              {t("devTools", language)} ▾
            </button>

            {isDevToolsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg shadow-xl z-50 py-1 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 border-b border-aws-lightBorder dark:border-aws-border text-[10px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase tracking-wider">
                  {t("layoutProfilesHeader", language)}
                </div>
                <button
                  id="preset-balanced-btn"
                  onClick={() => {
                    if (applyLayoutPreset) applyLayoutPreset(["databases", "balancer", "logs"], "presetBalanced");
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium transition-colors"
                >
                  <span>{t("presetBalanced", language)}</span>
                </button>
                <button
                  id="preset-finops-btn"
                  onClick={() => {
                    if (applyLayoutPreset) applyLayoutPreset(["balancer", "databases", "logs"], "presetFinOps");
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium transition-colors"
                >
                  <span>{t("presetFinOps", language)}</span>
                </button>
                <button
                  id="preset-dba-btn"
                  onClick={() => {
                    if (applyLayoutPreset) applyLayoutPreset(["databases", "logs", "balancer"], "presetDba");
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium transition-colors"
                >
                  <span>{t("presetDba", language)}</span>
                </button>

                <div className="px-3 py-1.5 border-t border-b border-aws-lightBorder dark:border-aws-border text-[10px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase tracking-wider mt-1">
                  {t("systemControlsHeader", language)}
                </div>
                <button
                  id="toggle-app-mode-btn"
                  onClick={() => {
                    setAppMode(appMode === "mode_a" ? "mode_b" : "mode_a");
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium transition-colors"
                >
                  <span>🔀</span> {appMode === "mode_a" ? "Mode A: SaaS" : "Mode B: AWS Extension"}
                </button>
                <button
                  id="global-reset-simulators-btn"
                  onClick={() => {
                    handleResetAllSimulators();
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium border-t border-aws-lightBorder dark:border-aws-divider transition-colors"
                >
                  <span>🔄</span> {t("resetSimulators", language)}
                </button>
                <button
                  id="global-reset-layout-btn"
                  onClick={() => {
                    if (resetDefaultLayout) resetDefaultLayout();
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium border-t border-aws-lightBorder dark:border-aws-divider transition-colors"
                >
                  <span>{"📐"}</span> {t("resetLayoutBtn", language)}
                </button>
                <button
                  id="open-graphql-modal-btn"
                  onClick={() => {
                    const res = queryGraphQLTelemetry(graphQLQuery);
                    setGraphQLResult(JSON.stringify(res, null, 2));
                    setIsGraphQLModalOpen(true);
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium border-t border-aws-lightBorder dark:border-aws-divider transition-colors"
                >
                  <span>⚡</span> {t("graphqlApi", language)}
                </button>

                <div className="px-3 py-1.5 border-t border-b border-aws-lightBorder dark:border-aws-border text-[10px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase tracking-wider mt-1">
                  {t("awsPartnerHeader", language)}
                </div>
                <button
                  id="export-ace-leads-btn"
                  onClick={() => {
                    if (handleExportAceLeads) handleExportAceLeads();
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium transition-colors"
                >
                  <span>🤝</span> {t("exportAceLeadsBtn", language)}
                </button>
                <button
                  id="run-ftr-audit-btn"
                  onClick={() => {
                    if (handleRunFtrAudit) handleRunFtrAudit();
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium border-t border-aws-lightBorder dark:border-aws-divider transition-colors"
                >
                  <span>🛡️</span> {t("runFtrAuditBtn", language)}
                </button>
              </div>
            )}
          </div>
          
          {/* Language Selector Dropdown */}
          <select
            id="header-language-selector"
            aria-label={t("selectLanguageAria", language)}
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="px-2.5 py-1.5 rounded-md bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-aws-orange focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-3 py-1.5 rounded-md bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
            title={t("toggleThemeTitle", language)}
          >
            {isDarkMode ? "☀️ " + t("lightTheme", language) : "🌙 " + t("darkTheme", language)}
          </button>
        </div>
      </div>

      
      {/* 1-Click AWS CloudFormation Launch Stack WCAG High-Contrast Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 px-4 lg:px-6 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 font-sans border-b border-amber-400">
        <div className="flex items-center gap-2.5">
          <span className="text-base p-1 bg-slate-950 rounded-md text-amber-400 font-bold shadow-inner">☁️</span>
          <div>
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-950">
              AWS Sandbox Evaluation Setup:
            </span>
            <span className="text-xs font-bold text-slate-900 ml-1.5 hidden md:inline-block">
              Deploy Kinesis telemetry IAM role template to your AWS Sandbox account without manual configuration.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const templateYaml = generateCloudFormationRoleTemplate("rds-sentinel-sandbox-role");
              downloadTemplateFile("rds-sentinel-sandbox-cloudformation.yml", templateYaml);
              window.open("https://console.aws.amazon.com/cloudformation/home#/stacks/quickcreate?stackName=RDSSentinelSandboxRole&param_ExternalId=rds-sentinel-demo-external-id", "_blank");
            }}
            className="px-4 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-400 border border-amber-300 font-black text-xs rounded-lg transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
            title="Download CloudFormation YAML & Open AWS Quick Create Console"
          >
            <span>🚀</span> 1-Click AWS CloudFormation Launch Stack
          </button>
        </div>
      </div>


      {/* Global Operational Subheader Filter Strip */}
      <div className="border-t border-aws-lightBorder/50 dark:border-aws-border/50 bg-aws-lightBg/40 dark:bg-aws-dark/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-2 flex flex-wrap items-center justify-between text-xs font-sans gap-3">
          {/* Left: Account & Cost Center Selectors */}
          <div className="flex items-center gap-3">
          <TrustpilotBadge />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary tracking-wider hidden sm:inline-block">
                {t("accountLabel", language)}
              </span>
              <select
                id="aws-account-selector"
                aria-label={t("selectAccountAria", language)}
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="px-2.5 py-1 rounded-md bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-aws-orange focus:outline-none"
              >
                <option value="ALL_ACCOUNTS">{t("allAccounts", language)} ({instances.length} DBs)</option>
                {linkedAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountName} ({acc.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Cost Center Tag Filter Pill Group */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary tracking-wider hidden md:inline-block">
                {t("tagLabel", language)}
              </span>
              {availableCostCenterTags.map((tag) => {
                const isActive = selectedCostCenterTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedCostCenterTag(tag)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-aws-orange text-slate-950 font-black shadow-md active:scale-95"
                        : "bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange hover:border-aws-orange/40"
                    }`}
                  >
                    {tag === "ALL_TAGS" ? t("allTags", language) : tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Tier Badge, Account Health Score & Pricing Sync */}
          <div className="flex items-center gap-3">
          <TrustpilotBadge />
            {/* Active Subscription Tier Selector */}
            <div id="header-tier-selector" className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary tracking-wider">
                {t("tierLabel", language)}
              </span>
              <div className="flex gap-1">
                {(["trial", "small", "medium", "enterprise"] as TierType[]).map((tCode) => (
                  <button
                    key={tCode}
                    onClick={() => setTier(tCode)}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase transition-all active:scale-95 cursor-pointer ${
                      tier === tCode
                        ? "bg-purple-600 text-white shadow-md border border-purple-400"
                        : "bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
                    }`}
                  >
                    {tCode}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Health Score Badge */}
            <div
              id="account-health-score-card"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border shadow-sm cursor-pointer hover:border-aws-orange/50 transition-all active:scale-95"
              onClick={() => setIsSettingsModalOpen(true)}
              title={healthMetrics.statusText}
            >
              <span className="text-[10px] font-bold uppercase text-aws-lightTextSecondary dark:text-aws-textSecondary tracking-wider">
                {t("healthScore", language)}
              </span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-md ${
                  healthMetrics.healthScore >= 85
                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30"
                    : healthMetrics.healthScore >= 70
                    ? "bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30"
                    : "bg-rose-500/15 text-rose-800 dark:text-rose-400 border border-rose-500/30"
                }`}
              >
                {healthMetrics.healthScore}/100
              </span>
            </div>

            {/* Centralized AWS Pricing Engine Sync Status */}
            <button
              id="sync-aws-pricing-badge-btn"
              onClick={async () => {
                const fresh = await syncLiveAWSPricings();
                setPricingSyncMetadata(fresh);
                if (showToast) showToast("🟢 AWS Pricing API Synchronized Successfully!");
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
              title={`AWS Live Pricing API Sync Active. Est. Account Monthly Cost: $${accountMonthlyCost.toFixed(2)}/mo. Click to re-sync.`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{t("awsRatesLabel", language)}{accountMonthlyCost.toFixed(2)}/mo</span>
              <span className="text-[9px] font-mono">({pricingSyncMetadata.region})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
