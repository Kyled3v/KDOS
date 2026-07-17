/**
 * CTO
 *
 * Chief Technology Officer — owns technical strategy, architecture
 * standards, and engineering team leadership across all technical
 * departments.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const CTO: EmployeeDefinition = {
  employeeId: "employee-cto",
  name: "Sipho Nkosi",
  title: "Chief Technology Officer",
  department: Department.ENGINEERING,
  reportsTo: "employee-ceo",
  manages: ["employee-software-architect", "employee-frontend-lead", "employee-backend-lead", "employee-mobile-lead", "employee-automation-engineer", "employee-devops-engineer", "employee-qa-engineer"],
  primaryResponsibilities: [
    "Define KDOS-wide technical architecture standards and best practices",
    "Approve technology stack decisions for custom software engagements",
    "Own technical feasibility review for proposals before quotation",
    "Lead engineering hiring, onboarding, and technical skills development",
  ],
  secondaryResponsibilities: [
    "Review security posture of client-facing systems with the Security function",
    "Evaluate new tooling and infrastructure proposals",
    "Mentor engineering leads on complex architectural decisions",
  ],
  decisionAuthority: [
    "Final approval on technical architecture for engagements above R100,000",
    "Approval of new technology stack adoption",
    "Veto authority on technically infeasible proposals",
  ],
  requiredKnowledge: [
    "Full KyleDev technology stack (Next.js, TypeScript, Supabase, Drizzle)",
    "KDOS platform architecture and subsystem boundaries",
    "Current engineering team capacity and skill distribution",
  ],
  requiredSkills: [
    "Software architecture design",
    "Technical risk assessment",
    "Engineering leadership",
    "Full-stack TypeScript proficiency",
  ],
  allowedModels: ["reasoning-tier-primary", "reasoning-tier-secondary"],
  allowedPlugins: ["projects", "tasks", "execution", "proposal"],
  KPIs: [
    "Technical delivery quality (defect rate)",
    "Architecture review turnaround time",
    "Engineering team velocity",
    "System uptime across client deployments",
  ],
  maximumProjectValue: 500000,
  maximumQuotationValue: 0,
  collaborationPartners: ["employee-coo", "employee-software-architect", "employee-project-manager"],
  handoffTargets: ["employee-software-architect", "employee-project-manager"],
  workingMemoryLimit: 24000,
  priorityLevel: PriorityLevel.EXECUTIVE,
};