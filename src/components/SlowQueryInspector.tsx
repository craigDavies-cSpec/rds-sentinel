"use client";

import React from "react";
import { SlowQuery, DBInstance } from "@/lib/mockTelemetry";
import { t, LanguageCode } from "@/lib/localization";
import { analyzeSlowQuery } from "@/lib/indexAdvisor";

interface SlowQueryInspectorProps {
  filteredSlowQueries: SlowQuery[];
  instances: DBInstance[];
  maskSql: boolean;
  setMaskSql: (mask: boolean) => void;
  language: LanguageCode;
  activeAdvisorQueryId: string | null;
  setActiveAdvisorQueryId: (id: string | null) => void;
  copiedDdlQueryId: string | null;
  setCopiedDdlQueryId: (id: string | null) => void;
}

export function SlowQueryInspector({
  filteredSlowQueries,
  instances,
  maskSql,
  setMaskSql,
  language,
  activeAdvisorQueryId,
  setActiveAdvisorQueryId,
  copiedDdlQueryId,
  setCopiedDdlQueryId,
  tier,
  handleTierClick,
  filteredLogs,
  hasFeature,
}: SlowQueryInspectorProps & {
  tier?: string;
  handleTierClick?: (tier: any) => void;
  filteredLogs?: any[];
  hasFeature?: (feat: string) => boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Log Watcher Card */}
      <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider">
            {t("logWatcher", language)}
          </h2>
        </div>

        {hasFeature && !hasFeature("real-time-logs") ? (
          /* Billing Upgrade CTA inside Log Watcher */
          <div className="text-center py-6 text-xs text-aws-textSecondary">
            <span className="block text-2xl mb-2">🔒</span>
            <p className="font-semibold text-aws-lightTextPrimary dark:text-aws-textPrimary">Real-Time Log Scanning Locked</p>
            <p className="mt-1 mb-4 text-[11px]">Real-time log scanning is a premium feature available in the **Medium** and **Enterprise** tiers.</p>
            <button 
              onClick={() => handleTierClick && handleTierClick("medium")}
              className="px-4 py-2 bg-aws-orange hover:bg-aws-orangeHover text-aws-lightTextPrimary dark:text-aws-lightTextPrimary text-xs font-bold rounded shadow transition-all active:scale-95 cursor-pointer"
            >
              Unlock Medium Tier
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(filteredLogs || []).map((log: any) => (
              <div key={log.id} className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-[11px] font-mono leading-relaxed">
                <div className="flex justify-between items-center mb-1">
                  <span className={`px-1 rounded text-[9px] font-bold ${
                    log.level === "ERROR" 
                      ? "bg-aws-red/10 text-red-800 dark:text-red-400" 
                      : "bg-aws-yellow/10 text-amber-800 dark:text-aws-yellow"
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-[9px] text-aws-lightTextSecondary dark:text-aws-textSecondary font-mono">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-aws-lightTextPrimary dark:text-aws-textPrimary">{log.maskedMessage}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="slow-query-inspector-card" className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-sm font-bold text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider flex items-center gap-2">
            {t("slowQueries", language)}
            <span className="text-[9px] bg-aws-red/10 text-red-800 dark:text-red-400 border border-aws-red/20 px-1.5 py-0.5 rounded font-mono">
              PII Redacted
            </span>
          </h2>
        </div>

        {/* Edge sanitization selector */}
        <button
          onClick={() => setMaskSql(!maskSql)}
          className={`text-xs px-3 py-1 rounded font-bold border transition-colors ${
            maskSql
              ? "bg-aws-green/10 text-emerald-800 dark:text-emerald-400 border-aws-green/30 hover:bg-aws-green/20"
              : "bg-aws-red/10 text-red-800 dark:text-red-400 border-aws-red/30 hover:bg-aws-red/20"
          }`}
        >
          {maskSql ? t("paramMaskingActive", language) : t("paramMaskingOff", language)}
        </button>
      </div>

      <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-4 leading-relaxed">
        {t("slowQueryDesc", language)}
      </p>

      <div className="flex flex-col gap-3">
        {filteredSlowQueries.map((q) => {
          const rec = analyzeSlowQuery(q);
          const isExpanded = activeAdvisorQueryId === q.id;
          const isCopied = copiedDdlQueryId === q.id;

          return (
            <div key={q.id} className="p-3 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded font-mono text-xs">
              <div className="flex justify-between text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-1.5 pb-1 border-b border-aws-lightBorder dark:border-aws-divider">
                <span>DB: {instances.find((db) => db.id === q.dbInstanceId)?.name}</span>
                <span>
                  Wait Event: <span className="text-amber-800 dark:text-aws-yellow">{q.waitEvent}</span>
                </span>
                <span className="text-red-800 dark:text-red-400 font-bold">{q.durationMs}ms</span>
              </div>

              <pre className="whitespace-pre-wrap break-all text-[11px] text-aws-lightTextPrimary dark:text-aws-textPrimary mb-2">
                {maskSql ? q.maskedSql : q.rawSql}
              </pre>

              <div className="flex justify-between items-center pt-2 border-t border-aws-lightBorder dark:border-aws-divider text-[10px]">
                <button
                  onClick={() => setActiveAdvisorQueryId(isExpanded ? null : q.id)}
                  className="px-2 py-1 rounded bg-aws-orange/10 hover:bg-aws-orange/20 text-amber-800 dark:text-aws-orange border border-aws-orange/20 font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  {isExpanded ? "▲ Hide Index Advisor" : `⚡ ${t("analyzeIndex", language)}`}
                </button>

                <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                  {t("estSpeedup", language)} -{rec.estimatedSpeedupPct}%
                </span>
              </div>

              {isExpanded && (
                <div className="mt-2.5 p-2.5 bg-aws-lightContainer dark:bg-aws-container border border-aws-orange/30 rounded text-xs font-sans leading-relaxed animate-fade-in">
                  <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-aws-lightBorder dark:border-aws-divider font-mono">
                    <span className="font-bold text-amber-800 dark:text-aws-orange text-[10px] uppercase">
                      💡 Automated Index Advisor DDL
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-bold text-[10px]">
                      {rec.originalDurationMs}ms ➔ {rec.optimizedDurationMs}ms (-{rec.estimatedSpeedupPct}% Faster)
                    </span>
                  </div>

                  <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-2">
                    {rec.explanation}
                  </p>

                  {/* AI Natural Language Diagnostic Card */}
                  <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-sans text-amber-900 dark:text-amber-300 mb-2 leading-relaxed">
                    <strong className="block font-bold mb-1 text-aws-orange">🤖 AI EXPLAIN Natural Language Diagnostic Advice:</strong>
                    <p>{rec.aiNaturalLanguageAdvice}</p>
                  </div>

                  {/* Recommended Standard DDL */}
                  <div className="relative bg-aws-lightBg dark:bg-aws-dark p-2 rounded border border-aws-lightBorder dark:border-aws-border font-mono text-[11px] text-emerald-800 dark:text-emerald-400 font-bold flex justify-between items-center mb-2">
                    <code>{rec.suggestedDdl}</code>
                    <button
                      id={`copy-ddl-btn-${q.id}`}
                      onClick={() => {
                        navigator.clipboard.writeText(rec.suggestedDdl);
                        setCopiedDdlQueryId(q.id);
                        setTimeout(() => setCopiedDdlQueryId(null), 2000);
                      }}
                      className="px-2 py-0.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-white text-[10px] font-bold cursor-pointer transition-all"
                    >
                      {isCopied ? t("ddlCopied", language) : t("copyDdl", language)}
                    </button>
                  </div>

                  {/* Zero-Downtime DDL Block */}
                  <div className="relative bg-aws-lightBg dark:bg-aws-dark p-2 rounded border border-aws-lightBorder dark:border-aws-border font-mono text-[11px] text-blue-800 dark:text-blue-400 font-bold flex justify-between items-center mb-2">
                    <div>
                      <span className="block text-[9px] uppercase text-blue-500 font-sans font-bold">⚡ Zero-Downtime Production DDL:</span>
                      <code>{rec.zeroDowntimeDdl}</code>
                    </div>
                    <button
                      id={`copy-zero-downtime-ddl-btn-${q.id}`}
                      onClick={() => {
                        navigator.clipboard.writeText(rec.zeroDowntimeDdl);
                        setCopiedDdlQueryId(`zero-${q.id}`);
                        setTimeout(() => setCopiedDdlQueryId(null), 2000);
                      }}
                      className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer transition-all"
                    >
                      {copiedDdlQueryId === `zero-${q.id}` ? "Copied!" : "Copy Zero-Downtime DDL"}
                    </button>
                  </div>

                  {/* Query Rewrite Suggestion */}
                  <div className="p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border font-mono text-[10px] text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    <strong className="block text-[9px] uppercase text-purple-400 font-sans font-bold mb-1">Optimized Query Rewrite:</strong>
                    <code>{rec.queryRewriteSuggestion}</code>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
}
