import { randomUUID } from "crypto";
import { EmployeeRole, type EmployeeTaskPriority } from "../workforce/types/Employee";

/**
 * A single unit of work identified during planning, tagged with the
 * specialist role and priority best suited to it. A PlannedUnit
 * describes what needs to happen — it carries no information about
 * who will perform the work or how it will be executed.
 */
export interface PlannedUnit {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly role: EmployeeRole;
  readonly priority: EmployeeTaskPriority;
}

/**
 * The complete execution plan produced for a single user request.
 */
export interface ExecutionPlan {
  readonly units: PlannedUnit[];
}

/**
 * Keyword signals used to classify a clause of a request against the
 * canonical specialist role best suited to address it. Order matters:
 * earlier entries take precedence when multiple roles match.
 */
const ROLE_SIGNALS: ReadonlyArray<readonly [EmployeeRole, readonly string[]]> = [
  [
    EmployeeRole.SOFTWARE_ENGINEER,
    ["build", "develop", "code", "implement", "api", "database", "app", "feature", "bug", "refactor", "test"],
  ],
  [
    EmployeeRole.MARKETING_STRATEGIST,
    ["marketing", "campaign", "advertis", "seo", "brand awareness"],
  ],
  [
    EmployeeRole.SALES_REPRESENTATIVE,
    ["sales", "sell", "close a deal", "pitch", "prospect"],
  ],
  [
    EmployeeRole.OUTREACH_SPECIALIST,
    ["outreach", "cold email", "cold call", "partnership", "networking"],
  ],
  [
    EmployeeRole.FINANCIAL_ANALYST,
    ["budget", "finance", "financial", "invoice", "revenue", "cost", "pricing"],
  ],
  [
    EmployeeRole.SUPPORT_AGENT,
    ["support", "customer service", "ticket", "complaint", "help desk"],
  ],
  [
    EmployeeRole.RESEARCHER,
    ["research", "investigate", "analyse", "analyze", "study", "explore options"],
  ],
  [
    EmployeeRole.EXECUTIVE_ASSISTANT,
    ["schedule", "calendar", "coordinate meeting", "book a", "organise a meeting"],
  ],
];

/**
 * Keyword signals used to classify the urgency of a clause.
 */
const URGENT_SIGNALS: readonly string[] = [
  "urgent",
  "asap",
  "immediately",
  "right now",
  "critical",
  "emergency",
];

const HIGH_SIGNALS: readonly string[] = [
  "important",
  "priority",
  "soon",
  "this week",
];

const LOW_SIGNALS: readonly string[] = [
  "eventually",
  "when you have time",
  "low priority",
  "nice to have",
  "whenever",
];

/**
 * The Executive Assistant is the brain of KDOS. It receives every
 * request directed at the company and is responsible solely for
 * analysing the underlying business objective, determining the
 * workforce required, and breaking that request into discrete
 * PlannedUnits, returned as an ExecutionPlan. The Executive Assistant
 * does not dispatch work, does not execute work, and does not call
 * any AI provider or AI Gateway — the TaskDispatcher is the only
 * component authorised to assign and execute work. The only
 * dependency this class has is a type-only reference to the canonical
 * EmployeeRole and EmployeeTaskPriority types, ensuring every plan it
 * produces is structurally compatible with the workforce that
 * ultimately resolves it.
 */
export class ExecutiveAssistant {
  /**
   * Receives a raw user request and returns a complete ExecutionPlan.
   * This is the sole entry point into the Executive Assistant.
   */
  public receiveRequest(userRequest: string): ExecutionPlan {
    if (!userRequest || userRequest.trim().length === 0) {
      throw new Error("ExecutiveAssistant: userRequest is required.");
    }

    const objective = this.analyseObjective(userRequest);
    const clauses = this.determineRequiredWorkforce(objective);
    const units = this.createPlannedUnits(clauses);

    if (units.length === 0) {
      throw new Error(
        "ExecutiveAssistant: no actionable units of work could be identified in the request."
      );
    }

    return { units };
  }

  /**
   * Normalises a raw user request into a single analysable objective
   * statement: trimmed, whitespace-collapsed, and stripped of
   * conversational filler that carries no business meaning.
   */
  private analyseObjective(userRequest: string): string {
    const collapsed = userRequest.replace(/\s+/g, " ").trim();

    const filler = /^(please|hey|hi|could you|can you|i need you to|i want you to)\s+/i;

    return collapsed.replace(filler, "").trim();
  }

  /**
   * Determines the discrete units of required workforce within an
   * objective statement by splitting it into clauses along sentence
   * boundaries, line breaks, numbered/bulleted list markers, and
   * coordinating conjunctions.
   */
  private determineRequiredWorkforce(objective: string): string[] {
    const rawClauses = objective
      .split(/\r?\n|(?<=[.!?])\s+|,?\s+and then\s+|,?\s+and also\s+|;\s*/i)
      .map((clause) => clause.replace(/^[-*\d.)\s]+/, "").trim())
      .filter((clause) => clause.length > 0);

    return rawClauses.length > 0 ? rawClauses : [objective];
  }

  /**
   * Converts a list of clauses into formal PlannedUnits, classifying
   * each clause's specialist role and priority from its content.
   */
  private createPlannedUnits(clauses: string[]): PlannedUnit[] {
    return clauses.map((clause) => ({
      id: randomUUID(),
      title: this.buildTitle(clause),
      description: clause,
      role: this.classifyRole(clause),
      priority: this.classifyPriority(clause),
    }));
  }

  /**
   * Derives a short title from a clause by truncating at a natural
   * word boundary.
   */
  private buildTitle(clause: string): string {
    const maxLength = 60;

    if (clause.length <= maxLength) {
      return clause;
    }

    const truncated = clause.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated}...`;
  }

  /**
   * Classifies the specialist role best suited to a clause based on
   * keyword signals. Defaults to PROJECT_MANAGER when no signal
   * matches, since coordinating unclassified work is itself a
   * legitimate project-management responsibility.
   */
  private classifyRole(clause: string): EmployeeRole {
    const normalised = clause.toLowerCase();

    for (const [role, keywords] of ROLE_SIGNALS) {
      if (keywords.some((keyword) => normalised.includes(keyword))) {
        return role;
      }
    }

    return EmployeeRole.PROJECT_MANAGER;
  }

  /**
   * Classifies the priority of a clause based on keyword signals.
   * Defaults to "medium" when no signal matches.
   */
  private classifyPriority(clause: string): EmployeeTaskPriority {
    const normalised = clause.toLowerCase();

    if (URGENT_SIGNALS.some((keyword) => normalised.includes(keyword))) {
      return "urgent";
    }

    if (HIGH_SIGNALS.some((keyword) => normalised.includes(keyword))) {
      return "high";
    }

    if (LOW_SIGNALS.some((keyword) => normalised.includes(keyword))) {
      return "low";
    }

    return "medium";
  }
}

export const executiveAssistant = new ExecutiveAssistant();