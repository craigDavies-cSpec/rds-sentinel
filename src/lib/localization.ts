// Enterprise Localization Engine (Phase 9A)

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

export interface TranslationDictionary {
  // Header & Toolbar
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

  // Left Column
  targetDatabases: string;
  instanceTelemetry: string;
  cpuUtilization: string;
  simulateLoadSpike: string;
  resetCpu: string;
  activeConnections: string;
  historicalCpuProfile: string;
  critical: string;
  high: string;
  normal: string;
  instanceClass: string;
  freeStorage: string;

  // Middle Column (Cost Balancer)
  costBalancer: string;
  tierCapability: string;
  baseDbCost: string;
  optimizedSavings: string;
  optimizedCost: string;
  downsizeVerified: string;
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
  applySavings: string;
  applied: string;

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
  copyDdl: string;
  ddlCopied: string;

  // Right Column (Log Watcher & Telemetry Sandbox)
  logWatcher: string;
  logScanningLocked: string;
  telemetrySandbox: string;
  ingestionOverride: string;
  dynamicScrapeWindow: string;
  calculatedInterval: string;
  monitoringCadence: string;
  telemetryOutbox: string;
  outboxCount: string;
  circuitBreakerLabel: string;
  online: string;
  disconnect: string;
  chaosSimulator: string;
  forceTripOpen: string;
  billingMatrix: string;
  activeFeature: string;
  lockedFeature: string;

  // Settings Modal Tabs
  tabPreferences: string;
  tabAwsAccounts: string;
  tabBilling: string;
  tabSecurity: string;
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
    resetSimulators: "🔄 Reset Simulators",
    graphqlApi: "⚡ GraphQL API",

    activeAccountBanner: "Active Live AWS Account:",
    liveMonitoredDb: "Live Monitored DB:",

    targetDatabases: "Target Databases",
    instanceTelemetry: "Instance Telemetry",
    cpuUtilization: "CPU Utilization",
    simulateLoadSpike: "SIMULATE LOAD SPIKE",
    resetCpu: "Reset CPU",
    activeConnections: "Active Connections",
    historicalCpuProfile: "Historical CPU Profile (Last 24 samples)",
    critical: "Critical",
    high: "High",
    normal: "Normal",
    instanceClass: "INSTANCE CLASS",
    freeStorage: "FREE STORAGE",

    costBalancer: "Cost-Performance Balancer",
    tierCapability: "Tier Capability:",
    baseDbCost: "BASE DB COST",
    optimizedSavings: "OPTIMIZED SAVINGS",
    optimizedCost: "OPTIMIZED COST",
    downsizeVerified: "AWS Free Tier Optimization Verified",
    proxyAdvisorTitle: "RDS Proxy Connection Pooling Advisor",
    proxyAdvisorDesc: "Connection pooling multiplexes connections, reducing memory overhead & CPU spikes.",
    poolEfficiency: "Pool Efficiency",
    latencyGain: "Estimated Latency Gain:",
    memorySavings: "Memory Savings:",
    clusterTopologyTitle: "Aurora Cluster Topology Visualizer",
    clusterTopologyDesc: "Interactive cluster graph. Click any node to inspect instance class and IOPS.",
    failoverReady: "Failover Ready",
    multiRegionTitle: "Multi-Region Replication Modeler",
    multiRegionDesc: "Cross-region read replica synchronization lag and egress cost optimizer.",
    syncLatency: "Sync Latency:",
    egressCost: "Egress Cost:",
    roiCalculator: "Interactive AWS Bill ROI Calculator",
    netRoi: "Net ROI",
    resetSlider: "Reset Slider",
    dbInstancesManaged: "Database Instances Managed:",
    applySavings: "Apply Recommendation",
    applied: "Applied",

    slowQueries: "Slow Query Inspector",
    piiRedacted: "PII Redacted",
    paramMaskingActive: "🛡️ Parameter Masking: ACTIVE (Safe)",
    paramMaskingOff: "⚠️ Parameter Masking: OFF (Raw)",
    slowQueryDesc: "Slow database queries captured with automated edge sanitization and DDL index suggestion.",
    queryFingerprint: "Query Fingerprint",
    avgLatency: "Avg Latency",
    executionCount: "Count",
    impact: "Impact",
    action: "Action",
    analyzeIndex: "Analyze & Suggest Index",
    copyDdl: "Copy DDL",
    ddlCopied: "Copied!",

