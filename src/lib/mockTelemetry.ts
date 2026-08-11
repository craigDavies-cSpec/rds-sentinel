import { maskSQLQuery } from "./logSanitizer";

export interface DBInstance {
  id: string;
  name: string;
  engine: "Aurora PostgreSQL" | "Aurora MySQL" | "RDS MySQL" | "RDS PostgreSQL";
  class: string;
  region: string;
  status: "available" | "backing-up" | "modifying" | "rebooting";
  cpuLoad: number;
  connections: number;
  iops: number;
  storageGb: number;
  freeStorageGb: number;
}

export interface CostRecommendation {
  id: string;
  dbInstanceId: string;
  type: "downsize" | "upsize" | "serverless" | "replica";
  title: string;
  impact: string;
  costDelta: number; // Negative = savings, positive = investment
  reason: string;
}

export interface SlowQuery {
  id: string;
  dbInstanceId: string;
  timestamp: string;
  durationMs: number;
  rawSql: string;
  maskedSql: string;
  waitEvent: string;
}

export interface DatabaseLog {
  id: string;
  dbInstanceId: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  maskedMessage: string;
}

// 1. Database Instances seed data
export const MOCK_INSTANCES: DBInstance[] = [
  {
    id: "db-prod-aurora",
    name: "sales-db-prod",
    engine: "Aurora PostgreSQL",
    class: "db.r6g.2xlarge",
    region: "us-east-1 (N. Virginia)",
    status: "available",
    cpuLoad: 72,
    connections: 142,
    iops: 4800,
    storageGb: 500,
    freeStorageGb: 142,
  },
  {
    id: "db-billing-rds",
    name: "billing-db-mysql",
    engine: "RDS MySQL",
    class: "db.m5.2xlarge",
    region: "us-east-1 (N. Virginia)",
    status: "available",
    cpuLoad: 28,
    connections: 45,
    iops: 1200,
    storageGb: 200,
    freeStorageGb: 110,
  },
  {
    id: "db-dev-sandbox",
    name: "dev-sandbox-db",
    engine: "RDS MySQL",
    class: "db.t3.medium",
    region: "us-east-1 (N. Virginia)",
    status: "available",
    cpuLoad: 12,
    connections: 3,
    iops: 250,
    storageGb: 50,
    freeStorageGb: 48,
  },
  {
    id: "db-analytics-aurora",
    name: "analytics-warehouse-replica",
    engine: "Aurora MySQL",
    class: "db.r6g.xlarge",
    region: "us-west-2 (Oregon)",
    status: "available",
    cpuLoad: 45,
    connections: 18,
    iops: 1800,
    storageGb: 800,
    freeStorageGb: 420,
  }
];

// 2. Cost Recommendations seed data
export const MOCK_RECOMMENDATIONS: CostRecommendation[] = [
  {
    id: "rec-1",
    dbInstanceId: "db-billing-rds",
    type: "downsize",
    title: "Downsize Over-provisioned DB Instance",
    impact: "Highly Recommended",
    costDelta: -168.00, // Saves $168/mo
    reason: "billing-db-mysql runs on db.m5.2xlarge. Historical CPU load has remained below 30% for 30 consecutive days. Downsizing to a db.m6g.xlarge reduces cost by 40% with identical memory and compute performance due to Graviton3 architecture efficiencies.",
  },
  {
    id: "rec-2",
    dbInstanceId: "db-dev-sandbox",
    type: "serverless",
    title: "Migrate Dev Sandbox to Aurora Serverless v2",
    impact: "Medium Impact",
    costDelta: -38.50, // Saves $38.50/mo
    reason: "dev-sandbox-db is active primarily during business hours (9 AM - 6 PM) and sits idle overnight. Converting to Aurora Serverless v2 with an auto-scaling range of 0.5 - 2 ACUs allows the instance to scale to zero at night while preventing CPU starvation during morning git merges.",
  },
  {
    id: "rec-3",
    dbInstanceId: "db-prod-aurora",
    type: "replica",
    title: "Add Aurora Read Replica in us-west-2 (Oregon)",
    impact: "Performance Booster",
    costDelta: 184.20, // Costs +$184.20/mo
    reason: "Application logs show API queries originating from West Coast clients face latency averages of 148ms. Deploying a regional read-replica reduces West Coast read latency to 15ms. Estimated cross-region data transfer out cost: $14.50/mo.",
  },
  {
    id: "rec-4",
    dbInstanceId: "db-prod-aurora",
    type: "upsize",
    title: "Enable Multi-AZ Standby Deployment",
    impact: "Reliability Focus",
    costDelta: 240.00, // Costs +$240/mo
    reason: "sales-db-prod is a single-node setup containing production data. Enabling Multi-AZ Standby provides automatic failover, SLA backup, and zero downtime for maintenance windows.",
  }
];

