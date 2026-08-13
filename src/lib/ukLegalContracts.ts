/**
 * UK Business Setup & SaaS Legal Contracts Generator
 * cSpec Solutions Ltd — RDS Sentinel
 */

export interface LegalContractPackage {
  companyName: string;
  registrationNumber: string;
  icoRegistrationNumber: string;
  jurisdiction: string;
  privacyPolicyMarkdown: string;
  eulaMarkdown: string;
  termsOfServiceMarkdown: string;
}

export function generateUKLegalContracts(
  companyName: string = "cSpec Solutions Ltd",
  crn: string = "CRN-15982430",
  icoRef: string = "ZB-948210"
): LegalContractPackage {
  const privacyPolicy = `# GDPR Privacy Policy & Telemetry Handling Notice
**Entity:** ${companyName} (Company No. ${crn})
**ICO Registration:** ${icoRef}
**Jurisdiction:** England & Wales

## 1. Zero-PII Telemetry Protection
RDS Sentinel processes AWS RDS database telemetry using edge sanitization Lambdas. All raw SQL queries undergo automated parameter masking (redacting literal string parameters, numerical constants, and email addresses) before data transmission to our SaaS functions.

## 2. Data Storage & Encryption
All telemetry metrics are encrypted in transit via TLS 1.3 and at rest using AES-256 AWS KMS customer-managed keys.

## 3. Data Subject Rights & Contact
Data subjects under UK GDPR / EU GDPR may exercise their rights by contacting support@cspec.uk.
`;

  const eula = `# End User License Agreement (EULA)
**Provider:** ${companyName}
**Product:** RDS Sentinel — AWS RDS & Aurora Monitor & Cost Optimizer

## 1. Grant of License
Subject to compliance with subscription tier terms on AWS Marketplace, ${companyName} grants Customer a non-exclusive, non-transferable, revocable license to install and use RDS Sentinel.

## 2. Service Level Agreement (SLA)
We maintain a 99.9% uptime commitment for Medium and Enterprise subscription tiers.

## 3. Governing Law
This Agreement is governed by and construed in accordance with the laws of England and Wales.
`;

  const termsOfService = `# Terms of Service
**Provider:** ${companyName}

## 1. Subscription & AWS Billing
RDS Sentinel subscriptions are billed directly through the AWS Marketplace via AWS Entitlement and Metering APIs.

## 2. Limitation of Liability
${companyName}'s aggregate liability arising out of or related to this agreement shall not exceed the total amount paid by Customer on AWS Marketplace during the twelve (12) months preceding the incident.
`;

  return {
    companyName,
    registrationNumber: crn,
    icoRegistrationNumber: icoRef,
    jurisdiction: "England & Wales",
    privacyPolicyMarkdown: privacyPolicy,
    eulaMarkdown: eula,
    termsOfServiceMarkdown: termsOfService,
  };
}
