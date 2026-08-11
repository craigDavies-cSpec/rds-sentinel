import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface RDSMonitoringRoleStackProps extends cdk.StackProps {
  /** The AWS Account ID of the SaaS monitoring service */
  saasAccountId: string;
  /** Cryptographic External ID generated for this tenant */
  externalId: string;
}

export class RDSMonitoringRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RDSMonitoringRoleStackProps) {
    super(scope, id, props);

    // Enforce parameter validation
    if (!props.saasAccountId || props.saasAccountId.trim() === "") {
      throw new Error("saasAccountId is required to configure cross-account trust.");
    }
    if (!props.externalId || props.externalId.trim() === "") {
      throw new Error("externalId is required to guard the cross-account trust relationship.");
    }

    // 1. Create the cross-account role with ExternalId trust policy (Security Auditor Audit)
    const monitoringRole = new iam.Role(this, "RDSSentinelRole", {
      roleName: "RDSSentinelMonitoringRole",
      assumedBy: new iam.AccountPrincipal(props.saasAccountId).withConditions({
        StringEquals: {
          "sts:ExternalId": props.externalId,
        },
      }),
      description: "Cross-account read-only monitoring role assumed by RDS Sentinel SaaS.",
    });

    // 2. Attach strict Read-Only Policies for RDS Metadata
    monitoringRole.addToPolicy(new iam.PolicyStatement({
      sid: "RDSSentinelMetadataQuery",
      effect: iam.Effect.ALLOW,
      actions: [
        "rds:DescribeDBInstances",
        "rds:DescribeDBClusters",
        "rds:DescribeDBParameters",
        "rds:ListTagsForResource",
      ],
      resources: ["*"],
    }));

    // 3. Attach strict Read-Only Policies for Performance Insights
    monitoringRole.addToPolicy(new iam.PolicyStatement({
      sid: "RDSSentinelPerformanceInsightsQuery",
      effect: iam.Effect.ALLOW,
      actions: [
        "pi:DescribeDimensionKeys",
        "pi:GetResourceMetrics",
      ],
      resources: ["*"],
    }));

    // 4. Attach strict Read-Only Policies for CloudWatch Metrics & Logs
    monitoringRole.addToPolicy(new iam.PolicyStatement({
      sid: "RDSSentinelCloudWatchQuery",
      effect: iam.Effect.ALLOW,
      actions: [
        "cloudwatch:GetMetricData",
        "cloudwatch:GetMetricStatistics",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:FilterLogEvents",
        "logs:GetLogEvents",
      ],
      resources: ["*"],
    }));

    // 5. Attach Read-Only Policies for Cost Explorer recommendations
    monitoringRole.addToPolicy(new iam.PolicyStatement({
      sid: "RDSSentinelCostRecommendationsQuery",
      effect: iam.Effect.ALLOW,
      actions: [
        "ce:GetCostAndUsage",
        "ce:GetCostRecommendations",
      ],
      resources: ["*"],
    }));

    // Output the Role ARN so clients can copy it to our dashboard
    new cdk.CfnOutput(this, "RDSSentinelRoleArnOutput", {
      value: monitoringRole.roleArn,
      description: "The ARN of the cross-account role to configure in the RDS Sentinel console.",
      exportName: "RDSSentinelRoleArn",
    });
  }
}
