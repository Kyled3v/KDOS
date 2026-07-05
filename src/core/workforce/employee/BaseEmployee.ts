import type {
  EmployeeId,
  EmployeeRole,
  EmployeeDepartment,
  EmployeeStatus,
  EmployeeSkill,
  EmployeeTask,
  EmployeeMemory,
  EmployeeTool,
  EmployeeProfile,
} from "./types";

/**
 * Abstract foundation for every AI employee in KDOS.
 * All employee implementations (Executive Assistant, Software Engineer,
 * Cybersecurity Engineer, Graphic Designer, Content Creator, Marketing
 * Manager, Finance Manager, etc.) must extend this class.
 */
export abstract class BaseEmployee {
  public readonly id: EmployeeId;
  public readonly name: string;
  public readonly role: EmployeeRole;
  public readonly department: EmployeeDepartment;
  public readonly createdAt: Date;

  protected status: EmployeeStatus;
  protected readonly skills: EmployeeSkill[];
  protected readonly tools: EmployeeTool[];
  protected readonly memory: EmployeeMemory[];
  protected currentTask: EmployeeTask | null;
  protected updatedAt: Date;

  protected constructor(params: {
    id: EmployeeId;
    name: string;
    role: EmployeeRole;
    department: EmployeeDepartment;
    skills: EmployeeSkill[];
    tools: EmployeeTool[];
  }) {
    if (!params.id) {
      throw new Error("BaseEmployee: id is required.");
    }
    if (!params.name) {
      throw new Error("BaseEmployee: name is required.");
    }

    this.id = params.id;
    this.name = params.name;
    this.role = params.role;
    this.department = params.department;
    this.skills = params.skills;
    this.tools = params.tools;
    this.memory = [];
    this.currentTask = null;
    this.status = "offline";
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Prepares the employee for active duty. Must be implemented by every
   * concrete employee to perform role-specific startup behaviour
   * (e.g. loading context, validating tool access, warming memory).
   */
  public abstract initialize(): Promise<void>;

  /**
   * Assigns a task to this employee. Throws if the employee cannot
   * execute the task or is already occupied with another task.
   */
  public assignTask(task: EmployeeTask): void {
    if (task.employeeId !== this.id) {
      throw new Error(
        `BaseEmployee: task ${task.id} is not assigned to employee ${this.id}.`
      );
    }

    if (this.currentTask !== null) {
      throw new Error(
        `BaseEmployee: employee ${this.id} already has an active task (${this.currentTask.id}).`
      );
    }

    if (!this.canExecute(task)) {
      throw new Error(
        `BaseEmployee: employee ${this.id} cannot execute task ${task.id}.`
      );
    }

    this.currentTask = task;
    this.updateStatus("busy");
  }

  /**
   * Marks the current task as completed. Throws if no task is active.
   */
  public completeTask(): void {
    if (this.currentTask === null) {
      throw new Error(
        `BaseEmployee: employee ${this.id} has no active task to complete.`
      );
    }

    this.currentTask = null;
    this.updateStatus("idle");
  }

  /**
   * Marks the current task as failed with a reason. Throws if no task
   * is active or if no reason is provided.
   */
  public failTask(reason: string): void {
    if (this.currentTask === null) {
      throw new Error(
        `BaseEmployee: employee ${this.id} has no active task to fail.`
      );
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error(
        `BaseEmployee: a reason is required to fail task ${this.currentTask.id}.`
      );
    }

    this.currentTask = null;
    this.updateStatus("error");
  }

  /**
   * Stores a new memory entry for this employee. Throws if the memory
   * does not belong to this employee.
   */
  public remember(memory: EmployeeMemory): void {
    if (memory.employeeId !== this.id) {
      throw new Error(
        `BaseEmployee: memory ${memory.id} does not belong to employee ${this.id}.`
      );
    }

    this.memory.push(memory);
    this.updatedAt = new Date();
  }

  /**
   * Removes a memory entry by id. Throws if the memory does not exist.
   */
  public forget(memoryId: string): void {
    const index = this.memory.findIndex((entry) => entry.id === memoryId);

    if (index === -1) {
      throw new Error(
        `BaseEmployee: memory ${memoryId} not found for employee ${this.id}.`
      );
    }

    this.memory.splice(index, 1);
    this.updatedAt = new Date();
  }

  /**
   * Invokes a tool by name. Throws if the tool is not assigned to this
   * employee or is disabled. Must be implemented by every concrete
   * employee to perform the actual invocation logic.
   */
  public abstract useTool(toolName: string): Promise<unknown>;

  /**
   * Determines whether this employee is capable of executing the given
   * task, based on current status and skill set. Must be implemented by
   * every concrete employee.
   */
  public abstract canExecute(task: EmployeeTask): boolean;

  /**
   * Returns a snapshot of this employee's public profile.
   */
  public getProfile(): EmployeeProfile {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      department: this.department,
      status: this.status,
      skills: [...this.skills],
      tools: [...this.tools],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Updates the employee's operational status.
   */
  public updateStatus(status: EmployeeStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  /**
   * Resolves a tool by name from this employee's assigned tool set.
   * Throws if the tool is not found or is disabled.
   */
  protected resolveTool(toolName: string): EmployeeTool {
    const tool = this.tools.find((entry) => entry.name === toolName);

    if (!tool) {
      throw new Error(
        `BaseEmployee: tool "${toolName}" is not assigned to employee ${this.id}.`
      );
    }

    if (!tool.isEnabled) {
      throw new Error(
        `BaseEmployee: tool "${toolName}" is disabled for employee ${this.id}.`
      );
    }

    return tool;
  }
}