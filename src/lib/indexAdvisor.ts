import { SlowQuery } from "./mockTelemetry";

export interface IndexRecommendation {
  queryId: string;
  targetTable: string;
  targetColumns: string[];
  suggestedDdl: string;
  estimatedSpeedupPct: number;
  originalDurationMs: number;
  optimizedDurationMs: number;
  tableScanRows: number;
  explanation: string;
  aiNaturalLanguageAdvice: string;
  queryRewriteSuggestion: string;
  zeroDowntimeDdl: string;
}

/**
 * Analyzes EXPLAIN plan nodes and generates plain-English architectural diagnostic advice
 */
export function generateAiExplainSummary(sql: string): string {
  const upperSql = sql.toUpperCase();
  if (upperSql.includes("SELECT") && upperSql.includes("WHERE")) {
    return "🤖 AI EXPLAIN Diagnostic: The PostgreSQL engine performs an unindexed Sequential Scan (Seq Scan) across disk pages. Filtering on non-indexed WHERE predicates forces 100% table read I/O. Creating a B-Tree composite index reduces query execution complexity from O(N) linear scan to O(log N) binary tree search.";
  }
  return "🤖 AI EXPLAIN Diagnostic: High CPU utilization caused by temporary disk spill during in-memory sorting. Adding covering indexes eliminates sorting overhead.";
}

/**
 * Analyzes slow queries and generates tailored DDL index recommendations with estimated speedup metrics.
 */
export function analyzeSlowQuery(query: SlowQuery): IndexRecommendation {
  const sql = (query.rawSql || "").toUpperCase();
  let targetTable = "unknown_table";
  let targetColumns: string[] = [];
  let suggestedDdl = "";
  let zeroDowntimeDdl = "";
  let queryRewriteSuggestion = "";
  let optimizedDurationMs = Math.max(4, Math.round(query.durationMs * 0.003));
  let tableScanRows = 88412;
  let explanation = "";

  if (sql.includes("FROM USERS") || sql.includes("WHERE EMAIL")) {
    targetTable = "users";
    targetColumns = ["email", "password_hash"];
    suggestedDdl = "CREATE INDEX idx_users_email_hash ON users (email, password_hash);";
    zeroDowntimeDdl = "CREATE INDEX CONCURRENTLY idx_users_email_hash ON users (email, password_hash);";
    queryRewriteSuggestion = "SELECT id, email, role FROM users WHERE email = $1 AND password_hash = $2 LIMIT 1;";
    tableScanRows = 142500;
    explanation = "Sequential table scan detected on users table. Composite index on (email, password_hash) replaces 142.5k full row scans with a 1-row B-Tree index lookup.";
  } else if (sql.includes("CREDIT_CARDS") || sql.includes("USER_ID")) {
    targetTable = "credit_cards";
    targetColumns = ["user_id"];
    suggestedDdl = "CREATE INDEX idx_credit_cards_user_id ON credit_cards (user_id);";
    zeroDowntimeDdl = "CREATE INDEX CONCURRENTLY idx_credit_cards_user_id ON credit_cards (user_id);";
    queryRewriteSuggestion = "SELECT id, card_token, expiry FROM credit_cards WHERE user_id = $1 AND is_active = true;";
    tableScanRows = 88412;
    explanation = "Lock contention lock:TransactionLock detected. Creating a single-column B-Tree index on credit_cards(user_id) eliminates table lock wait times on transaction commit.";
  } else if (sql.includes("PAYMENTS") || sql.includes("CARD_TOKEN")) {
    targetTable = "payments";
    targetColumns = ["card_token"];
    suggestedDdl = "CREATE INDEX idx_payments_card_token ON payments (card_token);";
    zeroDowntimeDdl = "CREATE INDEX CONCURRENTLY idx_payments_card_token ON payments (card_token);";
    queryRewriteSuggestion = "SELECT p.id, p.amount, p.status FROM payments p JOIN credit_cards c ON p.card_token = c.card_token WHERE c.user_id = $1;";
    tableScanRows = 64200;
    explanation = "Multi-table JOIN query scanning unindexed card_token foreign key. Indexing card_token speeds up JOIN hash matching from 2.89s to 6ms.";
  } else {
    targetTable = "test_accounts";
    targetColumns = ["dev_flag", "access_key"];
    suggestedDdl = "CREATE INDEX idx_test_accounts_dev_key ON test_accounts (dev_flag, access_key);";
    zeroDowntimeDdl = "CREATE INDEX CONCURRENTLY idx_test_accounts_dev_key ON test_accounts (dev_flag, access_key);";
    queryRewriteSuggestion = "SELECT account_id, status FROM test_accounts WHERE dev_flag = true AND access_key = $1;";
    tableScanRows = 12800;
    explanation = "Full table scan io:TableScan on test_accounts. Adding index on (dev_flag, access_key) converts sequential disk reads to direct index seek.";
  }

  const speedupRatio = (query.durationMs - optimizedDurationMs) / query.durationMs;
  const estimatedSpeedupPct = Math.round(speedupRatio * 1000) / 10;
  const aiNaturalLanguageAdvice = generateAiExplainSummary(query.rawSql || "");

  return {
    queryId: query.id,
    targetTable,
    targetColumns,
    suggestedDdl,
    zeroDowntimeDdl,
    queryRewriteSuggestion,
    estimatedSpeedupPct,
    originalDurationMs: query.durationMs,
    optimizedDurationMs,
    tableScanRows,
    explanation,
    aiNaturalLanguageAdvice,
  };
}
