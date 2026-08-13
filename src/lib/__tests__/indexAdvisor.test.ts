import { analyzeSlowQuery } from "../indexAdvisor";
import { MOCK_SLOW_QUERIES } from "../mockTelemetry";

describe("Index Advisor Utility Unit Tests", () => {
  test("should analyze slow query and generate tailored CREATE INDEX DDL", () => {
    const recommendation = analyzeSlowQuery(MOCK_SLOW_QUERIES[0]); // users table query

    expect(recommendation.targetTable).toBe("users");
    expect(recommendation.suggestedDdl).toContain("CREATE INDEX idx_users_email_hash ON users");
    expect(recommendation.estimatedSpeedupPct).toBeGreaterThan(90);
    expect(recommendation.optimizedDurationMs).toBeLessThan(recommendation.originalDurationMs);
    expect(recommendation.tableScanRows).toBeGreaterThan(0);
    expect(recommendation.explanation).toContain("Sequential table scan");
  });

  test("should analyze lock contention query and generate single-column index DDL", () => {
    const recommendation = analyzeSlowQuery(MOCK_SLOW_QUERIES[1]); // credit_cards query

    expect(recommendation.targetTable).toBe("credit_cards");
    expect(recommendation.suggestedDdl).toBe("CREATE INDEX idx_credit_cards_user_id ON credit_cards (user_id);");
    expect(recommendation.explanation).toContain("Lock contention");
  });
});
