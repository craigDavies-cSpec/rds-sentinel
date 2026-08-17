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

    logWatcher: "Anomaly Log Watcher",
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
