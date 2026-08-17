import { formatSlackPayload, formatPagerDutyPayload, formatTeamsPayload, dispatchWebhookAlert } from "../webhookSimulator";

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

  test("should format valid Microsoft Teams Adaptive Cards payload JSON", () => {
    const payload: any = formatTeamsPayload("fintech-db-prod", "High Storage Utilization", "Disk usage > 92%", "CREATE INDEX CONCURRENTLY idx_fintech ON payments(created_at);");
    expect(payload.type).toBe("message");
    expect(payload.attachments[0].contentType).toBe("application/vnd.microsoft.card.adaptive");
    expect(payload.attachments[0].content.body[0].text).toContain("High Storage Utilization");
    expect(payload.attachments[0].content.actions[0].title).toContain("1-Click Remediation Console");
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

  test("should simulate successful webhook dispatch with status 200 and HMAC SHA-256 signature header", async () => {
    const res = await dispatchWebhookAlert(
      "teams",
      "https://outlook.office.com/webhook/XXXXX/IncomingWebhook/YYYYY",
      "sales-db-prod",
      "Memory Threshold Exceeded",
      "Swap usage high"
    );
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.responseMessage).toContain("HTTP 200 OK");
    expect(res.signatureHeader).toContain("sha256=");
  });
});
