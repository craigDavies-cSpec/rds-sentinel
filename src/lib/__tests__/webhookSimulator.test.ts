import { formatSlackPayload, formatPagerDutyPayload, dispatchWebhookAlert } from "../webhookSimulator";

describe("Webhook Simulator Utility Unit Tests", () => {
  test("should format valid Slack Block Kit payload JSON with interactive 1-click DDL action buttons", () => {
    const payload: any = formatSlackPayload("sales-db-prod", "CPU Spike Alert", "CPU utilization exceeded 90%", "CREATE INDEX CONCURRENTLY idx_users_email ON users(email);");
    expect(payload.text).toContain("sales-db-prod");
    expect(payload.blocks.length).toBeGreaterThanOrEqual(4);
    expect(payload.blocks[0].text.text).toContain("CPU Spike Alert");
    
    // Action block assertion
    const actionBlock = payload.blocks.find((b: any) => b.type === "actions");
    expect(actionBlock).toBeDefined();
    expect(actionBlock.elements[0].text.text).toContain("1-Click Apply DDL Index");
  });

  test("should format valid PagerDuty Events v2 API payload JSON with custom remediation link", () => {
    const payload: any = formatPagerDutyPayload("billing-db-mysql", "High Connections", "Active connections > 140", "CREATE INDEX idx_billing ON billing(id);");
    expect(payload.event_action).toBe("trigger");
    expect(payload.payload.severity).toBe("error");
    expect(payload.payload.source).toBe("billing-db-mysql");
    expect(payload.links[0].text).toContain("1-Click Zero-Downtime DDL");
  });

  test("should reject invalid webhook URL endpoint with status 400", async () => {
    const res = await dispatchWebhookAlert("slack", "invalid-url", "sales-db-prod", "Test Alert", "Test Message");
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(400);
    expect(res.responseMessage).toContain("Invalid webhook URL format");
  });

  test("should simulate successful webhook dispatch with status 200", async () => {
    const res = await dispatchWebhookAlert(
      "slack",
      "https://hooks.slack.com/services/T00000000/B00000000/XXXXX",
      "sales-db-prod",
      "Memory Threshold Exceeded",
      "Swap usage high"
    );
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.responseMessage).toContain("HTTP 200 OK");
  });
});
