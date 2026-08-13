# 🇬🇧 UK Business Setup & Governance Guide: cSpec Solutions Ltd

Comprehensive guide for incorporating **cSpec Solutions Ltd** in the UK, setting up tax compliance, business banking, data protection, and SaaS legal contracts for **RDS Sentinel**.

---

## 🏢 1. Companies House LTD Incorporation Checklist

* **Company Name:** `cSpec Solutions Ltd` (Alternative fallback: `cSpec Ltd` or `cspec.uk`).
* **Jurisdiction:** Companies House (England & Wales).
* **Company Type:** Private Limited Company by Shares (LTD).
* **SIC Codes:**
  - `62012`: Business and domestic software development.
  - `62020`: Information technology consultancy activities.
* **Filing Fee:** £50 online WebFiling fee.
* **Registered Office Address:** Use a virtual office address service (e.g. Hoxton Mix, Virtual Office UK, or Regus) in London or Manchester (~£10-£15/month) to keep personal director home addresses off the public Companies House register.
* **Required Persons:**
  - **Director(s):** Minimum 1 natural person director (residing in UK or international).
  - **Person with Significant Control (PSC):** Shareholder(s) holding >25% shares/voting rights.

---

## 🏛️ 2. HMRC Tax & Regulatory Setup

1. **Corporation Tax:** Auto-registered upon Companies House incorporation. Unique Taxpayer Reference (UTR) is posted to the registered office within 14 days.
2. **VAT Registration:** Voluntary registration or threshold monitoring (UK VAT registration threshold is £90,000 turnover).
   - If selling via AWS Marketplace, AWS acts as the Merchant of Record for EU/UK B2C/B2B VAT collection on SaaS contracts, simplifying UK VAT filing.
3. **PAYE & Director Payroll:** Register for HMRC PAYE if paying director salaries above the National Insurance Threshold (£12,570/year).

---

## 🏦 3. UK Business Banking & AWS Marketplace Disbursements

To receive USD and GBP payouts from AWS Marketplace without losing 3-4% on currency conversion:

* **Recommended Bank:** **Wise Business** / **Starling Bank Business** / **Revolut Business**.
* **Key Features Needed:**
  - UK Account Number & Sort Code (GBP).
  - US Routing Number & Account Number (USD) for direct AWS Marketplace ACH payouts.
* **AWS Marketplace Seller Bank Linking:** Input US ACH details in AWS Marketplace Portal for USD disbursements.

---

## 📜 4. Data Protection & Legal Contract Suite

* **ICO Registration:** Register with the Information Commissioner's Office (ICO) under Tier 1 (£40/year fee).
* **GDPR Compliance:** Built-in edge SQL parameter masking guarantees zero PII collection.
* **SaaS Contract Templates:** Automated generator in [`src/lib/ukLegalContracts.ts`](file:///c:/Users/craig/cSpec%20Projects/rds-sentinel/src/lib/ukLegalContracts.ts) provides GDPR Privacy Policy, EULA, and Terms of Service.
