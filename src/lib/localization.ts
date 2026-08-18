// Enterprise Localization Engine (Phase 9A & 12 Pre-Production Release)

export type LanguageCode = "en" | "de" | "fr" | "ja";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export interface LocalizedRecommendation {
  title: string;
  reason: string;
}

export interface LocalizedTourStep {
  title: string;
  subtitle: string;
  description: string;
  badgeText: string;
}

export interface TranslationDictionary {
  // Header Toolbar & Subheader
  dashboardTitle: string;
  partnerBadge: string;
  tourBtn: string;
  exportCsvBtn: string;
  soc2Btn: string;
  settingsBtn: string;
  accountLabel: string;
  tagLabel: string;
  allTags: string;
  healthScore: string;
  savingsLabel: string;
  awsRates: string;
  tierLabel: string;
  devTools: string;
  resetSimulators: string;
  graphqlApi: string;
  resetLayoutBtn: string;
  layoutResetToast: string;
  layoutReorderedToast: string;
  dragHandleTitle: string;

  // Active Account Banner
  activeAccountBanner: string;
  liveMonitoredDb: string;

  // Target Databases & Telemetry Column
  targetDatabases: string;
  instanceTelemetry: string;
  cpuUtilization: string;
  simulateLoadSpike: string;
  resetCpu: string;
  activeConnections: string;
  historicalCpuProfile: string;
  clampedMax: string;
  critical: string;
  high: string;
  normal: string;
  hoverSampleTip: string;
  instanceClass: string;
  freeStorage: string;

  // Cost-Performance Balancer
  costBalancer: string;
  tierCapability: string;
  baseDbCost: string;
  optimizedSavings: string;
  optimizedCost: string;
  downsizeVerifiedTitle: string;
  downsizeVerifiedReason: string;
  proxyAdvisorTitle: string;
  proxyAdvisorDesc: string;
  poolEfficiency: string;
  latencyGain: string;
  memorySavings: string;
  clusterTopologyTitle: string;
  clusterTopologyDesc: string;
  failoverReady: string;
  multiRegionTitle: string;
  multiRegionDesc: string;
  syncLatency: string;
  egressCost: string;
  roiCalculator: string;
  netRoi: string;
  resetSlider: string;
  dbInstancesManaged: string;
  estAnnualCost: string;
  optAnnualCost: string;
  netAnnualSavings: string;
  applySavings: string;
  applied: string;

  // Recommendations Localized
  rec1Title: string;
  rec1Reason: string;
  rec2Title: string;
  rec2Reason: string;
  rec3Title: string;
  rec3Reason: string;
  rec4Title: string;
  rec4Reason: string;

  // Slow Query Inspector
  slowQueries: string;
  piiRedacted: string;
  paramMaskingActive: string;
  paramMaskingOff: string;
  slowQueryDesc: string;
  queryFingerprint: string;
  avgLatency: string;
  executionCount: string;
  impact: string;
  action: string;
  analyzeIndex: string;
  estSpeedup: string;
  copyDdl: string;
  ddlCopied: string;

  // Log Watcher & Telemetry Sandbox
  logWatcher: string;
  logScanningLocked: string;
  telemetrySandbox: string;
  ingestionOverride: string;
  dynamicScrapeWindow: string;
  calculatedInterval: string;
  monitoringCadence: string;
  loadSpikeWarning: string;
  idleInstanceMsg: string;
  telemetryOutbox: string;
  outboxCount: string;
  circuitBreakerLabel: string;
  online: string;
  disconnect: string;
  chaosSimulator: string;
  forceTripOpen: string;
  resetClosed: string;
  connectionOfflineMsg: string;
  billingMatrix: string;
  activeFeature: string;
  lockedFeature: string;
  slowQueryMetrics: string;
  costOptimizations: string;
  realTimeLogsWatcher: string;
  replicationLatencySuggester: string;
  slackPagerdutyIntegration: string;

  // Multi-Region Engine
  multiRegionEngineTitle: string;
  testFailover: string;
  writerRole: string;
  replicaRole: string;
  drRole: string;

  // Settings Modal Tabs & Controls
  settingsModalTitle: string;
  tabPreferences: string;
  tabAwsAccounts: string;
  tabBilling: string;
  tabSecurity: string;
  displayNotificationPref: string;
  colorThemeMode: string;
  darkSlateConsole: string;
  lightSlate: string;
  autoRefreshRate: string;
  alertFrequency: string;
  immediateAlerts: string;
  dailyDigest: string;
  weeklySummary: string;
  primaryTimezone: string;
  closeBtn: string;
  savePreferences: string;
  linkedSubAccounts: string;
  testAssumeRoleConnection: string;
  roleArnPlaceholder: string;
  extIdPlaceholder: string;
  testConnectionBtn: string;
  cfnServiceCatalogExport: string;
  downloadCfnTemplate: string;
  exportServiceCatalog: string;
  downloadTerraformHcl: string;
  runLiveIngestionTest: string;

  // Billing Portal Tab
  subscriptionBillingPortal: string;
  currentPlanBadge: string;
  changePlanBtn: string;
  activePlanBadge: string;
  confirmUpgradeTitle: string;
  confirmUpgradeMsg: string;
  proceedUpgradeBtn: string;
  cancelBtn: string;

  // Security & Vault Tab
  securityVaultTitle: string;
  owaspPwdGenTitle: string;
  entropyRatingLabel: string;
  generatePwdBtn: string;
  copyPwdBtn: string;
  copiedPwdBtn: string;
  apiKeyRateLimitVault: string;
  keyNamePlaceholder: string;
  rateLimitPlaceholder: string;
  generateApiKeyBtn: string;
  revokeKeyBtn: string;
  mfaControlTower: string;
  enterMfaToken: string;
  validateMfaBtn: string;
  soc2CompliancePackage: string;
  downloadSoc2Package: string;
  inspectEvidenceDrawer: string;
  hipaaBaaAgreement: string;
  signBaaBtn: string;
  signedBaaBadge: string;

  // GraphQL Modal
  graphqlModalTitle: string;
  graphqlQueryEditor: string;
  executeQueryBtn: string;
  jsonResultTitle: string;

  // Evidence Inspector Drawer
  evidenceDrawerTitle: string;
  auditIdLabel: string;

  // Product Tour Navigation
  tourStepPrefix: string;
  tourNextBtn: string;
  tourBackBtn: string;
  tourFinishBtn: string;

  // Complete UI Polish Keys
  modeA: string;
  modeB: string;
  lightTheme: string;
  darkTheme: string;
  allAccounts: string;
  lockedTrialCap: string;
  connectionState: string;
  offline: string;
  chaosToggle: string;
  settingsSubtitle: string;
  displayPreferencesSubtitle: string;
  accentColorTheme: string;
  linkedAccountsSubtitle: string;
  testStsConnection: string;
  testStsBtn: string;
  iacExportsTitle: string;
  testLiveIngestionBtn: string;
  awsOrgTitle: string;
  awsOrgSubtitle: string;
  scanOrgBtn: string;
  discoveredDbsTitle: string;
  importDbBtn: string;
  billingPortalSubtitle: string;
  activePlan: string;
  currentPlan: string;
  selectPlan: string;
  capExceeded: string;
  securityVaultSubtitle: string;
  apiKeyControlPanel: string;
  generateKeyBtn: string;
  revokeBtn: string;
  copyBtn: string;
  controlTowerTitle: string;
  soc2PackageTitle: string;
  inspectControlsBtn: string;
  downloadSoc2Btn: string;
  hipaaBaaTitle: string;
  signHipaaBaaBtn: string;
  resignHipaaBaaBtn: string;
  copyZeroDowntimeDdlBtn: string;

  // Deep Meticulous Pass UI Keys
  triggerTestFailoverBtn: string;
  enterpriseWebhookSimulatorTitle: string;
  triggerTestAnomalyAlertBtn: string;
  instancesCount: string;
  trialCostRecLimitTitle: string;
  trialCostRecLimitDesc: string;
  unlockSmallTierBtn: string;
  graphqlResultPlaceholder: string;
  trustServicesCriteriaSubtitle: string;
  overviewTab: string;
  tscControlsTab: string;
  iamProofsTab: string;
  downloadJsonPackageBtn: string;
  skipTourBtn: string;
  subscriptionMarketplaceTitle: string;
  selectModeUpgrade: string;
  awsAccountsLimit: string;
  dbInstancesLimit: string;
  includedEntitlements: string;
  testSandboxModeBtn: string;
  confirmMarketplaceBillingBtn: string;
  crossRegionReplicaRole: string;
  replicationLagLabel: string;
  failoverPriorityLabel: string;
  iopsThroughputLabel: string;
  nodeInspectorTitle: string;

  // Automated AST Scanner Comprehensive Keys
  moveBalancerLeftAria: string;
  moveBalancerRightAria: string;
  crossRegionLagLabel: string;
  failoverRtoLabel: string;
  webhookUrlAria: string;
  alertDeliveredTo: string;
  resetRoiSliderTitle: string;
  roiDbSliderAria: string;
  packageIdLabel: string;
  statusLabel: string;
  evaluatedStandardLabel: string;
  generatedForLabel: string;
  kmsMasterKeyLabel: string;
  tlsEnforcementLabel: string;
  proofLabel: string;
  iamAssumeRolePolicyLabel: string;
  externalIdConditionLabel: string;
  formatSoc2JsonPackageLabel: string;
  modeToggleTitle: string;
  exportCsvTitle: string;
  exportSoc2Title: string;
  openSettingsTitle: string;
  selectLanguageAria: string;
  toggleThemeTitle: string;
  selectAccountAria: string;
  awsRatesLabel: string;
  displayLanguagePrefTitle: string;
  externalIdPlaceholder: string;
  scpCheckerTitle: string;
  orgArnPlaceholder: string;
  foundAccountsLabel: string;
  accountsLabel: string;
  activeScpPoliciesLabel: string;
  scpEnforcementActive: string;
  apiKeyNamePlaceholder: string;
  charsLabel: string;
  bitsEntropyLabel: string;
  soc2AuditDesc: string;
  realTimeLogsLockedTitle: string;
  realTimeLogsLockedDesc: string;
  unlockMediumTierBtn: string;
  piiRedactedLabel: string;
  dbLabel: string;
  waitEventLabel: string;
  automatedIndexAdvisorTitle: string;
  aiExplainTitle: string;
  copyStandardDdlAria: string;
  zeroDowntimeProductionDdlTitle: string;
  copyZeroDowntimeDdlAria: string;
  optimizedQueryRewriteTitle: string;
  moveDbsLeftAria: string;
  moveDbsRightAria: string;
  cpuLabel: string;
  resetCpuTitle: string;
  simulateCpuLoadAria: string;
  engineLabel: string;
  regionLabel: string;
  liveAwsAccountLabel: string;
  liveAccountIn: string;
  targetTierLabel: string;
  monthLabel: string;
  moLabel: string;
  accountNamePlaceholder: string;
  accountIdPlaceholder: string;
  addAccountBtn: string;
  removeAccountBtn: string;
  refresh5s: string;
  refresh15s: string;
  refresh30s: string;
  refresh60s: string;
  tzUtc: string;
  tzEst: string;
  tzPst: string;
  tzBst: string;
  tzCet: string;
  tzJst: string;
  presetBalanced: string;
  presetFinOps: string;
  presetDba: string;
  presetAppliedToast: string;
  layoutProfilesHeader: string;
  systemControlsHeader: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    dashboardTitle: "RDS Sentinel",
    partnerBadge: "AWS Marketplace Partner",
    tourBtn: "🎯 2-Min Tour",
    exportCsvBtn: "📥 Export CSV",
    soc2Btn: "🛡️ SOC2 Audit",
    settingsBtn: "⚙️ Settings",
    accountLabel: "ACCOUNT:",
    tagLabel: "TAG:",
    allTags: "All Tags",
    healthScore: "Health Score:",
    savingsLabel: "Savings:",
    awsRates: "AWS Rates:",
    tierLabel: "TIER:",
    devTools: "🛠️ Dev Tools",
    resetSimulators: "Reset Simulators",
    graphqlApi: "GraphQL API",
    resetLayoutBtn: "Reset Default Layout",
    layoutResetToast: "🔄 Layout reset to default order!",
    layoutReorderedToast: "✨ Container layout reordered and saved!",
    dragHandleTitle: "Drag to reorder container",

    activeAccountBanner: "Active Live AWS Account:",
    liveMonitoredDb: "Live Monitored DB:",

    targetDatabases: "Target Databases",
    instanceTelemetry: "Instance Telemetry",
    cpuUtilization: "CPU Utilization",
    simulateLoadSpike: "SIMULATE LOAD SPIKE",
    resetCpu: "Reset CPU",
    activeConnections: "Active Connections",
    historicalCpuProfile: "Historical CPU Profile (Last 24 samples)",
    clampedMax: "Clamped to 50 max",
    critical: "Critical",
    high: "High",
    normal: "Normal",
    hoverSampleTip: "Hover over bar to view sample",
    instanceClass: "INSTANCE CLASS",
    freeStorage: "FREE STORAGE",

