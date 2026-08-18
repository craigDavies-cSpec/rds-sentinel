"use client";

import React, { useState } from "react";
import { CostRecommendation, DBInstance } from "@/lib/mockTelemetry";
import { t, LanguageCode, getLocalizedRecommendation } from "@/lib/localization";
import { TierType } from "@/lib/accountSettings";
import { ClusterTopologyData, ClusterNode } from "@/lib/clusterTopology";
import { dispatchWebhookAlert, WebhookDispatchResult } from "@/lib/webhookSimulator";

interface CostRecommendationsProps {
  totalCost: number;
  potentialSavings: number;
  activeRecommendations: CostRecommendation[];
  tier: TierType;
  language: LanguageCode;
  hasFeature: (feat: string) => boolean;
  topologyData: ClusterTopologyData;
  selectedTopologyNode: ClusterNode | null;
  setSelectedTopologyNode: (node: ClusterNode | null) => void;
  roiDbCount: number;
  setRoiDbCount: (cnt: number) => void;
  handleTierClick: (t: TierType) => void;
  showToast: (msg: string) => void;
  moveLeft: (key: string) => void;
  moveRight: (key: string) => void;
}

export function CostRecommendations({
  totalCost,
  potentialSavings,
  activeRecommendations,
  tier,
  language,
  hasFeature,
  topologyData,
  selectedTopologyNode,
  setSelectedTopologyNode,
  roiDbCount,
  setRoiDbCount,
  handleTierClick,
  showToast,
  moveLeft,
  moveRight,
}: CostRecommendationsProps) {
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/T0000/B0000/XXXXX");
  const [webhookTarget, setWebhookTarget] = useState<"slack" | "teams" | "pagerduty">("slack");
  const [webhookResult, setWebhookResult] = useState<WebhookDispatchResult | null>(null);
  return (
    <div className="bg-aws-lightContainer/90 dark:bg-aws-container/90 backdrop-blur-md border border-aws-lightBorder/80 dark:border-aws-border/80 rounded-xl shadow-lg hover:shadow-xl p-5 flex flex-col gap-4 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-border pb-3">
        <div className="flex items-center gap-2">
          <span className="text-aws-orange font-mono cursor-grab active:cursor-grabbing text-xs tracking-tighter" title={t("dragHandleTitle", language)}>{"⋮⋮"}</span>
          <h2 className="text-sm font-black text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider flex items-center gap-2">
            {t("costBalancer", language)}
          </h2>
        </div>
        <div className="flex gap-1" data-testid="layout-controls-recommendations">
          <button
            onClick={() => moveLeft("recommendations")}
            aria-label={t("moveBalancerLeftAria", language)}
            className="px-2 py-1 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded-md text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-all active:scale-95 cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={() => moveRight("recommendations")}
            aria-label={t("moveBalancerRightAria", language)}
            className="px-2 py-1 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded-md text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-all active:scale-95 cursor-pointer"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Cost Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
          <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase block">
            {t("baseDbCost", language)}
          </span>
          <span className="text-lg font-bold font-mono text-aws-lightTextPrimary dark:text-aws-textPrimary">
            {totalCost === 0 ? "$0/mo (Free Tier)" : `$${totalCost}/mo`}
          </span>
        </div>
        <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
          <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase block">
            {t("optimizedSavings", language)}
          </span>
          <span className="text-lg font-bold font-mono text-emerald-800 dark:text-emerald-400">
            ${potentialSavings}/mo
          </span>
        </div>
        <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
          <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase block">
            {t("optimizedCost", language)}
          </span>
          <span className="text-lg font-bold font-mono text-sky-800 dark:text-aws-blue">
            ${totalCost - potentialSavings}/mo
          </span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="flex flex-col gap-3">
        {activeRecommendations.map((rec) => {
          const loc = getLocalizedRecommendation(rec.id, language);
          const title = loc.title || rec.title;
          const reason = loc.reason || rec.reason;

          return (
            <div
              key={rec.id}
              className={`p-3 rounded border text-xs ${
                rec.costDelta < 0 ? "bg-aws-green/5 border-aws-green/20" : "bg-aws-blue/5 border-aws-blue/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded mr-2 ${
                      rec.costDelta < 0
                        ? "bg-aws-green/10 text-emerald-800 dark:text-emerald-400"
                        : "bg-aws-blue/10 text-sky-800 dark:text-sky-400"
                    }`}
                  >
                    {rec.type}
                  </span>
                  <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">{title}</strong>
                </div>
                <span
                  className={`font-mono font-bold text-sm ${
                    rec.costDelta < 0
                      ? "text-emerald-800 dark:text-emerald-400"
                      : "text-sky-800 dark:text-sky-400"
                  }`}
                >
                  {rec.costDelta < 0 ? `-$${Math.abs(rec.costDelta)}` : `+$${rec.costDelta}`} / mo
                </span>
              </div>
              <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed">
                {reason}
              </p>
            </div>
          );
        })}

        {/* RDS Proxy Advisor Card */}
        {hasFeature("real-time-logs") && (
          <div className="p-3 bg-aws-blue/5 border border-aws-blue/20 rounded text-xs">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-aws-blue/10 text-sky-800 dark:text-sky-400">
                  RDS Proxy
                </span>
                <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">
                  {t("proxyAdvisorTitle", language)}
                </strong>
              </div>
              <span className="font-mono font-bold text-xs text-sky-800 dark:text-sky-400">
                +82% {t("poolEfficiency", language)}
              </span>
            </div>
            <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed mb-2">
              {t("proxyAdvisorDesc", language)}
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono pt-1.5 border-t border-aws-blue/10">
              <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {t("latencyGain", language)} <strong className="text-emerald-800 dark:text-emerald-400">-12ms handshake</strong>
              </span>
              <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {t("memorySavings", language)} <strong className="text-sky-800 dark:text-sky-400">~1.4 GB RAM</strong>
              </span>
            </div>
          </div>
        )}

        {/* Multi-Region Replication Latency Modeler */}
        {hasFeature("multi-region") && (
          <div id="multi-region-replication-card" className="p-3 bg-aws-teal/5 border border-aws-teal/20 rounded text-xs">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-800 dark:text-teal-400">
                  Multi-Region
                </span>
                <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">
                  {t("multiRegionTitle", language)}
                </strong>
              </div>
              <span className="font-mono font-bold text-xs text-teal-800 dark:text-teal-400 flex items-center gap-1">
                <span>us-east-1</span> ➔ <span>eu-central-1</span> (68ms) | <span>98.5% Failover Ready</span>
              </span>
            </div>
            <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed mb-2">
              {t("multiRegionDesc", language)}
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono pt-1.5 border-t border-aws-teal/10">
              <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {t("crossRegionLagLabel", language)} <strong className="text-emerald-800 dark:text-emerald-400">120ms</strong>
              </span>
              <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {t("failoverRtoLabel", language)} <strong className="text-teal-800 dark:text-teal-400">{"< 30s"}</strong>
              </span>
            </div>
            <button
              id="test-failover-btn"
              onClick={() => {
                if (showToast) showToast("🟢 Simulated Multi-Region Aurora Failover Event to us-east-1 Successful (RTO 24s)!");
              }}
              className="mt-2 w-full py-1 rounded bg-teal-800 hover:bg-teal-900 text-white text-[10px] font-bold cursor-pointer transition-all"
            >
              {t("triggerTestFailoverBtn", language)}
            </button>
          </div>
        )}

        {/* Enterprise Webhook Dispatch Simulator */}
        {hasFeature("webhooks") && (
          <div id="webhook-simulator-card" className="p-3 bg-purple-500/5 border border-purple-500/20 rounded text-xs">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-800 dark:text-purple-400">
                  Enterprise
                </span>
                <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">
                  {t("enterpriseWebhookSimulatorTitle", language)}
                </strong>
              </div>
              <div className="flex gap-1">
                {(["slack", "teams", "pagerduty"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setWebhookTarget(t);
                      if (t === "slack") setWebhookUrl("https://hooks.slack.com/services/T0000/B0000/XXXXX");
                      else if (t === "teams") setWebhookUrl("https://outlook.office.com/webhook/XXXXX/IncomingWebhook/YYYYY");
                      else setWebhookUrl("https://events.pagerduty.com/v2/enqueue");
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                      webhookTarget === t
                        ? "bg-purple-600 text-white shadow"
                        : "bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextSecondary dark:text-aws-textSecondary"
                    }`}
                  >
                    {t === "slack" ? "💬 Slack" : t === "teams" ? "🟦 MS Teams" : "📟 PagerDuty"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <input
                id="webhook-url-input"
                type="text"
                value={webhookUrl}
                aria-label={t("webhookUrlAria", language)}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-2 py-1 text-[11px] font-mono rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary"
              />
              <button
                id="dispatch-webhook-btn"
                onClick={async () => {
                  const res = await dispatchWebhookAlert(webhookTarget, webhookUrl, "db-sales-prod", "High CPU Load", "High CPU anomaly detected on db-sales-prod (88%)");
                  setWebhookResult(res);
                }}
                className="px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer transition-all"
              >
                {t("triggerTestAnomalyAlertBtn", language)}
              </button>
              {webhookResult && (
                <div id="webhook-dispatch-response" className="p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-purple-500/30 text-[10px] font-mono flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-bold">HTTP {webhookResult.statusCode} OK</span>
                    {webhookResult.signatureHeader && (
                      <span className="text-[9px] text-purple-300">Header: {webhookResult.signatureHeader.slice(0, 18)}...</span>
                    )}
                  </div>
                  <span>{t("alertDeliveredTo", language)} {webhookResult.target}!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interactive ROI Savings Calculator */}
        <div className="p-3.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-xs mt-2">
          <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-aws-lightBorder dark:border-aws-divider">
            <span className="font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              📊 {t("roiCalculator", language)}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                {(
                  (roiDbCount * 145) /
                  (tier === "enterprise" ? 499 : tier === "medium" ? 179 : tier === "small" ? 59 : 179)
                ).toFixed(1)}
                x {t("netRoi", language)}
              </span>
              <button
                id="reset-roi-slider-btn"
                onClick={() => {
                  setRoiDbCount(10);
                  showToast("🔄 ROI Calculator slider reset to baseline (10 DBs)");
                }}
                className="px-2 py-0.5 rounded bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border text-[9px] font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary cursor-pointer transition-all flex items-center gap-1"
                title={t("resetRoiSliderTitle", language)}
              >
                🔄 {t("resetSlider", language)}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {t("dbInstancesManaged", language)}
              </span>
              <span className="font-mono font-bold text-amber-800 dark:text-aws-orange">{roiDbCount} {t("instancesCount", language)}</span>
            </div>

            <input
              type="range"
              id="roi-db-slider"
              aria-label={t("roiDbSliderAria", language)}
              min="1"
              max="50"
              value={roiDbCount}
              onChange={(e) => setRoiDbCount(Number(e.target.value))}
              className="w-full accent-aws-orange cursor-pointer h-1.5 bg-aws-lightBorder dark:bg-aws-border rounded-lg appearance-none"
            />

            <div className="grid grid-cols-3 gap-2 mt-1 font-mono text-[10px] text-center">
              <div className="p-1.5 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
                <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary block text-[9px]">
                  {t("estAnnualCost", language)}
                </span>
                <strong className="text-emerald-800 dark:text-emerald-400 text-xs">
                  ${(roiDbCount * 145).toLocaleString()}/mo
                </strong>
              </div>
              <div className="p-1.5 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
                <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary block text-[9px]">
                  {t("optAnnualCost", language)} ({tier})
                </span>
                <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs">
                  ${tier === "enterprise" ? 499 : tier === "medium" ? 179 : tier === "small" ? 59 : 0}/mo
                </strong>
              </div>
              <div className="p-1.5 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
                <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary block text-[9px]">
                  {t("netAnnualSavings", language)}
                </span>
                <strong className="text-sky-800 dark:text-aws-blue text-xs">
                  $
                  {(
                    (roiDbCount * 145 -
                      (tier === "enterprise" ? 499 : tier === "medium" ? 179 : tier === "small" ? 59 : 0)) *
                    12
                  ).toLocaleString()}
                  /yr
                </strong>
              </div>
            </div>
          </div>
        </div>

        {tier === "trial" && (
          <div className="p-4 bg-aws-orange/10 border border-dashed border-aws-orange/30 rounded text-center">
            <p className="text-xs font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary mb-1">
              {t("trialCostRecLimitTitle", language)}
            </p>
            <p className="text-[11px] text-aws-textSecondary mb-3">
              {t("trialCostRecLimitDesc", language)}
            </p>
            <button
              onClick={() => handleTierClick("small")}
              className="px-4 py-1.5 bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary dark:text-aws-lightTextPrimary text-xs font-bold rounded shadow transition-all active:scale-95"
            >
              {t("unlockSmallTierBtn", language)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
