import { randomUUID } from "crypto";
import { aiGateway } from "../workforce/gateway/AIGateway";
import { employeeRegistry } from "../workforce/registry/EmployeeRegistry";
import { taskDispatcher } from "../workforce/dispatcher/TaskDispatcher";
import type { BaseEmployee } from "../workforce/employee/BaseEmployee";
import type { EmployeeRole, EmployeeTask } from "../workforce/employee/types";

const VALID_ROLES: readonly EmployeeRole[] = [
  "executive-assistant",
  "software-engineer",
  "project-manager",
  "marketing-strategist",
  "sales-representative",
  "outreach-specialist",
  "financial-analyst",
  "support-agent",
  "researcher",
];

const VALID_PRIORITIES: readonly EmployeeTask["priority"][] = [
  "low",
  "medium",
  "high",
  "urgent",
];

/**
 * The analysed intent behind a raw user request, including its
 * business classification.
 */
export interface RequestIntent {
  readonly summary: string;
  readonly objective: string;
  readonly category: string;
}

/**
 * A single unit of work identified during planning, tagged with the
 * specialist role best suited to execute it, prior to an employee
 * being resolved and a formal task being dispatched.
 */
export export interface PlannedUnit {
  readonly title: string;
  readonly description: string;
  readonly role: EmployeeRole;
  readonly priority: EmployeeTask["priority"];
}

/**
 * The complete execution plan produced for a single user request.
 */
export interface ExecutionPlan {
  readonly intent: RequestIntent;
  readonly requiredSpecialists: readonly EmployeeRole[];
  readonly units: readonly PlannedUnit[];
}

/**
 * The Executive Assistant is the brain of KDOS. It receives every
 * request directed at the company, understands intent, classifies the
 * task, decides which AI employees are required, builds a formal
 * execution plan, and hands each unit of work to the TaskDispatcher.
 * It thinks like the CEO of KyleDev — reasoning about business
 * objectives and workforce composition — and is designed to scale as
 * the company's autonomous workforce grows. The Executive Assistant
 * never executes work itself. All AI reasoning flows exclusively
 * through the AIGateway.
 */
export class ExecutiveAssistant {
  /**
   * Receives a raw user request and drives it end to end through
   * intent analysis, task classification, specialist identification,
   * plan generation, and delegation to the TaskDispatcher. Returns the
   * tasks that were dispatched.
   */
  public async receiveRequest(userRequest: string): Promise<EmployeeTask[]> {
    if (!userRequest || userRequest.trim().length === 0) {
      throw new Error("ExecutiveAssistant: userRequest is required.");
    }

    const intent = await this.analyseIntent(userRequest);
    const plan = await this.generatePlan(userRequest, intent);

    return this.delegate(plan);
  }

  /**
   * Analyses a raw user request to determine its underlying intent,
   * business objective, and classification category. Uses the
   * AIGateway exclusively; never calls an AI provider directly.
   */
  public async analyseIntent(userRequest: string): Promise<RequestIntent> {
    if (!userRequest || userRequest.trim().length === 0) {
      throw new Error("ExecutiveAssistant: userRequest is required.");
    }

    const response = await aiGateway.generate({
      messages: [
        {
          role: "system",
          content:
            "You are the intent-analysis function of the Executive Assistant, the CEO-level " +
            "intelligence of an internal operating system for a technology agency. Analyse " +
            "the user's request and respond with ONLY a JSON object, no prose, no markdown " +
            'fences. The object must have exactly these fields: "summary" (a one-sentence ' +
            'restatement of what the user is asking for), "objective" (a one-sentence ' +
            'statement of the underlying business objective this request serves), and ' +
            '"category" (a short lowercase classification of the task, e.g. "development", ' +
            '"marketing", "design", "finance", "research", "support", "sales").',
        },
        {
          role: "user",
          content: userRequest,
        },
      ],
    });

    return this.parseIntent(response.content);
  }