    costBalancer: "Cost-Performance Balancer",
    tierCapability: "Tier Capability:",
    baseDbCost: "BASE DB COST",
    optimizedSavings: "OPTIMIZED SAVINGS",
    optimizedCost: "OPTIMIZED COST",
    downsizeVerifiedTitle: "AWS Free Tier Optimization Verified",
    downsizeVerifiedReason: "free-tier-sandbox-db is running on db.t4g.micro under AWS Free Tier ($0/mo). CPU load is healthy (18%) and storage utilization is optimal.",
    proxyAdvisorTitle: "RDS Proxy Connection Pooling Advisor",
    proxyAdvisorDesc: "Current active connection pool on selected DB is high. Provisioning an RDS Proxy target will multiplex database connections, reducing memory overhead and preventing CPU spikes during surge traffic.",
    poolEfficiency: "Pool Efficiency",
    latencyGain: "Estimated Latency Gain:",
    memorySavings: "Memory Savings:",
    clusterTopologyTitle: "Aurora Cluster Topology Visualizer",
    clusterTopologyDesc: "Interactive multi-region cluster node graph. Click any node to inspect instance class, IOPS throughput, and promotion priority.",
    failoverReady: "Failover Ready",
    multiRegionTitle: "Multi-Region Replication Modeler",
    multiRegionDesc: "Cross-region read replica (us-east-1 ➔ us-west-2) synchronization lag averages 62ms. Data transfer egress is optimized at ~$14.20/mo.",
    syncLatency: "Sync Latency:",
    egressCost: "Egress Cost:",
    roiCalculator: "Interactive AWS Bill ROI Calculator",
    netRoi: "Net ROI",
    resetSlider: "Reset Slider",
    dbInstancesManaged: "Database Instances Managed:",
    estAnnualCost: "Est. AWS Bill Savings",
    optAnnualCost: "Subscription Cost",
    netAnnualSavings: "Net Annual Savings",
    applySavings: "Apply Recommendation",
    applied: "Applied",

    rec1Title: "Downsize Over-provisioned DB Instance",
    rec1Reason: "billing-db-mysql runs on db.m5.2xlarge. Historical CPU load has remained below 30% for 30 consecutive days. Downsizing to a db.m6g.xlarge reduces cost by 40% with identical memory and compute performance due to Graviton3 architecture efficiencies.",
    rec2Title: "Migrate Dev Sandbox to Aurora Serverless v2",
    rec2Reason: "dev-sandbox-db is active primarily during business hours (9 AM - 6 PM) and sits idle overnight. Converting to Aurora Serverless v2 with an auto-scaling range of 0.5 - 2 ACUs allows the instance to scale to zero at night while preventing CPU starvation during morning git merges.",
    rec3Title: "Add Aurora Read Replica in us-west-2 (Oregon)",
    rec3Reason: "Application logs show API queries originating from West Coast clients face latency averages of 148ms. Deploying a regional read-replica reduces West Coast read latency to 15ms. Estimated cross-region data transfer out cost: $14.50/mo.",
    rec4Title: "Enable Multi-AZ Standby Deployment",
    rec4Reason: "sales-db-prod is a single-node setup containing production data. Enabling Multi-AZ Standby provides automatic failover, SLA backup, and zero downtime for maintenance windows.",

    slowQueries: "Slow Query Inspector",
    piiRedacted: "PII Redacted",
    paramMaskingActive: "🛡️ Parameter Masking: ACTIVE (Safe)",
    paramMaskingOff: "⚠️ Parameter Masking: OFF (Raw)",
    slowQueryDesc: "Below are slow queries captured. Turning masking off exposes customer emails and credit cards in raw query strings (simulated local VPC view). Active masking converts database inputs to safe placeholder parameters before sending.",
    queryFingerprint: "Query Fingerprint",
    avgLatency: "Avg Latency",
    executionCount: "Count",
    impact: "Impact",
    action: "Action",
    analyzeIndex: "Analyze & Suggest Index",
    estSpeedup: "Est. Speedup:",
    copyDdl: "Copy DDL",
    ddlCopied: "Copied!",

    logWatcher: "Real-Time Logs Watcher",
    logScanningLocked: "Real-Time Log Scanning Locked",
    telemetrySandbox: "Telemetry Ingest Sandbox",
    ingestionOverride: "INGESTION ENDPOINT OVERRIDE",
    dynamicScrapeWindow: "DYNAMIC SCRAPE WINDOW",
    calculatedInterval: "Calculated Interval:",
    monitoringCadence: "Monitoring database telemetry at default tier cadence.",
    loadSpikeWarning: "⚠️ Load spike detected! Scraping at 3x frequency (30s) to monitor metrics.",
    idleInstanceMsg: "💤 Instance is idle. Scraping extended to save CloudWatch API request fees.",
    telemetryOutbox: "TELEMETRY OUTBOX OUTFLOW",
    outboxCount: "Outbox Queue Count:",
    circuitBreakerLabel: "Circuit Breaker:",
    online: "Online",
    disconnect: "Disconnect",
    chaosSimulator: "Chaos Simulator:",
    forceTripOpen: "Force Trip OPEN",
    resetClosed: "Reset to CLOSED",
    connectionOfflineMsg: "⚠️ Connection offline. Payloads are queueing in local cache. Backing off retry delay:",
    billingMatrix: "BILLING FEATURE MATRIX",
    activeFeature: "Active",
    lockedFeature: "Locked",
    slowQueryMetrics: "Slow Query Metrics",
    costOptimizations: "Cost Optimizations",
    realTimeLogsWatcher: "Real-Time Logs Watcher",
    replicationLatencySuggester: "Replication Latency Suggester",
    slackPagerdutyIntegration: "Slack & PagerDuty Integration",

    multiRegionEngineTitle: "Multi-Region Database Replication & Failover Engine",
    testFailover: "Test Failover",
    writerRole: "WRITER",
    replicaRole: "REPLICA",
    drRole: "DR",

    settingsModalTitle: "Account Settings & Subscription Billing Portal",
    tabPreferences: "🎨 App Preferences",
    tabAwsAccounts: "☁️ AWS Accounts & Services",
    tabBilling: "💳 Subscription & Billing",
    tabSecurity: "🛡️ Security & Vault",
    displayNotificationPref: "Dashboard Display & Notification Preferences",
    colorThemeMode: "Color Theme Mode",
    darkSlateConsole: "🌙 Dark Slate (AWS Console Theme)",
    lightSlate: "☀️ Light Slate",
    autoRefreshRate: "Telemetry Auto-Refresh Rate",
    alertFrequency: "Alert Notification Frequency",
    immediateAlerts: "🚨 Immediate Real-Time Anomaly Alerts",
    dailyDigest: "📅 Daily Summary Digest Email",
    weeklySummary: "📊 Weekly Executive Report",
    primaryTimezone: "Primary Timezone",
    closeBtn: "✕ Close",
    savePreferences: "Save Display Preferences",
    linkedSubAccounts: "Linked AWS Sub-Accounts & Monitored Databases",
    testAssumeRoleConnection: "Test AWS STS AssumeRole Connection",
    roleArnPlaceholder: "IAM Role ARN (arn:aws:iam::123456789012:role/...)",
    extIdPlaceholder: "ExternalId Token",
    testConnectionBtn: "Test STS Connection",
    cfnServiceCatalogExport: "CloudFormation & AWS Service Catalog IaC Infrastructure Exports",
    downloadCfnTemplate: "Download CloudFormation Template",
    exportServiceCatalog: "Export Service Catalog Portfolio",
    downloadTerraformHcl: "Download Terraform HCL",
    runLiveIngestionTest: "Run Live AWS Ingestion Test",

    subscriptionBillingPortal: "RDS Sentinel SaaS Subscription & Billing Portal",
    currentPlanBadge: "Current Active Plan",
    changePlanBtn: "Select Plan",
    activePlanBadge: "Active Plan",
    confirmUpgradeTitle: "Confirm Subscription Tier Upgrade",
    confirmUpgradeMsg: "Are you sure you want to change your RDS Sentinel subscription tier to",
    proceedUpgradeBtn: "Confirm & Change Tier",
    cancelBtn: "Cancel",

    securityVaultTitle: "Enterprise Security Vault & OWASP Password Generator",
    owaspPwdGenTitle: "Cryptographic Password Generator (OWASP Standard)",
    entropyRatingLabel: "Entropy Rating:",
    generatePwdBtn: "Generate New Password",
    copyPwdBtn: "Copy Password",
    copiedPwdBtn: "✓ Copied!",
    apiKeyRateLimitVault: "API Keys & Rate-Limiting Control Panel",
    keyNamePlaceholder: "API Key Name (e.g. Production CI/CD Pipeline)",
    rateLimitPlaceholder: "Rate Limit (req/min)",
    generateApiKeyBtn: "Generate New API Key",
    revokeKeyBtn: "Revoke",
    mfaControlTower: "AWS Control Tower Guardrails & MFA Verification",
    enterMfaToken: "Enter 6-Digit MFA Token",
    validateMfaBtn: "Validate MFA Token",
    soc2CompliancePackage: "SOC2 Type II & HIPAA Audit Evidence Exporter",
    downloadSoc2Package: "Download SOC2 Evidence Package",
    inspectEvidenceDrawer: "Inspect Evidence Controls",
    hipaaBaaAgreement: "HIPAA Business Associate Agreement (BAA)",
    signBaaBtn: "Sign HIPAA BAA",
    signedBaaBadge: "✅ BAA Active & Executed",

    graphqlModalTitle: "GraphQL Telemetry Developer API Inspector",
    graphqlQueryEditor: "GraphQL Query Editor",
    executeQueryBtn: "Execute GraphQL Query",
    jsonResultTitle: "GraphQL JSON Response",

    evidenceDrawerTitle: "SOC2 Type II Audit Evidence Inspector",
    auditIdLabel: "Audit ID:",

    tourStepPrefix: "Step",
    tourNextBtn: "Next Step ➔",
    tourBackBtn: "⬅ Back",
    tourFinishBtn: "Finish Tour",

    modeA: "🌐 Mode A: SaaS",
    modeB: "⚡ Mode B: AWS Extension",
    lightTheme: "Light",
    darkTheme: "Dark",
    allAccounts: "All AWS Accounts",
    lockedTrialCap: "🔒 Locked (Trial Cap: 2 DBs)",
    connectionState: "Connection State:",
    offline: "Connection offline",
    chaosToggle: "Chaos Toggle",
    settingsSubtitle: "Manage AWS Sub-Accounts, Notification Preferences & Tier Billing",
    displayPreferencesSubtitle: "Customize theme colors, polling refresh intervals, and alert frequencies.",
    accentColorTheme: "Accent Color Theme",
    linkedAccountsSubtitle: "Manage cross-account IAM monitoring roles and test STS AssumeRole connectivity.",
    testStsConnection: "Test AWS STS AssumeRole Connection",
    testStsBtn: "Test STS Connection",
    iacExportsTitle: "CloudFormation & AWS Service Catalog IaC Infrastructure Exports",
    testLiveIngestionBtn: "⚡ Test Live AWS Free Tier Telemetry Ingestion ($0 / month)",
    awsOrgTitle: "AWS Organizations Auto-Discovery & SCP Governance",
    awsOrgSubtitle: "Discover child AWS accounts and RDS/Aurora databases across sub-account OUs via sts:AssumeRole.",
    scanOrgBtn: "Scan Organization",
    discoveredDbsTitle: "Discovered Databases:",
    importDbBtn: "Import Database",
    billingPortalSubtitle: "Select tier pricing plan matching your monitored database capacity needs.",
    activePlan: "Active Plan",
    currentPlan: "Current Plan",
    selectPlan: "Select Plan",
    capExceeded: "Cap Exceeded",
    securityVaultSubtitle: "Cryptographic password generators, MFA validation, Control Tower guardrails, and SOC2 evidence exports.",
    apiKeyControlPanel: "API Keys & Rate-Limiting Control Panel",
    generateKeyBtn: "Generate Key",
    revokeBtn: "Revoke",
    copyBtn: "Copy",
    controlTowerTitle: "AWS Control Tower Guardrails & MFA Verification",
    soc2PackageTitle: "Automated SOC2 Type II Compliance Evidence Package",
    inspectControlsBtn: "Inspect Controls",
    downloadSoc2Btn: "Download SOC2 Package",
    hipaaBaaTitle: "HIPAA Business Associate Agreement (BAA)",
    signHipaaBaaBtn: "Sign HIPAA BAA",
    resignHipaaBaaBtn: "Re-sign BAA",
    copyZeroDowntimeDdlBtn: "Copy Zero-Downtime DDL",

