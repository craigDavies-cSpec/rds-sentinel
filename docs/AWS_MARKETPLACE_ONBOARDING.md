# 🛒 AWS Marketplace Seller Onboarding & Monetization Guide

Guide for registering **cSpec Solutions Ltd** as an AWS Marketplace Seller and listing **RDS Sentinel**.

---

## 📋 1. Seller Registration & Financial Verification

1. **Sign Up:** Register at [AWS Marketplace Management Portal (AMMP)](https://aws.amazon.com/marketplace/management).
2. **Company Profile:** Enter `cSpec Solutions Ltd`, Companies House CRN, UK business address, and website `https://cspec.uk`.
3. **U.S. IRS Tax Form (W-8BEN-E):**
   - Submit Form W-8BEN-E (Certificate of Status of Beneficial Owner for United States Tax Withholding).
   - Claim Treaty Benefits under Chapter 3 (UK-US Double Taxation Treaty Article 12 - Royalties & Software SaaS) for **0% US Tax Withholding**.
4. **Bank Account Linking:** Input Wise Business / Starling Bank US ACH routing details for direct USD monthly disbursements.

---

## 📦 2. SaaS Product Listing Parameters

* **Product Title:** RDS Sentinel — AWS RDS & Aurora Performance Monitor & Cost Optimizer.
* **Fulfillment Type:** SaaS Contract + Usage (Metered Billing).
* **Tiered Pricing Structure:**
  - **7-Day Trial:** $0 (Max 2 DB Instances).
  - **Small Business:** $59 / month (Max 5 DB Instances).
  - **Medium Business:** $179 / month (Max 15 DB Instances).
  - **Enterprise:** $499 / month (Unlimited DB Instances).
* **1-Click Customer Onboarding Assets:**
  - CloudFormation Stack: `infra/lib/rds-monitoring-role-stack.ts` (`rds-sentinel-monitoring-role.yaml`).
  - Terraform Module: `src/lib/terraformExporter.ts` (`main.tf`, `variables.tf`).
  - AWS Service Catalog Blueprint: `src/lib/cloudFormationExporter.ts`.

---

## ⚡ 3. Metering & Entitlement API Integration

* **AWS Entitlement Service API (`GetEntitlements`):** Validates customer active subscription tier upon customer login.
* **AWS Marketplace Metering Service (`BatchMeterUsage`):** Reports hourly monitored database instance count to AWS Marketplace for billing.
