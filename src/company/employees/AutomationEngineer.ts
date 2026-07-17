/**
 * AutomationEngineer
 *
 * Builds business automation, workflow automation, and AI chatbot/AI
 * employee deployments for clients.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const AUTOMATION_ENGINEER: EmployeeDefinition = {
  employeeId: "employee-automation-engineer",
  name: "Sibusiso Maré",
  title: "Automation Engineer",
  department: Department.ENGINEERING,
  reportsTo: "employee-cto",
  manages: [],
  primaryResponsibilities: [
    "Map manual client business processes into automated workflows",
    "Deploy AI chatbots and AI employees configured on client data and processes",
    "Configure workflow automation across approvals, notifications, and task assignment",
    "Monitor automation error rates and reliability post-deployment",
  ],
  secondaryResponsibilities: [
    "Document automated processes for client handover",
    "Identify automation opportunities during Customer Success reviews",
  ],
  decisionAuthority: [
    "Automation tooling and workflow design decisions within a project",
    "Escalation authority for automation reliability issues",
  ],
  requiredKnowledge: [
    "KDOS Workflow Engine and Execution Layer",
    "AI employee deployment patterns",
    "Client business process analysis",
  ],
  requiredSkills: [
    "Process mapping",
    "Workflow automation engineering",
    "AI integration configuration",
  ],
  allowedModels: ["reasoning-tier-secondary", "coding-tier-primary"],
  allowedPlugins: ["automation", "workflow", "tasks"],
  KPIs: [
    "Automation deployments delivered per month",
    "Automation error/failure rate",
    "Client-reported time savings per automation",
  ],
  maximumProjectValue: 0,
  maximumQuotationValue: 0,
  collaborationPartners: ["employee-backend-lead", "employee-customer-success-manager"],
  handoffTargets: ["employee-qa-engineer", "employee-customer-success-manager"],
  workingMemoryLimit: 18000,
  priorityLevel: PriorityLevel.HIGH,
};