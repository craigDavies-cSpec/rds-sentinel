// Guided Interactive Product Tour Engine for Demo & Client Onboarding
import { LanguageCode, t } from "./localization";

export interface TourStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  targetElementId: string; // DOM element ID or CSS selector to highlight
  position: "bottom" | "top" | "left" | "right";
  badgeText: string;
}

export function getLocalizedTourSteps(lang: LanguageCode = "en"): TourStep[] {
  const stepPrefix = t("tourStepPrefix", lang);

  return [
    {
      id: 1,
      title: lang === "de" ? "Multi-AWS Kontoauswahl" : lang === "fr" ? "Sélecteur Multi-Comptes AWS" : lang === "ja" ? "マルチAWS アカウント セレクター" : "Multi-AWS Account Selector",
      subtitle: `${stepPrefix} 1 / 6 — ${t("tabAwsAccounts", lang)}`,
      description: lang === "de" ? "Wechseln Sie nahtlos zwischen Produktions- und Staging-AWS-Konten." : lang === "fr" ? "Basculez facilement entre les comptes AWS de production et de staging." : lang === "ja" ? "本番環境とステージングAWSアカウントを簡単に切り替えます。" : "Switch seamlessly between Production and Staging AWS Accounts.",
      targetElementId: "#aws-account-selector",
      position: "bottom",
      badgeText: "Multi-Account",
    },
    {
      id: 2,
      title: lang === "de" ? "Instanz-Telemetrie & CPU-Simulator" : lang === "fr" ? "Télémétrie & Simulateur CPU" : lang === "ja" ? "インスタンス テレメトリ & CPU シミュレーター" : "Instance Telemetry & CPU Simulator",
      subtitle: `${stepPrefix} 2 / 6 — ${t("instanceTelemetry", lang)}`,
      description: lang === "de" ? "Überwachen Sie CPU-Auslastung, IOPS und Verbindungspools in Echtzeit." : lang === "fr" ? "Surveillez l'utilisation CPU, les IOPS et les pools de connexions en temps réel." : lang === "ja" ? "リアルタイムのCPU使用率、IOPS、接続プールを監視します。" : "Monitor real-time CPU utilization, IOPS, and connection pools.",
      targetElementId: "#cpu-simulator-slider",
      position: "right",
      badgeText: "Real-Time Telemetry",
    },
    {
      id: 3,
      title: lang === "de" ? "AWS-Rechnungs ROI-Rechner" : lang === "fr" ? "Calculateur de ROI Facture AWS" : lang === "ja" ? "AWS請求額ROI計算機" : "AWS Bill ROI Savings Calculator",
      subtitle: `${stepPrefix} 3 / 6 — ${t("netRoi", lang)}`,
      description: lang === "de" ? "Ziehen Sie den Datenbank-Regler, um Ihre Netto-Finanzrendite zu berechnen." : lang === "fr" ? "Faites glisser le curseur pour calculer votre rendement financier net." : lang === "ja" ? "スライダーをドラッグして純財務リターンを計算します。" : "Drag the database instance slider to calculate your net financial return.",
      targetElementId: "#roi-db-slider",
      position: "top",
      badgeText: "Net Financial ROI",
    },
    {
      id: 4,
      title: t("clusterTopologyTitle", lang),
      subtitle: `${stepPrefix} 4 / 6 — ${t("failoverReady", lang)}`,
      description: t("clusterTopologyDesc", lang),
      targetElementId: "#topology-visualizer-card",
      position: "top",
      badgeText: "Topology Visualizer",
    },
    {
      id: 5,
      title: t("slowQueries", lang),
      subtitle: `${stepPrefix} 5 / 6 — 1-Click DDL`,
      description: t("slowQueryDesc", lang),
      targetElementId: "#slow-query-inspector-card",
      position: "top",
      badgeText: "EXPLAIN Engine",
    },
    {
      id: 6,
      title: lang === "de" ? "Enterprise Webhooks & Audit CSV Export" : lang === "fr" ? "Webhooks d'Entreprise & Export CSV" : lang === "ja" ? "エンタープライズ Webhook & CSV エクスポート" : "Enterprise Webhooks & Audit CSV Export",
      subtitle: `${stepPrefix} 6 / 6 — ${t("billingMatrix", lang)}`,
      description: lang === "de" ? "Senden Sie Live-Warnungen während Datenbankanomalien." : lang === "fr" ? "Envoyez des alertes en direct pendant les anomalies de base de données." : lang === "ja" ? "データベース異常発生時にリアルタイムでアラートを送信します。" : "Dispatch live Slack Block Kit and PagerDuty Events v2 alerts.",
      targetElementId: "#webhook-simulator-card",
      position: "top",
      badgeText: "Integrations & Audit",
    },
  ];
}

export const PRODUCT_TOUR_STEPS = getLocalizedTourSteps("en");

export function isTourCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("rds_sentinel_tour_completed") === "true";
}

export function markTourCompleted(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rds_sentinel_tour_completed", "true");
}

export function resetTourState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rds_sentinel_tour_completed");
}
