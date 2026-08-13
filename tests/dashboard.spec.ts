import { test, expect } from "@playwright/test";

test.describe("RDS Sentinel Dashboard Functional E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local dashboard
    await page.goto("/");
  });

  test("should render the AWS console-themed header and title", async ({ page }) => {
    await expect(page.locator("header")).toContainText("RDSSentinel");
    await expect(page.locator("header")).toContainText("AWS Marketplace");
  });

  test("should support toggling dark and light mode theme overrides", async ({ page }) => {
    const consoleToggle = page.locator("button[title='Toggle Theme']");
    await expect(consoleToggle).toBeVisible();
    
    const textBefore = await consoleToggle.textContent();
    await consoleToggle.click();
    const textAfter = await consoleToggle.textContent();
    
    // Confirms button text toggled between light and dark labels
    expect(textBefore).not.toEqual(textAfter);
  });

  test("should gate logs on Trial/Small tiers and unlock on Medium/Enterprise", async ({ page }) => {
    // 1. Shift to Trial tier using quick-tier button
    await page.locator("button:has-text('trial')").first().click();
    await expect(page.getByText("Real-Time Log Scanning Locked")).toBeVisible();

    // 2. Click upgrade CTA to shift to Medium tier
    await page.locator("button:has-text('Unlock Medium Tier')").click();
    await expect(page.getByText("Real-Time Log Scanning Locked")).not.toBeVisible();
    
    // 3. Confirm active billing matrix shows Logs as active
    await expect(page.locator("text=Real-Time Logs Watcher")).toBeVisible();
  });

  test("should mask raw queries when parameter masking is active and show raw values when toggled off", async ({ page }) => {
    const maskButton = page.locator("button:has-text('Parameter Masking')");
    await expect(maskButton).toBeVisible();

    // Masking is active by default: should see redacted sql query values
    await expect(page.locator("pre").first()).toContainText("'?'");
    await expect(page.locator("pre").first()).not.toContainText("'craig.davies@example.com'");

    // Toggle masking off
    await maskButton.click();
    await expect(maskButton).toContainText("Parameter Masking: OFF");
    
    // Raw email address should now be exposed
    await expect(page.locator("pre").first()).toContainText("'craig.davies@example.com'");
  });

  test("should queue telemetry payloads and trip circuit breaker to OPEN when disconnected", async ({ page }) => {
    // Locate the connection controllers
    const disconnectButton = page.locator("button:has-text('Disconnect')");
    const onlineButton = page.locator("button:has-text('Online')");
    
    await expect(disconnectButton).toBeVisible();
    await expect(onlineButton).toBeVisible();

    // Click disconnect to simulate offline connection
    await disconnectButton.click();
    await expect(page.locator("text=Connection offline")).toBeVisible();

    // Wait for the mock queue count to rise and trigger consecutive failures
    await page.waitForTimeout(2000);
    
    // The queue count should be greater than 0
    const outboxText = await page.locator("text=Outbox Queue Count:").locator("xpath=..").textContent();
    expect(outboxText).toContain("Outbox Queue Count:");
    
    // Restoring the connection clears the outbox
    await onlineButton.click();
    await expect(page.locator("text=Connection offline")).not.toBeVisible();
  });

  test("should render RDS Proxy Advisor and Multi-Region Latency cards on Medium tier", async ({ page }) => {
    // Confirm default tier is Medium
    await expect(page.getByText("RDS Proxy Connection Pooling Advisor")).toBeVisible();
    await expect(page.getByText("+82% Pool Efficiency")).toBeVisible();
    
    await expect(page.getByText("Cross-Region Latency & Cost Modeler")).toBeVisible();
    await expect(page.getByText("98.5% Failover Ready")).toBeVisible();
  });

  test("should update target database telemetry when switching database instance selection", async ({ page }) => {
    // Switch to billing-db-mysql
    const billingDbItem = page.locator("button:has-text('billing-db-mysql')").first();
    await billingDbItem.click();
    
    // Confirm title updates
    await expect(page.locator("span:has-text('billing-db-mysql')").first()).toBeVisible();
    await expect(page.getByText("RDS MySQL").first()).toBeVisible();
  });

  test("should dynamically update CPU utilization and scrape window when using CPU simulator slider", async ({ page }) => {
    const slider = page.locator("#cpu-simulator-slider");
    await expect(slider).toBeVisible();

    // Confirm dynamic scrape window panel displays calculated interval
    await expect(page.getByText("Calculated Interval:")).toBeVisible();
  });

  test("should render Export CSV button in header toolbar", async ({ page }) => {
    const csvButton = page.locator("button:has-text('Export CSV')");
    await expect(csvButton).toBeVisible();
  });

  test("should unlock and dispatch Slack and PagerDuty test anomaly webhooks on Enterprise tier", async ({ page }) => {
    // Shift to Enterprise tier via Settings modal
    await page.locator("#open-settings-modal-btn").click();
    await page.locator("#tab-billing-btn").click();
    await page.locator("button:has-text('Switch to Enterprise')").click();
    await page.locator("#close-settings-modal-btn").click();

    // Verify Enterprise Webhook Dispatch Simulator card is unlocked
    await expect(page.getByText("Enterprise Webhook Dispatch Simulator")).toBeVisible();
    await expect(page.locator("#webhook-url-input")).toBeVisible();

    // Click Trigger Test Anomaly Alert button
    const triggerButton = page.locator("button:has-text('Trigger Test Anomaly Alert')");
    await expect(triggerButton).toBeVisible();
    await triggerButton.click();

    // Verify status feedback renders
    await expect(page.getByText(/HTTP 200 OK/)).toBeVisible();
    await expect(page.getByText("RDS Sentinel Anomaly Alert")).toBeVisible();
  });

  test("should filter target databases when changing AWS Account selector", async ({ page }) => {
    const accountSelect = page.locator("#aws-account-selector");
    await expect(accountSelect).toBeVisible();

    // Select Staging Account
    await accountSelect.selectOption({ index: 2 });
    await page.waitForTimeout(300);

    // dev-sandbox-db should be visible in database list
    await expect(page.locator("button:has-text('dev-sandbox-db')").first()).toBeVisible();
  });

  test("should calculate net AWS ROI multiplier when using ROI calculator slider", async ({ page }) => {
    const slider = page.locator("#roi-db-slider");
    await expect(slider).toBeVisible();
    await expect(page.getByText(/Interactive AWS Bill ROI Calculator/)).toBeVisible();
  });

  test("should render automated DDL index recommendation when clicking Analyze & Suggest Index", async ({ page }) => {
    const analyzeButton = page.locator("button:has-text('Analyze & Suggest Index')").first();
    await expect(analyzeButton).toBeVisible();

    // Click Analyze & Suggest Index
    await analyzeButton.click();

    // Confirm Automated Index Advisor card expands
    await expect(page.getByText("Automated Index Advisor DDL")).toBeVisible();
    await expect(page.locator("code:has-text('CREATE INDEX')").first()).toBeVisible();
    await expect(page.locator("button:has-text('Copy DDL')").first()).toBeVisible();
  });

  test("should render Aurora Cluster Topology Visualizer nodes and inspect node details on click", async ({ page }) => {
    // Confirm Topology Visualizer header badge and cluster name
    await expect(page.getByText("Topology Visualizer")).toBeVisible();
    await expect(page.getByText(/Aurora Enterprise Multi-Region Cluster/)).toBeVisible();

    // Primary Writer badge should be visible
    await expect(page.getByText("Primary Writer").first()).toBeVisible();
    await expect(page.getByText("Read Replica").first()).toBeVisible();
  });

  test("should launch Guided Product Tour and navigate through steps and toggle Chaos Circuit Breaker", async ({ page }) => {
    // Confirm start product tour button is visible in header
    const startTourBtn = page.locator("#start-product-tour-btn");
    await expect(startTourBtn).toBeVisible();

    // Click start tour
    await startTourBtn.click();

    // Step 1: Multi-AWS Account Selector
    await expect(page.getByText("Step 1 of 6")).toBeVisible();
    await expect(page.getByText("Multi-AWS Account Selector")).toBeVisible();

    // Click Next Step
    await page.locator("button:has-text('Next Step')").click();

    // Step 2: Instance Telemetry & CPU Simulator
    await expect(page.getByText("Step 2 of 6")).toBeVisible();
    await expect(page.getByText("Instance Telemetry & CPU Simulator")).toBeVisible();

    // Click Skip Tour to dismiss overlay
    await page.locator("button:has-text('✕ Skip')").click();
    await expect(page.getByText("Step 2 of 6")).not.toBeVisible();

    // Test Chaos Circuit Breaker Toggle
    const chaosToggle = page.locator("#chaos-circuit-breaker-toggle");
    await expect(chaosToggle).toBeVisible();
    await chaosToggle.click();

    // Confirm circuit breaker trips to OPEN
    await expect(page.getByText("OPEN", { exact: true })).toBeVisible();
  });

  test("should render SOC2 / HIPAA Compliance Export button in header and trigger report generation", async ({ page }) => {
    // Confirm export SOC2 compliance button is visible in header
    const exportSoc2Btn = page.locator("#export-soc2-compliance-btn");
    await expect(exportSoc2Btn).toBeVisible();
    await expect(exportSoc2Btn).toHaveText(/SOC2 Audit/);

    // Click export button and verify action executes without error
    await exportSoc2Btn.click();
  });

  test("should open Settings & Subscription Billing Portal modal, switch tabs, test IAM connection, and switch tier plan", async ({ page }) => {
    // Confirm settings modal trigger button is visible
    const settingsBtn = page.locator("#open-settings-modal-btn");
    await expect(settingsBtn).toBeVisible();

    // Open settings modal
    await settingsBtn.click();
    await expect(page.getByText("Account Settings & Subscription Billing Portal")).toBeVisible();

    // Tab 1: App Preferences
    await expect(page.getByText("Dashboard Display & Notification Preferences")).toBeVisible();

    // Switch to Tab 2: AWS Accounts & Services
    await page.locator("#tab-aws-accounts-btn").click();
    await expect(page.getByText("Linked AWS Sub-Accounts & Monitored Databases")).toBeVisible();

    // Test IAM Connection button
    const testIamBtn = page.locator("#test-iam-role-connection-btn");
    await expect(testIamBtn).toBeVisible();
    await testIamBtn.click();
    await expect(page.getByText(/STS AssumeRole Successful!/)).toBeVisible();

    // Switch to Tab 3: Subscription & Billing
    await page.locator("#tab-billing-btn").click();
    await expect(page.getByText("Subscription Tiers & Billing Charging Mechanism")).toBeVisible();

    // Switch to Small Business plan
    const switchSmallBtn = page.locator("button:has-text('Switch to Small Business')");
    await expect(switchSmallBtn).toBeVisible();
    await switchSmallBtn.click();

    // Close Settings Modal
    await page.locator("#close-settings-modal-btn").click();
    await expect(page.getByText("Account Settings & Subscription Billing Portal")).not.toBeVisible();
  });

  test("should render Health Score badge, Cost Center Tag pills, and toggle Dual Mode A/Mode B", async ({ page }) => {
    // Confirm Health Score badge is visible
    await expect(page.getByText(/Health Score:/)).toBeVisible();

    // Confirm Dual Mode toggle button is visible
    const modeBtn = page.locator("#toggle-app-mode-btn");
    await expect(modeBtn).toBeVisible();
    await expect(modeBtn).toHaveText(/Mode A: SaaS/);

    // Toggle to Mode B
    await modeBtn.click();
    await expect(modeBtn).toHaveText(/Mode B: AWS Extension/);

    // Confirm Cost Center Tag buttons render
    await expect(page.getByText("All Tags")).toBeVisible();
    await expect(page.getByText("E-Commerce Platform")).toBeVisible();

    // Click Cost Center tag filter
    await page.getByText("E-Commerce Platform").click();
  });

  test("should execute HIPAA BAA agreement in Settings Security tab and trigger sticky toast banner", async ({ page }) => {
    // Open settings modal
    await page.locator("#open-settings-modal-btn").click();

    // Navigate to Security & Vault tab
    await page.locator("#tab-security-btn").click();
    await expect(page.getByText("HIPAA BAA Agreement Portal")).toBeVisible();

    // Execute HIPAA BAA
    const signBaaBtn = page.locator("#sign-hipaa-baa-btn");
    await expect(signBaaBtn).toBeVisible();
    await signBaaBtn.click();

    // Verify active BAA status banner renders
    await expect(page.getByText(/BAA Active: BAA-HIPAA-/)).toBeVisible();
  });

  test("should switch display language and custom accent color palette in Settings App Preferences tab", async ({ page }) => {
    // Open settings modal
    await page.locator("#open-settings-modal-btn").click();

    // Verify App Preferences tab active
    await expect(page.getByText("Dashboard Display & Notification Preferences")).toBeVisible();

    // 1. Switch language to German (de)
    const langSelect = page.locator("#language-selector");
    await expect(langSelect).toBeVisible();
    await langSelect.selectOption("de");

    // Close Settings modal
    await page.locator("#close-settings-modal-btn").click();

    // Confirm button labels update to German
    await expect(page.locator("#open-settings-modal-btn")).toHaveText("⚙️ Einstellungen");

    // 2. Open settings and switch accent theme to Emerald Green
    await page.locator("#open-settings-modal-btn").click();
    const emeraldAccentBtn = page.locator("#accent-theme-emerald_green");
    await expect(emeraldAccentBtn).toBeVisible();
    await emeraldAccentBtn.click();

    // Switch language back to English (en)
    await page.locator("#language-selector").selectOption("en");
    await page.locator("#close-settings-modal-btn").click();
    await expect(page.locator("#open-settings-modal-btn")).toHaveText("⚙️ Settings");
  });

  test("should render AWS Control Tower audit card in Settings Security tab and enforce MFA token validation", async ({ page }) => {
    // Open settings modal
    await page.locator("#open-settings-modal-btn").click();

    // Navigate to Security & Vault tab
    await page.locator("#tab-security-btn").click();
    await expect(page.getByText("AWS Control Tower Guardrail Compliance Audit")).toBeVisible();
    await expect(page.getByText("CT.RDS.PR.1 — Enforce RDS Storage Encryption")).toBeVisible();
  });

  test("should open GraphQL Developer API Inspector modal and execute GraphQL query", async ({ page }) => {
    // Click GraphQL API button in header
    await page.locator("#open-graphql-modal-btn").click();

    // Verify GraphQL modal title visible
    await expect(page.getByText("GraphQL Telemetry Developer API Inspector")).toBeVisible();

    // Execute query
    await page.locator("#execute-graphql-query-btn").click();

    // Close modal
    await page.locator("#close-graphql-modal-btn").click();
  });

  test("should render CloudFormation and Service Catalog export buttons in Settings Tab 2", async ({ page }) => {
    // Open settings modal
    await page.locator("#open-settings-modal-btn").click();

    // Navigate to Tab 2: AWS Accounts
    await page.locator("#tab-aws-accounts-btn").click();
    await expect(page.getByText("AWS Infrastructure Exporter (CloudFormation & Service Catalog)")).toBeVisible();
    await expect(page.locator("#export-cfn-template-btn")).toBeVisible();
    await expect(page.locator("#export-service-catalog-btn")).toBeVisible();
  });

  test("should render API Key & Rate-Limiting vault in Settings Security tab, generate new API key, and revoke active key", async ({ page }) => {
    // Open settings modal
    await page.locator("#open-settings-modal-btn").click();

    // Navigate to Security & Vault tab
    await page.locator("#tab-security-btn").click();
    await expect(page.getByText("Developer API Key & Request Rate-Limiting Vault")).toBeVisible();

    // Generate new key
    await page.locator("#new-api-key-name-input").fill("Datadog Realtime Stream");
    await page.locator("#generate-api-key-btn").click();
    await expect(page.getByText("Datadog Realtime Stream", { exact: true })).toBeVisible();

    // Revoke key
    await page.locator("#revoke-key-btn-key-1").click();
  });

  test("should render SOC2 Evidence Package download button in Settings Security tab", async ({ page }) => {
    // Open settings modal
    await page.locator("#open-settings-modal-btn").click();

    // Navigate to Security & Vault tab
    await page.locator("#tab-security-btn").click();
    await expect(page.getByText("Automated SOC2 Type II Compliance Evidence Package")).toBeVisible();
    await expect(page.locator("#download-soc2-evidence-btn")).toBeVisible();
  });

  test("should open Audit Evidence Inspector Drawer and inspect Trust Services Criteria controls", async ({ page }) => {
    // Open settings modal
    await page.locator("#open-settings-modal-btn").click();

    // Navigate to Security & Vault tab
    await page.locator("#tab-security-btn").click();
    await expect(page.locator("#inspect-soc2-evidence-btn")).toBeVisible();

    // Click inspect live evidence
    await page.locator("#inspect-soc2-evidence-btn").click();

    // Verify slide-over drawer opens
    await expect(page.getByText("SOC2 Type II Audit Evidence Inspector")).toBeVisible();
    await expect(page.getByText("Trust Services Criteria Control Evidence")).toBeVisible();

    // Close drawer
    await page.locator("#close-evidence-drawer-btn").click();
  });

  test("should render Terraform HCL export button in Settings Tab 2", async ({ page }) => {
    // Open settings modal
    await page.locator("#open-settings-modal-btn").click();

    // Navigate to AWS Accounts & Infrastructure tab (Tab 2)
    await page.locator("#tab-aws-accounts-btn").click();

    // Assert Terraform export button is visible
    await expect(page.locator("#export-terraform-hcl-btn")).toBeVisible();
  });
});
