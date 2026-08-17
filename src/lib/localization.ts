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
  dashboardTitle: string;
  partnerBadge: string;
  tourBtn: string;
  exportCsvBtn: string;
  soc2Btn: string;
  settingsBtn: string;
  accountLabel: string;
  tagLabel: string;
  healthScore: string;
  savingsLabel: string;
  targetDatabases: string;
  costBalancer: string;
  slowQueries: string;
  logWatcher: string;
  clusterTopology: string;
  instanceTelemetry: string;
  cpuUtilization: string;
  dbConnections: string;
  storageIops: string;
  activeRecommendations: string;
  applySavings: string;
  applied: string;
  paramMasking: string;
  analyzeIndex: string;
  proxyAdvisor: string;
  multiRegion: string;
  devTools: string;
  resetSimulators: string;
  graphqlApi: string;
  awsRates: string;
  liveSynced: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    dashboardTitle: "RDS Sentinel",
    partnerBadge: "AWS Marketplace Partner",
    tourBtn: "🎯 2-Min Tour",
    exportCsvBtn: "📥 Export CSV",
    soc2Btn: "🛡️ SOC2 Audit",
    settingsBtn: "⚙️ Settings",
    accountLabel: "Account:",
    tagLabel: "Tag:",
    healthScore: "Health Score:",
    savingsLabel: "Savings:",
    targetDatabases: "Target Databases",
    costBalancer: "Cost-Performance Balancer",
    slowQueries: "Slow Query Performance Insights",
    logWatcher: "Real-Time Logs & Security Watcher",
    clusterTopology: "Aurora Cluster Topology Visualizer",
    instanceTelemetry: "Instance Telemetry",
    cpuUtilization: "CPU Utilization",
    dbConnections: "DB Connections",
    storageIops: "Storage IOPS",
    activeRecommendations: "Active Cost Optimization Recommendations",
    applySavings: "Apply Recommendation",
    applied: "Applied",
    paramMasking: "Parameter Masking",
    analyzeIndex: "Analyze & Suggest Index",
    proxyAdvisor: "RDS Proxy Connection Pooling Advisor",
    multiRegion: "Multi-Region Replication Modeler",
    devTools: "🛠️ Dev Tools",
    resetSimulators: "🔄 Reset Simulators",
    graphqlApi: "⚡ GraphQL API",
    awsRates: "AWS Rates:",
    liveSynced: "Live API Synced",
  },
  de: {
    dashboardTitle: "RDS Sentinel",
    partnerBadge: "AWS Marketplace Partner",
    tourBtn: "🎯 2-Min Tour",
    exportCsvBtn: "📥 CSV Exportieren",
    soc2Btn: "🛡️ SOC2 Audit",
    settingsBtn: "⚙️ Einstellungen",
    accountLabel: "Konto:",
    tagLabel: "Tag:",
    healthScore: "Gesundheitswert:",
    savingsLabel: "Ersparnis:",
    targetDatabases: "Ziel-Datenbanken",
    costBalancer: "Kosten-Leistungs-Optimierer",
    slowQueries: "Langsame Abfragen Insights",
    logWatcher: "Echtzeit-Protokoll- & Sicherheitsüberwachung",
    clusterTopology: "Aurora Cluster-Topologie Visualisierer",
    instanceTelemetry: "Instanz-Telemetrie",
    cpuUtilization: "CPU-Auslastung",
    dbConnections: "DB-Verbindungen",
    storageIops: "Speicher IOPS",
    activeRecommendations: "Aktive Kostenempfehlungen",
    applySavings: "Empfehlung Anwenden",
    applied: "Angewendet",
    paramMasking: "Parameter-Maskierung",
    analyzeIndex: "Index Analysieren & Vorschlagen",
    proxyAdvisor: "RDS Proxy Verbindungs-Berater",
    multiRegion: "Multi-Regionen Replikations-Modellierer",
    devTools: "🛠️ Entwickler-Tools",
    resetSimulators: "🔄 Simulatoren Zurücksetzen",
    graphqlApi: "⚡ GraphQL API",
    awsRates: "AWS Tarife:",
    liveSynced: "Live-API Synchronisiert",
  },
  fr: {
    dashboardTitle: "RDS Sentinel",
    partnerBadge: "Partenaire AWS Marketplace",
    tourBtn: "🎯 Tour 2-Min",
    exportCsvBtn: "📥 Exporter CSV",
    soc2Btn: "🛡️ Audit SOC2",
    settingsBtn: "⚙️ Paramètres",
    accountLabel: "Compte:",
    tagLabel: "Balise:",
    healthScore: "Score de Santé:",
    savingsLabel: "Économies:",
    targetDatabases: "Bases de Données Cibles",
    costBalancer: "Équilibreur Coût-Performance",
    slowQueries: "Analyses de Requêtes Lentes",
    logWatcher: "Surveillance des Journaux et Sécurité en Temps Réel",
    clusterTopology: "Visualiseur de Topologie de Cluster Aurora",
    instanceTelemetry: "Télémétrie d'instance",
    cpuUtilization: "Utilisation du CPU",
    dbConnections: "Connexions DB",
    storageIops: "IOPS de Stockage",
    activeRecommendations: "Recommandations d'Optimisation des Coûts",
    applySavings: "Appliquer la Recommandation",
    applied: "Appliqué",
    paramMasking: "Masquage de Paramètres",
    analyzeIndex: "Analyser et Suggérer un Index",
    proxyAdvisor: "Conseiller en Pool de Connexions RDS Proxy",
    multiRegion: "Modéliseur de Réplication Multi-Régions",
    devTools: "🛠️ Outils Développeur",
    resetSimulators: "🔄 Réinitialiser les Simulateurs",
    graphqlApi: "⚡ API GraphQL",
    awsRates: "Tarifs AWS:",
    liveSynced: "Synchronisé via API",
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
    healthScore: "ヘルススコア:",
    savingsLabel: "削減額:",
    targetDatabases: "ターゲット データベース",
    costBalancer: "コスト パフォーマンス バランサー",
    slowQueries: "スロー クエリ パフォーマンス 分析",
    logWatcher: "リアルタイム ログ & セキュリティ 監視",
    clusterTopology: "Aurora クラスタ トポロジ ビジュアライザー",
    instanceTelemetry: "インスタンス テレメトリ",
    cpuUtilization: "CPU 使用率",
    dbConnections: "DB 接続数",
    storageIops: "ストレージ IOPS",
    activeRecommendations: "アクティブ コスト削減の提案",
    applySavings: "提案を適用する",
    applied: "適用済み",
    paramMasking: "パラメータ マスク",
    analyzeIndex: "インデックスの分析と提案",
    proxyAdvisor: "RDS Proxy 接続プーリング アドバイザー",
    multiRegion: "マルチリージョン データベース レプリケーション モデラー",
    devTools: "🛠️ 開発者ツール",
    resetSimulators: "🔄 シミュレータをリセット",
    graphqlApi: "⚡ GraphQL API",
    awsRates: "AWS 料金:",
    liveSynced: "リアルタイム API 同期",
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
