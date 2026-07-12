import type {
  Employee,
  EmployeeContext,
  EmployeeDepartment,
  EmployeeProfile,
  EmployeeResult,
  EmployeeRole,
  EmployeeStatus,
  EmployeeTask,
} from "../types/Employee";

/**
 * Abstract foundation for every AI employee in KDOS. BaseEmployee
 * implements the Employee contract exactly: id, name, role,
 * department, getProfile(), and execute(). Concrete employees extend
 * this class and supply their own execute() implementation; every
 * other member of the contract is fully implemented here so no
 * concrete employee needs to duplicate profile or identity handling.
 */
export abstract class BaseEmployee implements Employee {
  public readonly id: string;
  public readonly name: string;
  public readonly role: EmployeeRole;
  public readonly department: EmployeeDepartment;
  public readonly createdAt: Date;

  protected status: EmployeeStatus;
  protected lastActive: Date;
  protected updatedAt: Date;

  protected constructor(params: {
    id: string;
    name: string;
    role: EmployeeRole;
    department: EmployeeDepartment;
  }) {
    if (!params.id || params.id.trim().length === 0) {
      throw new Error("BaseEmployee: id is required.");
    }

    if (!params.name || params.name.trim().length === 0) {
      throw new Error("BaseEmployee: name is required.");
    }

    if (!params.role) {
      throw new Error("BaseEmployee: role is required.");
    }

    if (!params.department) {
      throw new Error("BaseEmployee: department is required.");
    }

    this.id = params.id;
    this.name = params.name;
    this.role = params.role;
    this.department = params.department;

    const now = new Date();

    this.status = "offline";
    this.lastActive = now;
    this.createdAt = now;
    this.updatedAt = now;
  }

  /**
   * Executes a task within the given context and returns a structured
   * result. Must be implemented by every concrete employee.
   */
  public abstract execute(
    task: EmployeeTask,
    context: EmployeeContext
  ): Promise<EmployeeResult>;

  /**
   * Returns a snapshot of this employee's public profile, including
   * its current status and the timestamp it was last active.
   */
  public getProfile(): EmployeeProfile {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      department: this.department,
      status: this.status,
      lastActive: this.lastActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Updates the employee's operational status and marks it as having
   * just been active.
   */
  protected updateStatus(status: EmployeeStatus): void {
    const now = new Date();

    this.status = status;
    this.lastActive = now;
    this.updatedAt = now;
  }

  /**
   * Validates that a task is addressed to this employee before
   * execution begins. Concrete employees should call this at the
   * start of their execute() implementation.
   */
  protected validateTask(task: EmployeeTask): void {
    if (!task) {
      throw new Error(`${this.name}: task is required.`);
    }

    if (task.employeeId !== this.id) {
      throw new Error(
        `${this.name}: task "${task.id}" is not assigned to employee "${this.id}".`
      );
    }
  }

  /**
   * Validates that execution context is well-formed before execution
   * begins. Concrete employees should call this at the start of their
   * execute() implementation.
   */
  protected validateContext(context: EmployeeContext): void {
    if (!context) {
      throw new Error(`${this.name}: context is required.`);
    }

    if (!context.requestId || context.requestId.trim().length === 0) {
      throw new Error(`${this.name}: context.requestId is required.`);
    }

    if (!context.correlationId || context.correlationId.trim().length === 0) {
      throw new Error(`${this.name}: context.correlationId is required.`);
    }
  }

  /**
   * Builds a structured success result for a completed task.
   */
  protected buildSuccessResult(
    task: EmployeeTask,
    summary: string,
    output: unknown,
    issues: readonly string[] = [],
    suggestions: readonly string[] = []
  ): EmployeeResult {
    return {
      taskId: task.id,
      employeeId: this.id,
      success: true,
      summary,
      output,
      issues,
      suggestions,
      completedAt: new Date(),
    };
  }

  /**
   * Builds a structured failure result for a task that could not be
   * completed.
   */
  protected buildFailureResult(task: EmployeeTask, message: string): EmployeeResult {
    return {
      taskId: task.id,
      employeeId: this.id,
      success: false,
      summary: `${this.name} failed to complete "${task.title}": ${message}`,
      output: null,
      issues: [],
      suggestions: [],
      completedAt: new Date(),
    };
  }
}