import { randomUUID } from "crypto";
import { EmployeeDepartment, EmployeeRole } from "../workforce/types/Employee";
import type { BusinessObjective, ObjectiveCategory, ObjectivePriority } from "./ObjectiveClassifier";

/**
 * A single executable business work unit produced by the
 * TaskBreakdownEngine. Every PlannedUnit has exactly one owning
 * department and one owning role — never more than one of either.
 */
export interface PlannedUnit {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly department: EmployeeDepartment;
  readonly role: EmployeeRole;
  readonly priority: ObjectivePriority;
  readonly estimatedHours: number;
  readonly dependencies: string[];
  readonly deliverables: string[];
  readonly parallelExecution: boolean;
}

/**
 * The skill category a work-unit template requires, used to resolve
 * the single department and single role that will own it. This is an
 * internal concept of the TaskBreakdownEngine — it exists only to
 * keep the department/role assignment logic in one place rather than
 * repeated across every template.
 */
type SkillTag =
  | "RESEARCH"
  | "ENGINEERING"
  | "DESIGN"
  | "MARKETING"
  | "SALES"
  | "OUTREACH"
  | "FINANCE"
  | "SUPPORT"
  | "COORDINATION";

/**
 * A template for a single step within a work-breakdown sequence,
 * prior to identity assignment and dependency resolution into a
 * formal PlannedUnit. dependsOn references other steps by their index
 * within the same template array.
 */
interface StepTemplate {
  readonly title: string;
  readonly description: string;
  readonly skill: SkillTag;
  readonly estimatedHours: number;
  readonly deliverables: readonly string[];
  readonly dependsOn: readonly number[];
  readonly parallel: boolean;
}

/**
 * Resolves each skill tag to the single department and single role
 * that owns work of that kind.
 */
const SKILL_OWNERSHIP: Readonly<Record<SkillTag, readonly [EmployeeDepartment, EmployeeRole]>> = {
  RESEARCH: [EmployeeDepartment.RESEARCH, EmployeeRole.RESEARCHER],
  ENGINEERING: [EmployeeDepartment.ENGINEERING, EmployeeRole.SOFTWARE_ENGINEER],
  DESIGN: [EmployeeDepartment.PRODUCT, EmployeeRole.SOFTWARE_ENGINEER],
  MARKETING: [EmployeeDepartment.MARKETING, EmployeeRole.MARKETING_STRATEGIST],
  SALES: [EmployeeDepartment.SALES, EmployeeRole.SALES_REPRESENTATIVE],
  OUTREACH: [EmployeeDepartment.SALES, EmployeeRole.OUTREACH_SPECIALIST],
  FINANCE: [EmployeeDepartment.FINANCE, EmployeeRole.FINANCIAL_ANALYST],
  SUPPORT: [EmployeeDepartment.SUPPORT, EmployeeRole.SUPPORT_AGENT],
  COORDINATION: [EmployeeDepartment.PRODUCT, EmployeeRole.PROJECT_MANAGER],
};

/**
 * The full ten-step breakdown for a Website objective, matching the
 * canonical KDOS example exactly: Research Business, Information
 * Architecture, UI Design, Frontend Development, Backend Development,
 * Authentication, Dashboard, Testing, Deployment, Documentation.
 * Backend Development and Documentation are marked to run in parallel
 * with the frontend/testing path where their dependencies allow it.
 */
