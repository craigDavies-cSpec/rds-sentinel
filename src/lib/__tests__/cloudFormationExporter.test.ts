import {
  generateCloudFormationRoleTemplate,
  generateServiceCatalogBlueprint,
} from "../cloudFormationExporter";

describe("cloudFormationExporter module", () => {
  it("should generate valid CloudFormation YAML containing specified ExternalId", () => {
    const template = generateCloudFormationRoleTemplate({ externalId: "ext-custom-777" });
    expect(template).toContain("AWSTemplateFormatVersion: '2010-09-09'");
    expect(template).toContain("ext-custom-777");
    expect(template).toContain("RDSSentinelRole");
    expect(template).toContain("rds:DescribeDBInstances");
  });

  it("should generate valid Service Catalog JSON blueprint", () => {
    const blueprint = generateServiceCatalogBlueprint();
    const parsed = JSON.parse(blueprint);
    expect(parsed.SchemaVersion).toBe("1.0");
    expect(parsed.Product.Name).toBe("RDS Sentinel Performance & Cost Optimizer");
  });
});
