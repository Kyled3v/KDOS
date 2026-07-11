import { randomUUID } from "crypto";
import { employeeRegistry } from "../registry/EmployeeRegistry";
import { taskDispatcher as coreDispatcher } from "../dispatcher/TaskDispatcher";
import type { BaseEmployee } from "../employee/BaseEmployee";
import type {
  EmployeeRole as RegistryEmployeeRole,
  EmployeeTask as RegistryEmployeeTask,
} from "../employee/types";
import { EmployeeRole } from "../types/Employee";
import type {
  ExecutionPlan,
  PlannedUnit,
} from "../../executive/ExecutiveAssistant";

/**
 * Maps the full V2 specialist role catalogue onto the subset of roles
 * the current EmployeeRegistry is able to resolve employees for. Roles
 * with no entry here have no supported employee type yet; dispatching
 * a unit tagged with such a role fails with a descriptive error rather
 * than being silently misassigned.
 */
const REGISTRY_ROLE_MAP: ReadonlyMap<EmployeeRole, RegistryEmployeeRole> = new Map([
  [EmployeeRole.EXECUTIVE_ASSISTANT, "executive-assistant"],
  [EmployeeRole.SOFTWARE_ENGINEER, "software-engineer"],
  [EmployeeRole.PROJECT_MANAGER, "project-manager"],
  [EmployeeRole.MARKETING_STRATEGIST, "marketing-strategist"],
  [EmployeeRole.SALES_REPRESENTATIVE, "sales-representative"],
  [EmployeeRole.OUTREACH_SPECIALIST, "outreach-specialist"],
  [EmployeeRole.FINANCIAL_ANALYST, "financial-analyst"],
  [EmployeeRole.SUPPORT_AGENT, "support-agent"],
  [EmployeeRole.RESEARCHER, "researcher"],
]);

/**
 * The outcome of monitoring a batch of dispatched tasks to completion.
 */
interface MonitorOutcome {
  readonly completed: readonly RegistryEmployeeTask[];
  readonly failed: readonly RegistryEmployeeTask[];
}

/**
 * Singleton dispatcher responsible for turning an ExecutionPlan
 * produced by the Executive Assistant into real work. This is the
 * ONLY component in KDOS authorised to assign work to an employee: it
 * resolves the employees required from the EmployeeRegistry, builds a
 * formal execution queue, dispatches every task, monitors execution to
 * completion, and merges the results into a single final response.
 * Every candidate list is validated before use and every resolved
 * employee is validated before assignment; nothing is ever assigned
 * on the basis of an unchecked array access.
 */
export class TaskDispatcher {
  private static instance: TaskDispatcher | null = null;

  private static readonly POLL_INTERVAL_MS = 500;
  private static readonly MAX_POLL_ATTEMPTS = 240;

  private constructor() {}

  /**
   * Returns the singleton instance of the dispatcher.
   */
  public static getInstance(): TaskDispatcher {
    if (TaskDispatcher.instance === null) {
      TaskDispatcher.instance = new TaskDispatcher();
    }

    return TaskDispatcher.instance;
  }

  /**
   * Executes a complete execution plan end to end: resolves required
   * employees, builds the queue, dispatches every task, monitors
   * execution, and returns a merged final response. Throws if any
   * unit's role cannot be resolved to an available employee, or if
   * any dispatched task fails.
   */
  public async execute(plan: ExecutionPlan): Promise<string> {
    this.validatePlan(plan);

    const assignments = this.resolveEmployees(plan);
    const queue = this.createQueue(plan, assignments);
    const dispatched = this.dispatchTasks(queue);
    const outcome = await this.monitorExecution(
      dispatched.map((task) => task.id)
    );

    return this.mergeResults(dispatched, outcome);
  }

  /**
   * Resolves a specific available employee from the EmployeeRegistry
   * for each planned unit in the plan. Every candidate list is
   * validated for emptiness before selection, and every selection is
   * validated for existence before being stored. Throws a descriptive
   * error if a unit's role has no registry mapping or no available
   * employee.
   */
  public resolveEmployees(plan: ExecutionPlan): Map<string, BaseEmployee> {
    this.validatePlan(plan);

    const assignments = new Map<string, BaseEmployee>();

    for (const unit of plan.units) {
      if (assignments.has(unit.id)) {
        continue;
      }

      const registryRole = this.resolveRegistryRole(unit.role);

      const candidates = employeeRegistry
        .getByRole(registryRole)
        .filter((employee) => employee.getProfile().status === "idle");

      const selected = this.selectEmployee(candidates, unit);

      assignments.set(unit.id, selected);
    }

    return assignments;
  }

  /**
   * Maps a V2 specialist role onto the role type the EmployeeRegistry
   * understands. Throws a descriptive error if the role has no
   * supported employee type registered yet.
   */
  private resolveRegistryRole(role: EmployeeRole): RegistryEmployeeRole {
    const registryRole = REGISTRY_ROLE_MAP.get(role);

    if (!registryRole) {
      throw new Error(
        `TaskDispatcher: role "${role}" has no supported employee type in the EmployeeRegistry yet.`
      );
    }

    return registryRole;
  }

