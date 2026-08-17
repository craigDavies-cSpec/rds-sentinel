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
- **UK Business Incorporation & Legal Suite**: `Active` (cSpec Solutions Ltd setup guides, UK Companies House LTD filings, HMRC tax & PAYE compliance, ICO registration, and UK GDPR/EULA contract generators in `src/lib/ukLegalContracts.ts`).
- **AWS Marketplace Monetization & Free Tier Ingestion**: `Active` (AWS Free Tier $0 live telemetry ingestion guide in `docs/AWS_FREE_TIER_INGESTION_GUIDE.md` and AWS Marketplace seller onboarding in `docs/AWS_MARKETPLACE_ONBOARDING.md`).
- **Automated Test Coverage**: **107/107 Tests Passing** (69 Jest unit + 36 Playwright E2E + 1 Layout E2E + 1 LocalStack E2E).

---

## Active Cost Recommendations (Savings: $206.50/mo)
- **billing-db-mysql**: Downsize `db.m5.2xlarge` to `db.m6g.xlarge` (Saves **$168.00/mo**).
- **dev-sandbox-db**: Convert to Aurora Serverless v2 auto-scaling (Saves **$38.50/mo**).
