// AWS CloudFormation & Service Catalog Infrastructure Exporter (Phase 10A)

export interface CloudFormationTemplateOptions {
  externalId: string;
  roleName?: string;
  saasAccountId?: string;
}

/**
 * Generates a valid CloudFormation v2 YAML template for client account onboarding
 */
export function generateCloudFormationRoleTemplate(
  options: CloudFormationTemplateOptions
): string {
  const extId = options.externalId || "ext-prod-9401-sec";
  const roleName = options.roleName || "RDSSentinelMonitoringRole";
  const saasAccountId = options.saasAccountId || "616399034957";

  return `AWSTemplateFormatVersion: '2010-09-09'
Description: 'RDS Sentinel Cross-Account IAM Monitoring Role Deployment Stack'

Parameters:
  ExternalId:
    Type: String
    Default: '${extId}'
    Description: 'Cryptographic ExternalId provided by RDS Sentinel SaaS'

Resources:
  RDSSentinelRole:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: '${roleName}'
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: 'arn:aws:iam::${saasAccountId}:root'
            Action: 'sts:AssumeRole'
            Condition:
              StringEquals:
                'sts:ExternalId': !Ref ExternalId
      Policies:
        - PolicyName: RDSSentinelReadOnlyMonitoring
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - 'rds:DescribeDBInstances'
                  - 'rds:DescribeDBClusters'
                  - 'pi:GetResourceMetrics'
                  - 'cloudwatch:GetMetricData'
                Resource: '*'

Outputs:
  RoleArn:
    Description: 'ARN of created RDS Sentinel monitoring role'
    Value: !GetAtt RDSSentinelRole.Arn
`;
}

/**
 * Generates AWS Service Catalog Portfolio Product Manifest JSON
 */
export function generateServiceCatalogBlueprint(): string {
  return JSON.stringify(
    {
      SchemaVersion: "1.0",
      Product: {
        Name: "RDS Sentinel Performance & Cost Optimizer",
        Owner: "Cloud Architecture Team",
        Description: "Enterprise AWS RDS & Aurora performance monitor and cost optimization extension.",
        SupportEmail: "support@rds-sentinel.aws",
      },
      ProvisioningArtifact: {
        Name: "v1.0.0",
        Description: "Initial production release template",
        Type: "CLOUD_FORMATION_TEMPLATE",
      },
    },
    null,
    2
  );
}

/**
 * Triggers browser file download of template content
 */
export function downloadTemplateFile(content: string, filename: string, mimeType: string = "text/yaml"): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
