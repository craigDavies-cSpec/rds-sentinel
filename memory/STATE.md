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
- **AWS Organizations Auto-Discovery Engine**: `Active` (Scans child AWS account OUs via `sts:AssumeRole`, enforces Service Control Policies `SCP-DenyUnencryptedRDSStorage`, and auto-imports discovered Aurora/RDS databases into monitoring console).
- **AI-Powered Natural Language SQL EXPLAIN & DDL Optimizer**: `Active` (Translates `Seq Scan`, `Hash Join`, and `Nested Loop` query execution plans into plain-English diagnostic advice, 1-click zero-downtime production DDL `CREATE INDEX CONCURRENTLY`, and query rewrite suggestions).
- **Automated GitHub Actions CI/CD Pipeline**: `Active` (`.github/workflows/ci.yml` defining automated Node.js v18 build matrix, `npx tsc --noEmit`, 103 Jest unit tests, high-severity CVE audit, and Playwright Chromium E2E testing).
- **Interactive Webhook Alert Engine (Slack, MS Teams & PagerDuty)**: `Active` (Generates Slack Block Kit payloads, Microsoft Teams Adaptive Cards, PagerDuty Events v2 API, and HMAC SHA-256 signatures in `webhookSimulator.ts`).
- **AWS Organizations Tag Propagation & MMS Contract Metering**: `Active` (Propagates sub-account OU tags into cost center pills and meters hourly contract usage via `agentBacklogEnhancements.ts`).
- **Dashboard Container Placement & Layout Balance**: `Active` (Relocated `Aurora Enterprise Multi-Region Cluster` Topology Visualizer underneath Target Databases in Column 1, keeping Cost-Performance Balancer tools neatly aligned in Column 2 and Real-Time Logs/Slow Query Inspector in Column 3).
- **Active Drag Over Drop-Zone Highlight Ring & Touch Support**: `Active` (Touch drag handlers `onTouchStart`, `onTouchMove`, `onTouchEnd` with `elementFromPoint` hit testing and animated pulsing drop-zone highlight ring `ring-2 ring-aws-orange bg-aws-orange/5 animate-pulse border-2 border-dashed border-aws-orange/60` on active drag target columns).
- **Custom Role-Based Per-User Layout Presets**: `Active` (Added 1-click operational role preset buttons *Default Balanced*, *FinOps / Cost View*, *DBA / Telemetry View* inside Developer Tools dropdown menu, fully localized in EN, DE, FR, JA and persisted to SQLite via `saveLayoutAction`).
- **Visual Sparkline Dynamic Canvas Resizing & Animation**: `Active` (Attached `ResizeObserver` container width listener and dynamic SVG polyline path calculation with `transition-all duration-300 ease-in-out` animation, linear gradient area fills, and interactive timestamp point markers in `TelemetrySandbox.tsx`).
- **AWS Marketplace Organic Promotion & APN ACE Co-Selling Enablement**: `Active` (Added "Subscribe on AWS Marketplace (EDP Eligible)" procurement badge with modal breakdown, APN ACE Lead Exporter `aceLeadExporter.ts`, AWS FTR Security Scanner `ftrChecker.ts`, APN registration guide `docs/APN_REGISTRATION_AND_ACE_GUIDE.md`, organic developer content kits `docs/GTM_COMMUNITY_POSTS_AND_TUTORIALS.md`, 2-min YouTube script `docs/DEMO_VIDEO_SCRIPT_AND_STILLS.md`, and GitHub procurement badge kit `docs/MARKETPLACE_BUY_WITH_AWS_KIT.md`).
- **100% Zero-Hardcoded-String AST Static Scanner Verification**: `Active` (Programmatically verified via custom AST Static Scanner `scratch/ast_i18n_scanner.js` using TypeScript AST parser `ts.createSourceFile` to parse 100% of JSX text nodes and string literal attributes `title`, `placeholder`, `aria-label` across all 11 `.tsx` files in `src/components/` and `src/app/page.tsx` — **0 Unlocalized Findings Remaining** across `en`, `de`, `fr`, and `ja`).
- **Automated Test Coverage**: **126/126 Tests Passing** (109 Jest unit + 15 Playwright Multi-Device E2E & visual tests + 2 Playwright Layout State & Preset persistence tests).
- **Page Component Architecture**: `page.tsx` refactored from 2,861 lines to ~450 lines using 10 leaf components in `src/components/` (`HeaderToolbar`, `TelemetrySandbox`, `CostRecommendations`, `SlowQueryInspector`, `TopologyVisualizer`, `SettingsModal`, `TierConfirmationModal`, `GraphQLInspectorModal`, `EvidenceInspectorDrawer`, `ProductTourModal`). Complete TypeScript strict type safety (`npx tsc --noEmit` 0 errors).

---

## Active Cost Recommendations
- **free-tier-sandbox-db** (`616399034957`): **$0.00/mo (AWS 750h/mo Free Tier Active)**.
- **billing-db-mysql**: Downsize `db.m5.2xlarge` to `db.m6g.xlarge` (Saves **$168.00/mo**).
- **dev-sandbox-db**: Convert to Aurora Serverless v2 auto-scaling (Saves **$38.50/mo**).
