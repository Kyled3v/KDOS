import { randomUUID } from "crypto";
import { employeeRegistry } from "../registry/EmployeeRegistry";
import type { BaseEmployee } from "../employees/BaseEmployee";
import type {
  EmployeeContext,
  EmployeeResult,
  EmployeeTask,
} from "../types/Employee";
import type { ExecutionPlan, PlannedUnit } from "../../executive/ExecutiveAssistant";

/**
 * A task paired with the employee resolved to execute it, prior to
 * dispatch.
 */
interface QueuedWork {
  readonly task: EmployeeTask;
  readonly employee: BaseEmployee;
}

/**
 * A dispatched unit of work paired with the in-flight promise tracking
 * its execution.
 */
interface InFlightWork {
  readonly task: EmployeeTask;
  readonly promise: Promise<EmployeeResult>;
}

/**
 * Singleton dispatcher and the only component in KDOS authorised to
 * assign and execute work. TaskDispatcher receives an ExecutionPlan
 * from the Executive Assistant, resolves the employees required from
 * the EmployeeRegistry, builds a formal execution queue, assigns work
 * by invoking each employee's execute() method, monitors execution to
 * completion, and merges the results into a single final response.
 * Every candidate list is validated before use and every resolved
 * employee is validated before assignment — nothing is ever assigned
 * on the basis of an unchecked array access.
 */
export class TaskDispatcher {
  private static instance: TaskDispatcher | null = null;

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
   * employees, builds the queue, assigns work, monitors execution, and
   * returns a merged final response. Throws if any unit's role has no
   * available employee, or if any dispatched task fails.
   */
  public async execute(plan: ExecutionPlan): Promise<string> {
    this.validatePlan(plan);

    const assignments = this.resolveEmployees(plan);
    const queue = this.createQueue(plan, assignments);
    const inFlight = this.assignWork(queue);
    const results = await this.monitorExecution(inFlight);

    return this.mergeResults(results);
  }

  /**
   * Resolves a specific available employee from the EmployeeRegistry
   * for each planned unit in the plan. Every candidate list is
   * validated for emptiness before selection, and every selection is
   * validated for existence before being stored. Throws a descriptive
   * error if a unit's role has no available employee.
   */
  public resolveEmployees(plan: ExecutionPlan): Map<string, BaseEmployee> {
    this.validatePlan(plan);

    const assignments = new Map<string, BaseEmployee>();

    for (const unit of plan.units) {
      if (assignments.has(unit.id)) {
        continue;
      }

      const candidates = employeeRegistry
        .getByRole(unit.role)
        .filter((employee) => employee.getProfile().status === "idle");

      const selected = this.selectEmployee(candidates, unit);

      assignments.set(unit.id, selected);
    }

    return assignments;
  }

  /**
   * Validates a candidate list of employees resolved for a planned
   * unit and returns the selected employee. Never indexes the array
   * directly — the array is checked for emptiness first, and the
   * selected entry is verified to exist before being returned. Throws
   * a descriptive error if the candidate list is empty or contains no
   * valid employee.
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
   * Builds a formal execution queue of EmployeeTask records paired
   * with their resolved employee, from the plan's units. Throws if
   * any unit has no resolved assignment.
   */
  public createQueue(
    plan: ExecutionPlan,
    assignments: Map<string, BaseEmployee>
  ): QueuedWork[] {
    this.validatePlan(plan);

    if (!assignments || assignments.size === 0) {
      throw new Error("TaskDispatcher: assignments must not be empty.");
    }

    const queue: QueuedWork[] = [];
    const now = new Date();

    for (const unit of plan.units) {
      const employee = assignments.get(unit.id);

      if (!employee) {
        throw new Error(
          `TaskDispatcher: no resolved employee for unit "${unit.id}".`
        );
      }

      const task: EmployeeTask = {
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
      };

      queue.push({ task, employee });
    }

    return queue;
  }

  /**
   * Assigns every item in the queue by invoking its resolved
   * employee's execute() method, returning the in-flight work so
   * execution can be monitored. Throws if the queue is empty.
   */
  public assignWork(queue: QueuedWork[]): InFlightWork[] {
    if (!Array.isArray(queue) || queue.length === 0) {
      throw new Error("TaskDispatcher: queue must be a non-empty array.");
    }

    const context: EmployeeContext = {
      requestId: randomUUID(),
      workflowId: null,
      correlationId: randomUUID(),
      metadata: {},
    };

    return queue.map(({ task, employee }) => ({
      task,
      promise: employee.execute(task, context),
    }));
  }

  /**
   * Monitors a batch of in-flight work to completion, awaiting every
   * execution. A rejected execution (an employee that threw rather
   * than returning a failure EmployeeResult) is converted into a
   * synthetic failure result so monitoring always resolves with a
   * complete, well-formed result set.
   */
  public async monitorExecution(
    inFlight: InFlightWork[]
  ): Promise<EmployeeResult[]> {
    if (!Array.isArray(inFlight) || inFlight.length === 0) {
      throw new Error("TaskDispatcher: inFlight must be a non-empty array.");
    }

    const settled = await Promise.allSettled(
      inFlight.map((work) => work.promise)
    );

    return settled.map((outcome, index) => {
      const work = inFlight[index];

      if (!work) {
        throw new Error(
          `TaskDispatcher: no in-flight work found at index ${index}.`
        );
      }

      if (outcome.status === "fulfilled") {
        return outcome.value;
      }

      const message =
        outcome.reason instanceof Error
          ? outcome.reason.message
          : "Unknown error occurred.";

      return {
        taskId: work.task.id,
        employeeId: work.task.employeeId,
        success: false,
        summary: `Task "${work.task.title}" failed: ${message}`,
        output: null,
        issues: [],
        suggestions: [],
        completedAt: new Date(),
      };
    });
  }

  /**
   * Merges a batch of results into a single final response string.
   * Throws if any result in the batch was unsuccessful.
   */
  public mergeResults(results: EmployeeResult[]): string {
    if (!Array.isArray(results) || results.length === 0) {
      throw new Error("TaskDispatcher: results must be a non-empty array.");
    }

    const failed = results.filter((result) => !result.success);

    if (failed.length > 0) {
      const failedSummaries = failed.map((result) => result.summary).join("; ");

      throw new Error(`TaskDispatcher: execution failed: ${failedSummaries}.`);
    }

    const summary = results
      .map((result) => `- ${result.summary}`)
      .join("\n");

    return `All ${results.length} task(s) completed successfully.\n${summary}`;
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

export const taskDispatcher = TaskDispatcher.getInstance();