const WEBSITE_TEMPLATE: readonly StepTemplate[] = [
  {
    title: "Research Business",
    description: "Research the target market, competitors, and business context.",
    skill: "RESEARCH",
    estimatedHours: 16,
    deliverables: ["Business research summary"],
    dependsOn: [],
    parallel: false,
  },
  {
    title: "Information Architecture",
    description: "Define the site structure, navigation, and content hierarchy.",
    skill: "ENGINEERING",
    estimatedHours: 8,
    deliverables: ["Sitemap", "Content hierarchy"],
    dependsOn: [0],
    parallel: false,
  },
  {
    title: "UI Design",
    description: "Design the visual interface and user experience for the site.",
    skill: "DESIGN",
    estimatedHours: 24,
    deliverables: ["UI design mockups"],
    dependsOn: [1],
    parallel: false,
  },
  {
    title: "Frontend Development",
    description: "Implement the frontend according to the UI design.",
    skill: "ENGINEERING",
    estimatedHours: 40,
    deliverables: ["Frontend implementation"],
    dependsOn: [2],
    parallel: false,
  },
  {
    title: "Backend Development",
    description: "Implement the backend services and data layer.",
    skill: "ENGINEERING",
    estimatedHours: 40,
    deliverables: ["Backend implementation"],
    dependsOn: [1],
    parallel: true,
  },
  {
    title: "Authentication",
    description: "Implement authentication and access control.",
    skill: "ENGINEERING",
    estimatedHours: 16,
    deliverables: ["Authentication system"],
    dependsOn: [4],
    parallel: false,
  },
  {
    title: "Dashboard",
    description: "Implement the authenticated dashboard experience.",
    skill: "ENGINEERING",
    estimatedHours: 24,
    deliverables: ["Dashboard implementation"],
    dependsOn: [3, 5],
    parallel: false,
  },
  {
    title: "Testing",
    description: "Test the site for correctness, performance, and cross-browser compatibility.",
    skill: "ENGINEERING",
    estimatedHours: 20,
    deliverables: ["Test results"],
    dependsOn: [6],
    parallel: false,
  },
  {
    title: "Deployment",
    description: "Deploy the site to production.",
    skill: "ENGINEERING",
    estimatedHours: 8,
    deliverables: ["Production deployment"],
    dependsOn: [7],
    parallel: false,
  },
  {
    title: "Documentation",
    description: "Document the site's architecture and maintenance procedures.",
    skill: "ENGINEERING",
    estimatedHours: 8,
    deliverables: ["Technical documentation"],
    dependsOn: [4],
    parallel: true,
  },
];

const MOBILE_APP_TEMPLATE: readonly StepTemplate[] = [
  { title: "Research Business", description: "Research the target users, competitors, and business context.", skill: "RESEARCH", estimatedHours: 16, deliverables: ["Business research summary"], dependsOn: [], parallel: false },
  { title: "UI Design", description: "Design the app's visual interface and user experience.", skill: "DESIGN", estimatedHours: 24, deliverables: ["UI design mockups"], dependsOn: [0], parallel: false },
  { title: "App Development", description: "Implement the mobile app according to the UI design.", skill: "ENGINEERING", estimatedHours: 48, deliverables: ["App implementation"], dependsOn: [1], parallel: false },
  { title: "Backend Development", description: "Implement the backend services and APIs the app depends on.", skill: "ENGINEERING", estimatedHours: 40, deliverables: ["Backend implementation"], dependsOn: [0], parallel: true },
  { title: "Testing", description: "Test the app for correctness, performance, and device compatibility.", skill: "ENGINEERING", estimatedHours: 20, deliverables: ["Test results"], dependsOn: [2, 3], parallel: false },
  { title: "Deployment", description: "Publish the app to the relevant app store(s).", skill: "ENGINEERING", estimatedHours: 8, deliverables: ["Store submission"], dependsOn: [4], parallel: false },
  { title: "Documentation", description: "Document the app's architecture and maintenance procedures.", skill: "ENGINEERING", estimatedHours: 8, deliverables: ["Technical documentation"], dependsOn: [3], parallel: true },
];