  /**
   * Validates a candidate list of employees and returns the selected
   * employee. Never indexes the array directly — the array is checked
   * for emptiness first, and the selected entry is verified to exist
   * before being returned. Throws a descriptive error if the
   * candidate list is empty or contains no valid employee.
   */
  private selectEmployee(
    candidates: BaseEmployee[],
    unit: PlannedUnit
  ): BaseEmployee {
    if (!Array.isArray(candidates)) {
      throw new Error(
        `TaskDispatcher: candidate list for unit "${unit.id}" (role "${unit.role}") is not an array.`
      );
    }

    if (candidates.length === 0) {
      throw new Error(
        `TaskDispatcher: no available employee found for unit "${unit.id}" (role "${unit.role}").`
      );
    }

    const selected = candidates.find((candidate) => candidate !== undefined);

    if (!selected) {
      throw new Error(
        `TaskDispatcher: candidate list for unit "${unit.id}" (role "${unit.role}") contained no valid employee.`
      );
    }

    return selected;
  }

  /**
   * Builds a formal execution queue of registry-compatible
   * EmployeeTask records from the plan's units, using the resolved
   * employee assignments. Throws if any unit has no resolved
   * assignment.
   */
  public createQueue(
    plan: ExecutionPlan,
    assignments: Map<string, BaseEmployee>
  ): RegistryEmployeeTask[] {
    this.validatePlan(plan);

    if (!assignments || assignments.size === 0) {
      throw new Error("TaskDispatcher: assignments must not be empty.");
    }

    const queue: RegistryEmployeeTask[] = [];
    const now = new Date();

    for (const unit of plan.units) {
      const employee = assignments.get(unit.id);

      if (!employee) {
        throw new Error(
          `TaskDispatcher: no resolved employee for unit "${unit.id}".`
        );
      }

      queue.push({
        id: randomUUID(),
        employeeId: employee.id,
        title: unit.title,
        description: unit.description,
        status: "pending",
        priority: unit.priority,
        workflowId: null,
        createdAt: now,
        updatedAt: now,
        dueAt: null,
        completedAt: null,
      });
    }

    return queue;
  }

  /**
   * Dispatches every task in the queue through the core TaskDispatcher.
   * Throws if the queue is empty.
   */
  public dispatchTasks(queue: RegistryEmployeeTask[]): RegistryEmployeeTask[] {
    if (!Array.isArray(queue) || queue.length === 0) {
      throw new Error("TaskDispatcher: queue must be a non-empty array.");
    }

    for (const task of queue) {
      coreDispatcher.dispatch(task);
    }

    return queue;
  }

  /**
   * Polls the core TaskDispatcher until every task in the batch has
   * either completed or failed, or the maximum poll attempts are
   * exhausted. Throws if monitoring times out.
   */
  public async monitorExecution(taskIds: string[]): Promise<MonitorOutcome> {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error("TaskDispatcher: taskIds must be a non-empty array.");
    }

    const pending = new Set(taskIds);
    const completed: RegistryEmployeeTask[] = [];
    const failed: RegistryEmployeeTask[] = [];

    for (
      let attempt = 0;
      attempt < TaskDispatcher.MAX_POLL_ATTEMPTS && pending.size > 0;
      attempt++
    ) {
      const completedTasks = coreDispatcher.completed();
      const failedTasks = coreDispatcher.failed();

      for (const taskId of Array.from(pending)) {
        const completedMatch = completedTasks.find(
          (task) => task.id === taskId
        );

        if (completedMatch) {
          completed.push(completedMatch);
          pending.delete(taskId);
          continue;
        }

        const failedMatch = failedTasks.find((task) => task.id === taskId);

        if (failedMatch) {
          failed.push(failedMatch);
          pending.delete(taskId);
        }
      }

      if (pending.size > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, TaskDispatcher.POLL_INTERVAL_MS)
        );
      }
    }

    if (pending.size > 0) {
      throw new Error(
        `TaskDispatcher: monitoring timed out waiting for task(s): ${Array.from(
          pending
        ).join(", ")}.`
      );
    }

    return { completed, failed };
  }

  /**
   * Merges the outcome of a monitored batch into a single final
   * response string. Throws if any task in the batch failed.
   */
  public mergeResults(
    dispatched: readonly RegistryEmployeeTask[],
    outcome: MonitorOutcome
  ): string {
    if (!Array.isArray(dispatched) || dispatched.length === 0) {
      throw new Error("TaskDispatcher: dispatched must be a non-empty array.");
    }

    if (outcome.failed.length > 0) {
      const failedTitles = outcome.failed.map((task) => task.title).join(", ");

      throw new Error(
        `TaskDispatcher: execution failed for task(s): ${failedTitles}.`
      );
    }

    const summary = outcome.completed
      .map((task) => `- ${task.title}: completed`)
      .join("\n");

    return `All ${dispatched.length} task(s) completed successfully.\n${summary}`;
  }

  /**
   * Validates the shape of an execution plan before processing.
   */
  private validatePlan(plan: ExecutionPlan): void {
    if (!plan) {
      throw new Error("TaskDispatcher: plan is required.");
    }

    if (!Array.isArray(plan.units) || plan.units.length === 0) {
      throw new Error("TaskDispatcher: plan.units must be a non-empty array.");
    }
  }
}

export const orchestratorDispatcher = TaskDispatcher.getInstance();