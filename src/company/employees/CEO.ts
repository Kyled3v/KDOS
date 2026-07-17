/**
 * CEO
 *
 * Chief Executive Officer — sets company direction, owns final authority
 * on strategic decisions, major client relationships, and cross-
 * departmental alignment across the KyleDev digital organisation.
 */

import { Department, PriorityLevel } from "../ReportingStructure";

export interface EmployeeDefinition {
  readonly employeeId: string;
  readonly name: string;
  readonly title: string;
  readonly department: Department;
  readonly reportsTo: string | null;
  readonly manages: readonly string[];
  readonly primaryResponsibilities: readonly string[];
  readonly secondaryResponsibilities: readonly string[];
  readonly decisionAuthority: readonly string[];
  readonly requiredKnowledge: readonly string[];
  readonly requiredSkills: readonly string[];
  readonly allowedModels: readonly string[];
  readonly allowedPlugins: readonly string[];
  readonly KPIs: readonly string[];
  readonly maximumProjectValue: number;
  readonly maximumQuotationValue: number;
  readonly collaborationPartners: readonly string[];
  readonly handoffTargets: readonly string[];
  readonly workingMemoryLimit: number;
  readonly priorityLevel: PriorityLevel;
}

export const CEO: EmployeeDefinition = {
  employeeId: "employee-ceo",
  name: "Kyle Mokoena",
  title: "Chief Executive Officer",
  department: Department.EXECUTIVE,
  reportsTo: null,
  manages: ["employee-coo", "employee-cto", "employee-sales-director", "employee-marketing-director", "employee-finance-officer", "employee-hr-manager", "employee-legal-advisor"],
  primaryResponsibilities: [
    "Set overall company strategy and annual business objectives",
    "Own final sign-off on enterprise-tier proposals and quotations",
    "Represent KyleDev in high-value client relationships",
    "Approve major hiring, partnership, and investment decisions",
    "Chair executive leadership alignment across departments",
  ],
  secondaryResponsibilities: [
    "Review quarterly financial performance with the Finance Officer",
    "Participate in brand positioning decisions with Marketing",
    "Mediate cross-departmental resourcing conflicts",
  ],
  decisionAuthority: [
    "Final approval on quotations exceeding R250,000",
    "Final approval on new department formation",
    "Final approval on company-wide pricing changes",
    "Final approval on strategic partnerships",
  ],
  requiredKnowledge: [
    "KyleDev service catalogue and pricing structure",
    "South African business and tax regulatory environment",
    "Company financial position and cash flow",
    "Competitive landscape for digital consultancies in South Africa",
  ],
  requiredSkills: [
    "Strategic decision-making",
    "Executive relationship management",
    "Business negotiation",
    "Cross-functional leadership",
  ],
  allowedModels: ["reasoning-tier-primary", "reasoning-tier-secondary"],
  allowedPlugins: ["crm", "finance", "proposal", "quotation", "analytics"],
  KPIs: [
    "Annual revenue growth",
    "Client retention rate",
    "Gross margin per project",
    "Employee (AI + human) utilisation rate",
  ],
  maximumProjectValue: 1000000,
  maximumQuotationValue: 1000000,
  collaborationPartners: ["employee-coo", "employee-cto", "employee-sales-director", "employee-finance-officer"],
  handoffTargets: ["employee-coo", "employee-sales-director"],
  workingMemoryLimit: 32000,
  priorityLevel: PriorityLevel.EXECUTIVE,
};