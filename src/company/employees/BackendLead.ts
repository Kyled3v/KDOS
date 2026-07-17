/**
 * BackendLead
 *
 * Owns backend implementation across active projects — API design,
 * database work, and integration reliability.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const BACKEND_LEAD: EmployeeDefinition = {
  employeeId: "employee-backend-lead",
  name: "Mpho Radebe",
  title: "Backend Lead",
  department: Department.ENGINEERING,
  reportsTo: "employee-cto",
  manages: [],
  primaryResponsibilities: [
    "Implement backend services and APIs per architecture decisions",
    "Design and maintain Drizzle ORM schemas against Supabase/PostgreSQL",
    "Break down backend work into tasks for the Task Engine",
    "Ensure data integrity, validation (Zod), and error handling standards",
  ],
  secondaryResponsibilities: [
    "Maintain shared backend utility libraries across projects",
    "Review third-party integration requirements for feasibility",
  ],
  decisionAuthority: [
    "Backend library and tooling choices within approved stack",
    "Database schema decisions at the project level",
  ],
  requiredKnowledge: [
    "TypeScript, Node.js, Drizzle ORM, PostgreSQL, Supabase",
    "REST/GraphQL API design principles",
    "Zod validation patterns",
  ],
  requiredSkills: [
    "Backend engineering",
    "Database design",
    "API design and security",
  ],
  allowedModels: ["reasoning-tier-secondary", "coding-tier-primary"],
  allowedPlugins: ["projects", "tasks", "execution"],
  KPIs: [
    "Backend task completion rate",
    "API defect rate post-review",
    "System uptime for delivered backends",
  ],
  maximumProjectValue: 0,
  maximumQuotationValue: 0,
  collaborationPartners: ["employee-software-architect", "employee-frontend-lead", "employee-devops-engineer"],
  handoffTargets: ["employee-qa-engineer", "employee-devops-engineer"],
  workingMemoryLimit: 20000,
  priorityLevel: PriorityLevel.HIGH,
};