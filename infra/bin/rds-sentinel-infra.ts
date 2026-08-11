#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { RDSMonitoringRoleStack } from "../lib/rds-monitoring-role-stack";
import { RDSIngestionStack } from "../lib/rds-ingestion-stack";

const app = new cdk.App();

// Environment variables configuration (Security Auditor Audit)
// These should be configured at deployment time
const SAAS_ACCOUNT_ID = process.env.SAAS_ACCOUNT_ID || "123456789012"; // Placeholder for synthesis
const TENANT_EXTERNAL_ID = process.env.TENANT_EXTERNAL_ID || "sec-token-default-handshake-99a3"; // Placeholder for synthesis

// 1. Instantiate the Client-Side IAM Role Stack
// Customers will deploy this stack in their target database accounts
new RDSMonitoringRoleStack(app, "RDSMonitoringRoleStack", {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || "us-east-1" 
  },
  saasAccountId: SAAS_ACCOUNT_ID,
  externalId: TENANT_EXTERNAL_ID,
});

// 2. Instantiate the SaaS-Side Telemetry Ingestion Stack
// We deploy this in our hosted SaaS monitoring environment
new RDSIngestionStack(app, "RDSIngestionStack", {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || "us-east-1" 
  },
});
