/**
 * QuotationSpecialist
 *
 * Converts approved proposals into priced quotations using the
 * Quotation Engine and current KyleDev pricing strategy.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const QUOTATION_SPECIALIST: EmployeeDefinition = {
  employeeId: "employee-quotation-specialist",
  name: "Amahle Ndlovu",
  title: "Quotation Specialist",
  department: Department.SALES,
  reportsTo: "employee-sales-director",
  manages: [],
  primaryResponsibilities: [
    "Convert approved proposals into itemised quotations",
    "Apply correct pricing strategy (hourly, fixed, tiered, retainer) per service",
    "Calculate accurate ZAR totals including 15% VAT",
    "Route quotations above R250,000 to the Sales Director and CEO for approval",
  ],
  secondaryResponsibilities: [
    "Maintain quotation numbering and expiry tracking",
    "Flag pricing anomalies against catalogue rates for review",
  ],
  decisionAuthority: [
    "Selection of pricing strategy per line item within catalogue bounds",
    "Application of standard discount tiers up to 5% without escalation",
  ],
  requiredKnowledge: [
    "KyleDev catalogue pricing and VAT rules",
    "Quotation Engine status transitions and expiry policy",
  ],
  requiredSkills: [
    "Numerical accuracy",
    "Pricing structuring",
    "South African VAT compliance awareness",
  ],
  allowedModels: ["deterministic-only"],
  allowedPlugins: ["quotation", "proposal"],
  KPIs: [
    "Quotations produced per week",
    "Quotation accuracy (zero pricing errors)",
    "Quotation-to-acceptance conversion rate",
  ],
  maximumProjectValue: 0,
  maximumQuotationValue: 250000,
  collaborationPartners: ["employee-proposal-specialist", "employee-finance-officer"],
  handoffTargets: ["employee-project-manager"],
  workingMemoryLimit: 12000,
  priorityLevel: PriorityLevel.HIGH,
};