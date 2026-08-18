"use client";

import React from "react";
import { DBInstance } from "@/lib/mockTelemetry";
import { t, LanguageCode } from "@/lib/localization";
import { TierType } from "@/lib/accountSettings";

interface TelemetrySandboxProps {
  filteredInstances: DBInstance[];
  selectedDbId: string;
  setSelectedDbId: (id: string) => void;
  selectedDb: DBInstance;
  tier: TierType;
  language: LanguageCode;
  isTransitioning: boolean;
  handleSelectDb: (id: string) => void;
  handleCpuSliderChange: (val: number) => void;
  handleResetCpuToBaseline: (id: string) => void;
  calculatedIntervalMs: number;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  circuitBreakerState: "CLOSED" | "HALF_OPEN" | "OPEN";
  setCircuitBreakerState: (state: "CLOSED" | "HALF_OPEN" | "OPEN") => void;
  outboxCount: number;
  setOutboxCount: (cnt: number) => void;
  consecutiveFailures: number;
  cpuSparklineData: number[];
  hoveredSparklineIndex: number | null;
  setHoveredSparklineIndex: (idx: number | null) => void;
  moveLeft: (componentKey: string) => void;
  moveRight: (componentKey: string) => void;
  onTouchStart?: (componentKey: string) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

export function TelemetrySandbox({
  filteredInstances,
  selectedDbId,
  tier,
  language,
  isTransitioning,
  handleSelectDb,
  selectedDb,
  handleCpuSliderChange,
  handleResetCpuToBaseline,
  calculatedIntervalMs,
  isOnline,
  setIsOnline,
  circuitBreakerState,
  setCircuitBreakerState,
  outboxCount,
  setOutboxCount,
  consecutiveFailures,
  cpuSparklineData,
  hoveredSparklineIndex,
  setHoveredSparklineIndex,
  moveLeft,
  moveRight,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: TelemetrySandboxProps) {
  const sparklineContainerRef = React.useRef<HTMLDivElement>(null);
  const [sparklineWidth, setSparklineWidth] = React.useState<number>(260);

  React.useEffect(() => {
    if (!sparklineContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setSparklineWidth(Math.floor(entry.contentRect.width));
        }
      }
    });
    observer.observe(sparklineContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const svgHeight = 64;
  const dataPoints = cpuSparklineData && cpuSparklineData.length > 0 ? cpuSparklineData : [20, 25, 22, 30, 28, 35, 40, 32, 28, 25];
  const stepX = dataPoints.length > 1 ? sparklineWidth / (dataPoints.length - 1) : sparklineWidth;

  const pointsString = dataPoints
    .map((val, idx) => {
      const x = (idx * stepX).toFixed(1);
      const y = (svgHeight - (val / 100) * (svgHeight - 12) - 6).toFixed(1);
      return `${x},${y}`;
    })
    .join(" ");

  const fillPathString = `M 0,${svgHeight} L ${dataPoints
    .map((val, idx) => `${(idx * stepX).toFixed(1)} ${(svgHeight - (val / 100) * (svgHeight - 12) - 6).toFixed(1)}`)
    .join(" L ")} L ${sparklineWidth},${svgHeight} Z`;

  return (
    <div className="bg-aws-lightContainer/90 dark:bg-aws-container/90 backdrop-blur-md border border-aws-lightBorder/80 dark:border-aws-border/80 rounded-xl shadow-lg hover:shadow-xl p-5 flex flex-col gap-4 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-border pb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-aws-orange font-mono cursor-grab active:cursor-grabbing text-xs tracking-tighter select-none touch-none"
            onTouchStart={() => onTouchStart && onTouchStart("databases")}
            onTouchMove={(e) => onTouchMove && onTouchMove(e)}
            onTouchEnd={() => onTouchEnd && onTouchEnd()}
            title={t("dragHandleTitle", language)}
          >
            {"⋮⋮"}
          </span>
          <h2 className="font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary text-sm flex items-center gap-2">
            <span>{"🗄️"}</span> {t("targetDatabases", language)}
          </h2>
        </div>
        <div className="flex gap-1" data-testid="layout-controls-databases">
          <button
            onClick={() => moveLeft("databases")}
            aria-label={t("moveDbsLeftAria", language)}
            className="px-2 py-1 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded-md text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-all active:scale-95 cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={() => moveRight("databases")}
            aria-label={t("moveDbsRightAria", language)}
            className="px-2 py-1 bg-aws-lightBg dark:bg-aws-dark hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border rounded-md text-[10px] text-aws-lightTextSecondary dark:text-aws-textSecondary transition-all active:scale-95 cursor-pointer"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Database Buttons List */}
      <div className="flex flex-col gap-2.5">
        {filteredInstances.map((db) => {
          const isSelected = db.id === selectedDbId;
          const isTrialRestricted =
            tier === "trial" && (db.id === "db-dev-sandbox" || db.id === "db-analytics-aurora");
          return (
            <button
              key={db.id}
              disabled={isTrialRestricted}
              onClick={() => handleSelectDb(db.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex flex-col active:scale-98 cursor-pointer ${
                isSelected
                  ? "bg-aws-orange/15 border-aws-orange text-aws-lightTextPrimary dark:text-aws-textPrimary shadow-md"
                  : isTrialRestricted
                  ? "opacity-40 bg-aws-lightBg/50 dark:bg-aws-dark/50 border-transparent cursor-not-allowed"
                  : "bg-aws-lightBg dark:bg-aws-dark border-aws-lightBorder dark:border-aws-border hover:border-aws-orange/50 hover:shadow"
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
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      db.cpuLoad > 80 ? "bg-aws-red animate-pulse" : "bg-aws-green"
                    }`}
                  />
                  {t("cpuLabel", language)} {db.cpuLoad}%
                </span>
              </div>
              {isTrialRestricted && (
                <span className="text-[9px] text-aws-red font-semibold mt-1">
                  {t("lockedTrialCap", language)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Telemetry Section */}
      <div className="border-t border-aws-lightBorder dark:border-aws-border pt-3 flex flex-col gap-3">
        <div className="border-b border-aws-lightBorder dark:border-aws-divider pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-aws-lightTextSecondary dark:text-aws-textSecondary">
            {t("instanceTelemetry", language)}
          </h3>
          <span className="text-lg font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary font-mono">
            {selectedDb.name}
          </span>
        </div>

        {isTransitioning ? (
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
            {/* CPU Bar & Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>{t("cpuUtilization", language)}</span>
                <span className="font-mono">{selectedDb.cpuLoad}%</span>
              </div>
              <div className="w-full h-2.5 bg-aws-lightBg dark:bg-aws-dark rounded-full overflow-hidden border border-aws-lightBorder dark:border-aws-border">
                <div
                  className={`h-full transition-all duration-500 ${
                    selectedDb.cpuLoad > 85
                      ? "bg-aws-red"
                      : selectedDb.cpuLoad > 60
                      ? "bg-aws-yellow"
                      : "bg-aws-blue"
                  }`}
                  style={{ width: `${selectedDb.cpuLoad}%` }}
                />
              </div>

              {/* Slider */}
              <div className="mt-2.5 p-2 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded">
                <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                  <span className="text-aws-lightTextSecondary dark:text-aws-textSecondary uppercase">
                    {t("simulateLoadSpike", language)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono ${
                        selectedDb.cpuLoad > 85
                          ? "bg-aws-red/10 text-red-800 dark:text-red-400"
                          : "text-amber-800 dark:text-aws-orange"
                      }`}
                    >
                      {selectedDb.cpuLoad}%
                    </span>
                    <button
                      id="reset-cpu-load-btn"
                      onClick={() => handleResetCpuToBaseline(selectedDb.id)}
                      className="px-2 py-0.5 rounded bg-aws-lightContainer dark:bg-aws-container hover:bg-aws-orange/20 border border-aws-lightBorder dark:border-aws-border text-[9px] font-bold text-aws-lightTextPrimary dark:text-aws-textPrimary cursor-pointer transition-all flex items-center gap-1"
                      title={t("resetCpuTitle", language)}
                    >
                      🔄 {t("resetCpu", language)}
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  id="cpu-simulator-slider"
                  aria-label={t("simulateCpuLoadAria", language)}
                  min="0"
                  max="100"
                  value={selectedDb.cpuLoad}
                  onChange={(e) => handleCpuSliderChange(Number(e.target.value))}
                  className="w-full accent-aws-orange cursor-pointer h-1.5 bg-aws-lightBorder dark:bg-aws-border rounded-lg appearance-none"
                />
              </div>

              {/* Dynamic Resizable Sparkline Graph */}
              <div className="mt-3 p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded-lg flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary">
                  <span>{t("cpuHistorySparkline", language)}</span>
                  <span className="font-mono text-[9px] text-amber-950 dark:text-aws-orange font-bold">
                    {hoveredSparklineIndex !== null ? `${dataPoints[hoveredSparklineIndex]}% @ T-${(dataPoints.length - 1 - hoveredSparklineIndex) * 5}s` : `Live Peak: ${Math.max(...dataPoints)}%`}
                  </span>
                </div>
                <div ref={sparklineContainerRef} className="w-full h-16 relative overflow-hidden flex items-center justify-center">
                  <svg
                    width="100%"
                    height={svgHeight}
                    viewBox={`0 0 ${sparklineWidth} ${svgHeight}`}
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff9900" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ff9900" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Benchmark Grid Lines */}
                    <line x1="0" y1={svgHeight * 0.25} x2={sparklineWidth} y2={svgHeight * 0.25} stroke="currentColor" strokeDasharray="2 2" className="text-aws-lightBorder dark:text-aws-border opacity-60" />
                    <line x1="0" y1={svgHeight * 0.5} x2={sparklineWidth} y2={svgHeight * 0.5} stroke="currentColor" strokeDasharray="2 2" className="text-aws-lightBorder dark:text-aws-border opacity-60" />
                    <line x1="0" y1={svgHeight * 0.75} x2={sparklineWidth} y2={svgHeight * 0.75} stroke="currentColor" strokeDasharray="2 2" className="text-aws-lightBorder dark:text-aws-border opacity-60" />

                    {/* Dynamic Area Fill */}
                    <path
                      d={fillPathString}
                      fill="url(#sparkline-gradient)"
                      className="transition-all duration-300 ease-in-out"
                    />

                    {/* Dynamic Sparkline Path */}
                    <polyline
                      fill="none"
                      stroke="#ff9900"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsString}
                      className="transition-all duration-300 ease-in-out"
                    />

                    {/* Interactive Data Point Dots */}
                    {dataPoints.map((val, idx) => {
                      const cx = idx * stepX;
                      const cy = svgHeight - (val / 100) * (svgHeight - 12) - 6;
                      const isHovered = hoveredSparklineIndex === idx;
                      return (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 4.5 : 2.5}
                          className={`cursor-pointer transition-all duration-200 ${
                            isHovered
                              ? "fill-aws-orange stroke-aws-lightBg dark:stroke-slate-950 stroke-2"
                              : "fill-amber-400 opacity-70 hover:opacity-100"
                          }`}
                          onMouseEnter={() => setHoveredSparklineIndex(idx)}
                          onMouseLeave={() => setHoveredSparklineIndex(null)}
                        >
                          <title>{`${val}% CPU`}</title>
                        </circle>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Calculated Interval Info */}
            <div className="text-[11px] p-2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border">
              <div className="flex justify-between items-center font-bold">
                <span>{t("calculatedInterval", language)}</span>
                <span className="font-mono text-amber-950 dark:text-aws-orange">{(calculatedIntervalMs / 1000).toFixed(0)}s</span>
              </div>
            </div>

            {/* Outbox & Circuit Breaker Status */}
            <div className="border-t border-aws-lightBorder dark:border-aws-border pt-3 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold">{t("connectionState", language)}</span>
                <span className={`font-mono font-bold ${isOnline ? "text-emerald-800 dark:text-emerald-400" : "text-rose-800 dark:text-rose-400"}`}>
                  {isOnline ? "🟢 " + t("online", language) : "🔴 " + t("offline", language)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">{t("circuitBreakerLabel", language)}</span>
                <span className={`font-mono font-bold ${circuitBreakerState === "OPEN" ? "text-rose-800 dark:text-rose-400" : "text-amber-900 dark:text-amber-400"}`}>
                  {circuitBreakerState}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">{t("outboxCount", language)}</span>
                <span className="font-mono font-bold">{outboxCount}</span>
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  id="simulate-online-btn"
                  onClick={() => {
                    setIsOnline(true);
                    setCircuitBreakerState("CLOSED");
                    setOutboxCount(0);
                  }}
                  className="flex-1 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold cursor-pointer transition-all"
                >
                  {t("online", language)}
                </button>
                <button
                  id="simulate-offline-btn"
                  onClick={() => setIsOnline(false)}
                  className="flex-1 py-1 rounded bg-rose-800 hover:bg-rose-900 text-white text-[10px] font-bold cursor-pointer transition-all"
                >
                  {t("disconnect", language)}
                </button>
                <button
                  id="chaos-circuit-breaker-toggle"
                  onClick={() => setCircuitBreakerState(circuitBreakerState === "OPEN" ? "CLOSED" : "OPEN")}
                  className="flex-1 py-1 rounded bg-amber-800 hover:bg-amber-900 text-white text-[10px] font-bold cursor-pointer transition-all"
                >
                  {t("chaosToggle", language)}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