    triggerTestFailoverBtn: "⚡ Trigger Test Failover Simulation",
    enterpriseWebhookSimulatorTitle: "Enterprise Webhook Dispatch Simulator",
    triggerTestAnomalyAlertBtn: "Trigger Test Anomaly Alert",
    instancesCount: "Instances",
    trialCostRecLimitTitle: "🔒 Cost recommendations are limited on the Trial tier.",
    trialCostRecLimitDesc: "Upgrade to Small Business or higher to unlock multi-region latency modeling and Aurora Serverless optimization.",
    unlockSmallTierBtn: "Unlock Small Business Tier",
    graphqlResultPlaceholder: "// Execution result will appear here...",
    trustServicesCriteriaSubtitle: "Trust Services Criteria Control Evidence",
    overviewTab: "Overview",
    tscControlsTab: "TSC Controls",
    iamProofsTab: "IAM & Encryption Proofs",
    downloadJsonPackageBtn: "Download JSON Package",
    skipTourBtn: "✕ Skip",
    subscriptionMarketplaceTitle: "Subscription Plan & AWS Marketplace Billing",
    selectModeUpgrade: "Select mode to upgrade to",
    awsAccountsLimit: "AWS Accounts Limit",
    dbInstancesLimit: "DB Instances Limit",
    includedEntitlements: "Included Entitlements:",
    testSandboxModeBtn: "🧪 Test in Sandbox Mode (Instant & Free)",
    confirmMarketplaceBillingBtn: "💳 Confirm AWS Marketplace Billing Subscription",
    crossRegionReplicaRole: "CROSS-REGION REPLICA",
    replicationLagLabel: "Replication Lag:",
    failoverPriorityLabel: "Failover Priority:",
    iopsThroughputLabel: "IOPS Throughput:",
    nodeInspectorTitle: "🔍 Node Inspector:",

