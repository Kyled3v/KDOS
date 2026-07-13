import { randomUUID } from "crypto";
import type { IntentAnalysis } from "./IntentAnalyzer";

/**
 * The structured business category a request is classified into.
 * "Software" covers general software work that is not specifically a
 * public-facing Website, Mobile App, or SaaS product (for example, an
 * internal system).
 */
export type ObjectiveCategory =
  | "Website"
  | "Mobile App"
  | "SaaS"
  | "Software"
  | "Marketing"
  | "Sales"
  | "Finance"
  | "Operations"
  | "Research"
  | "Automation"
  | "Internal"
  | "Unknown";

/**
 * The priority assigned to a business objective.
 */
export type ObjectivePriority = "Low" | "Medium" | "High" | "Critical";

/**
 * The estimated scale of a business objective.
 */
export type ObjectiveComplexity = "Small" | "Medium" | "Large" | "Enterprise";

/**
 * A fully classified, structured business objective, ready for
 * downstream task breakdown and execution planning.
 */
export interface BusinessObjective {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: ObjectiveCategory;
  readonly priority: ObjectivePriority;
  readonly estimatedComplexity: ObjectiveComplexity;
  readonly requiresResearch: boolean;
  readonly requiresPlanning: boolean;
  readonly requiredDepartments: string[];
}

/**
 * The ordered priority scale, used to escalate a base priority by one
 * level when scale warrants it.
 */
const PRIORITY_SCALE: readonly ObjectivePriority[] = ["Low", "Medium", "High", "Critical"];

/**
 * Keyword signals identifying a mobile app deliverable within the
 * software domain.
 */
const MOBILE_APP_SIGNALS: readonly string[] = ["mobile app", "ios app", "android app"];

/**
 * Keyword signals identifying a website deliverable within the
 * software domain.
 */
const WEBSITE_SIGNALS: readonly string[] = [
  "website",
  "web page",
  "webpage",
  "landing page",
  "web presence",
];

/**
 * Keyword signals identifying a SaaS deliverable within the software
 * domain.
 */
const SAAS_SIGNALS: readonly string[] = ["saas", "subscription platform", "multi-tenant"];

/**
 * Keyword signals identifying design-specific work within the
 * marketing domain, routed to a Graphic Design department rather than
 * general Marketing.
 */
const DESIGN_SIGNALS: readonly string[] = [
  "logo",
  "mockup",
  "wireframe",
  "brand identity",
  "visual design",
  "graphic",
];

/**
 * Keyword signals identifying finance-related concerns within an
 * otherwise generic software objective, such as an internal system
 * that touches billing or accounting.
 */
const FINANCE_SIGNALS: readonly string[] = [
  "invoic",
  "billing",
  "finance",
  "accounting",
  "payment",
];

/**
 * The ObjectiveClassifier receives an IntentAnalysis from the
 * IntentAnalyzer and is responsible for a single concern: classifying
 * it into a structured BusinessObjective. It performs no AI calls, no
 * dispatch, and creates no employees — every classification is pure,
 * deterministic reasoning over the IntentAnalysis it receives.
 */
export class ObjectiveClassifier {
  /**
   * Classifies an IntentAnalysis into a complete BusinessObjective.
   * Throws if the analysis is missing.
   */
  public classify(analysis: IntentAnalysis): BusinessObjective {
    if (!analysis) {
      throw new Error("ObjectiveClassifier: analysis is required.");
    }

    const category = this.classifyCategory(analysis);
    const estimatedComplexity = this.classifyComplexity(analysis, category);
    const requiredDepartments = this.determineDepartments(analysis, category);
    const priority = this.classifyPriority(analysis, estimatedComplexity);
    const requiresPlanning =
      estimatedComplexity === "Large" ||
      estimatedComplexity === "Enterprise" ||
      requiredDepartments.length > 1;
    const requiresResearch = analysis.requiresResearch || estimatedComplexity === "Enterprise";

    return {
      id: randomUUID(),
      title: this.buildTitle(analysis.objective),
      description: analysis.objective,
      category,
      priority,
      estimatedComplexity,
      requiresResearch,
      requiresPlanning,
      requiredDepartments,
    };
  }

