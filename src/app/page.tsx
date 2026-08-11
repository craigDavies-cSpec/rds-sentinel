"use client";

import React, { useState, useEffect } from "react";
import { 
  MOCK_INSTANCES, 
  MOCK_RECOMMENDATIONS, 
  MOCK_SLOW_QUERIES, 
  MOCK_LOGS, 
  DBInstance,
  CostRecommendation
} from "@/lib/mockTelemetry";
import { maskSQLQuery, maskLogLine } from "@/lib/logSanitizer";
import { calculateNextIntervalMs, TelemetryOutboxQueue } from "@/lib/dynamicTelemetry";

// Initialize the telemetry outbox queue
const outbox = new TelemetryOutboxQueue();

export default function Dashboard() {
  // Subscription tier state: gates dashboard features
  const [tier, setTier] = useState<"trial" | "small" | "medium" | "enterprise">("medium");
  
  // Dark/Light Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Active database instance selection
  const [selectedDbId, setSelectedDbId] = useState<string>("db-prod-aurora");
  const [instances, setInstances] = useState<DBInstance[]>(MOCK_INSTANCES);
  const [selectedDb, setSelectedDb] = useState<DBInstance>(MOCK_INSTANCES[0]);

  // Transition skeleton loading state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // SQL Masking toggle state
  const [maskSql, setMaskSql] = useState(true);

  // Simulated Outbox Queue state (from dynamicTelemetry)
  const [outboxStatus, setOutboxStatus] = useState(outbox.getStatus());
  const [isDbEndpointOnline, setIsDbEndpointOnline] = useState(true);

  // Real-time ticking telemetry simulation
  const [tickCount, setTickCount] = useState(0);

  // Memory Cap (Developer Agent Audit): Store limited history in state (max 50)
  const [cpuHistory, setCpuHistory] = useState<Record<string, number[]>>({
    "db-prod-aurora": Array.from({ length: 24 }, () => Math.round(60 + Math.random() * 20)),
    "db-billing-rds": Array.from({ length: 24 }, () => Math.round(20 + Math.random() * 15)),
    "db-dev-sandbox": Array.from({ length: 24 }, () => Math.round(8 + Math.random() * 5)),
    "db-analytics-aurora": Array.from({ length: 24 }, () => Math.round(40 + Math.random() * 15)),
  });

  // Synchronize document theme class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle DB selection change with a visual skeleton transition (UI/UX Agent Audit)
  const handleSelectDb = (dbId: string) => {
    if (dbId === selectedDbId) return;
    setIsTransitioning(true);
    setSelectedDbId(dbId);
    
    // Simulate minor network fetch delay (500ms) for telemetry query
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);

    return () => clearTimeout(timer);
  };

  // Telemetry loop to simulate real-time metrics drifting slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setInstances(prev => {
        const nextInstances = prev.map(db => {
          // Add random drift to CPU load (-4% to +4%)
          const cpuDrift = (Math.random() - 0.5) * 8;
          const newCpu = Math.max(5, Math.min(99, Math.round(db.cpuLoad + cpuDrift)));
          
          // Connections drift
          const connDrift = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const newConn = Math.max(1, Math.round(db.connections + connDrift));

          // IOPS drift proportional to CPU
          const newIops = Math.round(newCpu * (db.iops / db.cpuLoad) * (0.9 + Math.random() * 0.2));

          return {
            ...db,
            cpuLoad: newCpu,
            connections: newConn,
            iops: newIops
          };
        });

        // Update CPU history (Developer Agent Audit - Clamped to max 50 entries)
        setCpuHistory(history => {
          const updated = { ...history };
          nextInstances.forEach(db => {
            const list = history[db.id] || [];
            // Append new value and slice last 50 elements (hard boundary cap)
            updated[db.id] = [...list, db.cpuLoad].slice(-50);
          });
          return updated;
        });

        return nextInstances;
      });

      setTickCount(prev => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update selected DB reference when instances data drifts
  useEffect(() => {
    const updated = instances.find(db => db.id === selectedDbId);
    if (updated) {
      setSelectedDb(updated);
    }
  }, [instances, selectedDbId]);

  // Queue simulation logic
  useEffect(() => {
    const runQueueSimulation = async () => {
      // Enqueue mock telemetry
      outbox.enqueue({
        instanceId: selectedDb.id,
        timestamp: new Date().toISOString(),
        metrics: {
          cpu: selectedDb.cpuLoad,
          connections: selectedDb.connections,
          iops: selectedDb.iops,
          freeStorageBytes: selectedDb.freeStorageGb * 1024 * 1024 * 1024
        }
      });

      // Process telemetry payload queue based on connection state
      await outbox.processQueue(async (payload) => {
        // Resolve target connection simulation state
        return isDbEndpointOnline;
      });

      setOutboxStatus(outbox.getStatus());
    };

    runQueueSimulation();
  }, [tickCount, isDbEndpointOnline, selectedDb]);

  // Compute total monthly database cost & savings recommendations
  const totalCost = 1420; // Simulated current AWS base cost
  const activeRecommendations = MOCK_RECOMMENDATIONS.filter(rec => {
    if (tier === "trial") return rec.type === "downsize";
    if (tier === "small") return rec.type === "downsize" || rec.type === "serverless";
    return true; // Medium/Enterprise get all recommendations
  });

  const potentialSavings = activeRecommendations
    .filter(rec => rec.costDelta < 0)
    .reduce((acc, rec) => acc + Math.abs(rec.costDelta), 0);

  // Helper check for tier feature access
  const hasFeature = (feature: "real-time-logs" | "explain-advisor" | "multi-region" | "webhooks") => {
    if (tier === "trial" || tier === "small") return false;
    if (tier === "medium") return feature !== "webhooks"; // Enterprise only gets webhooks
    return true; // Enterprise has everything
  };

  // Helper class for billing active states
  const getBadgeClass = (active: boolean) => 
    active 
      ? "px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500" 
      : "px-2 py-0.5 rounded bg-aws-divider border border-aws-border text-xs text-aws-textSecondary line-through";

  return (
    <div className="min-h-screen bg-aws-lightBg dark:bg-aws-dark transition-colors duration-200">
      {/* 1. Global AWS Header */}
      <header className="sticky top-0 z-40 w-full border-b border-aws-lightBorder dark:border-aws-border bg-aws-lightContainer dark:bg-aws-container shadow-sm">
        <div className="mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* RDS Sentinel Logo */}
            <div className="flex items-center gap-1.5 font-bold tracking-tight">
              <span className="text-aws-orange font-extrabold text-xl">RDS</span>
              <span className="text-aws-lightTextPrimary dark:text-aws-textPrimary font-semibold">Sentinel</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-aws-orange/15 text-aws-orange border border-aws-orange/20 font-bold uppercase tracking-wider">
              AWS Marketplace Partner
            </span>
          </div>

          {/* Quick Gating Tier Controller & Theme Toggles */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-aws-lightBg dark:bg-aws-dark p-1 rounded-lg border border-aws-lightBorder dark:border-aws-border">
              <span className="text-[10px] uppercase font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary px-2">Tier:</span>
              {(["trial", "small", "medium", "enterprise"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all ${
                    tier === t
                      ? "bg-aws-orange text-white shadow-md"
                      : "text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? "☀️ Light Console" : "🌙 Dark Console"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN: Database Selectors & Health Telemetry */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          {/* DB Instances List */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
            <h2 className="text-sm font-bold text-aws-orange uppercase tracking-wider mb-3">Target Databases</h2>
            <div className="flex flex-col gap-2">
              {instances.map(db => {
                const isSelected = db.id === selectedDbId;
                const isTrialRestricted = tier === "trial" && (db.id === "db-dev-sandbox" || db.id === "db-analytics-aurora");
                return (
                  <button
                    key={db.id}
                    disabled={isTrialRestricted}
                    onClick={() => handleSelectDb(db.id)}
                    className={`w-full text-left p-3 rounded-md border transition-all flex flex-col ${
                      isSelected
                        ? "bg-aws-orange/10 border-aws-orange text-aws-lightTextPrimary dark:text-aws-textPrimary"
                        : isTrialRestricted
                        ? "opacity-40 bg-aws-lightBg/50 dark:bg-aws-dark/50 border-transparent cursor-not-allowed"
                        : "bg-aws-lightBg dark:bg-aws-dark border-aws-lightBorder dark:border-aws-border hover:border-aws-orange/40"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <span className="font-bold text-xs truncate max-w-[150px]">{db.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-aws-border text-aws-textSecondary font-mono">
                        {db.engine}
                      </span>
                    </div>
                    <div className="flex justify-between items-center w-full text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary">
                      <span>{db.region.split(" ")[0]}</span>
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${db.cpuLoad > 80 ? "bg-aws-red animate-pulse" : "bg-aws-green"}`} />
                        CPU: {db.cpuLoad}%
                      </span>
                    </div>
                    {isTrialRestricted && (
                      <span className="text-[9px] text-aws-red font-semibold mt-1">🔒 Locked (Trial Cap: 2 DBs)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Database Telemetry Gauges */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4 flex flex-col gap-4">
            <div className="border-b border-aws-lightBorder dark:border-aws-divider pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-aws-textSecondary">Instance Telemetry</h3>
              <span className="text-lg font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary font-mono">{selectedDb.name}</span>
            </div>

            {isTransitioning ? (
              /* Simulated Telemetry Loading Skeleton (UI/UX Agent Audit) */
              <div className="flex flex-col gap-4 py-2 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="h-3 w-24 bg-aws-lightBg dark:bg-aws-dark/60 rounded" />
                    <div className="h-5 w-full bg-aws-lightBg dark:bg-aws-dark/60 rounded" />
                  </div>
                ))}
                <div className="h-10 w-full bg-aws-lightBg dark:bg-aws-dark/60 rounded mt-2" />
              </div>
            ) : (
              <>
                {/* CPU Load bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>CPU Utilization</span>
                    <span className="font-mono">{selectedDb.cpuLoad}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-aws-lightBg dark:bg-aws-dark rounded-full overflow-hidden border border-aws-lightBorder dark:border-aws-border">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        selectedDb.cpuLoad > 85 ? "bg-aws-red" : selectedDb.cpuLoad > 60 ? "bg-aws-yellow" : "bg-aws-blue"
                      }`}
                      style={{ width: `${selectedDb.cpuLoad}%` }}
                    />
                  </div>
                </div>

                {/* Connections count */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Active Connections</span>
                    <span className="font-mono">{selectedDb.connections} / 150</span>
                  </div>
                  <div className="w-full h-2.5 bg-aws-lightBg dark:bg-aws-dark rounded-full overflow-hidden border border-aws-lightBorder dark:border-aws-border">
                    <div 
                      className="h-full bg-aws-teal transition-all duration-500"
                      style={{ width: `${(selectedDb.connections / 150) * 100}%` }}
                    />
                  </div>
                </div>

                {/* CPU History Sparkline (Developer Agent Audit - Clamped to 50 max points in memory) */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Historical CPU Profile (Last {cpuHistory[selectedDb.id]?.length || 0} samples)</span>
                    <span className="text-[10px] text-aws-textSecondary">Clamped to 50 max</span>
                  </div>
                  <div className="relative flex items-end gap-0.5 h-12 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded p-1 font-mono text-[9px] text-aws-textSecondary">
                    {/* Visual Threshold Baseline Gridlines (UI/UX Agent Audit) */}
                    <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-aws-lightBorder/40 dark:border-aws-border/40 pointer-events-none" title="75% CPU" />
                    <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-aws-lightBorder/40 dark:border-aws-border/40 pointer-events-none" title="50% CPU" />
                    <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-aws-lightBorder/40 dark:border-aws-border/40 pointer-events-none" title="25% CPU" />

                    {(cpuHistory[selectedDb.id] || []).map((cpuValue, i) => (
                      <div 
                        key={i} 
                        className={`flex-grow transition-all ${
                          cpuValue > 85 
                            ? "bg-aws-red/50 hover:bg-aws-red" 
                            : cpuValue > 60 
                            ? "bg-aws-yellow/50 hover:bg-aws-yellow" 
                            : "bg-aws-blue/50 hover:bg-aws-blue"
                        }`}
                        style={{ height: `${cpuValue}%` }}
                        title={`Sample ${i + 1}: CPU ${cpuValue}%`}
                      />
                    ))}
                  </div>
                </div>

                {/* DB Class & Storage Meta */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-aws-lightBorder dark:border-aws-divider text-xs">
                  <div>
                    <span className="text-[10px] text-aws-textSecondary block uppercase font-semibold">Instance Class</span>
                    <span className="font-bold font-mono">{selectedDb.class}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-aws-textSecondary block uppercase font-semibold">Free Storage</span>
                    <span className="font-bold font-mono text-aws-green">{selectedDb.freeStorageGb} GB</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* MIDDLE COLUMN: Cost-Performance Balancer & Slow Query list */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          {/* Cost-Performance Balancer */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-aws-orange uppercase tracking-wider">Cost-Performance Balancer</h2>
              <span className="text-[11px] font-bold text-aws-textSecondary">Tier Capability: <span className="text-aws-teal uppercase font-extrabold">{tier}</span></span>
            </div>

            {/* Key Billing Highlights */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
                <span className="text-[10px] text-aws-textSecondary uppercase block">Base DB Cost</span>
                <span className="text-lg font-bold font-mono text-aws-lightTextPrimary dark:text-aws-textPrimary">${totalCost}/mo</span>
              </div>
              <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
                <span className="text-[10px] text-aws-textSecondary uppercase block">Optimized Savings</span>
                <span className="text-lg font-bold font-mono text-aws-green">${potentialSavings}/mo</span>
              </div>
              <div className="p-3 bg-aws-lightBg dark:bg-aws-dark rounded border border-aws-lightBorder dark:border-aws-border text-center">
                <span className="text-[10px] text-aws-textSecondary uppercase block">Optimized Cost</span>
                <span className="text-lg font-bold font-mono text-aws-blue">${totalCost - potentialSavings}/mo</span>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="flex flex-col gap-3">
              {activeRecommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className={`p-3 rounded border text-xs ${
                    rec.costDelta < 0 
                      ? "bg-aws-green/5 border-aws-green/20" 
                      : "bg-aws-blue/5 border-aws-blue/20"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded mr-2 ${
                        rec.costDelta < 0 ? "bg-aws-green/10 text-aws-green" : "bg-aws-blue/10 text-aws-blue"
                      }`}>
                        {rec.type}
                      </span>
                      <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary">{rec.title}</strong>
                    </div>
                    <span className={`font-mono font-bold text-sm ${rec.costDelta < 0 ? "text-aws-green" : "text-aws-blue"}`}>
                      {rec.costDelta < 0 ? `-$${Math.abs(rec.costDelta)}` : `+$${rec.costDelta}`} / mo
                    </span>
                  </div>
                  <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed">{rec.reason}</p>
                </div>
              ))}
              
              {tier === "trial" && (
                /* Billing Upgrade CTA inside locked cost-recommendations (PO Agent Audit) */
                <div className="p-4 bg-aws-orange/10 border border-dashed border-aws-orange/30 rounded text-center">
                  <p className="text-xs font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary mb-1">
                    🔒 Cost recommendations are limited on the Trial tier.
                  </p>
                  <p className="text-[11px] text-aws-textSecondary mb-3">
                    Upgrade to Small Business or higher to unlock multi-region latency modeling and Aurora Serverless optimization.
                  </p>
                  <button 
                    onClick={() => setTier("small")}
                    className="px-4 py-1.5 bg-aws-orange hover:bg-aws-orangeHover text-white text-xs font-bold rounded shadow transition-all active:scale-95"
                  >
                    Unlock Small Business Tier
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Slow Query Monitor */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-sm font-bold text-aws-orange uppercase tracking-wider flex items-center gap-2">
                  Slow Query Inspector
                  <span className="text-[9px] bg-aws-red/10 text-aws-red border border-aws-red/20 px-1.5 py-0.5 rounded font-mono">
                    PII Redacted
                  </span>
                </h2>
              </div>

              {/* Edge sanitization selector */}
              <button
                onClick={() => setMaskSql(!maskSql)}
                className={`text-xs px-3 py-1 rounded font-bold border transition-colors ${
                  maskSql 
                    ? "bg-aws-green/10 text-aws-green border-aws-green/30 hover:bg-aws-green/20" 
                    : "bg-aws-red/10 text-aws-red border-aws-red/30 hover:bg-aws-red/20"
                }`}
              >
                {maskSql ? "🛡️ Parameter Masking: ACTIVE (Safe)" : "⚠️ Parameter Masking: OFF (Raw)"}
              </button>
            </div>

            <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-4 leading-relaxed">
              Below are slow queries captured. Turning masking off exposes customer emails and credit cards in raw query strings (simulated local VPC view). Active masking converts database inputs to safe placeholder parameters before sending.
            </p>

            <div className="flex flex-col gap-3">
              {MOCK_SLOW_QUERIES.map((q) => (
                <div key={q.id} className="p-3 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded font-mono text-xs">
                  <div className="flex justify-between text-[10px] text-aws-textSecondary mb-1.5 pb-1 border-b border-aws-lightBorder dark:border-aws-divider">
                    <span>DB: {instances.find(db => db.id === q.dbInstanceId)?.name}</span>
                    <span>Wait Event: <span className="text-aws-yellow">{q.waitEvent}</span></span>
                    <span className="text-aws-red font-bold">{q.durationMs}ms</span>
                  </div>
                  <pre className="whitespace-pre-wrap break-all text-[11px] text-aws-lightTextPrimary dark:text-aws-textPrimary">
                    {maskSql ? q.maskedSql : q.rawSql}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Log Watcher, Gaps Demo & Agents Audits */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          {/* Anomaly Log Watcher */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4">
            <h2 className="text-sm font-bold text-aws-orange uppercase tracking-wider mb-3">Anomaly Log Watcher</h2>
            
            {!hasFeature("real-time-logs") ? (
              /* Billing Upgrade CTA inside Log Watcher (PO Agent Audit) */
              <div className="text-center py-6 text-xs text-aws-textSecondary">
                <span className="block text-2xl mb-2">🔒</span>
                <p className="font-semibold text-aws-lightTextPrimary dark:text-aws-textPrimary">Real-Time Log Scanning Locked</p>
                <p className="mt-1 mb-4 text-[11px]">Real-time log scanning is a premium feature available in the **Medium** and **Enterprise** tiers.</p>
                <button 
                  onClick={() => setTier("medium")}
                  className="px-4 py-2 bg-aws-orange hover:bg-aws-orangeHover text-white text-xs font-bold rounded shadow transition-all active:scale-95"
                >
                  Unlock Medium Tier
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {MOCK_LOGS.map((log) => (
                  <div key={log.id} className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-[11px] font-mono leading-relaxed">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`px-1 rounded text-[9px] font-bold ${
                        log.level === "ERROR" 
                          ? "bg-aws-red/10 text-aws-red" 
                          : "bg-aws-yellow/10 text-aws-yellow"
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-[9px] text-aws-textSecondary">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-aws-lightTextPrimary dark:text-aws-textPrimary">{log.maskedMessage}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gaps Implementation Simulator Panel */}
          <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg p-4 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-aws-orange uppercase tracking-wider border-b border-aws-lightBorder dark:border-aws-divider pb-2">
              Telemetry Ingest Sandbox
            </h2>

            {/* Gap 1: Dynamic Telemetry scrape interval */}
            <div>
              <span className="text-[10px] text-aws-textSecondary uppercase font-bold block">Dynamic Scrape Window</span>
              <div className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded mt-1 text-[11px] leading-relaxed">
                <div className="flex justify-between font-bold mb-1">
                  <span>Calculated Interval:</span>
                  <span className="text-aws-teal">
                    {Math.round(calculateNextIntervalMs(selectedDb.cpuLoad, selectedDb.connections, tier) / 1000)}s
                  </span>
                </div>
                <p className="text-[10px] text-aws-textSecondary">
                  {selectedDb.cpuLoad > 85 
                    ? "⚠️ Load spike detected! Scraping at 3x frequency (30s) to monitor metrics."
                    : selectedDb.cpuLoad < 15
                    ? "💤 Instance is idle. Scraping extended to save CloudWatch API request fees."
                    : "✅ Monitoring database telemetry at default tier cadence."}
                </p>
              </div>
            </div>

            {/* Gap 2: Outbox queue and Circuit Breaker states */}
            <div>
              <span className="text-[10px] text-aws-textSecondary uppercase font-bold block">Telemetry Outbox Outflow</span>
              <div className="p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded mt-1 text-[11px] leading-relaxed">
                <div className="flex justify-between font-bold mb-1">
                  <span>Outbox Queue Count:</span>
                  <span className="font-mono text-aws-blue">{outboxStatus.queueCount}</span>
                </div>
                <div className="flex justify-between font-bold mb-2">
                  <span>Circuit Breaker:</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${
                    outboxStatus.state === "CLOSED"
                      ? "bg-aws-green/10 text-aws-green"
                      : outboxStatus.state === "OPEN"
                      ? "bg-aws-red/10 text-aws-red animate-pulse"
                      : "bg-aws-yellow/10 text-aws-yellow"
                  }`}>
                    {outboxStatus.state}
                  </span>
                </div>

                {/* Connection switch controller */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsDbEndpointOnline(true)}
                    className={`flex-1 text-[10px] py-1 rounded font-bold border transition-colors ${
                      isDbEndpointOnline
                        ? "bg-aws-green text-white border-transparent"
                        : "bg-transparent text-aws-textSecondary border-aws-border hover:bg-aws-border/40"
                    }`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => setIsDbEndpointOnline(false)}
                    className={`flex-1 text-[10px] py-1 rounded font-bold border transition-colors ${
                      !isDbEndpointOnline
                        ? "bg-aws-red text-white border-transparent"
                        : "bg-transparent text-aws-textSecondary border-aws-border hover:bg-aws-border/40"
                    }`}
                  >
                    Disconnect
                  </button>
                </div>
                
                {!isDbEndpointOnline && (
                  <p className="text-[9px] text-aws-red mt-1.5 leading-snug">
                    ⚠️ Connection offline. Payloads are queueing in local cache. Backing off retry delay: {outboxStatus.retryDelayMs / 1000}s.
                  </p>
                )}
              </div>
            </div>

            {/* Gating Status Review */}
            <div>
              <span className="text-[10px] text-aws-textSecondary uppercase font-bold block mb-1">Billing Feature Matrix</span>
              <div className="flex flex-col gap-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Slow Query Metrics</span>
                  <span className={getBadgeClass(true)}>Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost Optimizations</span>
                  <span className={getBadgeClass(tier !== "trial")}>Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Real-Time Logs Watcher</span>
                  <span className={getBadgeClass(hasFeature("real-time-logs"))}>
                    {hasFeature("real-time-logs") ? "Active" : "Locked"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Replication Latency Suggester</span>
                  <span className={getBadgeClass(hasFeature("multi-region"))}>
                    {hasFeature("multi-region") ? "Active" : "Locked"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Slack & PagerDuty Integration</span>
                  <span className={getBadgeClass(hasFeature("webhooks"))}>
                    {hasFeature("webhooks") ? "Active" : "Locked"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
