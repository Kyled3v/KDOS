/**
 * ExecutionRegistry
 *
 * Singleton in-memory registry responsible for storing and retrieving
 * Execution instances and their associated ExecutionHistory entries.
 * Uses Map-based storage only. No database, no networking, no external
 * dependencies. History entries are append-only, keyed by taskId, since
 * a task may be retried and thus accumulate multiple execution attempts.
 */

import { Execution } from "./ExecutionEngine";
import { ExecutionHistory } from "./ExecutionHistory";

export class ExecutionRegistry {
  private static instance: ExecutionRegistry | null = null;

  private readonly executions: Map<string, Execution>;
  private readonly history: Map<string, ExecutionHistory[]>;

  private constructor() {
    this.executions = new Map<string, Execution>();
    this.history = new Map<string, ExecutionHistory[]>();
  }

  /**
   * Returns the singleton instance of ExecutionRegistry.
   */
  public static getInstance(): ExecutionRegistry {
    if (ExecutionRegistry.instance === null) {
      ExecutionRegistry.instance = new ExecutionRegistry();
    }
    return ExecutionRegistry.instance;
  }

  /**
   * Resets the singleton instance. Intended for test isolation only.
   */
  public static resetInstance(): void {
    ExecutionRegistry.instance = null;
  }

  // ---------------------------------------------------------------------
  // Executions
  // ---------------------------------------------------------------------

  /**
   * Registers an execution. Throws if an execution with the same id already exists.
   */
  public register(execution: Execution): void {
    if (this.executions.has(execution.id)) {
      throw new Error(`Execution with id "${execution.id}" is already registered.`);
    }
    this.executions.set(execution.id, execution);
  }

  /**
   * Replaces an already-registered execution with an updated instance.
   * Throws if no execution with that id is registered.
   */
  public update(execution: Execution): void {
    if (!this.executions.has(execution.id)) {
      throw new Error(`Cannot update unregistered execution with id "${execution.id}".`);
    }
    this.executions.set(execution.id, execution);
  }

  /**
   * Removes an execution and its history entries. Throws if no execution
   * with that id exists.
   */
  public remove(id: string): void {
    if (!this.executions.has(id)) {
      throw new Error(`Cannot remove unregistered execution with id "${id}".`);
    }
    const execution = this.executions.get(id) as Execution;
    this.executions.delete(id);

    const remainingHistory = this.history.get(execution.taskId) ?? [];
    this.history.set(
      execution.taskId,
      remainingHistory.filter((entry) => entry.executionId !== id)
    );
  }

  /**
   * Finds an execution by id. Throws if no execution with that id exists.
   */
  public find(id: string): Execution {
    const execution = this.executions.get(id);
    if (!execution) {
      throw new Error(`No execution found with id "${id}".`);
    }
    return execution;
  }

  /**
   * Returns true if an execution with the given id is registered.
   */
  public has(id: string): boolean {
    return this.executions.has(id);
  }

  /**
   * Lists all registered executions.
   */
  public list(): readonly Execution[] {
    return Array.from(this.executions.values());
  }

  /**
   * Lists all executions belonging to a given task.
   */
  public listByTaskId(taskId: string): readonly Execution[] {
    return this.list().filter((execution) => execution.taskId === taskId);
  }

  /**
   * Returns the total number of registered executions.
   */
  public count(): number {
    return this.executions.size;
  }

  // ---------------------------------------------------------------------
  // History
  // ---------------------------------------------------------------------

  /**
   * Appends a history entry for the given task.
   */
  public addHistory(entry: ExecutionHistory): void {
    const existing = this.history.get(entry.taskId) ?? [];
    this.history.set(entry.taskId, [...existing, entry]);
  }

  /**
   * Returns the history entries for a given task, in chronological order.
   */
  public listHistoryByTaskId(taskId: string): readonly ExecutionHistory[] {
    return this.history.get(taskId) ?? [];
  }

  /**
   * Returns all history entries across all tasks.
   */
  public listAllHistory(): readonly ExecutionHistory[] {
    return Array.from(this.history.values()).flat();
  }
}