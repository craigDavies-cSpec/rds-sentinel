import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as kinesis from "aws-cdk-lib/aws-kinesis";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
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
      environment: {
        STREAM_NAME: telemetryLogStream.streamName,
      },
      code: lambda.Code.fromInline(`
        const { KinesisClient, PutRecordCommand } = require("@aws-sdk/client-kinesis");
        const endpoint = process.env.AWS_ENDPOINT_URL || (process.env.LOCALSTACK_HOSTNAME ? "http://" + process.env.LOCALSTACK_HOSTNAME + ":4566" : undefined);
        const kinesis = new KinesisClient({ endpoint });
        const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g;
        
        exports.handler = async function(event) {
          console.log("Ingest Event received:", JSON.stringify(event));
          
          // Case 1: Invoked via Function URL (HTTP POST client upload)
          if (event.body) {
            console.log("HTTP POST received, pushing payload to Kinesis stream...");
            try {
              const bodyText = event.isBase64Encoded 
                ? Buffer.from(event.body, 'base64').toString('utf-8')
                : event.body;
              
              await kinesis.send(new PutRecordCommand({
                StreamName: process.env.STREAM_NAME,
                PartitionKey: "partition-1",
                Data: Buffer.from(bodyText)
              }));
              
              return { 
                statusCode: 200, 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Payload queued in Kinesis successfully" }) 
              };
            } catch (err) {
              console.error("Failed to push to Kinesis:", err);
              return { 
                statusCode: 500, 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: err.message }) 
              };
            }
          }
          
          // Case 2: Invoked via Kinesis Event Source Mapping (log processing)
          if (event.Records) {
            console.log("Kinesis stream records received, sanitizing...");
            for (const record of event.Records) {
              // Decode Kinesis record payload
              const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8');
              console.log("Raw Received Ingestion Payload:", payload);
              
              // Perform Edge Sanitization parameter masking (Security Auditor Audit)
              let sanitized = payload.replace(EMAIL_REGEX, "[REDACTED_EMAIL]");
              
              // Mask raw string literals in SQL patterns
              sanitized = sanitized.replace(/'[^']*'/g, "'?'").replace(/"[^"]*"/g, '"?"');
              
              console.log("Sanitized Ingestion Payload:", sanitized);
            }
          }
          
          return { statusCode: 200, body: JSON.stringify({ message: "Processed successfully" }) };
        };
      `),
      description: "Ingests database telemetry and sanitizes raw query logs (PII masking).",
      timeout: cdk.Duration.seconds(30),
    });

    // 3. Grant Ingestion Lambda permission to read and write to Kinesis
    telemetryLogStream.grantReadWrite(ingestionLambda);

    // 4. Add Event Source Mapping so Kinesis triggers the Lambda for processing
    ingestionLambda.addEventSource(new lambdaEventSources.KinesisEventSource(telemetryLogStream, {
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 1,
    }));

    // 5. Create public Lambda Function URL for telemetry outbox submits (SaaS API endpoint)
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
