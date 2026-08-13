import { generateUKLegalContracts } from "../ukLegalContracts";

describe("UK Legal Contracts & Corporate Setup Exporter", () => {
  it("should generate legal contract package with company details and markdown files", () => {
    const pkg = generateUKLegalContracts("cSpec Solutions Ltd", "12345678", "ZB-100200");

    expect(pkg.companyName).toBe("cSpec Solutions Ltd");
    expect(pkg.registrationNumber).toBe("12345678");
    expect(pkg.icoRegistrationNumber).toBe("ZB-100200");
    expect(pkg.jurisdiction).toBe("England & Wales");

    expect(pkg.privacyPolicyMarkdown).toContain("GDPR Privacy Policy");
    expect(pkg.privacyPolicyMarkdown).toContain("edge sanitization");
    expect(pkg.eulaMarkdown).toContain("End User License Agreement");
    expect(pkg.termsOfServiceMarkdown).toContain("Terms of Service");
  });
});
