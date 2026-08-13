import { formatSlackPayload, formatPagerDutyPayload, dispatchWebhookAlert } from "../webhookSimulator";

describe("Webhook Simulator Utility Unit Tests", () => {
  test("should format valid Slack Block Kit payload JSON", () => {
    const payload: any = formatSlackPayload("sales-db-prod", "CPU Spike Alert", "CPU utilization exceeded 90%");
    expect(payload.text).toContain("sales-db-prod");
    expect(payload.blocks).toHaveLength(4);
    expect(payload.blocks[0].text.text).toContain("CPU Spike Alert");
  });

  test("should format valid PagerDuty Events v2 API payload JSON", () => {
    const payload: any = formatPagerDutyPayload("billing-db-mysql", "High Connections", "Active connections > 140");
    expect(payload.event_action).toBe("trigger");
    expect(payload.payload.severity).toBe("error");
    expect(payload.payload.source).toBe("billing-db-mysql");
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