const SAAS_TEMPLATE: readonly StepTemplate[] = [
  { title: "Research Business", description: "Research the target market, competitors, and business context.", skill: "RESEARCH", estimatedHours: 16, deliverables: ["Business research summary"], dependsOn: [], parallel: false },
  { title: "Architecture", description: "Define the technical architecture for the platform.", skill: "ENGINEERING", estimatedHours: 16, deliverables: ["Architecture specification"], dependsOn: [0], parallel: false },
  { title: "Core Development", description: "Implement the core product functionality.", skill: "ENGINEERING", estimatedHours: 60, deliverables: ["Core implementation"], dependsOn: [1], parallel: false },
  { title: "Billing Integration", description: "Integrate subscription billing and account management.", skill: "ENGINEERING", estimatedHours: 24, deliverables: ["Billing integration"], dependsOn: [1], parallel: true },
  { title: "Testing", description: "Test the platform for correctness, performance, and reliability.", skill: "ENGINEERING", estimatedHours: 24, deliverables: ["Test results"], dependsOn: [2, 3], parallel: false },
  { title: "Deployment", description: "Deploy the platform to production.", skill: "ENGINEERING", estimatedHours: 8, deliverables: ["Production deployment"], dependsOn: [4], parallel: false },
  { title: "Documentation", description: "Document the platform's architecture and maintenance procedures.", skill: "ENGINEERING", estimatedHours: 8, deliverables: ["Technical documentation"], dependsOn: [2], parallel: true },
];

const SOFTWARE_TEMPLATE: readonly StepTemplate[] = [
  { title: "Requirements Analysis", description: "Analyse the requirements and constraints for the system.", skill: "RESEARCH", estimatedHours: 8, deliverables: ["Requirements specification"], dependsOn: [], parallel: false },
  { title: "Architecture", description: "Define the technical architecture for the system.", skill: "ENGINEERING", estimatedHours: 8, deliverables: ["Architecture specification"], dependsOn: [0], parallel: false },
  { title: "Implementation", description: "Implement the system according to the architecture.", skill: "ENGINEERING", estimatedHours: 40, deliverables: ["System implementation"], dependsOn: [1], parallel: false },
  { title: "Testing", description: "Test the system for correctness and regressions.", skill: "ENGINEERING", estimatedHours: 16, deliverables: ["Test results"], dependsOn: [2], parallel: false },
  { title: "Documentation", description: "Document the system's usage and internals.", skill: "ENGINEERING", estimatedHours: 8, deliverables: ["Technical documentation"], dependsOn: [2], parallel: true },
];

const GRAPHIC_DESIGN_TEMPLATE: readonly StepTemplate[] = [
  { title: "Concept Design", description: "Produce initial design concepts for review.", skill: "DESIGN", estimatedHours: 4, deliverables: ["Design concepts"], dependsOn: [], parallel: false },
  { title: "Design Refinement", description: "Refine the selected concept based on feedback.", skill: "DESIGN", estimatedHours: 4, deliverables: ["Refined design"], dependsOn: [0], parallel: false },
  { title: "Final Delivery", description: "Prepare and deliver final design assets.", skill: "DESIGN", estimatedHours: 2, deliverables: ["Final design files"], dependsOn: [1], parallel: false },
];

const MARKETING_TEMPLATE: readonly StepTemplate[] = [
  { title: "Market Research", description: "Research the target market and competitive landscape.", skill: "RESEARCH", estimatedHours: 8, deliverables: ["Market research summary"], dependsOn: [], parallel: false },
  { title: "Strategy Development", description: "Develop the marketing strategy and messaging.", skill: "MARKETING", estimatedHours: 8, deliverables: ["Marketing strategy"], dependsOn: [0], parallel: false },
  { title: "Content Creation", description: "Create the content and creative assets for the campaign.", skill: "MARKETING", estimatedHours: 16, deliverables: ["Campaign content"], dependsOn: [1], parallel: false },
  { title: "Campaign Execution", description: "Launch and run the marketing campaign.", skill: "MARKETING", estimatedHours: 8, deliverables: ["Live campaign"], dependsOn: [2], parallel: false },
  { title: "Performance Analysis", description: "Analyse campaign performance and report results.", skill: "MARKETING", estimatedHours: 4, deliverables: ["Performance report"], dependsOn: [3], parallel: false },
];

