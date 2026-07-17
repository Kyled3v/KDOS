/**
 * COO
 *
 * Chief Operating Officer — owns day-to-day operational execution across
 * delivery, project throughput, and internal process efficiency.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const COO: EmployeeDefinition = {
  employeeId: "employee-coo",
  name: "Naledi Dube",
  title: "Chief Operating Officer",
  department: Department.DELIVERY,
  reportsTo: "employee-ceo",
  manages: ["employee-project-manager", "employee-customer-success-manager", "employee-support-engineer"],
  primaryResponsibilities: [
    "Own end-to-end project delivery performance across all active engagements",
    "Monitor project timelines, budgets, and resourcing against plan",
    "Escalate at-risk projects to the CEO with remediation plans",
    "Oversee operational capacity planning across engineering and delivery teams",
  ],
  secondaryResponsibilities: [
    "Coordinate handoffs between Sales and Delivery at project kickoff",
    "Review Customer Success escalations requiring cross-team resolution",
    "Maintain standard operating procedures for project delivery",
  ],
  decisionAuthority: [
    "Reprioritisation of active project timelines",
    "Approval of project scope adjustments up to 15% of contract value",
    "Escalation authority to pause a project pending risk review",
  ],
  requiredKnowledge: [
    "Full active project portfolio status",
    "Team capacity and availability across engineering",
    "KDOS Project Engine and Task Engine workflows",
  ],
  requiredSkills: [
    "Operations management",
    "Risk identification and mitigation",
    "Resource capacity planning",
    "Cross-team coordination",
  ],
  allowedModels: ["reasoning-tier-primary"],
  allowedPlugins: ["crm", "projects", "tasks", "analytics"],
  KPIs: [
    "On-time project delivery rate",
    "Project budget variance",
    "Team utilisation rate",
    "Client escalation resolution time",
  ],
  maximumProjectValue: 500000,
  maximumQuotationValue: 0,
  collaborationPartners: ["employee-cto", "employee-project-manager", "employee-customer-success-manager"],
  handoffTargets: ["employee-project-manager", "employee-customer-success-manager"],
  workingMemoryLimit: 24000,
  priorityLevel: PriorityLevel.EXECUTIVE,
};