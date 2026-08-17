"use client";

import React, { useState } from "react";
import { AuditEvidencePackage, AuditEvidenceControl } from "@/lib/auditEvidenceExporter";
import { t, LanguageCode } from "@/lib/localization";

interface EvidenceInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidencePackage: AuditEvidencePackage;
  downloadAuditEvidencePackageFile: (pkg: AuditEvidencePackage) => void;
  language: LanguageCode;
}

export function EvidenceInspectorDrawer({
  isOpen,
  onClose,
  evidencePackage,
  downloadAuditEvidencePackageFile,
  language,
}: EvidenceInspectorDrawerProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "controls" | "proofs">("summary");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-aws-lightContainer dark:bg-aws-container border-l border-aws-lightBorder dark:border-aws-border w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-aws-lightBorder dark:border-aws-border flex justify-between items-center bg-aws-lightBg dark:bg-aws-dark">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold text-lg">🛡️</span>
            <div>
              <h3 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary">
                {t("evidenceDrawerTitle", language)}
              </h3>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                {t("trustServicesCriteriaSubtitle", language)}
              </p>
              <span className="text-[10px] font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary">
                {t("packageIdLabel", language)} {evidencePackage.auditId}
              </span>
            </div>
          </div>
          <button
            id="close-evidence-drawer-btn"
            onClick={onClose}
            className="text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="flex border-b border-aws-lightBorder dark:border-aws-border bg-aws-lightBg/50 dark:bg-aws-dark/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === "summary"
                ? "bg-aws-orange text-white"
                : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
            }`}
          >
            {t("overviewTab", language)}
          </button>
          <button
            onClick={() => setActiveTab("controls")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === "controls"
                ? "bg-aws-orange text-white"
                : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
            }`}
          >
            {t("tscControlsTab", language)} ({evidencePackage.trustServicesCriteria.length})
          </button>
          <button
            onClick={() => setActiveTab("proofs")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === "proofs"
                ? "bg-aws-orange text-white"
                : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
            }`}
          >
            {t("iamProofsTab", language)}
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 overflow-y-auto flex-1 font-sans text-xs">
          {activeTab === "summary" && (
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                <span className="font-bold block mb-1">{t("statusLabel", language)} {evidencePackage.overallStatus}</span>
                <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                  {t("evaluatedStandardLabel", language)} {evidencePackage.complianceStandard}. {t("generatedForLabel", language)} {evidencePackage.companyName} ({evidencePackage.auditorEmail}).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border">
                  <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block">{t("kmsMasterKeyLabel", language)}</span>
                  <strong>{evidencePackage.encryptionProof.kmsKeyArn}</strong>
                </div>
                <div className="p-2 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border">
                  <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block">{t("tlsEnforcementLabel", language)}</span>
                  <strong>{evidencePackage.encryptionProof.tlsVersion}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === "controls" && (
            <div className="flex flex-col gap-3">
              {evidencePackage.trustServicesCriteria.map((ctrl: AuditEvidenceControl) => (
                <div key={ctrl.controlId} className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-aws-orange">{ctrl.controlId}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                      {ctrl.status}
                    </span>
                  </div>
                  <strong className="block text-xs mb-1">{ctrl.category}</strong>
                  <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-2">
                    {ctrl.description}
                  </p>
                  <span className="text-[10px] font-mono text-emerald-400 block bg-emerald-950/40 p-1.5 rounded">
                    {t("proofLabel", language)} {ctrl.evidenceSnippet}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "proofs" && (
            <div className="flex flex-col gap-3 font-mono text-[11px]">
              <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border">
                <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block mb-1">{t("iamAssumeRolePolicyLabel", language)}</span>
                <strong>{evidencePackage.iamIsolationProof.assumeRolePolicy}</strong>
              </div>
              <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border">
                <span className="text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary block mb-1">{t("externalIdConditionLabel", language)}</span>
                <strong>{evidencePackage.iamIsolationProof.externalIdCondition}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-aws-lightBorder dark:border-aws-border bg-aws-lightBg dark:bg-aws-dark flex justify-between items-center">
          <span className="text-xs font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary">
            {t("formatSoc2JsonPackageLabel", language)}
          </span>
          <button
            onClick={() => downloadAuditEvidencePackageFile(evidencePackage)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer transition-all active:scale-95"
          >
            {t("downloadJsonPackageBtn", language)}
          </button>
        </div>
      </div>
    </div>
  );
}
