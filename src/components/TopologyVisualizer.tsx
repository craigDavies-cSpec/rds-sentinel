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
    <div id="topology-visualizer-card" className="p-3.5 bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded text-xs">
      <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-aws-lightBorder dark:border-aws-divider">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-aws-orange/10 text-amber-800 dark:text-aws-orange border border-aws-orange/20">
            {t("clusterTopologyTitle", language)}
          </span>
          <strong className="text-aws-lightTextPrimary dark:text-aws-textPrimary text-xs font-mono">
            {topologyData.clusterName}
          </strong>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/20">
          ⚡ {topologyData.failoverReadinessPct}% {t("failoverReady", language)}
        </span>
      </div>

      <p className="text-[11px] text-aws-lightTextSecondary dark:text-aws-textSecondary mb-3">
        {t("clusterTopologyDesc", language)}
      </p>

      {/* Visual Node Graph */}
      <div className="relative p-3 bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-lg flex flex-col gap-3">
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
                      ? "WRITER"
                      : node.role === "cross-region-replica"
                      ? "CROSS-REGION REPLICA"
                      : "REPLICA"}
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
                🔍 Node Inspector: {selectedTopologyNode.name}
              </span>
              <button
                onClick={() => setSelectedTopologyNode(null)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-aws-lightContainer dark:bg-aws-container hover:bg-aws-orange/20 text-aws-lightTextSecondary dark:text-aws-textSecondary cursor-pointer"
              >
                {t("closeBtn", language)}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Engine:</span> <strong>{selectedTopologyNode.engine}</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">{t("instanceClass", language)}:</span> <strong>{selectedTopologyNode.instanceClass}</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Region:</span> <strong>{selectedTopologyNode.region}</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Failover Priority:</span> <strong>Tier-{selectedTopologyNode.failoverPriority}</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">Replication Lag:</span> <strong className="text-emerald-800 dark:text-emerald-400">{selectedTopologyNode.replicationLagMs}ms</strong></div>
              <div><span className="text-aws-lightTextSecondary dark:text-aws-textSecondary">IOPS Throughput:</span> <strong>{selectedTopologyNode.iops} IOPS</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