const SALES_TEMPLATE: readonly StepTemplate[] = [
  { title: "Lead Research", description: "Research and qualify prospective leads.", skill: "RESEARCH", estimatedHours: 8, deliverables: ["Qualified lead list"], dependsOn: [], parallel: false },
  { title: "Outreach", description: "Reach out to qualified leads.", skill: "OUTREACH", estimatedHours: 8, deliverables: ["Outreach log"], dependsOn: [0], parallel: false },
  { title: "Pitch Preparation", description: "Prepare the sales pitch and supporting materials.", skill: "SALES", estimatedHours: 4, deliverables: ["Pitch deck"], dependsOn: [1], parallel: false },
  { title: "Deal Negotiation", description: "Negotiate terms with interested prospects.", skill: "SALES", estimatedHours: 8, deliverables: ["Negotiated terms"], dependsOn: [2], parallel: false },
  { title: "Follow-up", description: "Follow up with prospects to close the deal.", skill: "SALES", estimatedHours: 4, deliverables: ["Closed deal or next steps"], dependsOn: [3], parallel: false },
];

const FINANCE_TEMPLATE: readonly StepTemplate[] = [
  { title: "Data Gathering", description: "Gather the financial data required.", skill: "FINANCE", estimatedHours: 8, deliverables: ["Financial data set"], dependsOn: [], parallel: false },
  { title: "Analysis", description: "Analyse the financial data.", skill: "FINANCE", estimatedHours: 8, deliverables: ["Financial analysis"], dependsOn: [0], parallel: false },
  { title: "Reporting", description: "Produce the financial report.", skill: "FINANCE", estimatedHours: 4, deliverables: ["Financial report"], dependsOn: [1], parallel: false },
];

const RESEARCH_TEMPLATE: readonly StepTemplate[] = [
  { title: "Literature Review", description: "Review existing knowledge and prior work on the topic.", skill: "RESEARCH", estimatedHours: 8, deliverables: ["Literature review"], dependsOn: [], parallel: false },
  { title: "Data Collection", description: "Collect the data required to answer the research question.", skill: "RESEARCH", estimatedHours: 16, deliverables: ["Collected data set"], dependsOn: [0], parallel: false },
  { title: "Analysis", description: "Analyse the collected data.", skill: "RESEARCH", estimatedHours: 8, deliverables: ["Analysis results"], dependsOn: [1], parallel: false },
  { title: "Report Writing", description: "Write up the research findings.", skill: "RESEARCH", estimatedHours: 8, deliverables: ["Research report"], dependsOn: [2], parallel: false },
];

const AUTOMATION_TEMPLATE: readonly StepTemplate[] = [
  { title: "Process Analysis", description: "Analyse the process to be automated and its requirements.", skill: "COORDINATION", estimatedHours: 8, deliverables: ["Process analysis"], dependsOn: [], parallel: false },
  { title: "Workflow Design", description: "Design the automated workflow.", skill: "ENGINEERING", estimatedHours: 8, deliverables: ["Workflow design"], dependsOn: [0], parallel: false },
  { title: "Implementation", description: "Implement the automation.", skill: "ENGINEERING", estimatedHours: 24, deliverables: ["Automation implementation"], dependsOn: [1], parallel: false },
  { title: "Testing", description: "Test the automation for correctness and reliability.", skill: "ENGINEERING", estimatedHours: 8, deliverables: ["Test results"], dependsOn: [2], parallel: false },
];

const INTERNAL_TEMPLATE: readonly StepTemplate[] = [
  { title: "Process Review", description: "Review the current internal process.", skill: "COORDINATION", estimatedHours: 8, deliverables: ["Process review"], dependsOn: [], parallel: false },
  { title: "Policy Drafting", description: "Draft the updated policy or procedure.", skill: "COORDINATION", estimatedHours: 8, deliverables: ["Draft policy"], dependsOn: [0], parallel: false },
  { title: "Rollout Coordination", description: "Coordinate the rollout of the change across the team.", skill: "COORDINATION", estimatedHours: 8, deliverables: ["Rollout plan"], dependsOn: [1], parallel: false },
];

const UNKNOWN_TEMPLATE: readonly StepTemplate[] = [
  { title: "Scoping", description: "Scope the work required to address the request.", skill: "COORDINATION", estimatedHours: 4, deliverables: ["Scope summary"], dependsOn: [], parallel: false },
  { title: "Execution", description: "Carry out the scoped work.", skill: "COORDINATION", estimatedHours: 16, deliverables: ["Completed work"], dependsOn: [0], parallel: false },
  { title: "Review", description: "Review the completed work.", skill: "COORDINATION", estimatedHours: 4, deliverables: ["Review notes"], dependsOn: [1], parallel: false },
];

