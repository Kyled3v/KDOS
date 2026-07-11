import { randomUUID } from "crypto";
import { employeeRegistry } from "../registry/EmployeeRegistry";
import { taskDispatcher as coreDispatcher } from "../dispatcher/TaskDispatcher";
import type { BaseEmployee } from "../employee/BaseEmployee";
import type { EmployeeRole, EmployeeTask } from "../employee/types";
import type {
  ExecutionPlan,
  PlannedUnit,
} from "../../executive/ExecutiveAssistant";

/**
 * The outcome of monitoring a batch of dispatched tasks to completion.
 */
interface MonitorOutcome {
  readonly completed: readonly EmployeeTask[];
  readonly failed: readonly EmployeeTask[];
}

/**
 * Singleton orchestrator responsible for turning an ExecutionPlan
 * produced by the Executive Assistant into real work: resolving the
 * AI employees required, building an execution queue, assigning work
 * through the core TaskDispatcher, monitoring progress to completion,
 * merging results, and returning a single final response.
 */
export class TaskDispatcher {
  private static instance: TaskDispatcher | null = null;

  private static readonly POLL_INTERVAL_MS = 500;
  private static readonly MAX_POLL_ATTEMPTS = 240;

  private constructor() {}

  /**
   * Returns the singleton instance of the orchestrator.
   */
  public static getInstance(): TaskDispatcher {
    if (TaskDispatcher.instance === null) {
      TaskDispatcher.instance = new TaskDispatcher();
    }

    return TaskDispatcher.instance;
  }

  /**
   * Executes a complete execution plan end to end: resolves required
   * employees, builds the queue, assigns work, monitors progress, and
   * returns a merged final response. Throws if any required role has
   * no available employee, or if any dispatched task fails.
   */
  public async execute(plan: ExecutionPlan): Promise<string> {
    this.validatePlan(plan);

    const assignments = this.determineRequiredEmployees(plan);
    const queue = this.createQueue(plan, assignments);
    const dispatched = this.assignWork(queue);
    const outcome = await this.monitorProgress(
      dispatched.map((task) => task.id)
    );

    return this.mergeResults(dispatched, outcome);
  }

  /**
   * Resolves a specific available employee for each planned unit's
   * required role. Throws if any required role has no available
   * employee.
   */
  public determineRequiredEmployees(
    plan: ExecutionPlan
  ): Map<string, BaseEmployee> {
    this.validatePlan(plan);

    const assignments = new Map<string, BaseEmployee>();

    for (const unit of plan.units) {
      if (assignments.has(this.unitKey(unit))) {
        continue;
      }

      const candidates = employeeRegistry
        .getByRole(unit.role)
        .filter((employee) => employee.getProfile().status === "idle");

      if (candidates.length === 0) {
        throw new Error(
          `TaskDispatcher: no available employee found for role "${unit.role}".`
        );
      }

      assignments.set(this.unitKey(unit), candidates[0]);
    }

    return assignments;
  }

  /**
   * Builds a formal execution queue of EmployeeTask records from the
   * plan's units, using the resolved employee assignments.
   */
  public createQueue(
    plan: ExecutionPlan,
    assignments: Map<string, BaseEmployee>
  ): EmployeeTask[] {
    this.validatePlan(plan);

    if (!assignments || assignments.size === 0) {
      throw new Error("TaskDispatcher: assignments must not be empty.");
    }

    const queue: EmployeeTask[] = [];
    const now = new Date();

    for (const unit of plan.units) {
      const employee = assignments.get(this.unitKey(unit));

      if (!employee) {
        throw new Error(
          `TaskDispatcher: no resolved employee for unit "${unit.title}".`
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
  public assignWork(queue: EmployeeTask[]): EmployeeTask[] {
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
  public async monitorProgress(taskIds: string[]): Promise<MonitorOutcome> {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error("TaskDispatcher: taskIds must be a non-empty array.");
    }

    const pending = new Set(taskIds);
    const completed: EmployeeTask[] = [];
    const failed: EmployeeTask[] = [];

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
    dispatched: readonly EmployeeTask[],
    outcome: MonitorOutcome
  ): string {
    if (!Array.isArray(dispatched) || dispatched.length === 0) {
      throw new Error(
        "TaskDispatcher: dispatched must be a non-empty array."
      );
    }

    if (outcome.failed.length > 0) {
      const failedTitles = outcome.failed
        .map((task) => task.title)
        .join(", ");

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
      throw new Error(
        "TaskDispatcher: plan.units must be a non-empty array."
      );
    }
  }

  /**
   * Builds a stable key for a planned unit's role to deduplicate
   * employee resolution across units that share a role.
   */
  private unitKey(unit: PlannedUnit): EmployeeRole {
    return unit.role;
  }
}

export const orchestratorDispatcher = TaskDispatcher.getInstance();