    logWatcher: "Anomaly Log Watcher",
    logScanningLocked: "Real-Time Log Scanning Locked",
    telemetrySandbox: "Telemetry Ingest Sandbox",
    ingestionOverride: "INGESTION ENDPOINT OVERRIDE",
    dynamicScrapeWindow: "DYNAMIC SCRAPE WINDOW",
    calculatedInterval: "Calculated Interval:",
    monitoringCadence: "Monitoring database telemetry at default tier cadence",
    telemetryOutbox: "TELEMETRY OUTBOX OUTFLOW",
    outboxCount: "Outbox Queue Count:",
    circuitBreakerLabel: "Circuit Breaker:",
    online: "Online",
    disconnect: "Disconnect",
    chaosSimulator: "Chaos Simulator:",
    forceTripOpen: "Force Trip OPEN",
    billingMatrix: "BILLING FEATURE MATRIX",
    activeFeature: "Active",
    lockedFeature: "Locked",

    tabPreferences: "🎨 App Preferences",
    tabAwsAccounts: "☁️ AWS Accounts & Services",
    tabBilling: "💳 Subscription & Billing",
    tabSecurity: "🛡️ Security & Vault",
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
    critical: "Kritisch",
    high: "Hoch",
    normal: "Normal",
    instanceClass: "INSTANZ-KLASSE",
    freeStorage: "FREIER SPEICHER",

    costBalancer: "Kosten-Leistungs-Optimierer",
    tierCapability: "Stufen-Kapazität:",
    baseDbCost: "BASIS-DB-KOSTEN",
    optimizedSavings: "OPTIMIERTE ERSPARNIS",
    optimizedCost: "OPTIMIERTE KOSTEN",
    downsizeVerified: "AWS Free-Tier Optimierung Verifiziert",
    proxyAdvisorTitle: "RDS Proxy Verbindungs-Berater",
    proxyAdvisorDesc: "Verbindungspooling reduziert Speicheraufwand und verhindert CPU-Spitzen.",
    poolEfficiency: "Pool-Effizienz",
    latencyGain: "Geschätzter Latenzgewinn:",
    memorySavings: "Speicherersparnis:",
    clusterTopologyTitle: "Aurora Cluster-Topologie Visualisierer",
    clusterTopologyDesc: "Interaktiver Cluster-Graph. Klicken Sie auf einen Knoten zur Inspektion.",
    failoverReady: "Ausfallsicher",
    multiRegionTitle: "Multi-Regionen Replikations-Modellierer",
    multiRegionDesc: "Optimierer für Replikationsverzögerung und Egress-Kosten.",
    syncLatency: "Synchr.-Latenz:",
    egressCost: "Egress-Kosten:",
    roiCalculator: "Interaktiver AWS-Rechnungs ROI-Rechner",
    netRoi: "Netto-ROI",
    resetSlider: "Regler Zurücksetzen",
    dbInstancesManaged: "Verwaltete Datenbank-Instanzen:",
    applySavings: "Empfehlung Anwenden",
    applied: "Angewendet",

    slowQueries: "Langsame Abfragen Inspektor",
    piiRedacted: "PII Anonymisiert",
    paramMaskingActive: "🛡️ Parameter-Maskierung: AKTIV (Sicher)",
    paramMaskingOff: "⚠️ Parameter-Maskierung: AUS (Roh)",
    slowQueryDesc: "Erfasste langsame Datenbankabfragen mit automatischer Maskierung und Indexvorschlag.",
    queryFingerprint: "Abfrage-Fingerabdruck",
    avgLatency: "Durchschn. Latenz",
    executionCount: "Anzahl",
    impact: "Auswirkung",
    action: "Aktion",
    analyzeIndex: "Index Analysieren",
    copyDdl: "DDL Kopieren",
    ddlCopied: "Kopiert!",

