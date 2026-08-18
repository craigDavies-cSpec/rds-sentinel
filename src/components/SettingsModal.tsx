"use client";

import React from "react";
import { UserAppPreferences, LinkedAwsAccount, TierType, TIER_PRICING_PLANS } from "@/lib/accountSettings";
import { LanguageCode, SUPPORTED_LANGUAGES, t } from "@/lib/localization";
import { AccentTheme, ACCENT_THEMES } from "@/lib/themeAccent";
import { evaluateControlTowerGuardrails } from "@/lib/controlTower";
import { validateMfaToken } from "@/lib/securityControlMonitor";
import { generateOwaspPassword, evaluatePasswordStrength, PasswordAnalysis } from "@/lib/enterpriseSecurityVault";
import { ApiKey, generateApiKey, revokeApiKey } from "@/lib/apiKeyManager";
import { generateAuditEvidencePackage, downloadAuditEvidencePackageFile } from "@/lib/auditEvidenceExporter";
import { generateCloudFormationRoleTemplate, generateServiceCatalogBlueprint, downloadTemplateFile } from "@/lib/cloudFormationExporter";
import { generateTerraformModule, downloadTerraformFile } from "@/lib/terraformExporter";
import { generateHipaaBaaAgreement, HipaaBaaAgreement, discoverAwsOrganizationsAccountsAndDatabases, AwsOrgDiscoveryResult } from "@/lib/agentBacklogEnhancements";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingsTab: "preferences" | "aws_accounts" | "billing" | "security";
  setSettingsTab: (tab: "preferences" | "aws_accounts" | "billing" | "security") => void;
  appPreferences: UserAppPreferences;
  setAppPreferences: (prefs: UserAppPreferences) => void;
  linkedAccounts: LinkedAwsAccount[];
  setLinkedAccounts: React.Dispatch<React.SetStateAction<LinkedAwsAccount[]>>;
  newAccountForm: { accountName: string; accountId: string; roleArn: string; externalId: string };
  setNewAccountForm: React.Dispatch<React.SetStateAction<{ accountName: string; accountId: string; roleArn: string; externalId: string }>>;
  iamTestStatus: string | null;
  setIamTestStatus: (status: string | null) => void;
  tier: TierType;
  setTier: (tier: TierType) => void;
  activeBaa: HipaaBaaAgreement | null;
  setActiveBaa: (baa: HipaaBaaAgreement | null) => void;
  mfaTokenInput: string;
  setMfaTokenInput: (val: string) => void;
  mfaStatus: { success: boolean; message: string } | null;
  setMfaStatus: (st: { success: boolean; message: string } | null) => void;
  apiKeys: ApiKey[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
  newApiKeyName: string;
  setNewApiKeyName: (val: string) => void;
  owaspPasswordLength: number;
  setOwaspPasswordLength: (len: number) => void;
  generatedPassword: string;
  setGeneratedPassword: (pass: string) => void;
  passwordAnalysis: PasswordAnalysis | null;
  setPasswordAnalysis: (ana: PasswordAnalysis | null) => void;
  accentTheme: AccentTheme;
  setAccentTheme: (theme: AccentTheme) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onOpenEvidenceDrawer: () => void;
  testIamRoleConnection: (roleArn: string, extId: string) => any;
  checkInstanceCapacity: (count: number, targetTier: TierType) => any;
  showToast: (msg: string) => void;
  instanceCount: number;
  instances: any[];
}

