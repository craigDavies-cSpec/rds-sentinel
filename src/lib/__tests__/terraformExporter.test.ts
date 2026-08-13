import { generateTerraformModule } from "../terraformExporter";

describe("terraformExporter module", () => {
  it("should generate valid Terraform HCL files for IAM monitoring role", () => {
    const bundle = generateTerraformModule("987654321098", "my-ext-id-123");
    expect(bundle.mainTf).toContain("resource \"aws_iam_role\" \"rds_sentinel_monitoring_role\"");
    expect(bundle.mainTf).toContain("sts:AssumeRole");
    expect(bundle.variablesTf).toContain("987654321098");
    expect(bundle.variablesTf).toContain("my-ext-id-123");
    expect(bundle.outputsTf).toContain("output \"monitoring_role_arn\"");
  });
});
