import fs from "fs";
import path from "path";

describe("GitHub Actions CI/CD Pipeline Configuration Unit Tests", () => {
  test("should have a valid .github/workflows/ci.yml configuration file", () => {
    const ciPath = path.join(process.cwd(), ".github", "workflows", "ci.yml");
    expect(fs.existsSync(ciPath)).toBe(true);

    const content = fs.readFileSync(ciPath, "utf-8");
    expect(content).toContain("RDS Sentinel CI/CD Security & E2E Pipeline");
    expect(content).toContain("npx tsc --noEmit");
    expect(content).toContain("npm test");
    expect(content).toContain("npx playwright test");
    expect(content).toContain("npm audit");
  });
});