  /**
   * Derives a short title from an objective by truncating at a
   * natural word boundary.
   */
  private buildTitle(objective: string): string {
    const maxLength = 60;

    if (objective.length <= maxLength) {
      return objective;
    }

    const truncated = objective.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated}...`;
  }

  /**
   * Classifies the business category of an objective. Software-domain
   * requests are further refined into Website, Mobile App, SaaS, or
   * generic Software based on deliverable-specific signals.
   */
  private classifyCategory(analysis: IntentAnalysis): ObjectiveCategory {
    const normalised = analysis.objective.toLowerCase();

    switch (analysis.businessDomain) {
      case "software":
        if (MOBILE_APP_SIGNALS.some((keyword) => normalised.includes(keyword))) {
          return "Mobile App";
        }

        if (WEBSITE_SIGNALS.some((keyword) => normalised.includes(keyword))) {
          return "Website";
        }

        if (SAAS_SIGNALS.some((keyword) => normalised.includes(keyword))) {
          return "SaaS";
        }

        return "Software";

      case "marketing":
        return "Marketing";

      case "finance":
        return "Finance";

      case "sales":
        return "Sales";

      case "research":
        return "Research";

      case "operations":
        return "Internal";

      case "automation":
        return "Automation";

      case "unknown":
      default:
        return "Unknown";
    }
  }

  /**
   * Classifies the estimated complexity of an objective, mapping the
   * IntentAnalyzer's complexity tier onto the classifier's own scale.
   * A generic Software objective (not a public-facing Website, Mobile
   * App, or SaaS product) is capped at "Large" even when the
   * underlying intent complexity was "enterprise", since true
   * enterprise-wide scope is reserved for complete, publicly-facing
   * products.
   */
  private classifyComplexity(
    analysis: IntentAnalysis,
    category: ObjectiveCategory
  ): ObjectiveComplexity {
    const baseline: Readonly<Record<IntentAnalysis["complexity"], ObjectiveComplexity>> = {
      low: "Small",
      medium: "Medium",
      high: "Large",
      enterprise: "Enterprise",
    };

    const mapped = baseline[analysis.complexity];

    if (category === "Software" && mapped === "Enterprise") {
      return "Large";
    }

    return mapped;
  }

  /**
   * Classifies the priority of an objective from its urgency, escalated
   * by one level when the objective's estimated complexity is large
   * enough to warrant elevated attention regardless of stated urgency.
   */
  private classifyPriority(
    analysis: IntentAnalysis,
    estimatedComplexity: ObjectiveComplexity
  ): ObjectivePriority {
    const urgencyBaseline: Readonly<Record<IntentAnalysis["urgency"], ObjectivePriority>> = {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };

    const baseIndex = PRIORITY_SCALE.indexOf(urgencyBaseline[analysis.urgency]);
    const shouldEscalate = estimatedComplexity === "Large" || estimatedComplexity === "Enterprise";
    const escalatedIndex = shouldEscalate
      ? Math.min(baseIndex + 1, PRIORITY_SCALE.length - 1)
      : baseIndex;

    const priority = PRIORITY_SCALE[escalatedIndex];

    if (!priority) {
      throw new Error("ObjectiveClassifier: failed to resolve a priority.");
    }

    return priority;
  }

  /**
   * Determines the departments required to fulfil an objective, based
   * on its category and, for generic Software and Marketing
   * objectives, deliverable-specific signals within the objective
   * text.
   */
  private determineDepartments(
    analysis: IntentAnalysis,
    category: ObjectiveCategory
  ): string[] {
    const normalised = analysis.objective.toLowerCase();

    switch (category) {
      case "Website":
        return ["Software Engineering", "UI/UX", "Marketing", "QA", "DevOps"];

      case "Mobile App":
        return ["Software Engineering", "UI/UX", "QA", "DevOps"];

      case "SaaS":
        return ["Software Engineering", "UI/UX", "QA", "DevOps", "Marketing"];

      case "Software": {
        const departments = ["Software Engineering"];

        if (FINANCE_SIGNALS.some((keyword) => normalised.includes(keyword))) {
          departments.push("Finance");
        }

        departments.push("QA");

        return departments;
      }

      case "Marketing":
        if (DESIGN_SIGNALS.some((keyword) => normalised.includes(keyword))) {
          return ["Graphic Design"];
        }

        return ["Marketing"];

      case "Sales":
        return ["Sales"];

      case "Finance":
        return ["Finance"];

      case "Research":
        return ["Research"];

      case "Automation":
        return ["Software Engineering", "Automation"];

      case "Internal":
        return ["Operations"];

      case "Unknown":
      default:
        return ["Operations"];
    }
  }
}