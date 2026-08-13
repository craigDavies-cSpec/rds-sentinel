# rds-sentinel Current Workspace State

_Last Updated: 2026-08-13_

---

## Subscription Tier & Feature Matrix
- **Active Tier**: `Medium Business` (Supports cost recommendations, real-time log scanning, index suggestions, RDS Proxy advisor, multi-region replication modeler, exportable CSV audit reports, and interactive CPU load simulation. Webhook dispatch simulator unlocks on Enterprise tier).

---

## Active Monitored Databases (4)
1. **sales-db-prod**
   - Engine: Aurora PostgreSQL (`db.r6g.2xlarge`)
   - Region: `us-east-1` (N. Virginia)
   - Status: `available`
   - Active Telemetry: CPU ~70%, Connections: 142
2. **billing-db-mysql**
   - Engine: RDS MySQL (`db.m5.2xlarge`)
   - Region: `us-east-1` (N. Virginia)
   - Status: `available`
   - Active Telemetry: CPU ~28%, Connections: 45
3. **dev-sandbox-db**
   - Engine: RDS MySQL (`db.t3.medium`)
   - Region: `us-east-1` (N. Virginia)
   - Status: `available`
   - Active Telemetry: CPU ~12%, Connections: 3
4. **analytics-warehouse-replica**
   - Engine: Aurora MySQL (`db.r6g.xlarge`)
   - Region: `us-west-2` (Oregon)
   - Status: `available`
   - Active Telemetry: CPU ~45%, Connections: 18

---

## Telemetry & Infrastructure Sandbox Status
- **Target Endpoint Connection**: `Online`
- **Circuit Breaker state**: `CLOSED`
- **Outbox Queue count**: `0` (Ingested successfully)
- **Sanitizer Parameter Masking**: `Active` (All sensitive SQL query parameters and emails redacted at edge).
- **Multi-Region Replication Engine**: `Active` (Cross-region replication latency lag matrix, inter-region transfer bandwidth cost modeling, and Aurora Global Database zero-data-loss failover simulation).
- **Automated Test Coverage**: **98/98 Tests Passing** (68 Jest unit + 31 Playwright E2E + 1 Layout E2E + 1 LocalStack E2E).

---

## Active Cost Recommendations (Savings: $206.50/mo)
- **billing-db-mysql**: Downsize `db.m5.2xlarge` to `db.m6g.xlarge` (Saves **$168.00/mo**).
- **dev-sandbox-db**: Convert to Aurora Serverless v2 auto-scaling (Saves **$38.50/mo**).
