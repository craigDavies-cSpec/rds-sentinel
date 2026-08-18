/**
 * APN ACE (AWS Partner Network Customer Engagement) Lead Qualification Exporter
 * Formats lead opportunities into official AWS Partner Central ACE CSV schema
 * for 1-click submission to AWS field sales reps and co-selling quota alignment.
 */

export interface AceLeadOpportunity {
  id: string;
  customerName: string;
  awsAccountId?: string;
  contactEmail: string;
  targetRdsEngines: string[];
  estimatedMonthlyAwsSpend: number;
  edpCommitmentStatus: "ACTIVE_EDP" | "STANDARD_PAYG" | "UNKNOWN";
  projectTimeline: "IMMEDIATE" | "1_TO_3_MONTHS" | "EXPLORATORY";
  notes?: string;
  createdDate: string;
}

export const MOCK_ACE_LEADS: AceLeadOpportunity[] = [
  {
    id: "ace-lead-001",
    customerName: "Acme Financial Services",
    awsAccountId: "123456789012",
    contactEmail: "cloud-ops@acme-fin.com",
    targetRdsEngines: ["Aurora PostgreSQL", "RDS MySQL"],
    estimatedMonthlyAwsSpend: 14500,
    edpCommitmentStatus: "ACTIVE_EDP",
    projectTimeline: "IMMEDIATE",
    notes: "Requires zero-PII SQL parameter masking and 40% IOPS cost reduction",
    createdDate: new Date().toISOString(),
  },
  {
    id: "ace-lead-002",
    customerName: "Global E-Commerce Logistics Ltd",
    awsAccountId: "987654321098",
    contactEmail: "finops-lead@global-logistics.co.uk",
    targetRdsEngines: ["Aurora MySQL", "RDS PostgreSQL"],
    estimatedMonthlyAwsSpend: 32000,
    edpCommitmentStatus: "ACTIVE_EDP",
    projectTimeline: "1_TO_3_MONTHS",
    notes: "Enterprise EDP commitment spend-down drawdown target",
    createdDate: new Date().toISOString(),
  },
];

/**
 * Converts ACE Lead Opportunities into official AWS Partner Central ACE CSV schema
 */
export function exportAceLeadsToCsv(leads: AceLeadOpportunity[] = MOCK_ACE_LEADS): string {
  const headers = [
    "AWS_ACE_Opportunity_ID",
    "Customer_Company_Name",
    "Target_AWS_Account_ID",
    "Primary_Contact_Email",
    "Monitored_RDS_Engines",
    "Est_Monthly_AWS_RDS_Spend_USD",
    "AWS_EDP_Commitment_Status",
    "Target_Deployment_Timeline",
    "ISV_Partner_Solution",
    "Notes_And_Use_Case",
    "Lead_Created_Timestamp",
  ];

  const rows = leads.map((lead) => [
    `"${lead.id}"`,
    `"${lead.customerName.replace(/"/g, '""')}"`,
    `"${lead.awsAccountId || "N/A"}"`,
    `"${lead.contactEmail}"`,
    `"${lead.targetRdsEngines.join("; ")}"`,
    lead.estimatedMonthlyAwsSpend.toString(),
    `"${lead.edpCommitmentStatus}"`,
    `"${lead.projectTimeline}"`,
    `"RDS Sentinel v2.0 Enterprise"`,
    `"${(lead.notes || "").replace(/"/g, '""')}"`,
    `"${lead.createdDate}"`,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

/**
 * Triggers a browser file download of the ACE Opportunity CSV package
 */
export function downloadAceLeadCsvPackage(leads: AceLeadOpportunity[] = MOCK_ACE_LEADS): void {
  const csvContent = exportAceLeadsToCsv(leads);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `APN_ACE_Opportunity_Pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