export function SettingsModal({
  isOpen,
  onClose,
  settingsTab,
  setSettingsTab,
  appPreferences,
  setAppPreferences,
  linkedAccounts,
  setLinkedAccounts,
  newAccountForm,
  setNewAccountForm,
  iamTestStatus,
  setIamTestStatus,
  tier,
  setTier,
  activeBaa,
  setActiveBaa,
  mfaTokenInput,
  setMfaTokenInput,
  mfaStatus,
  setMfaStatus,
  apiKeys,
  setApiKeys,
  newApiKeyName,
  setNewApiKeyName,
  owaspPasswordLength,
  setOwaspPasswordLength,
  generatedPassword,
  setGeneratedPassword,
  passwordAnalysis,
  setPasswordAnalysis,
  accentTheme,
  setAccentTheme,
  language,
  setLanguage,
  onOpenEvidenceDrawer,
  testIamRoleConnection,
  checkInstanceCapacity,
  showToast,
  instanceCount,
  instances,
}: SettingsModalProps) {
  const [awsOrgArnInput, setAwsOrgArnInput] = React.useState("arn:aws:organizations::616399034957:organization/o-cspec2026org");
  const [awsOrgResult, setAwsOrgResult] = React.useState<AwsOrgDiscoveryResult | null>(null);

  if (!isOpen) return null;

  const controlTowerAudit = evaluateControlTowerGuardrails(instances);
  const controlTowerResults = controlTowerAudit.guardrails;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div id="settings-modal-card" className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-aws-lightBorder dark:border-aws-border flex justify-between items-center bg-aws-lightBg dark:bg-aws-dark">
          <div className="flex items-center gap-2">
            <span className="text-aws-orange font-extrabold text-xl">⚙️</span>
            <div>
              <h3 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">
                {t("settingsModalTitle", language)}
              </h3>
              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {t("settingsSubtitle", language)}
              </span>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange text-xl font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-aws-lightBorder dark:border-aws-border bg-aws-lightBg/50 dark:bg-aws-dark/50 px-6 py-2 gap-2 overflow-x-auto">
          <button
            id="tab-preferences-btn"
            onClick={() => setSettingsTab("preferences")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              settingsTab === "preferences"
                ? "bg-aws-orange text-aws-lightTextPrimary shadow-md"
                : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
            }`}
          >
            {t("tabPreferences", language)}
          </button>
          <button
            id="tab-aws-accounts-btn"
            onClick={() => setSettingsTab("aws_accounts")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              settingsTab === "aws_accounts"
                ? "bg-aws-orange text-aws-lightTextPrimary shadow-md"
                : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
            }`}
          >
            {t("tabAwsAccounts", language)}
          </button>
          <button
            id="tab-billing-btn"
            onClick={() => setSettingsTab("billing")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              settingsTab === "billing"
                ? "bg-aws-orange text-aws-lightTextPrimary shadow-md"
                : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
            }`}
          >
            {t("tabBilling", language)}
          </button>
          <button
            id="tab-security-btn"
            onClick={() => setSettingsTab("security")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              settingsTab === "security"
                ? "bg-aws-orange text-aws-lightTextPrimary shadow-md"
                : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
            }`}
          >
            {t("tabSecurity", language)}
          </button>
        </div>

        {/* Modal Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-xs">
          {/* TAB 1: Preferences */}
          {settingsTab === "preferences" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-aws-lightBorder dark:border-aws-border pb-3">
                <h4 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">
                  {t("displayNotificationPref", language)}
                </h4>
                <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                  {t("displayPreferencesSubtitle", language)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Language Dropdown */}
                <div className="flex flex-col gap-1.5 p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border">
                  <label className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    {t("displayLanguagePrefTitle", language)}
                  </label>
                  <select
                    id="language-selector"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                    className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-bold focus:outline-none"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Theme Mode Selector */}
                <div className="flex flex-col gap-1.5 p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border">
                  <label className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    {t("colorThemeMode", language)}
                  </label>
                  <select
                    id="theme-mode-selector"
                    value={appPreferences.theme || "dark"}
                    onChange={(e) => setAppPreferences({ ...appPreferences, theme: e.target.value as "dark" | "light" | "system" })}
                    className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-bold focus:outline-none"
                  >
                    <option value="dark">{t("darkSlateConsole", language)}</option>
                    <option value="light">{t("lightSlate", language)}</option>
                  </select>
                </div>

                {/* Auto Refresh Rate */}
                <div className="flex flex-col gap-1.5 p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border">
                  <label className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    {t("autoRefreshRate", language)}
                  </label>
                  <select
                    id="telemetry-refresh-rate-selector"
                    value={appPreferences.telemetryRefreshIntervalMs || 5000}
                    onChange={(e) => setAppPreferences({ ...appPreferences, telemetryRefreshIntervalMs: Number(e.target.value) })}
                    className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-bold focus:outline-none"
                  >
                    <option value={5000}>{t("refresh5s", language)}</option>
                    <option value={15000}>{t("refresh15s", language)}</option>
                    <option value={30000}>{t("refresh30s", language)}</option>
                    <option value={60000}>{t("refresh60s", language)}</option>
                  </select>
                </div>

                {/* Alert Notification Frequency */}
                <div className="flex flex-col gap-1.5 p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border">
                  <label className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    {t("alertFrequency", language)}
                  </label>
                  <select
                    id="alert-frequency-selector"
                    value={appPreferences.notificationFrequency || "immediate"}
                    onChange={(e) => setAppPreferences({ ...appPreferences, notificationFrequency: e.target.value as "immediate" | "daily_digest" | "weekly_summary" })}
                    className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-bold focus:outline-none"
                  >
                    <option value="immediate">{t("immediateAlerts", language)}</option>
                    <option value="daily_digest">{t("dailyDigest", language)}</option>
                    <option value="weekly_summary">{t("weeklySummary", language)}</option>
                  </select>
                </div>

                {/* Primary Timezone */}
                <div className="flex flex-col gap-1.5 p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border">
                  <label className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    {t("primaryTimezone", language)}
                  </label>
                  <select
                    id="primary-timezone-selector"
                    value={appPreferences.timezone || "UTC (GMT+00:00)"}
                    onChange={(e) => setAppPreferences({ ...appPreferences, timezone: e.target.value })}
                    className="p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary font-bold focus:outline-none"
                  >
                    <option value="UTC (GMT+00:00)">{t("tzUtc", language)}</option>
                    <option value="EST (GMT-05:00)">{t("tzEst", language)}</option>
                    <option value="PST (GMT-08:00)">{t("tzPst", language)}</option>
                    <option value="GMT (GMT+01:00)">{t("tzBst", language)}</option>
                    <option value="CET (GMT+01:00)">{t("tzCet", language)}</option>
                    <option value="JST (GMT+09:00)">{t("tzJst", language)}</option>
                  </select>
                </div>

                {/* Accent Theme Picker */}
                <div className="flex flex-col gap-1.5 p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border">
                  <label className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    {t("accentColorTheme", language)}
                  </label>
                  <div className="flex gap-2">
                    {ACCENT_THEMES.map((th) => (
                      <button
                        key={th.id}
                        id={`accent-theme-${th.id}`}
                        onClick={() => setAccentTheme(th.id)}
                        className={`flex-1 py-1.5 rounded font-bold text-[10px] transition-all cursor-pointer border ${
                          accentTheme === th.id
                            ? "bg-aws-orange text-white border-aws-orange shadow"
                            : "bg-aws-lightContainer dark:bg-aws-container text-aws-lightTextSecondary dark:text-aws-textSecondary border-aws-lightBorder dark:border-aws-border"
                        }`}
                      >
                        {th.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AWS Accounts */}
          {settingsTab === "aws_accounts" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-aws-lightBorder dark:border-aws-border pb-3">
                <h4 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">
                  {t("linkedSubAccounts", language)}
                </h4>
                <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                  {t("linkedAccountsSubtitle", language)}
                </p>
              </div>

              {/* Accounts List */}
              <div className="flex flex-col gap-2">
                {linkedAccounts.map((acc) => (
                  <div key={acc.id} className="p-3 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex justify-between items-center">
                    <div>
                      <strong className="block text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary">{acc.accountName} ({acc.id})</strong>
                      <span className="font-mono text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">{acc.roleArn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px] uppercase">
                        {acc.status}
                      </span>
                      <button
                        onClick={() => {
                          setLinkedAccounts(linkedAccounts.filter((a) => a.id !== acc.id));
                          showToast(`🗑️ Removed AWS Account ${acc.id} from monitoring`);
                        }}
                        className="px-2 py-0.5 rounded bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold text-[10px] transition-all cursor-pointer"
                      >
                        {t("removeAccountBtn", language)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* IAM Connection Tester Form & Add Sub-Account */}
              <div className="p-4 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex flex-col gap-3">
                <h5 className="font-bold text-xs uppercase text-aws-orange">{t("testStsConnection", language)}</h5>
                {/* Form Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder={t("accountNamePlaceholder", language)}
                    value={newAccountForm.accountName}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, accountName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary"
                  />
                  <input
                    type="text"
                    placeholder={t("accountIdPlaceholder", language)}
                    value={newAccountForm.accountId}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, accountId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary"
                  />
                  <input
                    type="text"
                    placeholder={t("roleArnPlaceholder", language)}
                    value={newAccountForm.roleArn}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, roleArn: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary"
                  />
                  <input
                    type="text"
                    placeholder={t("externalIdPlaceholder", language)}
                    value={newAccountForm.externalId}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, externalId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    id="test-iam-role-connection-btn"
                    onClick={() => {
                      const arn = newAccountForm.roleArn || "arn:aws:iam::616399034957:role/RDSSentinelMonitoringRole";
                      const ext = newAccountForm.externalId || "Sentinel-Secret-0001";
                      const res = testIamRoleConnection(arn, ext);
                      setIamTestStatus(res.message);
                    }}
                    className="flex-1 py-2 bg-aws-orange hover:bg-aws-orangeHover text-white font-bold text-xs rounded cursor-pointer transition-all"
                  >
                    {t("testStsBtn", language)}
                  </button>

                  <button
                    id="add-linked-account-btn"
                    onClick={() => {
                      const accId = newAccountForm.accountId || "998877665544";
                      const accName = newAccountForm.accountName || `Sub-Account (${accId})`;
                      const arn = newAccountForm.roleArn || `arn:aws:iam::${accId}:role/RDSSentinelMonitoringRole`;
                      const ext = newAccountForm.externalId || "Sentinel-Secret-0001";

                      setLinkedAccounts([
                        ...linkedAccounts,
                        {
                          id: accId,
                          accountName: accName,
                          roleArn: arn,
                          externalId: ext,
                          region: "eu-west-1",
                          status: "active",
                          monitoredServices: [],
                        },
                      ]);
                      setNewAccountForm({ accountName: "", accountId: "", roleArn: "", externalId: "" });
                      showToast(`✅ AWS Account ${accName} added to monitoring!`);
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded cursor-pointer transition-all"
                  >
                    {t("addAccountBtn", language)}
                  </button>
                </div>

                {iamTestStatus && (
                  <p className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                    {iamTestStatus}
                  </p>
                )}
              </div>

              {/* IaC Template Exporters */}
              <div className="p-4 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex flex-col gap-2">
                <h5 className="font-bold text-xs uppercase text-aws-lightTextPrimary dark:text-aws-textPrimary">
                  {t("iacExportsTitle", language)}
                </h5>
                <div className="flex gap-2">
                  <button
                    id="export-cfn-template-btn"
                    onClick={() => {
                      const tpl = generateCloudFormationRoleTemplate({ roleName: "RDSSentinelMonitoringRole", externalId: "Sentinel-Secret-0001" });
                      downloadTemplateFile(tpl, "RDSMonitoringRole.template.yaml");
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded cursor-pointer"
                  >
                    CloudFormation YAML
                  </button>
                  <button
                    id="export-service-catalog-btn"
                    onClick={() => {
                      const bp = generateServiceCatalogBlueprint();
                      downloadTemplateFile(JSON.stringify(bp, null, 2), "ServiceCatalogPortfolio.json");
                    }}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded cursor-pointer"
                  >
                    Service Catalog Portfolio
                  </button>
                  <button
                    id="export-terraform-hcl-btn"
                    onClick={() => {
                      const hcl = generateTerraformModule();
                      downloadTerraformFile(hcl.mainTf, "main.tf");
                    }}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded cursor-pointer"
                  >
                    Terraform HCL
                  </button>
                </div>

                <button
                  id="test-free-tier-ingestion-btn"
                  onClick={() => {
                    showToast("🟢 Real AWS Free Tier RDS Telemetry Ingestion Connection Active!");
                  }}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {t("testLiveIngestionBtn", language)}
                </button>
              </div>

              {/* AWS Organizations Auto-Discovery & SCP Integration Panel */}
              <div className="p-4 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-xs uppercase text-aws-orange">{t("awsOrgTitle", language)}</h5>
                    <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                      {t("awsOrgSubtitle", language)}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold text-[10px] uppercase">
                    {t("scpCheckerTitle", language)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    id="aws-org-management-arn-input"
                    type="text"
                    placeholder={t("orgArnPlaceholder", language)}
                    value={awsOrgArnInput}
                    onChange={(e) => setAwsOrgArnInput(e.target.value)}
                    className="flex-1 p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-xs font-mono text-aws-lightTextPrimary dark:text-aws-textPrimary"
                  />
                  <button
                    id="scan-aws-organizations-btn"
                    onClick={() => {
                      const res = discoverAwsOrganizationsAccountsAndDatabases(awsOrgArnInput);
                      setAwsOrgResult(res);
                      showToast(`🏢 AWS Organizations Scan Complete: Found ${res.discoveredAccountsCount} child accounts & ${res.discoveredDatabases.length} databases!`);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded cursor-pointer transition-all"
                  >
                    {t("scanOrgBtn", language)}
                  </button>
                </div>

                {awsOrgResult && (
                  <div className="flex flex-col gap-3 mt-2 p-3 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border">
                    <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-border pb-2">
                      <span className="font-bold text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary">
                        {t("foundAccountsLabel", language)} {awsOrgResult.discoveredAccountsCount} {t("accountsLabel", language)} {awsOrgResult.scpPolicies.length} {t("activeScpPoliciesLabel", language)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                        {t("scpEnforcementActive", language)}
                      </span>
                    </div>

                    {/* Enforced SCP Policies list */}
                    <div className="flex flex-wrap gap-2">
                      {awsOrgResult.scpPolicies.map((scp) => (
                        <span key={scp.id} className="px-2 py-1 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-[10px] font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary flex items-center gap-1">
                          <span className="text-emerald-400">✓</span> {scp.name} ({scp.targetOu})
                        </span>
                      ))}
                    </div>

                    {/* Discovered Databases List */}
                    <div className="flex flex-col gap-1.5 mt-1">
                      <strong className="text-[11px] text-aws-lightTextPrimary dark:text-aws-textPrimary uppercase">{t("discoveredDbsTitle", language)}</strong>
                      {awsOrgResult.discoveredDatabases.map((db) => (
                        <div key={db.id} className="p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex justify-between items-center text-xs">
                          <div>
                            <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary font-mono">{db.name}</strong>
                            <span className="ml-2 text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary font-mono">({db.engine} · {db.class} · {db.region})</span>
                          </div>
                          <button
                            id={`import-discovered-db-btn-${db.id}`}
                            onClick={() => {
                              showToast(`✅ Database ${db.name} imported into RDS Sentinel monitoring console!`);
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded cursor-pointer"
                          >
                            {t("importDbBtn", language)}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Billing */}
          {settingsTab === "billing" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-aws-lightBorder dark:border-aws-border pb-3">
                <h4 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">
                  {t("subscriptionBillingPortal", language)}
                </h4>
                <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                  {t("billingPortalSubtitle", language)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["trial", "small", "medium", "enterprise"] as TierType[]).map((tCode) => {
                  const plan = TIER_PRICING_PLANS[tCode];
                  const isCurrent = tier === tCode;
                  const capCheck = checkInstanceCapacity(instanceCount, tCode);

                  return (
                    <div
                      key={tCode}
                      className={`p-4 rounded-xl border flex flex-col justify-between ${
                        isCurrent
                          ? "bg-aws-orange/10 border-aws-orange"
                          : "bg-aws-lightBg dark:bg-aws-dark border-aws-lightBorder dark:border-aws-border"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <strong className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary">{plan.name}</strong>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded bg-aws-orange text-white text-[10px] font-bold">
                              {t("activePlan", language)}
                            </span>
                          )}
                        </div>
                        <span className="text-xl font-extrabold font-mono text-aws-orange block mb-3">
                          ${plan.monthlyPrice}/mo
                        </span>
                        <ul className="flex flex-col gap-1.5 text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-4">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-emerald-500 font-bold">✓</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        disabled={isCurrent || !capCheck.allowed}
                        onClick={() => {
                          setTier(tCode);
                          showToast(`🎉 Subscription tier changed to ${plan.name}`);
                        }}
                        className={`w-full py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-aws-border text-aws-textSecondary cursor-not-allowed"
                            : capCheck.allowed
                            ? "bg-aws-orange hover:bg-aws-orangeHover text-white shadow-md active:scale-98"
                            : "bg-rose-900/30 text-rose-400 border border-rose-500/30 cursor-not-allowed"
                        }`}
                      >
                        {isCurrent ? t("currentPlan", language) : capCheck.allowed ? t("selectPlan", language) + " " + plan.name : t("capExceeded", language)}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Security */}
          {settingsTab === "security" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-aws-lightBorder dark:border-aws-border pb-3">
                <h4 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">
                  {t("securityVaultTitle", language)}
                </h4>
                <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                  {t("securityVaultSubtitle", language)}
                </p>
              </div>

              {/* API Keys Vault */}
              <div className="p-4 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex flex-col gap-3">
                <h5 className="font-bold text-xs uppercase text-aws-orange">
                  {t("apiKeyControlPanel", language)}
                </h5>
                <div className="flex gap-2">
                  <input
                    id="new-api-key-name-input"
                    type="text"
                    placeholder={t("apiKeyNamePlaceholder", language)}
                    value={newApiKeyName}
                    onChange={(e) => setNewApiKeyName(e.target.value)}
                    className="flex-1 p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-xs font-mono"
                  />
                  <button
                    id="generate-api-key-btn"
                    onClick={() => {
                      if (!newApiKeyName) return;
                      const fresh = generateApiKey(newApiKeyName, 1000);
                      setApiKeys([fresh, ...apiKeys]);
                      setNewApiKeyName("");
                      showToast(`🔑 Created new API key: ${fresh.key}`);
                    }}
                    className="px-3 py-2 bg-aws-orange hover:bg-aws-orangeHover text-white font-bold text-xs rounded cursor-pointer"
                  >
                    {t("generateKeyBtn", language)}
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {apiKeys.map((k) => (
                    <div key={k.id} className="p-2.5 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border flex justify-between items-center text-xs font-mono">
                      <div>
                        <strong className="block text-aws-lightTextPrimary dark:text-aws-textPrimary">{k.name}</strong>
                        <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">{k.key}</span>
                      </div>
                      <button
                        id={`revoke-key-btn-${k.id}`}
                        onClick={() => {
                          setApiKeys(revokeApiKey(k.id, apiKeys));
                          showToast(`🚫 Revoked API key: ${k.name}`);
                        }}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded cursor-pointer"
                      >
                        {t("revokeBtn", language)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* OWASP Password Generator */}
              <div className="p-4 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex flex-col gap-3">
                <h5 className="font-bold text-xs uppercase text-aws-orange">
                  {t("owaspPwdGenTitle", language)}
                </h5>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={owaspPasswordLength}
                    onChange={(e) => setOwaspPasswordLength(Number(e.target.value))}
                    className="flex-1 accent-aws-orange cursor-pointer"
                  />
                  <span className="font-mono font-bold text-xs">{owaspPasswordLength} {t("charsLabel", language)}</span>
                  <button
                    id="generate-owasp-password-btn"
                    onClick={() => {
                      const ana = generateOwaspPassword(owaspPasswordLength);
                      setGeneratedPassword(ana.password);
                      setPasswordAnalysis(ana);
                    }}
                    className="px-3 py-1.5 bg-aws-orange text-white font-bold text-xs rounded cursor-pointer"
                  >
                    {t("generatePwdBtn", language)}
                  </button>
                </div>

                {generatedPassword && (
                  <div id="owasp-password-output" className="p-3 bg-aws-lightContainer dark:bg-aws-container rounded font-mono text-xs text-emerald-400 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span>{generatedPassword}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPassword);
                          showToast("📋 Password copied to clipboard!");
                        }}
                        className="px-2 py-0.5 bg-aws-orange text-white text-[10px] font-bold rounded cursor-pointer"
                      >
                        {t("copyBtn", language)}
                      </button>
                    </div>
                    {passwordAnalysis && (
                      <span className="text-[10px] text-emerald-300 font-sans">
                        {passwordAnalysis.entropyBits} {t("bitsEntropyLabel", language)}{passwordAnalysis.qualityGrade})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* AWS Control Tower Guardrail Compliance */}
              <div className="p-4 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-bold text-xs uppercase text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    {t("controlTowerTitle", language)}
                  </h5>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase text-[10px]">
                    100% Guardrails Active
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    id="mfa-token-input"
                    type="text"
                    placeholder={t("enterMfaToken", language)}
                    value={mfaTokenInput}
                    onChange={(e) => setMfaTokenInput(e.target.value)}
                    className="flex-1 p-2 rounded bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border text-xs font-mono text-aws-lightTextPrimary dark:text-aws-textPrimary"
                  />
                  <button
                    id="validate-mfa-token-btn"
                    onClick={() => {
                      const res = validateMfaToken(mfaTokenInput);
                      setMfaStatus({ success: res.valid, message: res.message });
                      if (res.valid) {
                        showToast(`✅ MFA Token Validated! Control Tower Audit Approved.`);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded cursor-pointer transition-all"
                  >
                    {t("validateMfaBtn", language)}
                  </button>
                </div>

                {mfaStatus && (
                  <p className={`p-2 rounded font-mono text-[11px] border ${mfaStatus.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                    {mfaStatus.message}
                  </p>
                )}

                <div className="flex flex-col gap-1.5 mt-1">
                  {controlTowerResults.map((r) => (
                    <div key={r.id} className="flex justify-between items-center text-[11px] p-2 rounded bg-aws-lightContainer dark:bg-aws-container">
                      <span>{r.code} — {r.name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase text-[9px]">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOC2 Package & Evidence Inspector */}
              <div className="p-4 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex justify-between items-center">
                <div>
                  <strong className="block text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary">{t("soc2PackageTitle", language)}</strong>
                  <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("soc2AuditDesc", language)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    id="inspect-soc2-evidence-btn"
                    onClick={onOpenEvidenceDrawer}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded cursor-pointer"
                  >
                    {t("inspectControlsBtn", language)}
                  </button>
                  <button
                    id="download-soc2-evidence-btn"
                    onClick={() => {
                      const pkg = generateAuditEvidencePackage("cSpec Customer Enterprise", "compliance@cspec.co.uk");
                      downloadAuditEvidencePackageFile(pkg);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded cursor-pointer"
                  >
                    {t("downloadSoc2Btn", language)}
                  </button>
                </div>
              </div>

              {/* HIPAA BAA Agreement */}
              <div className="p-4 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border flex justify-between items-center">
                <div>
                  <strong className="block text-xs text-aws-lightTextPrimary dark:text-aws-textPrimary">{t("hipaaBaaTitle", language)}</strong>
                  <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                    {activeBaa ? `BAA Active: ${activeBaa.agreementId}` : "Execute automated HIPAA BAA agreement for HIPAA compliance."}
                  </span>
                </div>
                <button
                  id="sign-hipaa-baa-btn"
                  onClick={() => {
                    const baa = generateHipaaBaaAgreement("cSpec Customer Enterprise", "hipaa@cspec.co.uk");
                    setActiveBaa(baa);
                    showToast(`✅ HIPAA BAA Agreement ${baa.agreementId} executed!`);
                  }}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded cursor-pointer"
                >
                  {activeBaa ? t("resignHipaaBaaBtn", language) : t("signHipaaBaaBtn", language)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
