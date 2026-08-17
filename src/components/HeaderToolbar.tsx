"use client";

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
}: HeaderToolbarProps) {
  return (
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
            {t("partnerBadge", language)}
          </span>

          {/* Phase 7: Dual Mode Switcher Toggle */}
          <button
            id="toggle-app-mode-btn"
            onClick={() => setAppMode(appMode === "mode_a" ? "mode_b" : "mode_a")}
            className="px-2 py-0.5 rounded bg-aws-orange/10 hover:bg-aws-orange/20 border border-aws-orange/30 text-amber-900 dark:text-aws-orange text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
            title="Toggle between Mode A (Standalone SaaS Console) and Mode B (AWS Management Console Extension)"
          >
            {appMode === "mode_a" ? t("modeA", language) : t("modeB", language)}
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
            id="export-csv-report-btn"
            onClick={exportCSVReport}
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
                slowQueries.map((q) => q.rawSql),
                maskSql,
                "AWS Enterprise Client"
              );
              downloadCompliancePackage(report);
            }}
            className="px-2.5 py-1.5 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            title="Export SOC2 / HIPAA Security Compliance Audit Package"
          >
            {t("soc2Btn", language)}
          </button>

          {/* Settings Modal Trigger Button */}
          <button
            id="open-settings-modal-btn"
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-2.5 py-1.5 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            title="Open Dashboard Settings & Account Management"
          >
            {t("settingsBtn", language)}
          </button>

          {/* Option B: Developer Tools Menu Dropdown */}
          <div className="relative">
            <button
              id="dev-tools-dropdown-btn"
              onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
              className="px-2.5 py-1.5 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              {t("devTools", language)} ▼
            </button>

            {isDevToolsOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg shadow-xl py-1 z-50 animate-fade-in font-sans">
                <button
                  id="global-reset-simulators-btn"
                  onClick={() => {
                    handleResetAllSimulators();
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <span>🔄</span> {t("resetSimulators", language)}
                </button>
                <button
                  id="open-graphql-modal-btn"
                  onClick={() => {
                    const res = queryGraphQLTelemetry(graphQLQuery);
                    setGraphQLResult(JSON.stringify(res, null, 2));
                    setIsGraphQLModalOpen(true);
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium border-t border-aws-lightBorder dark:border-aws-divider"
                >
                  <span>⚡</span> {t("graphqlApi", language)}
                </button>
              </div>
            )}
          </div>

          {/* Option C: Language Dropdown Selector */}
          <select
            id="header-language-selector"
            aria-label="Select Display Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="px-2 py-1.5 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-aws-orange"
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
            className="px-2.5 py-1.5 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? "☀️ " + t("lightTheme", language) : "🌙 " + t("darkTheme", language)}
          </button>
        </div>
      </div>

      {/* Global Operational Subheader Bar */}
      <div className="border-t border-aws-lightBorder/60 dark:border-aws-border/60 bg-aws-lightBg/60 dark:bg-aws-dark/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-sans gap-2">
          {/* Left: Account & Cost Center Selectors */}
          <div className="flex items-center gap-3">
            {/* Account Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mr-1 hidden sm:inline-block">{t("accountLabel", language)}</span>
              <select
                id="aws-account-selector"
                aria-label="Select AWS Account"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="px-2 py-1 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-aws-orange"
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
              <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary mr-1 hidden md:inline-block">{t("tagLabel", language)}</span>
              {availableCostCenterTags.map((tag) => {
                const isActive = selectedCostCenterTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedCostCenterTag(tag)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-aws-orange text-aws-lightTextPrimary shadow"
                        : "bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
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
            {/* Active Subscription Tier Pill */}
            <div id="header-tier-selector" className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("tierLabel", language)}</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                {tier}
              </span>
              <div className="hidden sm:flex gap-1 ml-1">
                {(["trial", "small", "medium", "enterprise"] as TierType[]).map((tCode) => (
                  <button
                    key={tCode}
                    onClick={() => setTier(tCode)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                      tier === tCode
                        ? "bg-amber-800 text-white"
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
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border shadow-sm cursor-pointer hover:border-aws-orange/40 transition-all"
              onClick={() => setIsSettingsModalOpen(true)}
              title={healthMetrics.statusText}
            >
              <span className="text-[10px] font-bold uppercase text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("healthScore", language)}</span>
              <span
                className={`text-xs font-extrabold px-1.5 py-0.2 rounded ${
                  healthMetrics.healthScore >= 85
                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-400"
                    : healthMetrics.healthScore >= 70
                    ? "bg-amber-500/15 text-amber-800 dark:text-amber-400"
                    : "bg-rose-500/15 text-rose-800 dark:text-rose-400"
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
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-800/10 dark:bg-emerald-500/10 border border-emerald-800/20 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-400 text-[10px] font-bold transition-all cursor-pointer hover:bg-emerald-800/20 dark:hover:bg-emerald-500/20"
              title={`AWS Live Pricing API Sync Active. Est. Account Monthly Cost: $${accountMonthlyCost.toFixed(2)}/mo. Click to re-sync.`}
            >
              <span>🟢 AWS Rates: ${accountMonthlyCost.toFixed(2)}/mo</span>
              <span className="text-[9px] font-bold">({pricingSyncMetadata.region})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
