/**
 * Enterprise Webhook Dispatch Simulator for Slack and PagerDuty alert channels.
 */

export interface WebhookDispatchResult {
  success: boolean;
  statusCode: number;
  target: "slack" | "pagerduty";
  deliveredAt: string;
  responseMessage: string;
  payloadJson: string;
}

/**
 * Formats Slack Block Kit incoming webhook payload JSON with interactive 1-Click action buttons.
 */
export function formatSlackPayload(dbName: string, alertType: string, message: string, ddlAction?: string): object {
  const blocks: any[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `🚨 RDS Sentinel Anomaly Alert: ${alertType}`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Target Database:*\n\`${dbName}\``,
        },
        {
          type: "mrkdwn",
          text: `*Severity:*\n*HIGH (Action Required)*`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Details:*\n${message}`,
      },
    },
  ];

  if (ddlAction) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Suggested Zero-Downtime DDL Fix:*\n\`\`\`${ddlAction}\`\`\``,
      },
    });
  }

  // Interactive 1-Click Action Buttons
  blocks.push({
    type: "actions",
    block_id: "sentinel_ddl_actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "⚡ 1-Click Apply DDL Index",
          emoji: true,
        },
        style: "primary",
        value: ddlAction || "CREATE INDEX CONCURRENTLY idx_sentinel_auto ON users(email);",
        action_id: "apply_zero_downtime_ddl",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "🔕 Mute Alert (1 hr)",
          emoji: true,
        },
        value: "mute_1h",
        action_id: "mute_sentinel_alert",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "📊 Open Console",
          emoji: true,
        },
        url: "https://sentinel.cspec.uk/dashboard",
        action_id: "open_sentinel_console",
      },
    ],
  });

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `Timestamp: ${new Date().toISOString()} | Environment: Production | AWS Account: 616399034957`,
      },
    ],
  });

  return {
    text: `⚠️ [RDS Sentinel Alert] ${alertType} on ${dbName}`,
    blocks,
  };
}

/**
 * Formats PagerDuty Events API v2 payload JSON with custom action links.
 */
export function formatPagerDutyPayload(dbName: string, alertType: string, message: string, ddlAction?: string): object {
  return {
    routing_key: "pd-rds-sentinel-integration-key",
    event_action: "trigger",
    dedup_key: `rds-sentinel-${dbName}-${Date.now()}`,
    payload: {
      summary: `[RDS Sentinel] ${alertType} detected on ${dbName}`,
      source: dbName,
      severity: "error",
      timestamp: new Date().toISOString(),
      component: "database-telemetry",
      group: "aws-rds-monitoring",
      custom_details: {
        alert_type: alertType,
        message: message,
        suggested_ddl: ddlAction || "CREATE INDEX CONCURRENTLY idx_sentinel_auto ON users(email);",
        one_click_remediation_url: "https://sentinel.cspec.uk/api/v1/remediate",
      },
    },
    links: [
      {
        href: "https://sentinel.cspec.uk/dashboard?tab=slow-queries",
        text: "⚡ 1-Click Zero-Downtime DDL Remediation Console",
      },
    ],
  };
}

/**
 * Dispatches simulated webhook alert to target endpoint.
 */
export async function dispatchWebhookAlert(
  target: "slack" | "pagerduty",
  webhookUrl: string,
  dbName: string,
  alertType: string,
  message: string
): Promise<WebhookDispatchResult> {
  // Validate URL endpoint
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return {
      success: false,
      statusCode: 400,
      target,
      deliveredAt: new Date().toISOString(),
      responseMessage: "Invalid webhook URL format. Must start with http:// or https://",
      payloadJson: "{}",
    };
  }

  const payload =
    target === "slack"
      ? formatSlackPayload(dbName, alertType, message)
      : formatPagerDutyPayload(dbName, alertType, message);

  const payloadJson = JSON.stringify(payload, null, 2);

  // Simulate network delivery latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    success: true,
    statusCode: 200,
    target,
    deliveredAt: new Date().toISOString(),
    responseMessage: `HTTP 200 OK — Alert payload successfully delivered to ${target.toUpperCase()} webhook endpoint.`,
    payloadJson,
  };
}
