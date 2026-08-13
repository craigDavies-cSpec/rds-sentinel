# ☁️ $0 / Low-Cost AWS Free Tier Telemetry Ingestion Guide

Step-by-step guide for testing **RDS Sentinel** against **live real AWS RDS database telemetry** for **$0 / month** using AWS Free Tier limits.

---

## 🎯 AWS Free Tier Resource Allocation ($0 Cost Breakdown)

| AWS Service | Free Tier Limit | RDS Sentinel Usage | Cost |
|---|---|---|---|
| **AWS RDS (PostgreSQL / MySQL)** | 750 hours/month (`db.t4g.micro` or `db.t3.micro` Single-AZ) + 20GB Storage | 1 Monitored Free Tier Database Instance | **$0.00** |
| **AWS Lambda** | 1M free requests/month + 3.2M seconds compute time | Edge Sanitizer & Ingestion Lambdas | **$0.00** |
| **Lambda Function URL** | Built-in HTTPS endpoint (No API Gateway charge) | SaaS Telemetry Outbox Ingestion | **$0.00** |
| **AWS CloudWatch Logs** | 5GB ingestion free/month | RDS Slow Query Log Subscription Filters | **$0.00** |
| **AWS IAM / STS** | Free service | Cross-account IAM Monitoring Role (`AssumeRole`) | **$0.00** |
| **TOTAL MONTHLY COST** | | | **$0.00 / mo** |

---

## 🛠️ Step-by-Step Launch & Ingestion Workflow

### Step 1: Launch Monitored Free Tier RDS Instance
1. Open AWS Console ➔ RDS ➔ **Create Database**.
2. Engine: **PostgreSQL** or **MySQL**.
3. Template: **Free Tier** (`db.t4g.micro`, 20GB GP2 storage).
4. DB Instance Identifier: `free-tier-sandbox-db`.
5. Additional Configuration: Enable **CloudWatch Logs exports** (PostgreSQL log / MySQL slowquery log).

### Step 2: Deploy Client Cross-Account Monitoring Role Stack
Run AWS CDK synthesis or execute CloudFormation template `infra/lib/rds-monitoring-role-stack.ts`:

```bash
cd infra
npx cdk deploy RDSMonitoringRoleStack --parameters ExternalId=SENSITIVE_EXTERNAL_ID_123
```

### Step 3: Attach Zero-Cost CloudWatch Subscription Filter
Attach subscription filter forwarding slow query log events to the Edge Sanitizer Lambda:

```bash
aws logs put-subscription-filter \
  --log-group-name "/aws/rds/instance/free-tier-sandbox-db/postgresql" \
  --filter-name "RDSSentinelSlowQueryFilter" \
  --filter-pattern "[... log_statement = *slow*]" \
  --destination-arn "arn:aws:lambda:us-east-1:123456789012:function:RDSSentinelEdgeSanitizer"
```

### Step 4: Run Live Telemetry Benchmark Test
Connect to your `free-tier-sandbox-db` via `psql` or DBeaver and execute a test query:

```sql
-- Triggers slow query log entry without consuming CPU or storage
SELECT pg_sleep(2);
```

### Step 5: Verify Live Telemetry Ingestion on Dashboard
1. Open RDS Sentinel Dashboard (`http://127.0.0.1:8213`).
2. Confirm the live telemetry packet streams into the dashboard console with parameters masked:
   - Query: `SELECT pg_sleep(?);`
   - Execution Time: `2000ms`
   - Edge Masking Status: `REDACTED (0 PII Leaks)`
