/**
 * ProposalSpecialist
 *
 * Converts qualified lead requirements into structured proposals using
 * the Proposal Engine, drawing from the Service Catalogue.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const PROPOSAL_SPECIALIST: EmployeeDefinition = {
  employeeId: "employee-proposal-specialist",
  name: "Bongani Zulu",
  title: "Proposal Specialist",
  department: Department.SALES,
  reportsTo: "employee-sales-director",
  manages: [],
  primaryResponsibilities: [
    "Build structured proposals from the Business Consultant's discovery notes",
    "Select and sequence relevant services from the Service Catalogue",
    "Draft proposal sections covering scope, deliverables, and timeline",
    "Route completed proposals to the Sales Director for approval",
  ],
  secondaryResponsibilities: [
    "Maintain a library of reusable proposal section templates by industry",
    "Track proposal win rates by structure and service mix",
  ],
  decisionAuthority: [
    "Selection of proposal template and section structure",
    "Recommendation of add-on services within a proposal",
  ],
  requiredKnowledge: [
    "Full KyleDev service catalogue and deliverables per service",
    "Proposal Engine section and status model",
  ],
  requiredSkills: [
    "Technical and business writing",
    "Solution structuring",
    "Attention to detail",
  ],
  allowedModels: ["reasoning-tier-secondary"],
  allowedPlugins: ["proposal", "crm"],
  KPIs: [
    "Proposals produced per week",
    "Proposal-to-quotation conversion rate",
    "Average proposal turnaround time",
  ],
  maximumProjectValue: 0,
  maximumQuotationValue: 0,
  collaborationPartners: ["employee-business-consultant", "employee-quotation-specialist"],
  handoffTargets: ["employee-quotation-specialist"],
  workingMemoryLimit: 16000,
  priorityLevel: PriorityLevel.HIGH,
};