// 3. Raw Slow Queries
const RAW_SLOW_QUERIES_DATA = [
  {
    dbInstanceId: "db-prod-aurora",
    durationMs: 3420,
    rawSql: "SELECT * FROM users WHERE email = 'craig.davies@example.com' AND password_hash = '$2b$12$LhO2n19.c3k54yG.g41mReK7z2u'",
    waitEvent: "io:BufFileWrite",
  },
  {
    dbInstanceId: "db-billing-rds",
    durationMs: 5120,
    rawSql: "INSERT INTO credit_cards (user_id, card_number, cvc, billing_zip) VALUES (88412, '1111-2222-3333-4444', '312', '90210')",
    waitEvent: "lock:TransactionLock",
  },
  {
    dbInstanceId: "db-prod-aurora",
    durationMs: 2890,
    rawSql: "SELECT order_id, card_token FROM orders JOIN payments ON orders.id = payments.order_id WHERE card_token = 'tok_secure_99f2a481' LIMIT 50",
    waitEvent: "cpu:ExecuteQuery",
  },
  {
    dbInstanceId: "db-dev-sandbox",
    durationMs: 1450,
    rawSql: "SELECT * FROM test_accounts WHERE dev_flag = 1 AND access_key = 'AKIAIOSFODNN7EXAMPLE'",
    waitEvent: "io:TableScan",
  }
];

export const MOCK_SLOW_QUERIES: SlowQuery[] = RAW_SLOW_QUERIES_DATA.map((q, idx) => ({
  id: `q-${idx}`,
  dbInstanceId: q.dbInstanceId,
  timestamp: new Date(Date.now() - idx * 20 * 60 * 1000).toISOString(),
  durationMs: q.durationMs,
  rawSql: q.rawSql,
  maskedSql: maskSQLQuery(q.rawSql),
  waitEvent: q.waitEvent,
}));

// 4. Database Logs
const RAW_LOGS_DATA = [
  {
    dbInstanceId: "db-billing-rds",
    level: "ERROR" as const,
    message: "2026-08-11 10:15:32 [ERROR] Too many connections open. Max connections limit (150) reached for database connection client 'billing-service-user' at 192.168.1.42",
  },
  {
    dbInstanceId: "db-prod-aurora",
    level: "WARNING" as const,
    message: "2026-08-11 10:20:12 [WARNING] Long-running transaction detected. PostgreSQL backend PID 2381 holding lock on table 'orders' for 180 seconds. Client email: admin@cspec.uk",
  },
  {
    dbInstanceId: "db-prod-aurora",
    level: "ERROR" as const,
    message: "2026-08-11 10:22:45 [ERROR] Deadlock detected. Process 14822 waiting for ShareLock on transaction 8812; blocked by process 14890. SQL: UPDATE balances SET amount = 145.00 WHERE user_id = 99812",
  },
  {
    dbInstanceId: "db-dev-sandbox",
    level: "INFO" as const,
    message: "2026-08-11 10:24:00 [INFO] Vacuum process cleaned 184 dead tuples in database 'dev_sandbox'",
  }
];

export const MOCK_LOGS: DatabaseLog[] = RAW_LOGS_DATA.map((l, idx) => ({
  id: `log-${idx}`,
  dbInstanceId: l.dbInstanceId,
  timestamp: new Date(Date.now() - idx * 15 * 60 * 1000).toISOString(),
  level: l.level,
  message: l.message,
  maskedMessage: l.message.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]")
    .replace(/(?<=user_id\s*=\s*)\d+/i, "?")
    .replace(/(?<=balances\s*SET\s*amount\s*=\s*)\d+\.\d+/i, "?")
}));
