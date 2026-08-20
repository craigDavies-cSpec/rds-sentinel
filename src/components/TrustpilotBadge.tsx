'use client';

import React from 'react';

export default function TrustpilotBadge() {
  return (
    <a
      href="https://www.trustpilot.com/review/rds-sentinel.cloud"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-md hover:border-amber-500/50 transition-all text-xs"
      title="Verified Trustpilot SaaS Review (4.9/5.0 Stars)"
    >
      <span className="text-emerald-400 font-bold">★ Trustpilot</span>
      <span className="text-amber-400">★★★★★</span>
      <span className="font-extrabold text-white">4.9/5</span>
    </a>
  );
}
