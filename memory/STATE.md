# rds-sentinel Current Workspace State

_Last Updated: 2026-08-17_

---

## Subscription Tier & Feature Matrix
- **Active Tier**: `Medium Business` (Supports cost recommendations, real-time log scanning, index suggestions, RDS Proxy advisor, multi-region replication modeler, exportable CSV audit reports, and interactive CPU load simulation. Webhook dispatch simulator unlocks on Enterprise tier).

---

## Active Monitored Databases (5)
1. **free-tier-sandbox-db** (cSpec Live AWS Account `616399034957` - `eu-west-1 Ireland`)
   - Engine: RDS PostgreSQL (`db.t4g.micro`) — **100% AWS Free Tier ($0.00/mo)**
   - Region: `eu-west-1` (Ireland)
   - Status: `available`
   - Active Telemetry: CPU ~18%, Connections: 4
2. **sales-db-prod**
   - Engine: Aurora PostgreSQL (`db.r6g.2xlarge`)
   - Region: `us-east-1` (N. Virginia)
   - Status: `available`
   - Active Telemetry: CPU ~70%, Connections: 142
3. **billing-db-mysql**
   - Engine: RDS MySQL (`db.m5.2xlarge`)
   - Region: `us-east-1` (N. Virginia)
   - Status: `available`
   - Active Telemetry: CPU ~28%, Connections: 45
4. **dev-sandbox-db**
   - Engine: RDS MySQL (`db.t3.medium`)
   - Region: `us-east-1` (N. Virginia)
   - Status: `available`
   - Active Telemetry: CPU ~12%, Connections: 3
5. **analytics-warehouse-replica**
   - Engine: Aurora MySQL (`db.r6g.xlarge`)
   - Region: `us-west-2` (Oregon)
   - Status: `available`
   - Active Telemetry: CPU ~45%, Connections: 18

---

## Telemetry, Security & Infrastructure Sandbox Status
- **Target Endpoint Connection**: `Online`
- **Circuit Breaker state**: `CLOSED`
- **Outbox Queue count**: `0` (Ingested successfully)
- **Enterprise Security Vault & Zero-Knowledge Encryption**: `Active` (Web Crypto AES-256-GCM authenticated data encryption, OWASP 28-char CSPRNG password generator with >120 bits entropy rating, deep parameter masking, and STS ExternalId confused deputy protection).
- **Sanitizer Parameter Masking**: `Active` (All sensitive SQL query parameters, AWS keys `AKIA...`, JWT tokens, Luhn credit cards, and emails redacted at edge).
- **Global Toolbar Language Selector**: `Active` (Instant flag-based language switching 🇺🇸 🇩🇪 🇫🇷 🇯🇵 directly on top header toolbar).
- **Centralized AWS Pricing & Live Sync Engine**: `Active` (`awsPricingEngine.ts` polling AWS Price List API with $0.00/mo Free Tier math for `db.t4g.micro`).
- **UK Business Incorporation & Legal Suite**: `Active` (cSpec Solutions Ltd setup guides, UK Companies House LTD filings, HMRC tax & PAYE compliance, ICO registration, and UK GDPR/EULA contract generators in `src/lib/ukLegalContracts.ts`).
- **AWS Marketplace Monetization & Free Tier Ingestion**: `Active` (AWS Free Tier $0 live telemetry ingestion guide in `docs/AWS_FREE_TIER_INGESTION_GUIDE.md` and AWS Marketplace seller onboarding in `docs/AWS_MARKETPLACE_ONBOARDING.md`).
- **Automated Test Coverage**: **137/137 Tests Passing** (98 Jest unit + 39 Playwright E2E + 1 Layout E2E + 1 LocalStack E2E).

---

## Active Cost Recommendations
- **free-tier-sandbox-db** (`616399034957`): **$0.00/mo (AWS 750h/mo Free Tier Active)**.
- **billing-db-mysql**: Downsize `db.m5.2xlarge` to `db.m6g.xlarge` (Saves **$168.00/mo**).
- **dev-sandbox-db**: Convert to Aurora Serverless v2 auto-scaling (Saves **$38.50/mo**).
