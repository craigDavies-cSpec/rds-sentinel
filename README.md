# 🛡️ AWS RDS & Aurora Sentinel (`rds-sentinel`)

An ultra-modern, configurable database performance monitor, zero-knowledge security vault, and cost optimizer designed as an AWS Marketplace extension.

[![Build & Test Status](https://img.shields.io/badge/Tests-137%2F137%20Passing-emerald?style=flat-square)](https://github.com/craigDavies-cSpec/rds-sentinel)
[![Security Standard](https://img.shields.io/badge/Security-AES--256--GCM%20SOC2-blue?style=flat-square)](file:///c:/Users/craig/cSpec%20Projects/rds-sentinel/src/lib/enterpriseSecurityVault.ts)
[![AWS Free Tier](https://img.shields.io/badge/AWS%20Free%20Tier-%240.00%2Fmo-orange?style=flat-square)](file:///c:/Users/craig/cSpec%20Projects/rds-sentinel/docs/AWS_FREE_TIER_INGESTION_GUIDE.md)

---

## 🌟 Key Architecture & Highlights

- **Edge Parameter Masking & PII Redaction**: Telemetry log scanning and SQL parameter masking execute inside the client's AWS VPC boundary (Lambda Log Subscription Filters). Plaintext database records, passwords, credit cards, and customer rows never cross external network borders.
- **Enterprise Security & Zero-Knowledge Encryption Vault**: Web Crypto API **AES-256-GCM** authenticated data encryption with PBKDF2 (100,000 iterations), OWASP CSPRNG 28-character password generator (>120 bits entropy), and STS `ExternalId` Confused Deputy protection.
- **Centralized AWS Pricing & Automated Live API Sync**: Real-time pricing sync (`awsPricingEngine.ts`) polling the official AWS Price List API with automatic **$0.00/mo Free Tier** math for `db.t4g.micro` and `db.t2.micro` instances.
- **Global Accessibility Toolbar**: Instant flag-based language selector (🇺🇸 English, 🇩🇪 Deutsch, 🇫🇷 Français, 🇯🇵 日本語) directly on the main header bar for international non-English users.
- **UK Business & Governance Suite**: Complete Companies House LTD setup guides, HMRC Corporation Tax/VAT threshold monitoring, ICO registration guides, and UK GDPR/EULA legal contract generators.

---

## 🛠️ Technical Stack & Dependencies

- **Framework**: Next.js `13.4.19` (App Router)
- **Styling**: Tailwind CSS (AWS Cloudscape palette)
- **Testing**: Jest `29.7.0` (98 Unit Tests) + Playwright `1.42.1` (39 E2E Tests)
- **AWS CDK**: `2.100.0` (Synthesizing CloudFormation v2 templates)
- **Language**: TypeScript `5.x`

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.12.0`
- npm `8.x`

### Installation & Development Server
```bash
# Clone the repository
git clone https://github.com/craigDavies-cSpec/rds-sentinel.git
cd rds-sentinel

# Install dependencies
npm install

# Launch local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the SaaS console.

---

## 🧪 Testing & Quality Verification

```bash
# Run TypeScript type check & Jest unit tests (98 Tests)
npx tsc --noEmit && npm test

# Run Playwright End-to-End Test Suite (39 Tests)
npm run test:e2e

# Run Security CVE Vulnerability Audit
npm audit
```

---

## 📄 License & Contact

Developed by **cSpec Solutions Ltd** ([cspec.uk](https://cspec.uk)).  
Licensed under the Enterprise SaaS License for AWS Marketplace.
