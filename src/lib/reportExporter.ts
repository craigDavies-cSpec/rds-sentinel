import { DBInstance, CostRecommendation, SlowQuery } from "./mockTelemetry";

/**
 * Builds structured CSV report string containing database telemetry,
 * cost optimization recommendations, and slow query logs.
 */
export function buildCSVContent(
  instances: DBInstance[],
  recommendations: CostRecommendation[],
  slowQueries: SlowQuery[]
): string {
  const lines: string[] = [];

  // Header & Title
  lines.push("=== RDS SENTINEL PERFORMANCE & COST AUDIT REPORT ===");
  lines.push(`Generated At,${new Date().toISOString()}`);
  lines.push("");

  // Section 1: Monitored Databases
  lines.push("--- MONITORED DATABASE INSTANCES ---");
  lines.push("ID,Name,Engine,Class,Region,Status,CPU Load (%),Connections,Storage (GB)");
  instances.forEach((db) => {
    lines.push(
      `"${db.id}","${db.name}","${db.engine}","${db.class}","${db.region}","${db.status}",${db.cpuLoad},${db.connections},${db.freeStorageGb}`
    );
  });
  lines.push("");

  // Section 2: Cost Recommendations
  lines.push("--- COST OPTIMIZATION RECOMMENDATIONS ---");
  lines.push("ID,Type,Title,Reason,Monthly Delta ($)");
  recommendations.forEach((rec) => {
    const cleanReason = rec.reason.replace(/"/g, '""');
    lines.push(`"${rec.id}","${rec.type}","${rec.title}","${cleanReason}",${rec.costDelta}`);
  });
  lines.push("");

  // Section 3: Slow Query Metrics
  lines.push("--- SLOW QUERY ANALYTICS ---");
  lines.push("ID,Timestamp,Duration (ms),Wait Event,Query SQL");
  slowQueries.forEach((q) => {
    const cleanSql = (q.rawSql || "").replace(/"/g, '""');
    lines.push(`"${q.id}","${q.timestamp}",${q.durationMs},"${q.waitEvent}","${cleanSql}"`);
  });

  return lines.join("\n");
}

/**
 * Triggers client-side browser file download of CSV performance report.
 */
export function exportCSVReport(
  instances: DBInstance[],
  recommendations: CostRecommendation[],
  slowQueries: SlowQuery[]
): void {
  const csvText = buildCSVContent(instances, recommendations, slowQueries);
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `rds-sentinel-audit-report-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
