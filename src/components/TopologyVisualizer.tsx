"use client";

import React from "react";
import { ClusterTopologyData, ClusterNode } from "@/lib/clusterTopology";
import { t, LanguageCode } from "@/lib/localization";

interface TopologyVisualizerProps {
  topologyData: ClusterTopologyData;
  selectedTopologyNode: ClusterNode | null;
  setSelectedTopologyNode: (node: ClusterNode | null) => void;
  language: LanguageCode;
}

export function TopologyVisualizer({
  topologyData,
  selectedTopologyNode,
  setSelectedTopologyNode,
  language,
}: TopologyVisualizerProps) {
  return (
    <div id="topology-visualizer-card" className="bg-aws-lightContainer/90 dark:bg-aws-container/90 backdrop-blur-md border border-aws-lightBorder/80 dark:border-aws-border/80 rounded-xl shadow-lg hover:shadow-xl p-5 flex flex-col gap-4 transition-all duration-300">
      <div className="flex justify-between items-center pb-3 border-b border-aws-lightBorder dark:border-aws-border">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black text-aws-lightTextPrimary dark:text-aws-orange uppercase tracking-wider flex items-center gap-2">
            {t("clusterTopologyTitle", language)}
          </h2>
          <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-mono px-2 py-0.5 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border">
            {topologyData.clusterName}
          </strong>
        </div>
        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/30 shadow-sm">
          ⚡ {topologyData.failoverReadinessPct}% {t("failoverReady", language)}
        </span>
      </div>

      <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed">
        {t("clusterTopologyDesc", language)}
      </p>

      {/* Visual Node Graph */}
      <div className="relative p-4 bg-aws-lightBg/80 dark:bg-aws-dark/80 border border-aws-lightBorder dark:border-aws-border rounded-xl flex flex-col gap-3">
        <div className="flex flex-wrap justify-around items-center gap-3">
          {topologyData.nodes.map((node) => {
            const isWriter = node.role === "writer";
            const isCrossRegion = node.role === "cross-region-replica";
            const isSelected = selectedTopologyNode?.id === node.id;

            return (
              <button
                key={node.id}
                onClick={() => setSelectedTopologyNode(isSelected ? null : node)}
                className={`p-2.5 rounded-lg border transition-all flex flex-col items-center gap-1.5 min-w-[140px] text-left cursor-pointer ${
                  isSelected
                    ? "bg-aws-orange/15 border-aws-orange shadow-md scale-105"
                    : isWriter
                    ? "bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/20"
                    : isCrossRegion
                    ? "bg-teal-500/10 border-teal-500/40 hover:bg-teal-500/20"
                    : "bg-aws-lightBg dark:bg-aws-dark border-aws-lightBorder dark:border-aws-border hover:border-aws-orange/40"
                }`}
              >
                <div className="flex items-center gap-1.5 w-full justify-between">
                  <span className={`w-2 h-2 rounded-full ${isWriter ? "bg-aws-green animate-pulse" : "bg-aws-blue"}`} />
                  <span className="text-[9px] uppercase font-bold font-mono px-1 py-0.2 rounded bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-divider text-aws-lightTextSecondary dark:text-aws-textSecondary">
                    {node.role === "writer"
                      ? t("writerRole", language)
                      : node.role === "cross-region-replica"
                      ? t("crossRegionReplicaRole", language)
                      : t("replicaRole", language)}
                  </span>
                </div>

                <span className="font-mono font-bold text-[11px] text-aws-lightTextPrimary dark:text-aws-textPrimary truncate max-w-[130px]">
                  {node.name.split(" ")[0]}
                </span>

                <div className="flex justify-between w-full text-[9px] font-mono text-aws-lightTextSecondary dark:text-aws-textSecondary pt-1 border-t border-aws-lightBorder dark:border-aws-divider">
                  <span>{node.region.split(" ")[0]}</span>
                  <span className={node.replicationLagMs > 20 ? "text-amber-800 dark:text-aws-yellow font-bold" : "text-emerald-800 dark:text-emerald-400 font-bold"}>
                    {node.replicationLagMs === 0 ? "0ms lag" : `${node.replicationLagMs}ms lag`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Topology Node Detail Panel */}
        {selectedTopologyNode && (
          <div className="mt-2 p-2.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-orange/40 rounded text-xs font-mono leading-relaxed animate-fade-in">
            <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-aws-lightBorder dark:border-aws-divider">
              <span className="font-bold text-amber-800 dark:text-aws-orange text-[11px] uppercase">
                {t("nodeInspectorTitle", language)} {selectedTopologyNode.name}
              </span>
              <button
                onClick={() => setSelectedTopologyNode(null)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-aws-lightContainer dark:bg-aws-container hover:bg-aws-orange/20 text-aws-lightTextSecondary dark:text-aws-textSecondary cursor-pointer"
              >
                {t("closeBtn", language)}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("engineLabel", language)}</span> <strong>{selectedTopologyNode.engine}</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("instanceClass", language)}:</span> <strong>{selectedTopologyNode.instanceClass}</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("regionLabel", language)}</span> <strong>{selectedTopologyNode.region}</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("failoverPriorityLabel", language)}</span> <strong>Tier-{selectedTopologyNode.failoverPriority}</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("replicationLagLabel", language)}</span> <strong className="text-emerald-800 dark:text-emerald-400">{selectedTopologyNode.replicationLagMs}ms</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("iopsThroughputLabel", language)}</span> <strong>{selectedTopologyNode.iops} IOPS</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
