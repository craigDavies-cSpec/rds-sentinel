"use client";

import React from "react";
import { t, LanguageCode } from "@/lib/localization";

interface GraphQLInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  graphQLQuery: string;
  setGraphQLQuery: (query: string) => void;
  graphQLResult: string;
  setGraphQLResult: (result: string) => void;
  queryGraphQLTelemetry: (query: string) => any;
  language: LanguageCode;
}

export function GraphQLInspectorModal({
  isOpen,
  onClose,
  graphQLQuery,
  setGraphQLQuery,
  graphQLResult,
  setGraphQLResult,
  queryGraphQLTelemetry,
  language,
}: GraphQLInspectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-lightBorder dark:border-aws-border rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-aws-lightBorder dark:border-aws-border flex justify-between items-center bg-aws-lightBg dark:bg-aws-dark">
          <div className="flex items-center gap-2">
            <span className="text-purple-500 font-extrabold text-lg">⚡</span>
            <h3 className="font-bold text-sm text-aws-lightTextPrimary dark:text-aws-textPrimary uppercase tracking-wider">
              {t("graphqlModalTitle", language)}
            </h3>
          </div>
          <button
            id="close-graphql-modal-btn"
            onClick={onClose}
            className="text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Query Editor */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-aws-lightTextSecondary dark:text-aws-textSecondary">
              {t("graphqlQueryEditor", language)}
            </label>
            <textarea
              value={graphQLQuery}
              onChange={(e) => setGraphQLQuery(e.target.value)}
              rows={12}
              className="w-full p-3 font-mono text-xs bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded-lg text-aws-lightTextPrimary dark:text-aws-textPrimary focus:outline-none focus:border-aws-orange"
            />
            <button
              id="execute-graphql-query-btn"
              onClick={() => {
                const res = queryGraphQLTelemetry(graphQLQuery);
                setGraphQLResult(JSON.stringify(res, null, 2));
              }}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer transition-all active:scale-98"
            >
              {t("executeQueryBtn", language)}
            </button>
          </div>

          {/* Right: Query Result */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-aws-lightTextSecondary dark:text-aws-textSecondary">
              {t("jsonResultTitle", language)}
            </label>
            <pre className="w-full p-3 font-mono text-[11px] bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border rounded-lg text-emerald-600 dark:text-emerald-400 overflow-auto h-[290px]">
              {graphQLResult || "// Execution result will appear here..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
