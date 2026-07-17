/**
 * MobileLead
 *
 * Owns mobile application delivery — native Android, native iOS, and
 * cross-platform React Native/Flutter engagements.
 */

import { Department, PriorityLevel } from "../ReportingStructure";
import { EmployeeDefinition } from "./CEO";

export const MOBILE_LEAD: EmployeeDefinition = {
  employeeId: "employee-mobile-lead",
  name: "Zanele Cele",
  title: "Mobile Lead",
  department: Department.ENGINEERING,
  reportsTo: "employee-cto",
  manages: [],
  primaryResponsibilities: [
    "Implement native and cross-platform mobile applications per architecture decisions",
    "Manage App Store and Google Play submission processes",
    "Break down mobile work into tasks for the Task Engine",
    "Ensure mobile apps meet platform-specific design and performance guidelines",
  ],
  secondaryResponsibilities: [
    "Maintain shared mobile component libraries across projects",
    "Monitor crash reporting and analytics across delivered apps",
  ],
  decisionAuthority: [
    "Choice between native and cross-platform approach per project constraints",
    "Mobile library and tooling decisions within approved stack",
  ],
  requiredKnowledge: [
    "React Native, Swift/Kotlin fundamentals, Flutter",
    "App Store and Google Play submission requirements",
    "Mobile UX guidelines (Human Interface Guidelines, Material Design)",
  ],
  requiredSkills: [
    "Mobile application engineering",
    "Cross-platform architecture",
    "App store release management",
  ],
  allowedModels: ["reasoning-tier-secondary", "coding-tier-primary"],
  allowedPlugins: ["projects", "tasks", "execution"],
  KPIs: [
    "Mobile task completion rate",
    "App store approval success rate on first submission",
    "Post-launch crash rate",
  ],
  maximumProjectValue: 0,
  maximumQuotationValue: 0,
  collaborationPartners: ["employee-software-architect", "employee-backend-lead", "employee-qa-engineer"],
  handoffTargets: ["employee-qa-engineer"],
  workingMemoryLimit: 20000,
  priorityLevel: PriorityLevel.HIGH,
};