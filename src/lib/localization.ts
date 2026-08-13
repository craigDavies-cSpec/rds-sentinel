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
    logWatcher: "Real-Time Logs Watcher",
    clusterTopology: "Aurora Cluster Topology Visualizer",
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
    logWatcher: "Echtzeit-Protokollüberwachung",
    clusterTopology: "Aurora Cluster-Topologie Visualisierer",
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
    logWatcher: "Surveillance des Journaux en Temps Réel",
    clusterTopology: "Visualiseur de Topologie de Cluster Aurora",
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
    logWatcher: "リアルタイム ログ 監視",
    clusterTopology: "Aurora クラスタ トポロジ ビジュアライザー",
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