    logWatcher: "Echtzeit-Protokollüberwachung",
    logScanningLocked: "Echtzeit-Protokollüberwachung Gesperrt",
    telemetrySandbox: "Telemetrie-Ingest Sandbox",
    ingestionOverride: "INGESTION-ENDPUNKT ÜBERSCHREIBEN",
    dynamicScrapeWindow: "DYNAMISCHES INTERVALL",
    calculatedInterval: "Berechnetes Intervall:",
    monitoringCadence: "Überwachung der Datenbanktelemetrie im Standardintervall",
    telemetryOutbox: "TELEMETRIE OUTBOX AUSFLUSS",
    outboxCount: "Outbox-Warteschlange:",
    circuitBreakerLabel: "Schutzschalter:",
    online: "Online",
    disconnect: "Trennen",
    chaosSimulator: "Chaos-Simulator:",
    forceTripOpen: "Schalter AUSLÖSEN",
    billingMatrix: "FUNKTIONSMATRIX",
    activeFeature: "Aktiv",
    lockedFeature: "Gesperrt",

    tabPreferences: "🎨 Einstellungen",
    tabAwsAccounts: "☁️ AWS Konten & Dienste",
    tabBilling: "💳 Abonnements & Abrechnung",
    tabSecurity: "🛡️ Sicherheit & Tresor",
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
    critical: "Critique",
    high: "Élevé",
    normal: "Normal",
    instanceClass: "CLASSE D'INSTANCE",
    freeStorage: "STOCKAGE LIBRE",

    costBalancer: "Équilibreur Coût-Performance",
    tierCapability: "Capacité du Niveau:",
    baseDbCost: "COÛT DE BASE BDD",
    optimizedSavings: "ÉCONOMIES OPTIMISÉES",
    optimizedCost: "COÛT OPTIMISÉ",
    downsizeVerified: "Optimisation AWS Offre Gratuite Vérifiée",
    proxyAdvisorTitle: "Conseiller en Pool de Connexions RDS Proxy",
    proxyAdvisorDesc: "Le multiplexage réduit la mémoire et prévient les pics de CPU.",
    poolEfficiency: "Efficacité du Pool",
    latencyGain: "Gain de Latence Estimé:",
    memorySavings: "Économies de Mémoire:",
    clusterTopologyTitle: "Visualiseur de Topologie de Cluster Aurora",
    clusterTopologyDesc: "Graphe interactif de cluster. Cliquez sur un nœud pour inspecter.",
    failoverReady: "Prêt pour Basculement",
    multiRegionTitle: "Modéliseur de Réplication Multi-Régions",
    multiRegionDesc: "Optimiseur de latence de réplication et coût de sortie.",
    syncLatency: "Latence Synchro:",
    egressCost: "Coût Egress:",
    roiCalculator: "Calculateur de ROI Facture AWS Interactif",
    netRoi: "ROI Net",
    resetSlider: "Réinitialiser Curseur",
    dbInstancesManaged: "Instances BDD Gérées:",
    applySavings: "Appliquer Recommandation",
    applied: "Appliqué",

    slowQueries: "Inspecteur de Requêtes Lentes",
    piiRedacted: "PII Anonymisé",
    paramMaskingActive: "🛡️ Masquage Paramètres: ACTIF (Sécurisé)",
    paramMaskingOff: "⚠️ Masquage Paramètres: DESACTIF (Brut)",
    slowQueryDesc: "Requêtes lentes capturées avec assainissement automatique et suggestion d'index DDL.",
    queryFingerprint: "Empreinte de Requête",
    avgLatency: "Latence Moy",
    executionCount: "Nombre",
    impact: "Impact",
    action: "Action",
    analyzeIndex: "Analyser et Suggérer Index",
    copyDdl: "Copier DDL",
    ddlCopied: "Copié!",

    logWatcher: "Surveillance des Anomales en Temps Réel",
    logScanningLocked: "Surveillance des Journaux Verrouillée",
    telemetrySandbox: "Bac à Sable Ingestion Télémétrie",
    ingestionOverride: "SURCHARGER ENDPOINT INGESTION",
    dynamicScrapeWindow: "FENETRE DE BALAYAGE DYNAMIQUE",
    calculatedInterval: "Intervalle Calculé:",
    monitoringCadence: "Surveillance de la télémétrie de la base de données",
    telemetryOutbox: "FLUX BOITE DE SORTIE TELEMETRIE",
    outboxCount: "File d'attente Outbox:",
    circuitBreakerLabel: "Disjoncteur:",
    online: "En Ligne",
    disconnect: "Déconnecter",
    chaosSimulator: "Simulateur de Chaos:",
    forceTripOpen: "Forcer Ouverture",
    billingMatrix: "MATRICE DES FONCTIONNALITES",
    activeFeature: "Actif",
    lockedFeature: "Verrouillé",