  /**
   * Determines the required specialist roles for a given intent. Uses
   * the AIGateway exclusively.
   */
  public async determineSpecialists(
    intent: RequestIntent
  ): Promise<EmployeeRole[]> {
    if (!intent) {
      throw new Error("ExecutiveAssistant: intent is required.");
    }

    const response = await aiGateway.generate({
      messages: [
        {
          role: "system",
          content:
            "You determine which specialist AI employee roles are required to fulfil a " +
            "business objective inside an AI workforce. Respond with ONLY a JSON array of " +
            'role strings, no prose, no markdown fences. Valid roles are exactly: ' +
            VALID_ROLES.map((role) => `"${role}"`).join(", ") +
            ". Include only the roles genuinely required.",
        },
        {
          role: "user",
          content: `Summary: ${intent.summary}\nObjective: ${intent.objective}\nCategory: ${intent.category}`,
        },
      ],
    });

    return this.parseRoles(response.content);
  }

  /**
   * Generates a complete execution plan for a user request: analysed
   * intent, required specialists, and a breakdown of discrete units of
   * work tagged with the responsible role. Uses the AIGateway
   * exclusively.
   */
  public async generatePlan(
    userRequest: string,
    intent: RequestIntent
  ): Promise<ExecutionPlan> {
    if (!userRequest || userRequest.trim().length === 0) {
      throw new Error("ExecutiveAssistant: userRequest is required.");
    }

    if (!intent) {
      throw new Error("ExecutiveAssistant: intent is required.");
    }

    const requiredSpecialists = await this.determineSpecialists(intent);

    const response = await aiGateway.generate({
      messages: [
        {
          role: "system",
          content:
            "You are the planning function of the Executive Assistant, the CEO-level " +
            "intelligence of an internal operating system for a technology agency. Break " +
            "the request into a minimal set of discrete units of work, each assigned to " +
            "one of the required specialist roles. Respond with ONLY a JSON array, no " +
            'prose, no markdown fences. Each element must be an object with exactly these ' +
            'fields: "title" (string), "description" (string), "role" (one of the ' +
            'required specialist roles provided), and "priority" (one of: "low", ' +
            '"medium", "high", "urgent").' +
            `\n\nRequired specialist roles: ${requiredSpecialists.join(", ")}`,
        },
        {
          role: "user",
          content: `Original request: ${userRequest}\nObjective: ${intent.objective}\nCategory: ${intent.category}`,
        },
      ],
    });

    const units = this.parsePlanUnits(response.content, requiredSpecialists);

    return { intent, requiredSpecialists, units };
  }

  /**
   * Hands a completed execution plan to the TaskDispatcher by
   * resolving an available employee for each planned unit's role,
   * constructing a formal EmployeeTask, and dispatching it. Before
   * accessing the resolved employee's id, its existence is explicitly
   * validated — an undefined assignee is never permitted to reach
   * task construction. Throws a descriptive error if no suitable
   * employee exists for a required role.
   */
  public delegate(plan: ExecutionPlan): EmployeeTask[] {
    if (!plan || !Array.isArray(plan.units) || plan.units.length === 0) {
      throw new Error(
        "ExecutiveAssistant: plan must contain at least one unit of work."
      );
    }

    const tasks: EmployeeTask[] = [];

    for (const unit of plan.units) {
      const assignee = this.resolveAssignee(unit.role);
      const now = new Date();

      const task: EmployeeTask = {
        id: randomUUID(),
        employeeId: assignee.id,
        title: unit.title,
        description: unit.description,
        status: "pending",
        priority: unit.priority,
        workflowId: null,
        createdAt: now,
        updatedAt: now,
        dueAt: null,
        completedAt: null,
      };

      taskDispatcher.dispatch(task);
      tasks.push(task);
    }

    return tasks;
  }

  /**
   * Resolves a single available employee for the given role. Validates
   * the candidate list before selection and validates the selected
   * assignee itself before returning it — an undefined assignee can
   * never be returned from this method. Throws a descriptive error if
   * no valid assignee can be found.
   */
  private resolveAssignee(role: EmployeeRole): BaseEmployee {
    const candidates = employeeRegistry
      .getByRole(role)
      .filter((employee) => employee.getProfile().status === "idle");

    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new Error(
        `ExecutiveAssistant: no available employee found for role "${role}".`
      );
    }

