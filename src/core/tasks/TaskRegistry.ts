/**
 * TaskRegistry
 *
 * Singleton in-memory registry responsible for storing and retrieving
 * Task, TaskAssignment, and TaskExecution instances. Uses Map-based
 * storage only. No database, no networking, no external dependencies.
 * Assignments and executions are stored as append-only histories keyed
 * by taskId, since a task may be reassigned or re-executed over its
 * lifetime.
 */

import { Task } from "./Task";
import { TaskAssignment } from "./TaskAssignment";
import { TaskExecution } from "./TaskExecution";

export class TaskRegistry {
  private static instance: TaskRegistry | null = null;

  private readonly tasks: Map<string, Task>;
  private readonly assignments: Map<string, TaskAssignment[]>;
  private readonly executions: Map<string, TaskExecution[]>;

  private constructor() {
    this.tasks = new Map<string, Task>();
    this.assignments = new Map<string, TaskAssignment[]>();
    this.executions = new Map<string, TaskExecution[]>();
  }

  /**
   * Returns the singleton instance of TaskRegistry.
   */
  public static getInstance(): TaskRegistry {
    if (TaskRegistry.instance === null) {
      TaskRegistry.instance = new TaskRegistry();
    }
    return TaskRegistry.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    TaskRegistry.instance = null;
  }

  // ---------------------------------------------------------------------
  // Task
  // ---------------------------------------------------------------------

  /**
   * Registers a task. Throws if a task with the same id already exists.
   */
  public register(task: Task): void {
    if (this.tasks.has(task.id)) {
      throw new Error(`Task with id "${task.id}" is already registered.`);
    }
    this.tasks.set(task.id, task);
  }

  /**
   * Replaces an already-registered task with an updated instance.
   * Throws if no task with that id is registered.
   */
  public update(task: Task): void {
    if (!this.tasks.has(task.id)) {
      throw new Error(`Cannot update unregistered task with id "${task.id}".`);
    }
    this.tasks.set(task.id, task);
  }

  /**
   * Removes a task and its associated assignment and execution history.
   * Throws if no task with that id exists.
   */
  public remove(id: string): void {
    if (!this.tasks.has(id)) {
      throw new Error(`Cannot remove unregistered task with id "${id}".`);
    }
    this.tasks.delete(id);
    this.assignments.delete(id);
    this.executions.delete(id);
  }

  /**
   * Finds a task by id. Throws if no task with that id exists.
   */
  public find(id: string): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`No task found with id "${id}".`);
    }
    return task;
  }

  /**
   * Returns true if a task with the given id is registered.
   */
  public has(id: string): boolean {
    return this.tasks.has(id);
  }

  /**
   * Lists all registered tasks.
   */
  public list(): readonly Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Lists all tasks belonging to a given project.
   */
  public listByProjectId(projectId: string): readonly Task[] {
    return this.list().filter((task) => task.projectId === projectId);
  }

  /**
   * Lists all tasks currently assigned to a given employee role.
   */
  public listByEmployeeRole(employeeRole: string): readonly Task[] {
    return this.list().filter((task) => task.employeeRole === employeeRole);
  }

  /**
   * Returns the total number of registered tasks.
   */
  public count(): number {
    return this.tasks.size;
  }

  // ---------------------------------------------------------------------
  // Assignments
  // ---------------------------------------------------------------------

  /**
   * Appends an assignment record to a task's assignment history.
   */
  public addAssignment(assignment: TaskAssignment): void {
    const existing = this.assignments.get(assignment.taskId) ?? [];
    this.assignments.set(assignment.taskId, [...existing, assignment]);
  }

  /**
   * Returns the assignment history for a task, in chronological order.
   */
  public listAssignments(taskId: string): readonly TaskAssignment[] {
    return this.assignments.get(taskId) ?? [];
  }

  /**
   * Returns the most recent assignment for a task, or null if never assigned.
   */
  public latestAssignment(taskId: string): TaskAssignment | null {
    const history = this.listAssignments(taskId);
    return history.length === 0 ? null : history[history.length - 1];
  }

  // ---------------------------------------------------------------------
  // Executions
  // ---------------------------------------------------------------------

  /**
   * Appends an execution record to a task's execution history.
   */
  public addExecution(execution: TaskExecution): void {
    const existing = this.executions.get(execution.taskId) ?? [];
    this.executions.set(execution.taskId, [...existing, execution]);
  }

  /**
   * Replaces the most recent execution record for a task with an updated
   * instance (used when closing an open execution). Throws if no execution
   * history exists for the task.
   */
  public updateLatestExecution(execution: TaskExecution): void {
    const history = this.executions.get(execution.taskId);
    if (!history || history.length === 0) {
      throw new Error(`No execution history found for task with id "${execution.taskId}".`);
    }
    const updatedHistory = [...history.slice(0, -1), execution];
    this.executions.set(execution.taskId, updatedHistory);
  }

  /**
   * Returns the execution history for a task, in chronological order.
   */
  public listExecutions(taskId: string): readonly TaskExecution[] {
    return this.executions.get(taskId) ?? [];
  }

  /**
   * Returns the most recent execution for a task, or null if never executed.
   */
  public latestExecution(taskId: string): TaskExecution | null {
    const history = this.listExecutions(taskId);
    return history.length === 0 ? null : history[history.length - 1];
  }
}