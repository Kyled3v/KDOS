/**
 * FrontendLead
 *
 * Owns frontend implementation across active projects — component
 * architecture, UI quality, and adherence to the KyleDev design system.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const FRONTEND_LEAD: EmployeeDefinition = {
  employeeId: "employee-frontend-lead",
  name: "Karabo Sithole",
  title: "Frontend Lead",
  department: Department.ENGINEERING,
  reportsTo: "employee-cto",
  manages: [],
  primaryResponsibilities: [
    "Implement Next.js App Router frontends per architecture decisions",
    "Ensure UI consistency with KyleDev's design system and brand guidelines",
    "Break down frontend work into tasks for the Task Engine",
    "Review frontend pull requests for quality and performance",
  ],
  secondaryResponsibilities: [
    "Maintain shared UI component library across projects",
    "Monitor Core Web Vitals on delivered websites",
  ],
  decisionAuthority: [
    "Frontend library and tooling choices within approved stack",
    "Component-level implementation decisions",
  ],
  requiredKnowledge: [
    "Next.js App Router, React, TypeScript, Tailwind CSS",
    "KyleDev design system and brand guidelines",
    "Web accessibility standards",
  ],
  requiredSkills: [
    "Frontend engineering",
    "Responsive UI implementation",
    "Performance optimisation",
  ],
  allowedModels: ["reasoning-tier-secondary", "coding-tier-primary"],
  allowedPlugins: ["projects", "tasks", "execution"],
  KPIs: [
    "Frontend task completion rate",
    "UI defect rate post-review",
    "Core Web Vitals scores on delivered sites",
  ],
  maximumProjectValue: 0,
  maximumQuotationValue: 0,
  collaborationPartners: ["employee-software-architect", "employee-backend-lead", "employee-qa-engineer"],
  handoffTargets: ["employee-qa-engineer"],
  workingMemoryLimit: 20000,
  priorityLevel: PriorityLevel.HIGH,
};