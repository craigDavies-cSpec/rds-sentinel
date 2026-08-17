"use client";

import React from "react";
import { TierType, TIER_PRICING_PLANS, calculateTierProration } from "@/lib/accountSettings";
import { t, LanguageCode } from "@/lib/localization";

interface TierConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: TierType;
  pendingTier: TierType;
  onConfirmTier: (tier: TierType, mode: "sandbox" | "marketplace") => void;
  language: LanguageCode;
}

export function TierConfirmationModal({
  isOpen,
  onClose,
  currentTier,
  pendingTier,
  onConfirmTier,
  language,
}: TierConfirmationModalProps) {
  if (!isOpen) return null;

  const targetPlan = TIER_PRICING_PLANS[pendingTier] || TIER_PRICING_PLANS.medium;
  const proration = calculateTierProration(currentTier, pendingTier);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-border pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <div>
              <h3 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">
                {t("subscriptionMarketplaceTitle", language)}
              </h3>
              <span className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {t("selectModeUpgrade", language)} {targetPlan.name} (${targetPlan.monthlyPrice}/{t("moLabel", language)})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sm font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Plan Comparison Box */}
        <div className="p-4 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded-lg flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-divider pb-2">
            <div>
              <span className="text-xs font-bold text-amber-800 dark:text-aws-orange uppercase tracking-wider block">
                {t("targetTierLabel", language)} {targetPlan.name}
              </span>
              <span className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {proration.textSummary}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-mono font-extrabold text-aws-lightTextPrimary dark:text-aws-textPrimary">
                ${targetPlan.monthlyPrice}
              </span>
              <span className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary block">/{t("monthLabel", language)}</span>
            </div>
          </div>

          {/* Multi-Account & Instance Capacity Limits */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block uppercase font-bold">{t("awsAccountsLimit", language)}</span>
              <strong className="text-sky-800 dark:text-sky-400">
                {pendingTier === "enterprise" ? "Unlimited (AWS Orgs)" : pendingTier === "medium" ? "Up to 3 Accounts" : "1 Account"}
              </strong>
            </div>
            <div className="p-2 bg-aws-lightContainer dark:bg-aws-container rounded border border-aws-lightBorder dark:border-aws-border">
              <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block uppercase font-bold">{t("dbInstancesLimit", language)}</span>
              <strong className="text-emerald-800 dark:text-emerald-400">
                {pendingTier === "enterprise" ? "50 DBs Included (+ Metered)" : `Max ${targetPlan.maxInstances} DBs`}
              </strong>
            </div>
          </div>

          {/* Features List */}
          <div className="flex flex-col gap-1 pt-1 text-xs">
            <span className="text-[10px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase">{t("includedEntitlements", language)}</span>
            {targetPlan.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px]">
                <span className="text-emerald-800 dark:text-emerald-400 font-bold">✓</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            id="confirm-sandbox-tier-btn"
            onClick={() => onConfirmTier(pendingTier, "sandbox")}
            className="w-full py-2.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {t("testSandboxModeBtn", language)}
          </button>

          <button
            id="confirm-aws-marketplace-billing-btn"
            onClick={() => onConfirmTier(pendingTier, "marketplace")}
            className="w-full py-2.5 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {t("confirmMarketplaceBillingBtn", language)} (${targetPlan.monthlyPrice}/{t("moLabel", language)})
          </button>
        </div>
      </div>
    </div>
  );
}
