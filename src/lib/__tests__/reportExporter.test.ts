import { buildCSVContent } from "../reportExporter";
import { MOCK_INSTANCES, MOCK_RECOMMENDATIONS, MOCK_SLOW_QUERIES } from "../mockTelemetry";

describe("Report Exporter Utility Unit Tests", () => {
  test("should format database instances, recommendations, and slow queries into structured CSV", () => {
    const csv = buildCSVContent(MOCK_INSTANCES, MOCK_RECOMMENDATIONS, MOCK_SLOW_QUERIES);

    expect(csv).toContain("=== RDS SENTINEL PERFORMANCE & COST AUDIT REPORT ===");
    expect(csv).toContain("--- MONITORED DATABASE INSTANCES ---");
    expect(csv).toContain('"sales-db-prod"');
    expect(csv).toContain('"billing-db-mysql"');
    expect(csv).toContain("--- COST OPTIMIZATION RECOMMENDATIONS ---");
    expect(csv).toContain('"Downsize Over-provisioned DB Instance"');
    expect(csv).toContain("--- SLOW QUERY ANALYTICS ---");
    expect(csv).toContain("SELECT * FROM users");
  });
});
