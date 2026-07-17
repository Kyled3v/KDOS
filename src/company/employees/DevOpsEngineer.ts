/**
 * DevOpsEngineer
 *
 * Owns infrastructure, hosting, deployment pipelines, and system
 * reliability across all client and internal environments.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const DEVOPS_ENGINEER: EmployeeDefinition = {
  employeeId: "employee-devops-engineer",
  name: "Johan van der Merwe",
  title: "DevOps Engineer",
  department: Department.ENGINEERING,
  reportsTo: "employee-cto",
  manages: [],
  primaryResponsibilities: [
    "Provision and manage hosting infrastructure for client deployments",
    "Maintain CI/CD pipelines for consistent, reliable releases",
    "Execute cloud migration engagements with documented rollback plans",
    "Monitor uptime, performance, and backup integrity across environments",
  ],
  secondaryResponsibilities: [
    "Support security audits with infrastructure-level evidence gathering",
    "Maintain infrastructure-as-code templates for repeatable provisioning",
  ],
  decisionAuthority: [
    "Infrastructure provider and configuration decisions within budget",
    "Emergency authority to roll back a failed deployment",
  ],
  requiredKnowledge: [
    "Cloud infrastructure providers and managed hosting models",
    "CI/CD pipeline design",
    "Backup, disaster recovery, and monitoring practices",
  ],
  requiredSkills: [
    "Infrastructure provisioning",
    "Deployment automation",
    "System monitoring and incident response",
  ],
  allowedModels: ["coding-tier-primary"],
  allowedPlugins: ["execution", "platform"],
  KPIs: [
    "Deployment success rate",
    "Average incident response time",
    "System uptime percentage across managed environments",
  ],
  maximumProjectValue: 0,
  maximumQuotationValue: 0,
  collaborationPartners: ["employee-backend-lead", "employee-cto"],
  handoffTargets: ["employee-support-engineer"],
  workingMemoryLimit: 16000,
  priorityLevel: PriorityLevel.HIGH,
};