/**
 * The complete set of templates addressable by objective category.
 * Marketing objectives are further routed to the Graphic Design
 * template when the classifier identified graphic design as the
 * required department, since a single design deliverable follows a
 * materially different sequence than a full marketing campaign.
 */
const CATEGORY_TEMPLATES: Readonly<Record<ObjectiveCategory, readonly StepTemplate[]>> = {
  Website: WEBSITE_TEMPLATE,
  "Mobile App": MOBILE_APP_TEMPLATE,
  SaaS: SAAS_TEMPLATE,
  Software: SOFTWARE_TEMPLATE,
  Marketing: MARKETING_TEMPLATE,
  Sales: SALES_TEMPLATE,
  Finance: FINANCE_TEMPLATE,
  Operations: INTERNAL_TEMPLATE,
  Research: RESEARCH_TEMPLATE,
  Automation: AUTOMATION_TEMPLATE,
  Internal: INTERNAL_TEMPLATE,
  Unknown: UNKNOWN_TEMPLATE,
};

/**
 * The TaskBreakdownEngine receives a BusinessObjective and is
 * responsible for a single concern: transforming it into an ordered
 * sequence of executable PlannedUnits, each with exactly one owning
 * department, one owning role, explicit dependencies, and a flag
 * indicating whether it may run in parallel with sibling work. It
 * performs no AI calls, creates no employees, and dispatches no
 * work — it only decomposes.
 */
export class TaskBreakdownEngine {
  /**
   * Breaks a BusinessObjective into an ordered list of PlannedUnits.
   * Throws if the objective is missing or its category has no known
   * template.
   */
  public breakdown(objective: BusinessObjective): PlannedUnit[] {
    if (!objective) {
      throw new Error("TaskBreakdownEngine: objective is required.");
    }

    const template = this.resolveTemplate(objective);

    if (!template || template.length === 0) {
      throw new Error(
        `TaskBreakdownEngine: no work-breakdown template exists for category "${objective.category}".`
      );
    }

    return this.materialise(template, objective.priority);
  }

  /**
   * Resolves the step template for an objective. Marketing objectives
   * whose required departments identify graphic design as the sole
   * requirement are routed to the lighter Graphic Design template
   * rather than the full marketing campaign template.
   */
  private resolveTemplate(objective: BusinessObjective): readonly StepTemplate[] {
    if (
      objective.category === "Marketing" &&
      objective.requiredDepartments.includes("Graphic Design")
    ) {
      return GRAPHIC_DESIGN_TEMPLATE;
    }

    return CATEGORY_TEMPLATES[objective.category];
  }

  /**
   * Converts a step template into formal PlannedUnits: assigning
   * identity to every step first, then resolving each step's
   * dependencies into the concrete ids of the steps it depends on.
   */
  private materialise(
    template: readonly StepTemplate[],
    priority: ObjectivePriority
  ): PlannedUnit[] {
    const ids = template.map(() => randomUUID());

    return template.map((step, index) => {
      const [department, role] = SKILL_OWNERSHIP[step.skill];

      const dependencies = step.dependsOn.map((dependencyIndex) => {
        const dependencyId = ids[dependencyIndex];

        if (!dependencyId) {
          throw new Error(
            `TaskBreakdownEngine: step "${step.title}" declares a dependency on an unknown step index ${dependencyIndex}.`
          );
        }

        return dependencyId;
      });

      const id = ids[index];

      if (!id) {
        throw new Error(
          `TaskBreakdownEngine: failed to assign an id to step "${step.title}".`
        );
      }

      return {
        id,
        title: step.title,
        description: step.description,
        department,
        role,
        priority,
        estimatedHours: step.estimatedHours,
        dependencies,
        deliverables: [...step.deliverables],
        parallelExecution: step.parallel,
      };
    });
  }
}