    moveBalancerLeftAria: "Move Balancer Left",
    moveBalancerRightAria: "Move Balancer Right",
    crossRegionLagLabel: "Cross-Region Replication Lag:",
    failoverRtoLabel: "Failover RTO:",
    webhookUrlAria: "Webhook Endpoint URL",
    alertDeliveredTo: "RDS Sentinel Anomaly Alert delivered to",
    resetRoiSliderTitle: "Reset ROI DB slider count to default 10 DBs",
    roiDbSliderAria: "Database Instances Count for ROI Calculation",
    packageIdLabel: "Package ID:",
    statusLabel: "Status:",
    evaluatedStandardLabel: "Evaluated standard:",
    generatedForLabel: "Generated for",
    kmsMasterKeyLabel: "KMS Master Key",
    tlsEnforcementLabel: "TLS Transport Enforcement",
    proofLabel: "Proof:",
    iamAssumeRolePolicyLabel: "IAM AssumeRole Policy",
    externalIdConditionLabel: "ExternalId Condition",
    formatSoc2JsonPackageLabel: "Format: SOC2 Audit JSON Package",
    modeToggleTitle: "Toggle between Mode A (Standalone SaaS Console) and Mode B (AWS Management Console Extension)",
    exportCsvTitle: "Export CSV Performance Report",
    exportSoc2Title: "Export SOC2 / HIPAA Security Compliance Audit Package",
    openSettingsTitle: "Open Dashboard Settings & Account Management",
    selectLanguageAria: "Select Display Language",
    toggleThemeTitle: "Toggle Theme",
    selectAccountAria: "Select AWS Account",
    awsRatesLabel: "🟢 AWS Rates: $",
    displayLanguagePrefTitle: "Display Language / Sprache / Langue / 言語",
    externalIdPlaceholder: "ExternalId",
    scpCheckerTitle: "SCP Policy Checker",
    orgArnPlaceholder: "Management Account Organization ARN (arn:aws:organizations::...)",
    foundAccountsLabel: "Found",
    accountsLabel: "Accounts ·",
    activeScpPoliciesLabel: "Active SCP Policies",
    scpEnforcementActive: "SCP Enforcement: ACTIVE",
    apiKeyNamePlaceholder: "API Key Name (e.g. Datadog Stream)",
    charsLabel: "chars",
    bitsEntropyLabel: "Bits Entropy (",
    soc2AuditDesc: "Download certified audit proofs or open interactive drawer inspector.",
    realTimeLogsLockedTitle: "Real-Time Log Scanning Locked",
    realTimeLogsLockedDesc: "Real-time log scanning is a premium feature available in the Medium and Enterprise tiers.",
    unlockMediumTierBtn: "Unlock Medium Tier",
    piiRedactedLabel: "PII Redacted",
    dbLabel: "DB:",
    waitEventLabel: "Wait Event:",
    automatedIndexAdvisorTitle: "💡 Automated Index Advisor DDL",
    aiExplainTitle: "🤖 AI EXPLAIN Natural Language Diagnostic Advice:",
    copyStandardDdlAria: "Copy standard DDL index SQL statement",
    zeroDowntimeProductionDdlTitle: "⚡ Zero-Downtime Production DDL:",
    copyZeroDowntimeDdlAria: "Copy zero-downtime production DDL index SQL statement",
    optimizedQueryRewriteTitle: "Optimized Query Rewrite:",
    moveDbsLeftAria: "Move Databases Left",
    moveDbsRightAria: "Move Databases Right",
    cpuLabel: "CPU:",
    resetCpuTitle: "Reset CPU load to baseline performing state",
    simulateCpuLoadAria: "Simulate CPU Utilization Load",
    engineLabel: "Engine:",
    regionLabel: "Region:",
    liveAwsAccountLabel: "cSpec Live AWS Account",
    liveAccountIn: "in",
    targetTierLabel: "Target Tier:",
    monthLabel: "month",
    moLabel: "mo",
    accountNamePlaceholder: "Account Name (e.g. Production East)",
    accountIdPlaceholder: "12-Digit Account ID (e.g. 123456789012)",
    addAccountBtn: "➕ Add Linked AWS Account",
    removeAccountBtn: "Remove",
    refresh5s: "⚡ 5 Seconds (Real-Time)",
    refresh15s: "⏱️ 15 Seconds (Balanced)",
    refresh30s: "💤 30 Seconds (Eco Mode)",
    refresh60s: "😴 60 Seconds (Low CloudWatch API)",
    tzUtc: "UTC (GMT+00:00) Universal Coordinated",
    tzEst: "EST (GMT-05:00) US Eastern Standard",
    tzPst: "PST (GMT-08:00) US Pacific Standard",
    tzBst: "London / BST (GMT+01:00) United Kingdom",
    tzCet: "CET (GMT+01:00) Central European",
    tzJst: "JST (GMT+09:00) Japan Standard",
    presetBalanced: "⚖️ Balanced View",
    presetFinOps: "💰 FinOps / Cost View",
    presetDba: "🛠️ DBA / Telemetry View",
    presetAppliedToast: "🎯 Layout preset applied",
    layoutProfilesHeader: "Operational Layout Profiles",
    systemControlsHeader: "System Diagnostics & Controls",
  },
  de: {
    dashboardTitle: "RDS Sentinel",
    partnerBadge: "AWS Marketplace Partner",
    tourBtn: "🎯 2-Min Tour",
    exportCsvBtn: "📥 CSV Exportieren",
    soc2Btn: "🛡️ SOC2 Audit",
    settingsBtn: "⚙️ Einstellungen",
    accountLabel: "KONTO:",
    tagLabel: "TAG:",
    allTags: "Alle Tags",
    healthScore: "Gesundheitswert:",
    savingsLabel: "Ersparnis:",
    awsRates: "AWS Tarife:",
    tierLabel: "STUFE:",
    devTools: "🛠️ Entwickler-Tools",
    resetSimulators: "Simulatoren Zurücksetzen",
    graphqlApi: "GraphQL API",
    resetLayoutBtn: "Standard-Layout zurücksetzen",
    layoutResetToast: "🔄 Layout auf Standardreihenfolge zurückgesetzt!",
    layoutReorderedToast: "✨ Container-Layout neu geordnet und gespeichert!",
    dragHandleTitle: "Ziehen zum Umorganisieren des Containers",

    activeAccountBanner: "Aktives Live-AWS-Konto:",
    liveMonitoredDb: "Überwachte Live-DB:",

    targetDatabases: "Ziel-Datenbanken",
    instanceTelemetry: "Instanz-Telemetrie",
    cpuUtilization: "CPU-Auslastung",
    simulateLoadSpike: "LASTSPITZE SIMULIEREN",
    resetCpu: "CPU Zurücksetzen",
    activeConnections: "Aktive Verbindungen",
    historicalCpuProfile: "Historisches CPU-Profil (Letzte 24 Proben)",
    clampedMax: "Begrenzt auf max 50",
    critical: "Kritisch",
    high: "Hoch",
    normal: "Normal",
    hoverSampleTip: "Fahren Sie über den Balken, um die Probe zu sehen",
    instanceClass: "INSTANZ-KLASSE",
    freeStorage: "FREIER SPEICHER",

    costBalancer: "Kosten-Leistungs-Optimierer",
    tierCapability: "Stufen-Kapazität:",
    baseDbCost: "BASIS-DB-KOSTEN",
    optimizedSavings: "OPTIMIERTE ERSPARNIS",
    optimizedCost: "OPTIMIERTE KOSTEN",
    downsizeVerifiedTitle: "AWS Free-Tier Optimierung Verifiziert",
    downsizeVerifiedReason: "free-tier-sandbox-db läuft auf db.t4g.micro im AWS Free Tier ($0/Monat). CPU-Auslastung ist gesund (18%) und Speichernutzung ist optimal.",
    proxyAdvisorTitle: "RDS Proxy Verbindungs-Berater",
    proxyAdvisorDesc: "Die aktuelle Verbindungs-Anzahl der ausgewählten DB ist hoch. Die Bereitstellung eines RDS-Proxy-Ziels verteilt Datenbankverbindungen und verhindert CPU-Spitzen.",
    poolEfficiency: "Pool-Effizienz",
    latencyGain: "Geschätzter Latenzgewinn:",
    memorySavings: "Speicherersparnis:",
    clusterTopologyTitle: "Aurora Cluster-Topologie Visualisierer",
    clusterTopologyDesc: "Interaktiver Multi-Regionen Cluster-Graph. Klicken Sie auf einen Knoten zur Überprüfung von Instanzklasse, IOPS und Ausfallsicherheit.",
    failoverReady: "Ausfallsicher",
    multiRegionTitle: "Multi-Regionen Replikations-Modellierer",
    multiRegionDesc: "Replikationsverzögerung (us-east-1 ➔ us-west-2) beträgt durchschnittlich 62 ms. Datentransfer-Egress ist auf ~$14.20/Monat optimiert.",
    syncLatency: "Synchr.-Latenz:",
    egressCost: "Egress-Kosten:",
    roiCalculator: "Interaktiver AWS-Rechnungs ROI-Rechner",
    netRoi: "Netto-ROI",
    resetSlider: "Regler Zurücksetzen",
    dbInstancesManaged: "Verwaltete Datenbank-Instanzen:",
    estAnnualCost: "Geschätzte AWS-Ersparnis",
    optAnnualCost: "Abonnementpreis",
    netAnnualSavings: "Netto-Jahresersparnis",
    applySavings: "Empfehlung Anwenden",
    applied: "Angewendet",

    rec1Title: "Überdimensionierte DB-Instanz verkleinern",
    rec1Reason: "billing-db-mysql läuft auf db.m5.2xlarge. Die historische CPU-Auslastung lag 30 Tage in Folge unter 30%. Eine Verkleinerung auf db.m6g.xlarge reduziert die Kosten um 40% bei identischer Leistung durch Graviton3-Architektur.",
    rec2Title: "Entwicklungs-Sandbox zu Aurora Serverless v2 migrieren",
    rec2Reason: "dev-sandbox-db ist hauptsächlich während der Geschäftszeiten (9:00 - 18:00 Uhr) aktiv und nachts inaktiv. Die Konvertierung zu Aurora Serverless v2 ermöglicht Skalierung auf Null in der Nacht.",
    rec3Title: "Aurora Read Replica in us-west-2 (Oregon) hinzufügen",
    rec3Reason: "Anwendungsprotokolle zeigen API-Abfragen von der Westküste mit durchschnittlich 148 ms Latenz. Eine regionale Lese-Replika reduziert die Latenz auf 15 ms.",
    rec4Title: "Multi-AZ Standby-Bereitstellung aktivieren",
    rec4Reason: "sales-db-prod ist ein Einzelknoten-Setup mit Produktionsdaten. Die Aktivierung von Multi-AZ Standby bietet automatisches Failover und unterbrechungsfreie Wartungsfenster.",

    slowQueries: "Langsame Abfragen Inspektor",
    piiRedacted: "PII Anonymisiert",
    paramMaskingActive: "🛡️ Parameter-Maskierung: AKTIV (Sicher)",
    paramMaskingOff: "⚠️ Parameter-Maskierung: AUS (Roh)",
    slowQueryDesc: "Unten sind langsame Abfragen erfasst. Die Maskierung schützt Kunden-E-Mails und Kreditkarten in Roh-Abfragestrings.",
    queryFingerprint: "Abfrage-Fingerabdruck",
    avgLatency: "Durchschn. Latenz",
    executionCount: "Anzahl",
    impact: "Auswirkung",
    action: "Aktion",
    analyzeIndex: "Index Analysieren & Vorschlagen",
    estSpeedup: "Geschätzter Gewinn:",
    copyDdl: "DDL Kopieren",
    ddlCopied: "Kopiert!",

    logWatcher: "Echtzeit-Protokollüberwachung",
    logScanningLocked: "Echtzeit-Protokollüberwachung Gesperrt",
    telemetrySandbox: "Telemetrie-Ingest Sandbox",
    ingestionOverride: "INGESTION-ENDPUNKT ÜBERSCHREIBEN",
    dynamicScrapeWindow: "DYNAMISCHES INTERVALL",
    calculatedInterval: "Berechnetes Intervall:",
    monitoringCadence: "Überwachung der Datenbanktelemetrie im Standardintervall.",
    loadSpikeWarning: "⚠️ Lastspitze erkannt! Abfrage mit 3-facher Frequenz (30s) zur Metriküberwachung.",
    idleInstanceMsg: "💤 Instanz ist inaktiv. Abfrageintervall verlängert, um CloudWatch-API-Gebühren zu sparen.",
    telemetryOutbox: "TELEMETRIE OUTBOX AUSFLUSS",
    outboxCount: "Outbox-Warteschlange:",
    circuitBreakerLabel: "Schutzschalter:",
    online: "Online",
    disconnect: "Trennen",
    chaosSimulator: "Chaos-Simulator:",
    forceTripOpen: "Schalter AUSLÖSEN",
    resetClosed: "Auf GESCHLOSSEN zurücksetzen",
    connectionOfflineMsg: "⚠️ Verbindung offline. Daten werden im lokalen Cache zwischengespeichert. Verzögerung:",
    billingMatrix: "FUNKTIONSMATRIX",
    activeFeature: "Aktiv",
    lockedFeature: "Gesperrt",
    slowQueryMetrics: "Metriken Langsamer Abfragen",
    costOptimizations: "Kostenoptimierungen",
    realTimeLogsWatcher: "Echtzeit-Protokollüberwachung",
    replicationLatencySuggester: "Replikationslatenz-Berater",
    slackPagerdutyIntegration: "Slack & PagerDuty Integration",

    multiRegionEngineTitle: "Multi-Regionen Replikations- & Failover-Engine",
    testFailover: "Failover Testen",
    writerRole: "SCHREIBER",
    replicaRole: "REPLIKA",
    drRole: "DR",

    settingsModalTitle: "Kontoeinstellungen & Abonnements-Portal",
    tabPreferences: "🎨 Einstellungen",
    tabAwsAccounts: "☁️ AWS Konten & Dienste",
    tabBilling: "💳 Abonnements & Abrechnung",
    tabSecurity: "🛡️ Sicherheit & Tresor",
    displayNotificationPref: "Dashboard-Anzeige & Benachrichtigungseinstellungen",
    colorThemeMode: "Farbdesign-Modus",
    darkSlateConsole: "🌙 Dunkles Slate (AWS Konsolen-Design)",
    lightSlate: "☀️ Helles Slate",
    autoRefreshRate: "Automatische Aktualisierungsrate",
    alertFrequency: "Benachrichtigungshäufigkeit",
    immediateAlerts: "🚨 Sofortige Echtzeit-Warnungen",
    dailyDigest: "📅 Tägliche Zusammenfassung per E-Mail",
    weeklySummary: "📊 Wöchentlicher Bericht",
    primaryTimezone: "Primäre Zeitzone",
    closeBtn: "✕ Schließen",
    savePreferences: "Einstellungen Speichern",
    linkedSubAccounts: "Verknüpfte AWS Sub-Konten & Überwachte Datenbanken",
    testAssumeRoleConnection: "AWS STS AssumeRole Verbindung Testen",
    roleArnPlaceholder: "IAM Rollen ARN (arn:aws:iam::123456789012:role/...)",
    extIdPlaceholder: "ExternalId Token",
    testConnectionBtn: "STS Verbindung Testen",
    cfnServiceCatalogExport: "CloudFormation & AWS Service Catalog IaC Exporte",
    downloadCfnTemplate: "CloudFormation Vorlage Herunterladen",
    exportServiceCatalog: "Service Catalog Portfolio Exportieren",
    downloadTerraformHcl: "Terraform HCL Herunterladen",
    runLiveIngestionTest: "Live AWS Ingest-Test Ausführen",

    subscriptionBillingPortal: "RDS Sentinel SaaS Abonnements-Portal",
    currentPlanBadge: "Aktuell Aktiver Plan",
    changePlanBtn: "Plan Auswählen",
    activePlanBadge: "Aktiver Plan",
    confirmUpgradeTitle: "Abonnement-Upgrade Bestätigen",
    confirmUpgradeMsg: "Sind Sie sicher, dass Sie Ihre RDS Sentinel-Stufe ändern möchten auf",
    proceedUpgradeBtn: "Bestätigen & Stufe Ändern",
    cancelBtn: "Abbrechen",

    securityVaultTitle: "Sicherheitstresor & OWASP Passwort-Generator",
    owaspPwdGenTitle: "Kryptographischer Passwort-Generator (OWASP Standard)",
    entropyRatingLabel: "Entropie-Bewertung:",
    generatePwdBtn: "Neues Passwort Generieren",
    copyPwdBtn: "Passwort Kopieren",
    copiedPwdBtn: "✓ Kopiert!",
    apiKeyRateLimitVault: "API-Schlüssel & Ratenbegrenzung",
    keyNamePlaceholder: "API-Schlüssel Name (z.B. Produktions-Pipeline)",
    rateLimitPlaceholder: "Ratenlimit (Anfragen/Min)",
    generateApiKeyBtn: "Neuen API-Schlüssel Generieren",
    revokeKeyBtn: "Widerrufen",
    mfaControlTower: "AWS Control Tower Richtlinien & MFA Verifizierung",
    enterMfaToken: "6-Stelligen MFA-Token Eingeben",
    validateMfaBtn: "MFA-Token Überprüfen",
    soc2CompliancePackage: "SOC2 Type II & HIPAA Audit-Nachweise Exporter",
    downloadSoc2Package: "SOC2 Nachweispaket Herunterladen",
    inspectEvidenceDrawer: "Kontrollen Überprüfen",
    hipaaBaaAgreement: "HIPAA Business Associate Agreement (BAA)",
    signBaaBtn: "HIPAA BAA Unterzeichnen",
    signedBaaBadge: "✅ BAA Aktiv & Ausgeführt",

    graphqlModalTitle: "GraphQL Telemetry Entwickler-API Inspektor",
    graphqlQueryEditor: "GraphQL Abfrage-Editor",
    executeQueryBtn: "GraphQL Abfrage Ausführen",
    jsonResultTitle: "GraphQL JSON Antwort",

    evidenceDrawerTitle: "SOC2 Type II Audit-Nachweis Inspektor",
    auditIdLabel: "Audit ID:",

    tourStepPrefix: "Schritt",
    tourNextBtn: "Nächster Schritt ➔",
    tourBackBtn: "⬅ Zurück",
    tourFinishBtn: "Tour Beenden",

    modeA: "🌐 Modus A: SaaS",
    modeB: "⚡ Modus B: AWS-Erweiterung",
    lightTheme: "Hell",
    darkTheme: "Dunkel",
    allAccounts: "Alle AWS-Konten",
    lockedTrialCap: "🔒 Gesperrt (Testversion-Limit: 2 DBs)",
    connectionState: "Verbindungsstatus:",
    offline: "Verbindung offline",
    chaosToggle: "Chaos-Umschalter",
    settingsSubtitle: "Verwalten Sie AWS-Unterkonten, Benachrichtigungseinstellungen und Tarife",
    displayPreferencesSubtitle: "Anpassen von Themenfarben, Aktualisierungsintervallen und Warnfrequenzen.",
    accentColorTheme: "Akzentfarbenthema",
    linkedAccountsSubtitle: "Verwalten Sie kontoübergreifende IAM-Überwachungsrollen und testen Sie die STS-Konnektivität.",
    testStsConnection: "AWS STS AssumeRole-Verbindung testen",
    testStsBtn: "STS-Verbindung testen",
    iacExportsTitle: "CloudFormation & AWS Service Catalog IaC-Infrastrukturexporte",
    testLiveIngestionBtn: "⚡ Kostenlose AWS Free Tier Telemetrie-Einbindung testen (0 € / Monat)",
    awsOrgTitle: "AWS Organizations Automatische Erkennung & SCP-Governance",
    awsOrgSubtitle: "Erkennen Sie untergeordneten AWS-Konten und RDS/Aurora-Datenbanken über sts:AssumeRole.",
    scanOrgBtn: "Organisation scannen",
    discoveredDbsTitle: "Erkannte Datenbanken:",
    importDbBtn: "Datenbank importieren",
    billingPortalSubtitle: "Wählen Sie den Preisplan aus, der Ihren Datenbankkapazitätsanforderungen entspricht.",
    activePlan: "Aktiver Plan",
    currentPlan: "Aktueller Plan",
    selectPlan: "Plan auswählen",
    capExceeded: "Kapazität überschritten",
    securityVaultSubtitle: "Kryptografische Passwortgeneratoren, MFA-Validierung, Control Tower Guardrails und SOC2-Nachweise.",
    apiKeyControlPanel: "API-Schlüssel & Ratenbegrenzung-Bedienfeld",
    generateKeyBtn: "Schlüssel generieren",
    revokeBtn: "Widerrufen",
    copyBtn: "Kopieren",
    controlTowerTitle: "AWS Control Tower Guardrails & MFA-Überprüfung",
    soc2PackageTitle: "Automatisierte SOC2 Type II Konformitätsnachweise",
    inspectControlsBtn: "Kontrollen prüfen",
    downloadSoc2Btn: "SOC2-Paket herunterladen",
    hipaaBaaTitle: "HIPAA Business Associate Agreement (BAA)",
    signHipaaBaaBtn: "HIPAA BAA unterzeichnen",
    resignHipaaBaaBtn: "BAA erneut unterzeichnen",
    copyZeroDowntimeDdlBtn: "Ausfallfreie DDL kopieren",

    triggerTestFailoverBtn: "⚡ Test-Failover-Simulation auslösen",
    enterpriseWebhookSimulatorTitle: "Enterprise Webhook-Sende-Simulator",
    triggerTestAnomalyAlertBtn: "Test-Anomalie-Warnung auslösen",
    instancesCount: "Instanzen",
    trialCostRecLimitTitle: "🔒 Kostenempfehlungen sind in der Testversion eingeschränkt.",
    trialCostRecLimitDesc: "Upgraden Sie auf Small Business oder höher, um Multi-Regionen-Latenzmodellierung freizuschalten.",
    unlockSmallTierBtn: "Small Business Tarif freischalten",
    graphqlResultPlaceholder: "// Ausführungsergebnis erscheint hier...",
    trustServicesCriteriaSubtitle: "Trust Services Criteria Kontrollnachweise",
    overviewTab: "Übersicht",
    tscControlsTab: "TSC-Kontrollen",
    iamProofsTab: "IAM- & Verschlüsselungsnachweise",
    downloadJsonPackageBtn: "JSON-Paket herunterladen",
    skipTourBtn: "✕ Überspringen",
    subscriptionMarketplaceTitle: "Abonnement-Tarif & AWS Marketplace-Abrechnung",
    selectModeUpgrade: "Wählen Sie den Modus für das Upgrade auf",
    awsAccountsLimit: "AWS-Konten-Limit",
    dbInstancesLimit: "DB-Instanzen-Limit",
    includedEntitlements: "Enthaltene Leistungen:",
    testSandboxModeBtn: "🧪 Im Sandbox-Modus testen (Sofort & Kostenlos)",
    confirmMarketplaceBillingBtn: "💳 AWS Marketplace-Abrechnungsabonnement bestätigen",
    crossRegionReplicaRole: "REGIONENÜBERGREIFENDE REPLIK",
    replicationLagLabel: "Replikationsverzögerung:",
    failoverPriorityLabel: "Failover-Priorität:",
    iopsThroughputLabel: "IOPS-Durchsatz:",
    nodeInspectorTitle: "🔍 Knoten-Inspektor:",

    moveBalancerLeftAria: "Balancer nach links verschieben",
    moveBalancerRightAria: "Balancer nach rechts verschieben",
    crossRegionLagLabel: "Regionenübergreifende Replikationsverzögerung:",
    failoverRtoLabel: "Failover-RTO:",
    webhookUrlAria: "Webhook-Endpunkt-URL",
    alertDeliveredTo: "RDS Sentinel Anomalie-Warnung gesendet an",
    resetRoiSliderTitle: "ROI-DB-Schieberegler auf Standard 10 DBs zurücksetzen",
    roiDbSliderAria: "Anzahl der Datenbankinstanzen für ROI-Berechnung",
    packageIdLabel: "Paket-ID:",
    statusLabel: "Status:",
    evaluatedStandardLabel: "Bewerteter Standard:",
    generatedForLabel: "Erstellt für",
    kmsMasterKeyLabel: "KMS-Hauptschlüssel",
    tlsEnforcementLabel: "TLS-Transport erzwingen",
    proofLabel: "Nachweis:",
    iamAssumeRolePolicyLabel: "IAM-AssumeRole-Richtlinie",
    externalIdConditionLabel: "ExternalId-Bedingung",
    formatSoc2JsonPackageLabel: "Format: SOC2 Audit JSON-Paket",
    modeToggleTitle: "Umschalten zwischen Modus A (SaaS-Konsole) und Modus B (AWS-Konsolen-Erweiterung)",
    exportCsvTitle: "CSV-Leistungsbericht exportieren",
    exportSoc2Title: "SOC2 / HIPAA Sicherheits-Audit-Paket exportieren",
    openSettingsTitle: "Dashboard-Einstellungen & Kontoverwaltung öffnen",
    selectLanguageAria: "Anzeigesprache auswählen",
    toggleThemeTitle: "Design umschalten",
    selectAccountAria: "AWS-Konto auswählen",
    awsRatesLabel: "🟢 AWS-Tarife: $",
    displayLanguagePrefTitle: "Display Language / Sprache / Langue / 言語",
    externalIdPlaceholder: "ExternalId",
    scpCheckerTitle: "SCP-Richtlinien-Prüfer",
    orgArnPlaceholder: "Management-Konto Organisations-ARN (arn:aws:organizations::...)",
    foundAccountsLabel: "Gefunden",
    accountsLabel: "Konten ·",
    activeScpPoliciesLabel: "Aktive SCP-Richtlinien",
    scpEnforcementActive: "SCP-Durchsetzung: AKTIV",
    apiKeyNamePlaceholder: "API-Schlüssel-Name (z.B. Datadog Stream)",
    charsLabel: "Zeichen",
    bitsEntropyLabel: "Bit Entropie (",
    soc2AuditDesc: "Zertifizierte Audit-Nachweise herunterladen oder interaktiven Inspector öffnen.",
    realTimeLogsLockedTitle: "Echtzeit-Log-Scanning gesperrt",
    realTimeLogsLockedDesc: "Echtzeit-Log-Scanning ist eine Premium-Funktion, die in den Tarifen Medium und Enterprise verfügbar ist.",
    unlockMediumTierBtn: "Medium Tarif freischalten",
    piiRedactedLabel: "PII anonymisiert",
    dbLabel: "DB:",
    waitEventLabel: "Warte-Ereignis:",
    automatedIndexAdvisorTitle: "💡 Automatisierter Index Advisor DDL",
    aiExplainTitle: "🤖 KI EXPLAIN Diagnosehinweise in natürlicher Sprache:",
    copyStandardDdlAria: "Standard DDL Index SQL-Anweisung kopieren",
    zeroDowntimeProductionDdlTitle: "⚡ Ausfallfreie Produktions-DDL:",
    copyZeroDowntimeDdlAria: "Ausfallfreie Produktions-DDL Index SQL-Anweisung kopieren",
    optimizedQueryRewriteTitle: "Optimierte Abfrage-Umschreibung:",
    moveDbsLeftAria: "Datenbanken nach links verschieben",
    moveDbsRightAria: "Datenbanken nach rechts verschieben",
    cpuLabel: "CPU:",
    resetCpuTitle: "CPU-Auslastung auf Baseline zurücksetzen",
    simulateCpuLoadAria: "CPU-Auslastung simulieren",
    engineLabel: "Engine:",
    regionLabel: "Region:",
    liveAwsAccountLabel: "cSpec Live AWS Konto",
    liveAccountIn: "in",
    targetTierLabel: "Ziel-Tarif:",
    monthLabel: "Monat",
    moLabel: "Mon",
    accountNamePlaceholder: "Konto-Name (z.B. Produktion Ost)",
    accountIdPlaceholder: "12-stellige Konto-ID (z.B. 123456789012)",
    addAccountBtn: "➕ Verknüpftes AWS-Konto hinzufügen",
    removeAccountBtn: "Entfernen",
    refresh5s: "⚡ 5 Sekunden (Echtzeit)",
    refresh15s: "⏱️ 15 Sekunden (Ausgewogen)",
    refresh30s: "💤 30 Sekunden (Öko-Modus)",
    refresh60s: "😴 60 Sekunden (Niedrige API-Nutzung)",
    tzUtc: "UTC (GMT+00:00) Koordinierte Weltzeit",
    tzEst: "EST (GMT-05:00) US-Ostküstenzeit",
    tzPst: "PST (GMT-08:00) US-Pazifikzeit",
    tzBst: "London / BST (GMT+01:00) Großbritannien",
    tzCet: "MEZ (GMT+01:00) Mitteleuropäische Zeit",
    tzJst: "JST (GMT+09:00) Japanische Standardzeit",
    presetBalanced: "⚖️ Ausgewogene Ansicht",
    presetFinOps: "💰 FinOps / Kosten-Ansicht",
    presetDba: "🛠️ DBA / Telemetrie-Ansicht",
    presetAppliedToast: "🎯 Layout-Vorlage angewendet",
    layoutProfilesHeader: "Betriebliche Layout-Profile",
    systemControlsHeader: "Systemdiagnose & Steuerung",
  },
  fr: {
    dashboardTitle: "RDS Sentinel",
    partnerBadge: "Partenaire AWS Marketplace",
    tourBtn: "🎯 Tour 2-Min",
    exportCsvBtn: "📥 Exporter CSV",
    soc2Btn: "🛡️ Audit SOC2",
    settingsBtn: "⚙️ Paramètres",
    accountLabel: "COMPTE:",
    tagLabel: "BALISE:",
    allTags: "Toutes les Balises",
    healthScore: "Score de Santé:",
    savingsLabel: "Économies:",
    awsRates: "Tarifs AWS:",
    tierLabel: "NIVEAU:",
    devTools: "🛠️ Outils Développeur",
    resetSimulators: "Réinitialiser Simulateurs",
    graphqlApi: "API GraphQL",
    resetLayoutBtn: "Réinitialiser la disposition par défaut",
    layoutResetToast: "🔄 Disposition réinitialisée à l'ordre par défaut !",
    layoutReorderedToast: "✨ Disposition des conteneurs réorganisée et enregistrée !",
    dragHandleTitle: "Faites glisser pour réorganiser le conteneur",

    activeAccountBanner: "Compte AWS Actif en Direct:",
    liveMonitoredDb: "BDD Surveillée en Direct:",

    targetDatabases: "Bases de Données Cibles",
    instanceTelemetry: "Télémétrie d'instance",
    cpuUtilization: "Utilisation du CPU",
    simulateLoadSpike: "SIMULER PIC DE CHARGE",
    resetCpu: "Réinitialiser CPU",
    activeConnections: "Connexions Actives",
    historicalCpuProfile: "Profil CPU Historique (24 derniers échantillons)",
    clampedMax: "Limité à 50 max",
    critical: "Critique",
    high: "Élevé",
    normal: "Normal",
    hoverSampleTip: "Survolez la barre pour voir l'échantillon",
    instanceClass: "CLASSE D'INSTANCE",
    freeStorage: "STOCKAGE LIBRE",

    costBalancer: "Équilibreur Coût-Performance",
    tierCapability: "Capacité du Niveau:",
    baseDbCost: "COÛT DE BASE BDD",
    optimizedSavings: "ÉCONOMIES OPTIMISÉES",
    optimizedCost: "COÛT OPTIMISÉ",
    downsizeVerifiedTitle: "Optimisation AWS Offre Gratuite Vérifiée",
    downsizeVerifiedReason: "free-tier-sandbox-db s'exécute sur db.t4g.micro sous AWS Offre Gratuite ($0/mois). L'utilisation CPU est saine (18%) et le stockage est optimal.",
    proxyAdvisorTitle: "Conseiller en Pool de Connexions RDS Proxy",
    proxyAdvisorDesc: "Le pool de connexions actif sur la BDD sélectionnée est élevé. Le provisionnement d'un RDS Proxy réduira l'utilisation mémoire et évitera les pics CPU.",
    poolEfficiency: "Efficacité du Pool",
    latencyGain: "Gain de Latence Estimé:",
    memorySavings: "Économies de Mémoire:",
    clusterTopologyTitle: "Visualiseur de Topologie de Cluster Aurora",
    clusterTopologyDesc: "Graphe interactif de nœuds de cluster multi-régions. Cliquez sur un nœud pour inspecter la classe d'instance et les IOPS.",
    failoverReady: "Prêt pour Basculement",
    multiRegionTitle: "Modéliseur de Réplication Multi-Régions",
    multiRegionDesc: "Le délai de synchronisation de la réplique (us-east-1 ➔ us-west-2) est de 62ms en moyenne. Le coût de sortie est optimisé à ~$14.20/mois.",
    syncLatency: "Latence Synchro:",
    egressCost: "Coût Egress:",
    roiCalculator: "Calculateur de ROI Facture AWS Interactif",
    netRoi: "ROI Net",
    resetSlider: "Réinitialiser Curseur",
    dbInstancesManaged: "Instances BDD Gérées:",
    estAnnualCost: "Économies Estimées Facture AWS",
    optAnnualCost: "Coût de l'Abonnement",
    netAnnualSavings: "Économies Annuelles Nettes",
    applySavings: "Appliquer Recommandation",
    applied: "Appliqué",

    rec1Title: "Réduire la taille d'une instance surdimensionnée",
    rec1Reason: "billing-db-mysql s'exécute sur db.m5.2xlarge. La charge CPU est restée inférieure à 30% pendant 30 jours. Le passage à db.m6g.xlarge réduit les coûts de 40%.",
    rec2Title: "Migrer la Sandbox Dev vers Aurora Serverless v2",
    rec2Reason: "dev-sandbox-db est active pendant les heures de bureau (9h - 18h) et inactive la nuit. La conversion vers Aurora Serverless v2 permet de réduire la charge à zéro la nuit.",
    rec3Title: "Ajouter une réplique de lecture Aurora dans us-west-2",
    rec3Reason: "Les journaux d'application montrent des requêtes API provenant de la côte ouest avec une latence moyenne de 148ms. Une réplique régionale réduit la latence à 15ms.",
    rec4Title: "Activer le déploiement Standby Multi-AZ",
    rec4Reason: "sales-db-prod est une configuration mono-nœud avec des données de production. L'activation de Multi-AZ Standby fournit un basculement automatique.",

    slowQueries: "Inspecteur de Requêtes Lentes",
    piiRedacted: "PII Anonymisé",
    paramMaskingActive: "🛡️ Masquage Paramètres: ACTIF (Sécurisé)",
    paramMaskingOff: "⚠️ Masquage Paramètres: DESACTIF (Brut)",
    slowQueryDesc: "Ci-dessous sont capturées les requêtes lentes. Le désactivation du masquage expose les e-mails et cartes bancaires des clients.",
    queryFingerprint: "Empreinte de Requête",
    avgLatency: "Latence Moy",
    executionCount: "Nombre",
    impact: "Impact",
    action: "Action",
    analyzeIndex: "Analyser et Suggérer Index",
    estSpeedup: "Gain de Vitesse Estimé:",
    copyDdl: "Copier DDL",
    ddlCopied: "Copié!",

    logWatcher: "Surveillance des Anomales en Temps Réel",
    logScanningLocked: "Surveillance des Journaux Verrouillée",
    telemetrySandbox: "Bac à Sable Ingestion Télémétrie",
    ingestionOverride: "SURCHARGER ENDPOINT INGESTION",
    dynamicScrapeWindow: "FENETRE DE BALAYAGE DYNAMIQUE",
    calculatedInterval: "Intervalle Calculé:",
    monitoringCadence: "Surveillance de la télémétrie de la base de données.",
    loadSpikeWarning: "⚠️ Pic de charge détecté ! Fréquence de balayage multipliée par 3 (30s).",
    idleInstanceMsg: "💤 Instance inactive. Intervalle prolongé pour économiser les frais d'API.",
    telemetryOutbox: "FLUX BOITE DE SORTIE TELEMETRIE",
    outboxCount: "File d'attente Outbox:",
    circuitBreakerLabel: "Disjoncteur:",
    online: "En Ligne",
    disconnect: "Déconnecter",
    chaosSimulator: "Simulateur de Chaos:",
    forceTripOpen: "Forcer Ouverture",
    resetClosed: "Réinitialiser FERMÉ",
    connectionOfflineMsg: "⚠️ Connexion hors ligne. Les données sont en file d'attente locale. Délai:",
    billingMatrix: "MATRICE DES FONCTIONNALITES",
    activeFeature: "Actif",
    lockedFeature: "Verrouillé",
    slowQueryMetrics: "Métriques de Requêtes Lentes",
    costOptimizations: "Optimisations de Coûts",
    realTimeLogsWatcher: "Surveillance des Journaux",
    replicationLatencySuggester: "Conseiller de Latence de Réplication",
    slackPagerdutyIntegration: "Intégration Slack & PagerDuty",

    multiRegionEngineTitle: "Moteur de Réplication Multi-Régions & Basculement",
    testFailover: "Tester Basculement",
    writerRole: "ÉCRIVAIN",
    replicaRole: "RÉPLIQUE",
    drRole: "SECOURS",

    settingsModalTitle: "Paramètres du Compte & Portail de Facturation",
    tabPreferences: "🎨 Préférences",
    tabAwsAccounts: "☁️ Comptes AWS & Services",
    tabBilling: "💳 Abonnement & Facturation",
    tabSecurity: "🛡️ Sécurité & Coffre",
    displayNotificationPref: "Préférences d'Affichage et de Notification",
    colorThemeMode: "Mode de Thème de Couleur",
    darkSlateConsole: "🌙 Ardoise Sombre (Thème Console AWS)",
    lightSlate: "☀️ Ardoise Claire",
    autoRefreshRate: "Taux de Rafraîchissement Automatique",
    alertFrequency: "Fréquence des Alertes",
    immediateAlerts: "🚨 Alertes en Temps Réel Immédiates",
    dailyDigest: "📅 E-mail Récapitulatif Quotidien",
    weeklySummary: "📊 Rapport Hebdomadaire",
    primaryTimezone: "Fuseau Horaire Principal",
    closeBtn: "✕ Fermer",
    savePreferences: "Enregistrer Préférences",
    linkedSubAccounts: "Sous-comptes AWS Liés & Bases de Données Surveillées",
    testAssumeRoleConnection: "Tester la Connexion STS AssumeRole",
    roleArnPlaceholder: "ARN du Rôle IAM (arn:aws:iam::123456789012:role/...)",
    extIdPlaceholder: "Jeton ExternalId",
    testConnectionBtn: "Tester Connexion STS",
    cfnServiceCatalogExport: "Exportations CloudFormation & AWS Service Catalog",
    downloadCfnTemplate: "Télécharger Modèle CloudFormation",
    exportServiceCatalog: "Exporter Portfolio Service Catalog",
    downloadTerraformHcl: "Télécharger Terraform HCL",
    runLiveIngestionTest: "Exécuter Test Ingestion AWS Direct",

    subscriptionBillingPortal: "Portail d'Abonnement SaaS RDS Sentinel",
    currentPlanBadge: "Plan Actif Actuel",
    changePlanBtn: "Sélectionner Plan",
    activePlanBadge: "Plan Actif",
    confirmUpgradeTitle: "Confirmer la Mise à Niveau",
    confirmUpgradeMsg: "Êtes-vous sûr de vouloir changer votre niveau d'abonnement RDS Sentinel pour",
    proceedUpgradeBtn: "Confirmer et Changer de Niveau",
    cancelBtn: "Annuler",

    securityVaultTitle: "Coffre-fort de Sécurité & Générateur de Mots de Passe OWASP",
    owaspPwdGenTitle: "Générateur de Mots de Passe Cryptographiques (Standard OWASP)",
    entropyRatingLabel: "Évaluation de l'Entropie:",
    generatePwdBtn: "Générer Nouveau Mot de Passe",
    copyPwdBtn: "Copier Mot de Passe",
    copiedPwdBtn: "✓ Copié !",
    apiKeyRateLimitVault: "Clés API & Panneau de Contrôle de Limitation",
    keyNamePlaceholder: "Nom de la Clé API (ex: Pipeline CI/CD Prod)",
    rateLimitPlaceholder: "Limite de Taux (req/min)",
    generateApiKeyBtn: "Générer Nouvelle Clé API",
    revokeKeyBtn: "Révoquer",
    mfaControlTower: "Règles AWS Control Tower & Vérification MFA",
    enterMfaToken: "Saisir le Jeton MFA à 6 Chiffres",
    validateMfaBtn: "Valider le Jeton MFA",
    soc2CompliancePackage: "Exportateur de Preuves d'Audit SOC2 Type II & HIPAA",
    downloadSoc2Package: "Télécharger le Paquet de Preuves SOC2",
    inspectEvidenceDrawer: "Inspecter les Contrôles",
    hipaaBaaAgreement: "Accord de Partenariat Commercial HIPAA (BAA)",
    signBaaBtn: "Signer le BAA HIPAA",
    signedBaaBadge: "✅ BAA Actif & Exécuté",

    graphqlModalTitle: "Inspecteur API Développeur GraphQL",
    graphqlQueryEditor: "Éditeur de Requêtes GraphQL",
    executeQueryBtn: "Exécuter la Requête GraphQL",
    jsonResultTitle: "Réponse JSON GraphQL",

    evidenceDrawerTitle: "Inspecteur de Preuves d'Audit SOC2 Type II",
    auditIdLabel: "ID d'Audit :",

    tourStepPrefix: "Étape",
    tourNextBtn: "Étape Suivante ➔",
    tourBackBtn: "⬅ Retour",
    tourFinishBtn: "Terminer la Visite",

    modeA: "🌐 Mode A : SaaS",
    modeB: "⚡ Mode B : Extension AWS",
    lightTheme: "Clair",
    darkTheme: "Sombre",
    allAccounts: "Tous les comptes AWS",
    lockedTrialCap: "🔒 Verrouillé (Limite d'essai : 2 BDD)",
    connectionState: "État de la connexion :",
    offline: "Connexion hors ligne",
    chaosToggle: "Bascule Chaos",
    settingsSubtitle: "Gérez les sous-comptes AWS, les préférences de notification et la facturation.",
    displayPreferencesSubtitle: "Personnalisez les couleurs du thème, les intervalles de rafraîchissement et la fréquence des alertes.",
    accentColorTheme: "Thème de couleur d'accentuation",
    linkedAccountsSubtitle: "Gérez les rôles de surveillance IAM intercomptes et testez la connectivité STS.",
    testStsConnection: "Tester la connexion AWS STS AssumeRole",
    testStsBtn: "Tester la connexion STS",
    iacExportsTitle: "Exportations d'infrastructure IaC CloudFormation et AWS Service Catalog",
    testLiveIngestionBtn: "⚡ Tester l'ingestion de télémétrie AWS Free Tier en direct (0 € / mois)",
    awsOrgTitle: "Découverte automatique AWS Organizations & Gouvernance SCP",
    awsOrgSubtitle: "Découvrez les comptes AWS enfants et les bases de données RDS/Aurora via sts:AssumeRole.",
    scanOrgBtn: "Analyser l'organisation",
    discoveredDbsTitle: "Bases de données découvertes :",
    importDbBtn: "Importer la base de données",
    billingPortalSubtitle: "Sélectionnez le forfait tarifaire correspondant à vos besoins en capacité de base de données.",
    activePlan: "Plan actif",
    currentPlan: "Plan actuel",
    selectPlan: "Sélectionner le plan",
    capExceeded: "Capacité dépassée",
    securityVaultSubtitle: "Générateurs de mots de passe cryptographiques, validation MFA, garde-fous Control Tower et preuves SOC2.",
    apiKeyControlPanel: "Panneau de configuration des clés API et de la limitation de débit",
    generateKeyBtn: "Générer la clé",
    revokeBtn: "Révoquer",
    copyBtn: "Copier",
    controlTowerTitle: "Garde-fous AWS Control Tower et vérification MFA",
    soc2PackageTitle: "Paquet de preuves de conformité SOC2 Type II automatisé",
    inspectControlsBtn: "Inspecter les contrôles",
    downloadSoc2Btn: "Télécharger le paquet SOC2",
    hipaaBaaTitle: "Accord d'associé commercial HIPAA (BAA)",
    signHipaaBaaBtn: "Signer le BAA HIPAA",
    resignHipaaBaaBtn: "Resigner le BAA",
    copyZeroDowntimeDdlBtn: "Copier le DDL sans interruption",

    triggerTestFailoverBtn: "⚡ Déclencher la simulation de basculement de test",
    enterpriseWebhookSimulatorTitle: "Simulateur d'envoi de webhook d'entreprise",
    triggerTestAnomalyAlertBtn: "Déclencher l'alerte d'anomalie de test",
    instancesCount: "Instances",
    trialCostRecLimitTitle: "🔒 Les recommandations de coûts sont limitées dans la version d'essai.",
    trialCostRecLimitDesc: "Passez à Small Business ou supérieur pour déverrouiller la modélisation de latence multirégionale.",
    unlockSmallTierBtn: "Débloquer le niveau Small Business",
    graphqlResultPlaceholder: "// Le résultat de l'exécution apparaîtra ici...",
    trustServicesCriteriaSubtitle: "Preuves de contrôle des critères de services de confiance",
    overviewTab: "Aperçu",
    tscControlsTab: "Contrôles TSC",
    iamProofsTab: "Preuves IAM et de chiffrement",
    downloadJsonPackageBtn: "Télécharger le paquet JSON",
    skipTourBtn: "✕ Passer",
    subscriptionMarketplaceTitle: "Plan d'abonnement et facturation AWS Marketplace",
    selectModeUpgrade: "Sélectionnez le mode de mise à niveau vers",
    awsAccountsLimit: "Limite de comptes AWS",
    dbInstancesLimit: "Limite d'instances de BDD",
    includedEntitlements: "Droits inclus :",
    testSandboxModeBtn: "🧪 Tester en mode Sandbox (Instantanné & Gratuit)",
    confirmMarketplaceBillingBtn: "💳 Confirmer l'abonnement à la facturation AWS Marketplace",
    crossRegionReplicaRole: "RÉPLIQUE INTERRÉGIONALE",
    replicationLagLabel: "Retard de réplication :",
    failoverPriorityLabel: "Priorité de basculement :",
    iopsThroughputLabel: "Débit IOPS :",
    nodeInspectorTitle: "🔍 Inspecteur de nœud :",

    moveBalancerLeftAria: "Déplacer le balancier vers la gauche",
    moveBalancerRightAria: "Déplacer le balancier vers la droite",
    crossRegionLagLabel: "Retard de réplication interrégionale :",
    failoverRtoLabel: "RTO de basculement :",
    webhookUrlAria: "URL du point de terminaison webhook",
    alertDeliveredTo: "Alerte d'anomalie RDS Sentinel livrée à",
    resetRoiSliderTitle: "Réinitialiser le curseur ROI à 10 BDD par défaut",
    roiDbSliderAria: "Nombre d'instances de BDD pour le calcul du ROI",
    packageIdLabel: "ID du paquet :",
    statusLabel: "Statut :",
    evaluatedStandardLabel: "Norme évaluée :",
    generatedForLabel: "Généré pour",
    kmsMasterKeyLabel: "Clé maître KMS",
    tlsEnforcementLabel: "Application du transport TLS",
    proofLabel: "Preuve :",
    iamAssumeRolePolicyLabel: "Politique IAM AssumeRole",
    externalIdConditionLabel: "Condition ExternalId",
    formatSoc2JsonPackageLabel: "Format : Paquet JSON d'audit SOC2",
    modeToggleTitle: "Basculez entre le Mode A (Console SaaS) et le Mode B (Extension AWS)",
    exportCsvTitle: "Exporter le rapport de performance CSV",
    exportSoc2Title: "Exporter le paquet d'audit de sécurité SOC2 / HIPAA",
    openSettingsTitle: "Ouvrir les paramètres et la gestion du compte",
    selectLanguageAria: "Sélectionner la langue d'affichage",
    toggleThemeTitle: "Changer de thème",
    selectAccountAria: "Sélectionner le compte AWS",
    awsRatesLabel: "🟢 Tarifs AWS : $",
    displayLanguagePrefTitle: "Display Language / Sprache / Langue / 言語",
    externalIdPlaceholder: "ExternalId",
    scpCheckerTitle: "Vérificateur de politiques SCP",
    orgArnPlaceholder: "ARN d'organisation du compte de gestion (arn:aws:organizations::...)",
    foundAccountsLabel: "Trouvé",
    accountsLabel: "Comptes ·",
    activeScpPoliciesLabel: "Politiques SCP actives",
    scpEnforcementActive: "Application SCP : ACTIVE",
    apiKeyNamePlaceholder: "Nom de la clé API (ex. Datadog Stream)",
    charsLabel: "caractères",
    bitsEntropyLabel: "Bits d'entropie (",
    soc2AuditDesc: "Téléchargez des preuves d'audit certifiées ou ouvrez l'inspecteur.",
    realTimeLogsLockedTitle: "Analyse des journaux en temps réel verrouillée",
    realTimeLogsLockedDesc: "L'analyse des journaux en temps réel est disponible dans les niveaux Medium et Enterprise.",
    unlockMediumTierBtn: "Débloquer le niveau Medium",
    piiRedactedLabel: "PII anonymisée",
    dbLabel: "BDD :",
    waitEventLabel: "Événement d'attente :",
    automatedIndexAdvisorTitle: "💡 DDL automatisé du conseiller d'index",
    aiExplainTitle: "🤖 Conseil de diagnostic en langage naturel IA EXPLAIN :",
    copyStandardDdlAria: "Copier l'instruction SQL DDL d'index standard",
    zeroDowntimeProductionDdlTitle: "⚡ DDL de production sans interruption :",
    copyZeroDowntimeDdlAria: "Copier l'instruction SQL DDL d'index de production sans interruption",
    optimizedQueryRewriteTitle: "Réécriture d'une requête optimisée :",
    moveDbsLeftAria: "Déplacer les bases de données vers la gauche",
    moveDbsRightAria: "Déplacer les bases de données vers la droite",
    cpuLabel: "CPU :",
    resetCpuTitle: "Réinitialiser la charge CPU à l'état de référence",
    simulateCpuLoadAria: "Simuler la charge d'utilisation CPU",
    engineLabel: "Moteur :",
    regionLabel: "Région :",
    liveAwsAccountLabel: "Compte AWS en direct cSpec",
    liveAccountIn: "dans",
    targetTierLabel: "Niveau cible :",
    monthLabel: "mois",
    moLabel: "mois",
    accountNamePlaceholder: "Nom du compte (ex. Production Est)",
    accountIdPlaceholder: "ID de compte à 12 chiffres (ex. 123456789012)",
    addAccountBtn: "➕ Ajouter un compte AWS lié",
    removeAccountBtn: "Supprimer",
    refresh5s: "⚡ 5 Secondes (Temps réel)",
    refresh15s: "⏱️ 15 Secondes (Équilibré)",
    refresh30s: "💤 30 Secondes (Mode Éco)",
    refresh60s: "😴 60 Secondes (Faible coût API)",
    tzUtc: "UTC (GMT+00:00) Temps universel coordonné",
    tzEst: "EST (GMT-05:00) Heure normale de l'Est",
    tzPst: "PST (GMT-08:00) Heure normale du Pacifique",
    tzBst: "Londres / BST (GMT+01:00) Royaume-Uni",
    tzCet: "HNEC (GMT+01:00) Heure normale d'Europe centrale",
    tzJst: "JST (GMT+09:00) Heure normale du Japon",
    presetBalanced: "⚖️ Vue Équilibrée",
    presetFinOps: "💰 FinOps / Vue des Coûts",
    presetDba: "🛠️ DBA / Vue Télémétrie",
    presetAppliedToast: "🎯 Préréglage de disposition appliqué",
    layoutProfilesHeader: "Profils de Disposition Opérationnels",
    systemControlsHeader: "Diagnostics Système & Contrôles",
  },
  ja: {
    dashboardTitle: "RDS Sentinel",
    partnerBadge: "AWS マーケットプレイス パートナー",
    tourBtn: "🎯 2分ツアー",
    exportCsvBtn: "📥 CSVエクスポート",
    soc2Btn: "🛡️ SOC2 監査",
    settingsBtn: "⚙️ 設定",
    accountLabel: "アカウント:",
    tagLabel: "タグ:",
    allTags: "すべてのタグ",
    healthScore: "ヘルススコア:",
    savingsLabel: "削減額:",
    awsRates: "AWS 料金:",
    tierLabel: "ティア:",
    devTools: "🛠️ 開発者ツール",
    resetSimulators: "シミュレータをリセット",
    graphqlApi: "GraphQL API",
    resetLayoutBtn: "デフォルトレイアウトをリセット",
    layoutResetToast: "🔄 レイアウトがデフォルト順にリセットされました！",
    layoutReorderedToast: "✨ コンテナレイアウトが再構成され保存されました！",
    dragHandleTitle: "コンテナをドラッグして再構成",

    activeAccountBanner: "アクティブなライブAWSアカウント:",
    liveMonitoredDb: "監視中のライブDB:",

    targetDatabases: "ターゲット データベース",
    instanceTelemetry: "インスタンス テレメトリ",
    cpuUtilization: "CPU 使用率",
    simulateLoadSpike: "負荷スパイクのシミュレート",
    resetCpu: "CPU リセット",
    activeConnections: "アクティブ接続数",
    historicalCpuProfile: "過去のCPUプロファイル (過去24サンプル)",
    clampedMax: "最大50サンプルに制限",
    critical: "危険",
    high: "高",
    normal: "正常",
    hoverSampleTip: "バーにホバーしてサンプルを表示",
    instanceClass: "インスタンス クラス",
    freeStorage: "空きストレージ",

    costBalancer: "コスト パフォーマンス バランサー",
    tierCapability: "ティア機能:",
    baseDbCost: "基本DBコスト",
    optimizedSavings: "最適化削減額",
    optimizedCost: "最適化後コスト",
    downsizeVerifiedTitle: "AWS無料利用枠の最適化が検証されました",
    downsizeVerifiedReason: "free-tier-sandbox-db は AWS 無料利用枠 ($0/月) の db.t4g.micro で動作しています。CPU負荷は健全(18%)でストレージ利用も最適です。",
    proxyAdvisorTitle: "RDS Proxy 接続プーリング アドバイザー",
    proxyAdvisorDesc: "選択されたDBのアクティブ接続プールが高くなっています。RDS Proxyを導入することで接続を多重化し、メモリオーバーヘッドとCPUスパイクを防ぎます。",
    poolEfficiency: "プール効率",
    latencyGain: "推定レイテンシ改善:",
    memorySavings: "メモリ削減額:",
    clusterTopologyTitle: "Aurora クラスタ トポロジ ビジュアライザー",
    clusterTopologyDesc: "対話型マルチリージョン クラスタ ノード グラフ。ノードをクリックしてインスタンス クラス、IOPS、優先度を検査できます。",
    failoverReady: "フェイルオーバー準備完了",
    multiRegionTitle: "マルチリージョン レプリケーション モデラー",
    multiRegionDesc: "リージョン間リードレプリカ (us-east-1 ➔ us-west-2) の同期遅延は平均 62ms です。転送コストは ~$14.20/月に最適化されています。",
    syncLatency: "同期遅延:",
    egressCost: "転送コスト:",
    roiCalculator: "インタラクティブAWS請求額ROI計算機",
    netRoi: "純ROI",
    resetSlider: "スライダーをリセット",
    dbInstancesManaged: "管理中のデータベース インスタンス:",
    estAnnualCost: "推定AWS請求削減額",
    optAnnualCost: "サブスクリプション料金",
    netAnnualSavings: "年間純削減額",
    applySavings: "提案を適用する",
    applied: "適用済み",

    rec1Title: "過剰プロビジョニングされたDBインスタンスの縮小",
    rec1Reason: "billing-db-mysql は db.m5.2xlarge で動作しています。過去30日間のCPU負荷は30%未満にとどまっています。db.m6g.xlarge に変更することでコストを40%削減できます。",
    rec2Title: "開発サンドボックスを Aurora Serverless v2 に移行",
    rec2Reason: "dev-sandbox-db は主に営業時間中にアクティブで、夜間はアイドル状態です。Aurora Serverless v2 に変換することで夜間のスケールダウンが可能です。",
    rec3Title: "us-west-2 に Aurora リードレプリカを追加",
    rec3Reason: "西海岸のクライアントからのリクエストの平均レイテンシは 148ms です。リージョン間リードレプリカを配置することでレイテンシを 15ms に短縮できます。",
    rec4Title: "Multi-AZ スタンバイ配置を有効化",
    rec4Reason: "sales-db-prod は本番データを含む単一ノード構成です。Multi-AZ スタンバイを有効にすることで自動フェイルオーバーが実現します。",

    slowQueries: "スロー クエリ インスペクター",
    piiRedacted: "個人情報マスク済み",
    paramMaskingActive: "🛡️ パラメータマスク: 有効 (安全)",
    paramMaskingOff: "⚠️ パラメータマスク: 無効 (生データ)",
    slowQueryDesc: "捕捉されたスロークエリです。マスキングを無効にすると顧客のメールアドレスやクレジットカード番号がそのまま表示されます。",
    queryFingerprint: "クエリフィンガープリント",
    avgLatency: "平均レイテンシ",
    executionCount: "実行回数",
    impact: "影響度",
    action: "アクション",
    analyzeIndex: "インデックスの分析と提案",
    estSpeedup: "推定高速化:",
    copyDdl: "DDLをコピー",
    ddlCopied: "コピー完了!",

    logWatcher: "リアルタイム ログ & 異常監視",
    logScanningLocked: "リアルタイム ログ スキャンはロックされています",
    telemetrySandbox: "テレメトリ インジェスト サンドボックス",
    ingestionOverride: "インジェスト エンドポイントの上書き",
    dynamicScrapeWindow: "動的スクレイプ ウィンドウ",
    calculatedInterval: "計算された間隔:",
    monitoringCadence: "デフォルトのティア間隔でデータベーステレメトリを監視中。",
    loadSpikeWarning: "⚠️ 負荷スパイク検知！メトリクス監視のため3倍の頻度 (30秒) でスクレイプ中。",
    idleInstanceMsg: "💤 インスタンスはアイドル状態です。CloudWatch API料金を節約するため間隔を延長しています。",
    telemetryOutbox: "テレメトリ アウトボックス フロー",
    outboxCount: "アウトボックス キュー数:",
    circuitBreakerLabel: "サーキット ブレーカー:",
    online: "オンライン",
    disconnect: "切断",
    chaosSimulator: "カオス シミュレーター:",
    forceTripOpen: "強制的にオープン状態にする",
    resetClosed: "CLOSED にリセット",
    connectionOfflineMsg: "⚠️ 接続オフライン。データはローカルキャッシュにキューイングされています。リトライ遅延:",
    billingMatrix: "機能マトリックス",
    activeFeature: "有効",
    lockedFeature: "ロック",
    slowQueryMetrics: "スロー クエリ メトリクス",
    costOptimizations: "コスト最適化提案",
    realTimeLogsWatcher: "リアルタイム ログ 監視",
    replicationLatencySuggester: "レプリケーション遅延提案",
    slackPagerdutyIntegration: "Slack & PagerDuty 連携",

    multiRegionEngineTitle: "マルチリージョン レプリケーション & フェイルオーバー エンジン",
    testFailover: "フェイルオーバーテスト",
    writerRole: "ライター",
    replicaRole: "レプリカ",
    drRole: "DR",

    settingsModalTitle: "アカウント設定 & サブスクリプション管理",
    tabPreferences: "🎨 アプリ設定",
    tabAwsAccounts: "☁️ AWS アカウント & サービス",
    tabBilling: "💳 サブスクリプション & 請求",
    tabSecurity: "🛡️ セキュリティ & 金庫",
    displayNotificationPref: "ダッシュボード表示 & 通知設定",
    colorThemeMode: "カラーテーマ モード",
    darkSlateConsole: "🌙 ダークスレート (AWS コンソールテーマ)",
    lightSlate: "☀️ ライトスレート",
    autoRefreshRate: "自動更新レート",
    alertFrequency: "アラート通知の頻度",
    immediateAlerts: "🚨 リアルタイム異常アラート (即時)",
    dailyDigest: "📅 日次サマリー メール",
    weeklySummary: "📊 週次エグゼクティブ レポート",
    primaryTimezone: "プライマリ タイムゾーン",
    closeBtn: "✕ 閉じる",
    savePreferences: "設定を保存",
    linkedSubAccounts: "連携中の AWS サブアカウント & 監視対象 DB",
    testAssumeRoleConnection: "AWS STS AssumeRole 接続テスト",
    roleArnPlaceholder: "IAM ロール ARN (arn:aws:iam::123456789012:role/...)",
    extIdPlaceholder: "ExternalId トークン",
    testConnectionBtn: "STS 接続テスト実行",
    cfnServiceCatalogExport: "CloudFormation & AWS Service Catalog IaC エクスポート",
    downloadCfnTemplate: "CloudFormation テンプレートをダウンロード",
    exportServiceCatalog: "Service Catalog ポートフォリオをエクスポート",
    downloadTerraformHcl: "Terraform HCL をダウンロード",
    runLiveIngestionTest: "ライブ AWS インジェスト テストを実行",

    subscriptionBillingPortal: "RDS Sentinel SaaS サブスクリプション ポータル",
    currentPlanBadge: "現在アクティブなプラン",
    changePlanBtn: "プランを選択",
    activePlanBadge: "アクティブ プラン",
    confirmUpgradeTitle: "サブスクリプション ティア変更の確認",
    confirmUpgradeMsg: "RDS Sentinel のサブスクリプション ティアを以下に変更してもよろしいですか：",
    proceedUpgradeBtn: "確定して変更する",
    cancelBtn: "キャンセル",

    securityVaultTitle: "エンタープライズ セキュリティ 金庫 & OWASP パスワード発生器",
    owaspPwdGenTitle: "暗号論的パスワード発生器 (OWASP 標準)",
    entropyRatingLabel: "エントロピー評価:",
    generatePwdBtn: "新しいパスワードを生成",
    copyPwdBtn: "パスワードをコピー",
    copiedPwdBtn: "✓ コピー完了！",
    apiKeyRateLimitVault: "API キー & レート制限コントロール パネル",
    keyNamePlaceholder: "API キー名 (例: 本番 CI/CD パイプライン)",
    rateLimitPlaceholder: "レート制限 (req/min)",
    generateApiKeyBtn: "新しい API キーを生成",
    revokeKeyBtn: "失効",
    mfaControlTower: "AWS Control Tower ガードレール & MFA 検証",
    enterMfaToken: "6桁の MFA トークンを入力",
    validateMfaBtn: "MFA トークンを検証",
    soc2CompliancePackage: "SOC2 Type II & HIPAA 監査証拠エクスポート",
    downloadSoc2Package: "SOC2 証拠パッケージをダウンロード",
    inspectEvidenceDrawer: "統制を検査する",
    hipaaBaaAgreement: "HIPAA 事業提携協定 (BAA)",
    signBaaBtn: "HIPAA BAA に署名",
    signedBaaBadge: "✅ BAA 有効 & 締結済み",

    graphqlModalTitle: "GraphQL テレメトリ 開発者 API インスペクター",
    graphqlQueryEditor: "GraphQL クエリ エディター",
    executeQueryBtn: "GraphQL クエリを実行",
    jsonResultTitle: "GraphQL JSON レスポンス",

    evidenceDrawerTitle: "SOC2 Type II 監査証拠インスペクター",
    auditIdLabel: "監査 ID:",

    tourStepPrefix: "ステップ",
    tourNextBtn: "次のステップ ➔",
    tourBackBtn: "⬅ 戻る",
    tourFinishBtn: "ツアーを終了",

    modeA: "🌐 モードA: SaaS",
    modeB: "⚡ モードB: AWS拡張",
    lightTheme: "ライト",
    darkTheme: "ダーク",
    allAccounts: "すべてのAWSアカウント",
    lockedTrialCap: "🔒 ロック済み（トライアル上限: 2DB）",
    connectionState: "接続状態:",
    offline: "接続オフライン",
    chaosToggle: "カオス切替",
    settingsSubtitle: "AWSサブアカウント、通知設定、およびティア課金を管理します",
    displayPreferencesSubtitle: "テーマの色、更新間隔、アラートの頻度をカスタマイズします。",
    accentColorTheme: "アクセントカラーテーマ",
    linkedAccountsSubtitle: "クロスアカウントIAM監視ロールを管理し、STS接続をテストします。",
    testStsConnection: "AWS STS AssumeRole接続のテスト",
    testStsBtn: "STS接続テスト",
    iacExportsTitle: "CloudFormationおよびAWS Service Catalog IaCインフラストラクチャのエクスポート",
    testLiveIngestionBtn: "⚡ ライブAWS無料枠テレメトリ取り込みをテスト（月額$0）",
    awsOrgTitle: "AWS Organizations自動検出およびSCPガバナンス",
    awsOrgSubtitle: "sts:AssumeRoleを介してサブアカウントOU全体の配下AWSアカウントとRDS/Auroraデータベースを検出します。",
    scanOrgBtn: "組織をスキャン",
    discoveredDbsTitle: "検出されたデータベース:",
    importDbBtn: "データベースをインポート",
    billingPortalSubtitle: "監視対象のデータベース容量要件に一致する料金プランを選択します。",
    activePlan: "アクティブなプラン",
    currentPlan: "現在のプラン",
    selectPlan: "プランを選択",
    capExceeded: "容量上限超過",
    securityVaultSubtitle: "暗号化パスワード生成、MFA検証、Control Towerガードレール、SOC2監査証跡。",
    apiKeyControlPanel: "APIキーおよびレート制限管理パネル",
    generateKeyBtn: "キーを生成",
    revokeBtn: "無効化",
    copyBtn: "コピー",
    controlTowerTitle: "AWS Control TowerガードレールおよびMFA検証",
    soc2PackageTitle: "自動SOC2 Type IIコンプライアンス証跡パッケージ",
    inspectControlsBtn: "統制の検査",
    downloadSoc2Btn: "SOC2パッケージのダウンロード",
    hipaaBaaTitle: "HIPAAビジネスアソシエイト契約（BAA）",
    signHipaaBaaBtn: "HIPAA BAAに署名",
    resignHipaaBaaBtn: "BAAに再署名",
    copyZeroDowntimeDdlBtn: "ゼロダウンタイムDDLをコピー",

    triggerTestFailoverBtn: "⚡ テストフェイルオーバーシミュレーションを実行",
    enterpriseWebhookSimulatorTitle: "エンタープライズ Webhook 送信シミュレーター",
    triggerTestAnomalyAlertBtn: "テスト異常アラートをトリガー",
    instancesCount: "インスタンス",
    trialCostRecLimitTitle: "🔒 トライアルティアではコスト最適化提案が制限されています。",
    trialCostRecLimitDesc: "マルチリージョン遅延モデリングを解放するには Small Business 以上にアップグレードしてください。",
    unlockSmallTierBtn: "Small Business ティアを解放",
    graphqlResultPlaceholder: "// 実行結果がここに表示されます...",
    trustServicesCriteriaSubtitle: "信頼性サービス基準の統制証拠",
    overviewTab: "概要",
    tscControlsTab: "TSC統制",
    iamProofsTab: "IAMおよび暗号化証明",
    downloadJsonPackageBtn: "JSONパッケージをダウンロード",
    skipTourBtn: "✕ スキップ",
    subscriptionMarketplaceTitle: "サブスクリプション プランおよび AWS Marketplace 請求",
    selectModeUpgrade: "アップグレードするモードを選択:",
    awsAccountsLimit: "AWS アカウント上限",
    dbInstancesLimit: "DB インスタンス上限",
    includedEntitlements: "含まれる権利:",
    testSandboxModeBtn: "🧪 サンドボックスモードでテスト（即時＆無料）",
    confirmMarketplaceBillingBtn: "💳 AWS Marketplace 請求サブスクリプションを確定",
    crossRegionReplicaRole: "クロスリージョン レプリカ",
    replicationLagLabel: "レプリケーション遅延:",
    failoverPriorityLabel: "フェイルオーバー優先度:",
    iopsThroughputLabel: "IOPS スループット:",
    nodeInspectorTitle: "🔍 ノード インスペクター:",

    moveBalancerLeftAria: "バランサーを左に移動",
    moveBalancerRightAria: "バランサーを右に移動",
    crossRegionLagLabel: "クロスリージョン レプリケーション遅延:",
    failoverRtoLabel: "フェイルオーバー RTO:",
    webhookUrlAria: "Webhook エンドポイント URL",
    alertDeliveredTo: "RDS Sentinel 異常アラートが送信されました:",
    resetRoiSliderTitle: "ROI DB スライダー数をデフォルトの 10 DB にリセット",
    roiDbSliderAria: "ROI 計算用データベース インスタンス数",
    packageIdLabel: "パッケージ ID:",
    statusLabel: "ステータス:",
    evaluatedStandardLabel: "評価規格:",
    generatedForLabel: "作成対象:",
    kmsMasterKeyLabel: "KMS マスターキー",
    tlsEnforcementLabel: "TLS 輸送の強制",
    proofLabel: "証明:",
    iamAssumeRolePolicyLabel: "IAM AssumeRole ポリシー",
    externalIdConditionLabel: "ExternalId 条件",
    formatSoc2JsonPackageLabel: "フォーマット: SOC2 監査 JSON パッケージ",
    modeToggleTitle: "モード A（スタンドアロン SaaS）とモード B（AWS コンソール拡張）を切り替え",
    exportCsvTitle: "CSV パフォーマンス レポートをエクスポート",
    exportSoc2Title: "SOC2 / HIPAA セキュリティ監査パッケージをエクスポート",
    openSettingsTitle: "ダッシュボード設定およびアカウント管理を開く",
    selectLanguageAria: "表示言語を選択",
    toggleThemeTitle: "テーマ切り替え",
    selectAccountAria: "AWS アカウントを選択",
    awsRatesLabel: "🟢 AWS 料金: $",
    displayLanguagePrefTitle: "Display Language / Sprache / Langue / 言語",
    externalIdPlaceholder: "ExternalId",
    scpCheckerTitle: "SCP ポリシー チェッカー",
    orgArnPlaceholder: "管理アカウントの組織 ARN (arn:aws:organizations::...)",
    foundAccountsLabel: "発見",
    accountsLabel: "アカウント ·",
    activeScpPoliciesLabel: "アクティブな SCP ポリシー",
    scpEnforcementActive: "SCP 適用: アクティブ",
    apiKeyNamePlaceholder: "API キー名 (例: Datadog Stream)",
    charsLabel: "文字",
    bitsEntropyLabel: "ビット エントロピー (",
    soc2AuditDesc: "認定された監査証明をダウンロードするか、インスペクターを開きます。",
    realTimeLogsLockedTitle: "リアルタイム ログ スキャンがロックされています",
    realTimeLogsLockedDesc: "リアルタイム ログ スキャンは Medium および Enterprise ティアで利用可能です。",
    unlockMediumTierBtn: "Medium ティアを解放",
    piiRedactedLabel: "PII マスク済み",
    dbLabel: "DB:",
    waitEventLabel: "待機イベント:",
    automatedIndexAdvisorTitle: "💡 自動インデックス アドバイザー DDL",
    aiExplainTitle: "🤖 AI EXPLAIN 自然言語診断アドバイス:",
    copyStandardDdlAria: "標準 DDL インデックス SQL ステートメントをコピー",
    zeroDowntimeProductionDdlTitle: "⚡ ゼロダウンタイム生産 DDL:",
    copyZeroDowntimeDdlAria: "ゼロダウンタイム生産 DDL インデックス SQL ステートメントをコピー",
    optimizedQueryRewriteTitle: "最適化されたクエリの書き換え:",
    moveDbsLeftAria: "データベースを左に移動",
    moveDbsRightAria: "データベースを右に移動",
    cpuLabel: "CPU:",
    resetCpuTitle: "CPU 負荷をパフォーマンス基準状態にリセット",
    simulateCpuLoadAria: "CPU 利用率負荷をシミュレート",
    engineLabel: "エンジン:",
    regionLabel: "リージョン:",
    liveAwsAccountLabel: "cSpec ライブ AWS アカウント",
    liveAccountIn: "リージョン:",
    targetTierLabel: "対象ティア:",
    monthLabel: "月",
    moLabel: "月",
    accountNamePlaceholder: "アカウント名 (例: 本番東部)",
    accountIdPlaceholder: "12桁のアカウントID (例: 123456789012)",
    addAccountBtn: "➕ 連携AWSアカウントを追加",
    removeAccountBtn: "削除",
    refresh5s: "⚡ 5秒 (リアルタイム)",
    refresh15s: "⏱️ 15秒 (標準)",
    refresh30s: "💤 30秒 (省エネ)",
    refresh60s: "😴 60秒 (CloudWatch API節約)",
    tzUtc: "UTC (GMT+00:00) 協定世界時",
    tzEst: "EST (GMT-05:00) 米国東部標準時",
    tzPst: "PST (GMT-08:00) 米国太平洋標準時",
    tzBst: "ロンドン / BST (GMT+01:00) 英国夏時間",
    tzCet: "CET (GMT+01:00) 中央ヨーロッパ時間",
    tzJst: "JST (GMT+09:00) 日本標準時",
    presetBalanced: "⚖️ バランス表示",
    presetFinOps: "💰 FinOps / コスト表示",
    presetDba: "🛠️ DBA / テレメトリ表示",
    presetAppliedToast: "🎯 レイアウトプリセットを適用しました",
    layoutProfilesHeader: "運用レイアウトプロファイル",
    systemControlsHeader: "システム診断とコントロール",
  },
};

/**
 * Returns localized string for a given key and language with English fallback
 */
export function t(
  key: keyof TranslationDictionary,
  lang: LanguageCode = "en"
): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || "";
}

/**
 * Returns localized Recommendation Title & Reason
 */
export function getLocalizedRecommendation(
  recId: string,
  lang: LanguageCode = "en"
): { title?: string; reason?: string } {
  switch (recId) {
    case "rec-1":
      return { title: t("rec1Title", lang), reason: t("rec1Reason", lang) };
    case "rec-2":
      return { title: t("rec2Title", lang), reason: t("rec2Reason", lang) };
    case "rec-3":
      return { title: t("rec3Title", lang), reason: t("rec3Reason", lang) };
    case "rec-4":
      return { title: t("rec4Title", lang), reason: t("rec4Reason", lang) };
    case "rec-5":
      return { title: t("downsizeVerifiedTitle", lang), reason: t("downsizeVerifiedReason", lang) };
    default:
      return {};
  }
}