    const assignee = candidates.find((candidate) => candidate !== undefined);

    if (!assignee) {
      throw new Error(
        `ExecutiveAssistant: no valid assignee could be resolved for role "${role}".`
      );
    }

    return assignee;
  }

  /**
   * Parses and validates the AI-generated intent response.
   */
  private parseIntent(rawContent: string): RequestIntent {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      throw new Error(
        "ExecutiveAssistant: failed to parse intent response as JSON."
      );
    }

    if (typeof parsed !== "object" || parsed === null) {
      throw new Error(
        "ExecutiveAssistant: intent response must be a JSON object."
      );
    }

    const candidate = parsed as Record<string, unknown>;

    if (
      typeof candidate.summary !== "string" ||
      candidate.summary.trim().length === 0
    ) {
      throw new Error(
        "ExecutiveAssistant: intent response has an invalid summary."
      );
    }

    if (
      typeof candidate.objective !== "string" ||
      candidate.objective.trim().length === 0
    ) {
      throw new Error(
        "ExecutiveAssistant: intent response has an invalid objective."
      );
    }

    if (
      typeof candidate.category !== "string" ||
      candidate.category.trim().length === 0
    ) {
      throw new Error(
        "ExecutiveAssistant: intent response has an invalid category."
      );
    }

    return {
      summary: candidate.summary,
      objective: candidate.objective,
      category: candidate.category,
    };
  }

  /**
   * Parses and validates the AI-generated list of required specialist
   * roles.
   */
  private parseRoles(rawContent: string): EmployeeRole[] {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      throw new Error(
        "ExecutiveAssistant: failed to parse specialist roles response as JSON."
      );
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error(
        "ExecutiveAssistant: specialist roles response must be a non-empty JSON array."
      );
    }

    return parsed.map((entry, index) => {
      if (
        typeof entry !== "string" ||
        !VALID_ROLES.includes(entry as EmployeeRole)
      ) {
        throw new Error(
          `ExecutiveAssistant: specialist role at index ${index} is invalid.`
        );
      }

      return entry as EmployeeRole;
    });
  }

  /**
   * Parses and validates the AI-generated plan units, ensuring each
   * unit's role is among the required specialists.
   */
  private parsePlanUnits(
    rawContent: string,
    requiredSpecialists: readonly EmployeeRole[]
  ): PlannedUnit[] {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      throw new Error(
        "ExecutiveAssistant: failed to parse plan response as JSON."
      );
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error(
        "ExecutiveAssistant: plan response must be a non-empty JSON array."
      );
    }

    return parsed.map((entry, index) => {
      if (typeof entry !== "object" || entry === null) {
        throw new Error(
          `ExecutiveAssistant: plan entry at index ${index} is not an object.`
        );
      }

      const unit = entry as Record<string, unknown>;

      if (typeof unit.title !== "string" || unit.title.trim().length === 0) {
        throw new Error(
          `ExecutiveAssistant: plan entry at index ${index} has an invalid title.`
        );
      }

      if (
        typeof unit.description !== "string" ||
        unit.description.trim().length === 0
      ) {
        throw new Error(
          `ExecutiveAssistant: plan entry at index ${index} has an invalid description.`
        );
      }

      if (
        typeof unit.role !== "string" ||
        !requiredSpecialists.includes(unit.role as EmployeeRole)
      ) {
        throw new Error(
          `ExecutiveAssistant: plan entry at index ${index} has a role outside the required specialists.`
        );
      }

      if (
        typeof unit.priority !== "string" ||
        !VALID_PRIORITIES.includes(unit.priority as EmployeeTask["priority"])
      ) {
        throw new Error(
          `ExecutiveAssistant: plan entry at index ${index} has an invalid priority.`
        );
      }

      return {
        title: unit.title,
        description: unit.description,
        role: unit.role as EmployeeRole,
        priority: unit.priority as EmployeeTask["priority"],
      };
    });
  }
}

export const executiveAssistant = new ExecutiveAssistant();