    tabPreferences: "🎨 Préférences",
    tabAwsAccounts: "☁️ Comptes AWS & Services",
    tabBilling: "💳 Abonnement & Facturation",
    tabSecurity: "🛡️ Sécurité & Coffre",
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
    critical: "危険",
    high: "高",
    normal: "正常",
    instanceClass: "インスタンス クラス",
    freeStorage: "空きストレージ",

    costBalancer: "コスト パフォーマンス バランサー",
    tierCapability: "ティア機能:",
    baseDbCost: "基本DBコスト",
    optimizedSavings: "最適化削減額",
    optimizedCost: "最適化後コスト",
    downsizeVerified: "AWS無料利用枠の最適化が検証されました",
    proxyAdvisorTitle: "RDS Proxy 接続プーリング アドバイザー",
    proxyAdvisorDesc: "接続プーリングによりメモリオーバーヘッドとCPUスパイクを削減します。",
    poolEfficiency: "プール効率",
    latencyGain: "推定レイテンシ改善:",
    memorySavings: "メモリ削減額:",
    clusterTopologyTitle: "Aurora クラスタ トポロジ ビジュアライザー",
    clusterTopologyDesc: "対話型クラスタノードグラフ。クリックして詳細を検査できます。",
    failoverReady: "フェイルオーバー準備完了",
    multiRegionTitle: "マルチリージョン レプリケーション モデラー",
    multiRegionDesc: "リージョン間レプリケーション遅延と転送コストの最適化。",
    syncLatency: "同期遅延:",
    egressCost: "転送コスト:",
    roiCalculator: "インタラクティブAWS請求額ROI計算機",
    netRoi: "純ROI",
    resetSlider: "スライダーをリセット",
    dbInstancesManaged: "管理中のデータベース インスタンス:",
    applySavings: "提案を適用する",
    applied: "適用済み",

    slowQueries: "スロー クエリ インスペクター",
    piiRedacted: "個人情報マスク済み",
    paramMaskingActive: "🛡️ パラメータマスク: 有効 (安全)",
    paramMaskingOff: "⚠️ パラメータマスク: 無効 (生データ)",
    slowQueryDesc: "エッジマスキングとDDLインデックス提案を備えた捕捉スロークエリ。",
    queryFingerprint: "クエリフィンガープリント",
    avgLatency: "平均レイテンシ",
    executionCount: "実行回数",
    impact: "影響度",
    action: "アクション",
    analyzeIndex: "インデックスの分析と提案",
    copyDdl: "DDLをコピー",
    ddlCopied: "コピー完了!",

    logWatcher: "リアルタイム ログ & 異常監視",
    logScanningLocked: "リアルタイム ログ スキャンはロックされています",
    telemetrySandbox: "テレメトリ インジェスト サンドボックス",
    ingestionOverride: "インジェスト エンドポイントの上書き",
    dynamicScrapeWindow: "動的スクレイプ ウィンドウ",
    calculatedInterval: "計算された間隔:",
    monitoringCadence: "デフォルトのティア間隔でデータベーステレメトリを監視中",
    telemetryOutbox: "テレメトリ アウトボックス フロー",
    outboxCount: "アウトボックス キュー数:",
    circuitBreakerLabel: "サーキット ブレーカー:",
    online: "オンライン",
    disconnect: "切断",
    chaosSimulator: "カオス シミュレーター:",
    forceTripOpen: "強制的にオープン状態にする",
    billingMatrix: "機能マトリックス",
    activeFeature: "有効",
    lockedFeature: "ロック",

    tabPreferences: "🎨 アプリ設定",
    tabAwsAccounts: "☁️ AWS アカウント & サービス",
    tabBilling: "💳 サブスクリプション & 請求",
    tabSecurity: "🛡️ セキュリティ & 金庫",
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
