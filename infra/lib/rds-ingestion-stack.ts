import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as kinesis from "aws-cdk-lib/aws-kinesis";
import { Construct } from "constructs";

export class RDSIngestionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create Kinesis Data Stream for real-time log ingestion (AWS Expert Audit)
    const telemetryLogStream = new kinesis.Stream(this, "TelemetryLogStream", {
      streamName: "rds-sentinel-log-stream",
      shardCount: 1,
      retentionPeriod: cdk.Duration.hours(24),
      encryption: kinesis.StreamEncryption.MANAGED, // Enforce encryption at rest
    });

    // 2. Create the Node.js Sanitizer & Ingestion Lambda Function
    // This Lambda processes incoming telemetry and runs SQL/PII parameter masking
    const ingestionLambda = new lambda.Function(this, "RDSSanitizerLambda", {
      runtime: lambda.Runtime.NODEJS_18_X, // Node 18 compatible runtime
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g;
        
        exports.handler = async function(event) {
          console.log("Processing ingestion records...");
          
          for (const record of event.Records) {
            // Decode Kinesis record payload
            const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
            console.log("Raw Received Ingestion Payload:", payload);
            
            // Perform Edge Sanitization parameter masking (Security Auditor Audit)
            let sanitized = payload.replace(EMAIL_REGEX, "[REDACTED_EMAIL]");
            
            // Mask raw string literals in SQL patterns
            sanitized = sanitized.replace(/'[^']*'/g, "'?'").replace(/"[^"]*"/g, '"?"');
            
            console.log("Sanitized Ingestion Payload:", sanitized);
            // In a production setup, write the sanitized payload to DynamoDB/Timestream
          }
          
          return { statusCode: 200, body: JSON.stringify({ message: "Processed successfully" }) };
        };
      `),
      description: "Ingests database telemetry and sanitizes raw query logs (PII masking).",
      timeout: cdk.Duration.seconds(30),
    });

    // 3. Grant Ingestion Lambda permission to read from Kinesis
    telemetryLogStream.grantRead(ingestionLambda);

    // 4. Create public Lambda Function URL for telemetry outbox submits (SaaS API endpoint)
    const functionUrl = ingestionLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, // Open API path for client uploads
      cors: {
        allowedOrigins: ["*"],
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["content-type"],
      },
    });

    // Outputs for console binding
    new cdk.CfnOutput(this, "IngestionEndpointOutput", {
      value: functionUrl.url,
      description: "Public endpoint URL for rds-sentinel client telemetry uploads.",
      exportName: "RDSSentinelIngestionEndpoint",
    });
  }
}
