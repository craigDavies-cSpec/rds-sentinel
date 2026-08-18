import { exportAceLeadsToCsv, MOCK_ACE_LEADS } from "../aceLeadExporter";

describe("APN ACE Lead Qualification Exporter", () => {
  it("should format lead opportunities into valid CSV schema headers", () => {
    const csv = exportAceLeadsToCsv(MOCK_ACE_LEADS);
    expect(csv).toContain("AWS_ACE_Opportunity_ID");
    expect(csv).toContain("Customer_Company_Name");
    expect(csv).toContain("Est_Monthly_AWS_RDS_Spend_USD");
    expect(csv).toContain("AWS_EDP_Commitment_Status");
  });

  it("should correctly escape quotes and include customer lead data", () => {
    const csv = exportAceLeadsToCsv(MOCK_ACE_LEADS);
    expect(csv).toContain("Acme Financial Services");
    expect(csv).toContain("ACTIVE_EDP");
    expect(csv).toContain("14500");
  });
});
