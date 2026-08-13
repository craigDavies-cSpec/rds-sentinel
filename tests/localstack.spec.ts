import { test, expect } from "@playwright/test";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { KinesisClient, DescribeStreamCommand, GetShardIteratorCommand, GetRecordsCommand } from "@aws-sdk/client-kinesis";

test.describe("LocalStack E2E Cloud Simulation Integration Tests", () => {
  let functionUrl = "";

  test.beforeAll(async () => {
    test.setTimeout(180000); // 3 minutes timeout for container start + cdk deploy
    
    console.log("Starting LocalStack container...");
    execSync("docker compose up -d");

    // Poll LocalStack health endpoint until services are ready
    let isReady = false;
    for (let i = 0; i < 30; i++) {
      try {
        const response = await fetch("http://localhost:4566/_localstack/health");
        if (response.ok) {
          const status = await response.json();
          const kinesisState = status.services.kinesis;
          const lambdaState = status.services.lambda;
          if (kinesisState && lambdaState && (kinesisState === "available" || kinesisState === "running")) {
            isReady = true;
            break;
          }
        }
      } catch (err) {
        // Wait and retry
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!isReady) {
      throw new Error("LocalStack container failed to boot in time.");
    }
    console.log("LocalStack services are online. Deploying CDK stacks locally...");

    // Deploy CDK stacks to LocalStack
    const execOptions = {
      cwd: "infra",
      env: {
        ...process.env,
        AWS_ACCESS_KEY_ID: "test",
        AWS_SECRET_ACCESS_KEY: "test",
        AWS_DEFAULT_REGION: "us-east-1",
      },
    };

    execSync("npx.cmd cdklocal bootstrap --qualifier rds-sentinel aws://000000000000/us-east-1", execOptions);
    execSync("npx.cmd cdklocal deploy RDSIngestionStack --require-approval never --outputs-file outputs.json", execOptions);

    const outputsPath = path.join(__dirname, "../infra/outputs.json");
    if (!fs.existsSync(outputsPath)) {
      throw new Error("CDK deployment did not generate outputs.json");
    }

    // Resolve the real function name from LocalStack to build a direct path-based URL
    const { LambdaClient, ListFunctionsCommand, AddPermissionCommand } = require("@aws-sdk/client-lambda");
    const lambdaClient = new LambdaClient({
      endpoint: "http://127.0.0.1:4566",
      region: "us-east-1",
      credentials: { accessKeyId: "test", secretAccessKey: "test" },
    });

    const listRes = await lambdaClient.send(new ListFunctionsCommand({}));
    const foundFunc = listRes.Functions?.find((f: any) => f.FunctionName?.includes("RDSSanitizerLambda"));
    if (!foundFunc || !foundFunc.FunctionName) {
      throw new Error("Could not locate RDSSanitizerLambda function in LocalStack.");
    }

    // Workaround for LocalStack CloudFormation permission sync bug:
    // Explicitly add InvokeFunctionUrl permission to allow anonymous/public browser POST requests
    try {
      await lambdaClient.send(
        new AddPermissionCommand({
          FunctionName: foundFunc.FunctionName,
          StatementId: "FunctionURLAllowPublicAccess-LocalStackOverride",
          Action: "lambda:InvokeFunctionUrl",
          Principal: "*",
          FunctionUrlAuthType: "NONE",
        })
      );
      console.log("Successfully granted InvokeFunctionUrl permissions on LocalStack.");
    } catch (err: any) {
      console.warn("Could not apply InvokeFunctionUrl permissions override:", err);
    }

    const outputs = JSON.parse(fs.readFileSync(outputsPath, "utf-8"));
    functionUrl = outputs.RDSIngestionStack.IngestionEndpointOutput;
    console.log("Deployed stack successfully. Function URL:", functionUrl);

  });

  test.afterAll(async () => {
    // Fetch and print Lambda CloudWatch Logs for debugging
    try {
      console.log("Fetching Lambda CloudWatch Logs...");
      const { CloudWatchLogsClient, DescribeLogStreamsCommand, GetLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");
      const cwlClient = new CloudWatchLogsClient({
        endpoint: "http://127.0.0.1:4566",
        region: "us-east-1",
        credentials: { accessKeyId: "test", secretAccessKey: "test" },
      });

      // Find the function name
      const { LambdaClient, ListFunctionsCommand } = require("@aws-sdk/client-lambda");
      const lambdaClient = new LambdaClient({
        endpoint: "http://127.0.0.1:4566",
        region: "us-east-1",
        credentials: { accessKeyId: "test", secretAccessKey: "test" },
      });
      const listRes = await lambdaClient.send(new ListFunctionsCommand({}));
      const foundFunc = listRes.Functions?.find((f: any) => f.FunctionName?.includes("RDSSanitizerLambda"));
      
      if (foundFunc && foundFunc.FunctionName) {
        const logGroupName = `/aws/lambda/${foundFunc.FunctionName}`;
        const streamsRes = await cwlClient.send(new DescribeLogStreamsCommand({
          logGroupName,
          orderBy: "LastEventTime",
          descending: true,
          limit: 1
        }));
        
        const stream = streamsRes.logStreams?.[0];
        if (stream && stream.logStreamName) {
          const eventsRes = await cwlClient.send(new GetLogEventsCommand({
            logGroupName,
            logStreamName: stream.logStreamName,
            limit: 50
          }));
          console.log(`\n--- Lambda CloudWatch Logs [${foundFunc.FunctionName}] ---`);
          eventsRes.events?.forEach((evt: any) => {
            console.log(evt.message?.trim());
          });
          console.log(`--------------------------------------------------------\n`);
        } else {
          console.log("No log streams found for log group:", logGroupName);
        }
      } else {
        console.log("Could not locate RDSSanitizerLambda for CloudWatch Logs.");
      }
    } catch (cwlErr: any) {
      console.warn("Could not retrieve CloudWatch logs:", cwlErr?.message);
    }

    try {
      console.log("Fetching LocalStack container logs...");
      execSync("docker logs rds-sentinel-localstack", { stdio: "inherit" });
    } catch (err) {
      console.error("Failed to fetch Docker logs:", err);
    }

    console.log("Tearing down LocalStack container...");
    try {
      execSync("docker compose down");
      try {
        execSync("docker rm -f $(docker ps -a -q -f name=rds-sentinel-localstack-lambda)", { stdio: "ignore" });
      } catch (e) {}
      const outputsPath = path.join(__dirname, "../infra/outputs.json");
      if (fs.existsSync(outputsPath)) {
        fs.unlinkSync(outputsPath);
      }
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  });

  test("should upload telemetry payloads end-to-end and queue them in Kinesis stream", async ({ page }) => {
    test.setTimeout(90000); // 90 seconds timeout for E2E flow

    page.on("console", (msg) => {
      console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      console.error(`[Browser PageError]: ${err.message}`);
    });

    // Intercept client-side fetch requests to LocalStack and proxy them from Node.js
    // to bypass LocalStack's browser CORS/Origin validation limits
    await page.route(
      (url) => url.href.includes("localhost.localstack.cloud") || url.href.includes("/functions/"),
      async (route) => {
        const request = route.request();
        console.log(`[Playwright Proxy] Intercepted request to: ${request.url()}`);
        if (request.method() === "POST") {
          try {
            console.log(`[Playwright Proxy] Forwarding POST request with body: ${request.postData()}`);
            const res = await fetch(request.url(), {
              method: "POST",
              headers: { "Content-Type": "text/plain" },
              body: request.postData() || "",
            });
            const bodyText = await res.text();
            console.log(`[Playwright Proxy] Response status: ${res.status}, body: ${bodyText}`);
            await route.fulfill({
              status: res.status,
              contentType: "application/json",
              body: bodyText,
            });
          } catch (e) {
            console.error(`[Playwright Proxy] Forwarding failed:`, e);
            await route.abort();
          }
        } else {
          await route.continue();
        }
      }
    );

    await page.goto("/");

    // Locate the override input and fill it with the LocalStack Function URL
    const overrideInput = page.locator("#ingestion-url-override");
    await expect(overrideInput).toBeVisible();
    await overrideInput.fill(functionUrl);

    // Switch between databases to force outbox queue telemetry generation
    const dbItem = page.locator("div:has-text('billing-db-mysql')").first();
    await dbItem.click();

    // Verify outbox status displays successful transmissions
    await page.waitForTimeout(5000); // Let simulated ticks process and fetch
    
    // Connect to local Kinesis client to retrieve records
    console.log("Connecting to Kinesis mock client at LocalStack...");
    const kinesis = new KinesisClient({
      endpoint: "http://127.0.0.1:4566",
      region: "us-east-1",
      credentials: { accessKeyId: "test", secretAccessKey: "test" },
    });

    // Fetch the Shard ID
    const stream = await kinesis.send(new DescribeStreamCommand({ StreamName: "rds-sentinel-log-stream" }));
    const shardId = stream.StreamDescription?.Shards?.[0]?.ShardId;

    // Get Shard Iterator
    const iterator = await kinesis.send(
      new GetShardIteratorCommand({
        StreamName: "rds-sentinel-log-stream",
        ShardId: shardId,
        ShardIteratorType: "TRIM_HORIZON",
      })
    );

    // Retrieve records from stream with a robust polling retry loop
    let records: any = null;
    let attempts = 0;
    const maxAttempts = 15;
    
    while (attempts < maxAttempts) {
      console.log(`Querying Kinesis records (Attempt ${attempts + 1}/${maxAttempts})...`);
      try {
        const res = await kinesis.send(new GetRecordsCommand({ ShardIterator: iterator.ShardIterator }));
        if (res.Records && res.Records.length > 0) {
          records = res;
          break;
        }
      } catch (err: any) {
        console.warn("Error querying Kinesis:", err?.message);
      }
      attempts++;
      await page.waitForTimeout(2000); // Wait 2s between checks
    }

    expect(records).toBeDefined();
    expect(records.Records?.length).toBeGreaterThan(0);

    const firstRecord = records.Records![0];
    const payloadText = Buffer.from(firstRecord.Data!).toString("utf-8");
    const payload = JSON.parse(payloadText);

    console.log("Verified Kinesis Ingested Payload:", payload);
    
    // Assert structural attributes of telemetry payloads
    expect(payload.instanceId).toBeDefined();
    expect(payload.metrics.cpu).toBeDefined();
    expect(payload.metrics.connections).toBeDefined();
  });
});
