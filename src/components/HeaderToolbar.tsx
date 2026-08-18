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
  resetDefaultLayout?: () => void;
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
}: HeaderToolbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-aws-lightBorder/80 dark:border-aws-border/80 bg-aws-lightContainer/90 dark:bg-aws-container/90 backdrop-blur-md shadow-md transition-all">
      {/* Main Top Header Bar */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Brand Logo & Partner Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <span className="text-amber-800 dark:text-aws-orange font-black text-xl tracking-wider drop-shadow-sm">RDS</span>
            <span className="text-aws-lightTextPrimary dark:text-aws-textPrimary font-bold text-lg">Sentinel</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-aws-orange/10 text-amber-900 dark:text-aws-orange border border-aws-orange/30 font-extrabold uppercase tracking-wider hidden sm:inline-block shadow-sm">
            {t("partnerBadge", language)}
          </span>

          {/* Dual Mode Switcher Toggle */}
          <button
            id="toggle-app-mode-btn"
            onClick={() => setAppMode(appMode === "mode_a" ? "mode_b" : "mode_a")}
            className="px-2.5 py-1 rounded-md bg-aws-orange/10 hover:bg-aws-orange/20 border border-aws-orange/30 text-amber-950 dark:text-aws-orange text-[10px] font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
            title={t("modeToggleTitle", language)}
          >
            {appMode === "mode_a" ? t("modeA", language) : t("modeB", language)}
          </button>
        </div>

        {/* Right: Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          <button
            id="start-product-tour-btn"
            onClick={() => {
              resetTourState();
              setCurrentTourStepIndex(0);
              setIsTourActive(true);
            }}
            className="text-xs px-3 py-1.5 rounded-md font-extrabold bg-aws-orange hover:bg-aws-orangeHover text-slate-950 transition-all active:scale-95 shadow-md flex items-center gap-1 cursor-pointer"
          >
            {t("tourBtn", language)}
          </button>

          <button
            id="export-csv-report-btn"
            onClick={exportCSVReport}
            className="px-3 py-1.5 rounded-md bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1 cursor-pointer"
            title={t("exportCsvTitle", language)}
          >
            {t("exportCsvBtn", language)}
          </button>

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
            className="px-3 py-1.5 rounded-md bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1 cursor-pointer"
            title={t("exportSoc2Title", language)}
          >
            {t("soc2Btn", language)}
          </button>

          <button
            id="open-settings-modal-btn"
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-3 py-1.5 rounded-md bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1 cursor-pointer"
            title={t("openSettingsTitle", language)}
          >
            {t("settingsBtn", language)}
          </button>

          {/* Developer Tools Menu Dropdown */}
          <div className="relative">
            <button
              id="dev-tools-dropdown-btn"
              onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
              className="px-3 py-1.5 rounded-md bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/10 border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1 cursor-pointer"
            >
              {t("devTools", language)} ▼
            </button>

            {isDevToolsOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
                <button
                  id="global-reset-simulators-btn"
                  onClick={() => {
                    handleResetAllSimulators();
                    setIsDevToolsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary hover:bg-aws-orange/10 flex items-center gap-2 cursor-pointer font-medium transition-colors"
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

      {/* Global Operational Subheader Filter Strip */}
      <div className="border-t border-aws-lightBorder/50 dark:border-aws-border/50 bg-aws-lightBg/40 dark:bg-aws-dark/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-2 flex flex-wrap items-center justify-between text-xs font-sans gap-3">
          {/* Left: Account & Cost Center Selectors */}
          <div className="flex items-center gap-3">
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
